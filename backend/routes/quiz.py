from fastapi import HTTPException, Depends, APIRouter, status
from dependencies.auth import get_current_user
from schemas import quiz
from db.database import user_collection, quiz_attempt_collection, quiz_collection
from bson import ObjectId

router = APIRouter()

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

@router.post('/start')
def start_quiz(current_user=Depends(get_current_user)):
    difficulty = current_user.get('level', 'easy')
    quiz_doc = quiz_collection.find_one({
        'difficulty': difficulty
    })
    
    # Fallback to avoid crashes if database is unseeded
    if quiz_doc is None:
        return {
            'quiz_id': 'mock_quiz_id',
            'title': f'{difficulty.capitalize()} Mesozoic Basics',
            'difficulty': difficulty,
            'questions': [
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
        }

    question_final = []
    for i in quiz_doc.get('questions', []):
        question_final.append({
            'question_id': i.get('question_id'),
            'question': i.get('question'),
            'options': i.get('options')
        })
    return {
        'quiz_id': str(quiz_doc['_id']),
        'title': quiz_doc.get('title'),
        'difficulty': quiz_doc.get('difficulty'),
        'questions': question_final
    }

@router.post('/submit')
def submit_quiz(submission: quiz.QuizSubmission, current_user=Depends(get_current_user)):
    # Handle mock quiz fallback submissions
    if submission.quiz_id == 'mock_quiz_id':
        quiz_doc = {
            '_id': 'mock_quiz_id',
            'difficulty': current_user.get('level', 'easy'),
            'questions': [
                {
                    'question_id': 'q1',
                    'correct_answer': 'Triassic'
                },
                {
                    'question_id': 'q2',
                    'correct_answer': 'Tyrannosaurus Rex'
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
    
    # Adaptive progression rules
    level = 'easy'
    if score >= (total_questions - 1) and accuracy >= 90:
        level = 'hard'
    elif score >= (total_questions // 2) and accuracy >= 50:
        level = 'medium'
    
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
    
    # Compute new averages
    prev_attempts = current_user.get('total_attempts', 0)
    new_attempts = prev_attempts + 1
    
    prev_avg_score = current_user.get('average_score', 0)
    new_avg_score = ((prev_avg_score * prev_attempts) + score) / new_attempts
    
    prev_avg_accuracy = current_user.get('average_accuracy', 0)
    new_avg_accuracy = ((prev_avg_accuracy * prev_attempts) + accuracy) / new_attempts
    
    highest_score = max(current_user.get('highest_score', 0), score)
    
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
    
    return {
        'score': score,
        'wrong_answers': wrong_answers,
        'accuracy': accuracy,
        'total_questions': total_questions,
        'level': level
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
