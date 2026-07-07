from fastapi import HTTPException, Depends, APIRouter, status
from dependencies.auth import get_current_user
from schemas import quiz
from db.database import user_collection, quiz_attempt_collection, quiz_collection
from bson import ObjectId

router = APIRouter()

@router.get('/dashboard')
def dashboard(current_user = Depends(get_current_user)):
    user_data = quiz_attempt_collection.find({
        'user_id': str(current_user['_id'])
    })
    history = []
    for doc in user_data:
        doc['_id'] = str(doc['_id'])
        history.append(doc)
        
    rank = user_collection.count_documents({
        'highest_score': {
            '$gt': current_user['highest_score']
        }
    }) + 1
    
    return {
        'name': current_user['name'],
        'email': current_user['email'],
        'level': current_user['level'],
        'highest_score': current_user['highest_score'],
        'average_score': current_user['average_score'],
        'average_accuracy': current_user['average_accuracy'],
        'total_attempts': current_user['total_attempts'],
        'rank': rank,
        'history': history
    }

@router.post('/start')
def start_quiz(current_user = Depends(get_current_user)):
    difficulty = current_user['level']
    quiz = quiz_collection.find_one({
        'difficulty': difficulty
    })
    if quiz is None: 
        return {'message': "No quiz found"}

    question_final = []
    for i in quiz['questions']:
        question_final.append({
            'question_id': i['question_id'],
            'question': i['question'],
            'option': i['options']
        })
    return {
        'quiz_id': str(quiz['_id']),
        'title': quiz['title'],
        'difficulty': quiz['difficulty'],
        'questions': question_final
    }

@router.post('/submit')
def submit_quiz(submission: quiz.QuizSubmission, current_user = Depends(get_current_user)):
    quiz = quiz_collection.find_one({
        '_id': ObjectId(submission.quiz_id)
    })
    if quiz is None: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz Not found")
        
    correct_answers = {}
    for question in quiz['questions']:
        correct_answers[question['question_id']] = question['correct_answer']
    
    score = 0
    wrong_answers = 0
    for answer in submission.answer:
        correct = correct_answers.get(answer.question_id)
        if correct == answer.selected_option:
            score += 1
        else:
            wrong_answers += 1
            
    total_questions = len(quiz['questions'])
    accuracy = (score / total_questions) * 100
    
    level = 'easy'
    if score > (total_questions - 5) and accuracy > 90:
        level = 'hard'
    elif score > (total_questions - (total_questions // 2)) and accuracy > 50:
        level = 'medium'
    
    attempts = {
        'user_id': str(current_user['_id']),
        'quiz_id': str(submission.quiz_id),
        'difficulty': quiz['difficulty'],
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
            'level': level
        },
        '$inc': {
            'total_attempts': 1,
        }
    })
    
    return {
        'score': score,
        'wrong answer': wrong_answers,
        'accuracy': accuracy,
        'total questions': total_questions,
        'level': level
    }
    
@router.get('/leaderboard')
def leaderboard(current_user = Depends(get_current_user)):
    user_data = user_collection.find({
        'role': 'user'
    }).sort('highest_score', -1).limit(100)
    users = list(user_data)
    leaderboard = []
    rank = 1
    for user in users: 
        leaderboard.append({
            'rank': rank,
            'name': user['name'],
            'score': user['highest_score'],
            'level': user['level']
        })       
        rank += 1
    return leaderboard
