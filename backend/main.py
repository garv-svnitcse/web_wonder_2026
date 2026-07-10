from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import contact, auth, timeline, research, quiz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contact.router, prefix="/contact", tags=['Contact'])
app.include_router(auth.router, prefix='/auth', tags=['Authentication'])
app.include_router(timeline.router, prefix='/timeline', tags=['Timeline'])
app.include_router(research.router, prefix='/research', tags=['Research'])
app.include_router(quiz.router, prefix='/quiz', tags=['Quiz'])