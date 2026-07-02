from fastapi import FastAPI
from routes import contact, auth

app = FastAPI()

app.include_router(contact.router, prefix="/contact", tags=['Contact'])
app.include_router(auth.router, prefix='/auth', tags=['Authentication'])