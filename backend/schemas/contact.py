from pydantic import BaseModel,EmailStr

class Contact (BaseModel) :
    name : str
    email : EmailStr
    subject : str
    message : str