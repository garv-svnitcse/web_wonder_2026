from pydantic import BaseModel
from typing import Optional

class CreatePost(BaseModel):
    title: str
    content: str
    author: Optional[str] = None
    author_role: Optional[str] = None

class CreateComment(BaseModel):
    content: str
    parent_id: Optional[str] = None
    reply_to: Optional[str] = None
    reply_to_author: Optional[str] = None
    author: Optional[str] = None

class VoteSchema(BaseModel):
    direction: int
