from fastapi import FastAPI
from routes import contact, auth, timeline, research

app = FastAPI()

app.include_router(contact.router, prefix="/contact", tags=['Contact'])
app.include_router(auth.router, prefix='/auth', tags=['Authentication'])
app.include_router(timeline.router, prefix='/timeline', tags=['Timeline'])
app.include_router(research.router, prefix='/research', tags=['Research'])