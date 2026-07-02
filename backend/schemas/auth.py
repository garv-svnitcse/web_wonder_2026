from pydantic import BaseModel, EmailStr

class SignUp(BaseModel):
    name: str
    email: EmailStr
    password: str

class Login(BaseModel): 
    email: EmailStr
    password: str
