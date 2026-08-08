from pydantic import BaseModel, EmailStr
from typing import Optional

class Contact(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = "Jurassic Journey Feedback"
    message: str