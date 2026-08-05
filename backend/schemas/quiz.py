from pydantic import BaseModel
from typing import List, Literal, Optional

class StartQuiz(BaseModel):
    difficulty: Literal['easy', 'medium', 'hard']
    topic: Literal['dinosaurs', 'fossils', 'paleontology']

class Question(BaseModel):
    question_id: str
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class Quiz(BaseModel):
    title: str
    difficulty: Literal['easy', 'medium', 'hard']
    questions: List[Question]

class UserAnswer(BaseModel):
    question_id: str
    selected_option: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answer: List[UserAnswer]

class ChatHistoryItem(BaseModel):
    role: Literal['user', 'assistant']
    content: str

class ChatMessage(BaseModel):
    quiz_id: str
    message: str
    history: Optional[List[ChatHistoryItem]] = []
