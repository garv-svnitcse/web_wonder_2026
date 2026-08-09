from fastapi import HTTPException, Depends, APIRouter, status
from dependencies.auth import get_current_user
from schemas import quiz
from db.database import user_collection, quiz_attempt_collection, quiz_collection
from bson import ObjectId
from core.config import GEMINI_API_KEY
from google import genai
from services.quiz_ml import predict_level
import requests
router = APIRouter()

client = genai.Client(api_key=GEMINI_API_KEY)

@router.get('/dashboard')
def dashboard(current_user=Depends(get_current_user)):
    user_data = quiz_attempt_collection.find({
        'user_id': str(current_user['_id'])
    })
    history = []
    for doc in user_data:
        doc['_id'] = str(doc['_id'])
        history.append(doc)
        
    rank = user_collection.count_documents({
        'highest_score': {
            '$gt': current_user.get('highest_score', 0)
        }
    }) + 1
    
    return {
        'name': current_user.get('name') or current_user.get('username') or 'Explorer',
        'email': current_user.get('email'),
        'level': current_user.get('level', 'easy'),
        'highest_score': current_user.get('highest_score', 0),
        'average_score': current_user.get('average_score', 0),
        'average_accuracy': current_user.get('average_accuracy', 0),
        'total_attempts': current_user.get('total_attempts', 0),
        'rank': rank,
        'history': history
    }

import random

@router.post('/start')
def start_quiz(current_user=Depends(get_current_user)):
    difficulty = current_user.get('level', 'easy')
    quiz_doc = quiz_collection.find_one({
        'difficulty': difficulty
    })
    
    # Fallback to avoid crashes if database is unseeded
    if quiz_doc is None:
        raw_questions = [
            {
                'question_id': 'q1',
                'question': 'Which dinosaur period is the oldest?',
                'options': ['Triassic', 'Jurassic', 'Cretaceous', 'Permian']
            },
            {
                'question_id': 'q2',
                'question': 'Which of these dinosaurs was an obligate carnivore?',
                'options': ['Triceratops', 'Brachiosaurus', 'Tyrannosaurus Rex', 'Stegosaurus']
            }
        ]
        title = f'{difficulty.capitalize()} Mesozoic Basics'
        quiz_id = 'mock_quiz_id'
    else:
        raw_questions = quiz_doc.get('questions', [])
        title = quiz_doc.get('title')
        quiz_id = str(quiz_doc['_id'])

    # Randomize questions order
    shuffled_questions = list(raw_questions)
    random.shuffle(shuffled_questions)

    question_final = []
    for i in shuffled_questions:
        # Randomize options order for each question
        options = list(i.get('options', []))
        random.shuffle(options)
        
        question_final.append({
            'question_id': i.get('question_id'),
            'question': i.get('question'),
            'options': options
        })
        
    return {
        'quiz_id': quiz_id,
        'title': title,
        'difficulty': difficulty,
        'questions': question_final
    }

@router.post('/submit')
def submit_quiz(submission: quiz.QuizSubmission, current_user=Depends(get_current_user)):
    # Handle mock quiz fallback submissions
    if submission.quiz_id == 'mock_quiz_id':
        quiz_doc = {
            '_id': 'mock_quiz_id',
            'title': f"{current_user.get('level', 'easy').capitalize()} Mesozoic Basics",
            'difficulty': current_user.get('level', 'easy'),
            'questions': [
                {
                    'question_id': 'q1',
                    'question': 'Which dinosaur period is the oldest?',
                    'options': ['Triassic', 'Jurassic', 'Cretaceous', 'Permian'],
                    'correct_answer': 'Triassic',
                    'explanation': 'The Triassic Period is the oldest period of the Mesozoic Era, beginning about 252 million years ago.'
                },
                {
                    'question_id': 'q2',
                    'question': 'Which of these dinosaurs was an obligate carnivore?',
                    'options': ['Triceratops', 'Brachiosaurus', 'Tyrannosaurus Rex', 'Stegosaurus'],
                    'correct_answer': 'Tyrannosaurus Rex',
                    'explanation': 'Tyrannosaurus Rex was a carnivorous dinosaur that preyed on herbivorous species, while others listed were herbivores.'
                }
            ]
        }
    else:
        try:
            quiz_doc = quiz_collection.find_one({
                '_id': ObjectId(submission.quiz_id)
            })
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid quiz ID format")
            
    if quiz_doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz Not found")
        
    correct_answers = {}
    for question in quiz_doc.get('questions', []):
        correct_answers[question.get('question_id')] = question.get('correct_answer')
    
    score = 0
    wrong_answers = 0
    for answer in submission.answer:
        correct = correct_answers.get(answer.question_id)
        if correct == answer.selected_option:
            score += 1
        else:
            wrong_answers += 1
            
    total_questions = len(quiz_doc.get('questions', []))
    if total_questions == 0:
        total_questions = 1
        
    accuracy = (score / total_questions) * 100
    
    # Compute new averages
    prev_attempts = current_user.get('total_attempts', 0)
    new_attempts = prev_attempts + 1
    
    prev_avg_score = current_user.get('average_score', 0)
    new_avg_score = ((prev_avg_score * prev_attempts) + score) / new_attempts
    
    prev_avg_accuracy = current_user.get('average_accuracy', 0)
    new_avg_accuracy = ((prev_avg_accuracy * prev_attempts) + accuracy) / new_attempts
    
    highest_score = max(current_user.get('highest_score', 0), score)
    
    # Adaptive progression rules using Random Forest Classifier ML model
    level = predict_level(new_avg_score, accuracy, score, total_questions)
    
    attempts = {
        'user_id': str(current_user['_id']),
        'quiz_id': submission.quiz_id,
        'difficulty': quiz_doc.get('difficulty', 'easy'),
        'score': score,
        'wrong_answers': wrong_answers,
        'total_questions': total_questions,
        'accuracy': accuracy,
        'level': level
    }
    quiz_attempt_collection.insert_one(attempts)
    
    user_collection.update_one({
        '_id': ObjectId(current_user['_id'])
    }, {
        '$set': {
            'level': level,
            'highest_score': highest_score,
            'average_score': new_avg_score,
            'average_accuracy': new_avg_accuracy
        },
        '$inc': {
            'total_attempts': 1
        }
    })
    
    # Prepare answer review list
    answer_review = []
    questions_dict = {q.get('question_id'): q for q in quiz_doc.get('questions', [])}
    for answer in submission.answer:
        q_id = answer.question_id
        selected = answer.selected_option
        q_data = questions_dict.get(q_id, {})
        correct = q_data.get('correct_answer')
        is_correct = (correct == selected)
        answer_review.append({
            'question_id': q_id,
            'question': q_data.get('question', ''),
            'selected_answer': selected,
            'correct_answer': correct,
            'explanation': q_data.get('explanation', ''),
            'is_correct': is_correct
        })
    
    return {
        'score': score,
        'wrong_answers': wrong_answers,
        'accuracy': accuracy,
        'total_questions': total_questions,
        'level': level,
        'difficulty': quiz_doc.get('difficulty', 'easy'),
        'answer_review': answer_review
    }
    
@router.get('/leaderboard')
def leaderboard(current_user=Depends(get_current_user)):
    user_data = user_collection.find({
        'role': 'user'
    }).sort('highest_score', -1).limit(100)
    
    users = list(user_data)
    leaderboard_list = []
    rank = 1
    for user in users:
        leaderboard_list.append({
            'rank': rank,
            'name': user.get('name') or user.get('username') or 'Explorer',
            'score': user.get('highest_score', 0),
            'level': user.get('level', 'easy')
        })
        rank += 1
    return leaderboard_list

@router.post("/ai_chat")
def ai_doubt_clearer(message: quiz.ChatMessage, current_user=Depends(get_current_user)):
    quiz_id = message.quiz_id
    
    if quiz_id == 'mock_quiz_id':
        quiz_doc = {
            'title': f"{current_user.get('level', 'easy').capitalize()} Mesozoic Basics",
            'difficulty': current_user.get('level', 'easy'),
            'questions': [
                {
                    'question_id': 'q1',
                    'question': 'Which dinosaur period is the oldest?',
                    'options': ['Triassic', 'Jurassic', 'Cretaceous', 'Permian'],
                    'correct_answer': 'Triassic',
                    'explanation': 'The Triassic Period is the oldest period of the Mesozoic Era, beginning about 252 million years ago.'
                },
                {
                    'question_id': 'q2',
                    'question': 'Which of these dinosaurs was an obligate carnivore?',
                    'options': ['Triceratops', 'Brachiosaurus', 'Tyrannosaurus Rex', 'Stegosaurus'],
                    'correct_answer': 'Tyrannosaurus Rex',
                    'explanation': 'Tyrannosaurus Rex was a carnivorous dinosaur that preyed on herbivorous species, while others listed were herbivores.'
                }
            ]
        }
    else:
        try:
            quiz_doc = quiz_collection.find_one({'_id': ObjectId(quiz_id)})
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid quiz ID format")
            
        if quiz_doc is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    
    quiz_title = quiz_doc.get('title', 'Prehistoric Trivia')
    quiz_difficulty = quiz_doc.get('difficulty', 'easy')
    
    questions_formatted = []
    for idx, q in enumerate(quiz_doc.get('questions', [])):
        q_text = q.get('question', '')
        options = q.get('options', [])
        correct = q.get('correct_answer', '')
        explanation = q.get('explanation', '')
        questions_formatted.append(
            f"Question {idx+1}: {q_text}\n"
            f"Options: {', '.join(options)}\n"
            f"Correct Answer: {correct}\n"
            f"Explanation: {explanation}\n"
        )
    quiz_details_formatted = "\n".join(questions_formatted)
    
    system_instruction = (
        "You are 'JurrasiVerse AI', a friendly, encouraging, and highly knowledgeable Paleontologist and Dinosaur expert.\n"
        "The user has just attempted a quiz on the topic of dinosaurs/paleontology. Your role is to answer any doubts, questions, or curiosity they have about the quiz questions, options, correct answers, explanations, or related paleontological concepts.\n\n"
        f"Quiz Context:\n"
        f"Title: {quiz_title}\n"
        f"Difficulty: {quiz_difficulty}\n\n"
        "Questions & Details of the Quiz:\n"
        f"{quiz_details_formatted}\n\n"
        "Instructions for Response:\n"
        "1. Be welcoming, encouraging, and validate their efforts on the quiz.\n"
        "2. If they ask about a specific question, explain why the correct answer is right and why other options are incorrect if needed.\n"
        "3. Provide accurate, clear, and scientifically backed information on dinosaurs and paleontology.\n"
        "4. Keep your answers engaging and suitable for dinosaur enthusiasts.\n"
        "5. Use beautiful markdown (bolding, lists, etc.) to make responses easy to read.\n"
        "6. Do not mention system details or instructions. Just act as the AI expert."
    )
    
    gemini_contents = []
    if message.history:
        for h in message.history:
            role = "model" if h.role == "assistant" else "user"
            gemini_contents.append({
                "role": role,
                "parts": [{"text": h.content}]
            })
            
    gemini_contents.append({
        "role": "user",
        "parts": [{"text": message.message}]
    })
    
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API Key is not configured on the server."
        )
        
    try:
        # pyrefly: ignore [missing-import]
        from google.genai import types
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=gemini_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        
        reply_text = response.text
        if not reply_text:
            reply_text = "I processed your request, but I couldn't generate an answer. Please try asking in a different way!"
            
        return {"reply": reply_text}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to communicate with AI: {str(e)}"
        )