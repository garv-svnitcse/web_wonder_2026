from pydantic import BaseModel
from typing import Optional, Literal

class ProposedChange(BaseModel):
    weight: Optional[str] = None
    height: Optional[str] = None
    habitat: Optional[str] = None
    diet: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

class NewDinosaur(BaseModel):
    name: str
    slug: str
    era: str
    period: str
    million_years_ago: int
    diet: str
    habitat: str
    description: str
    image: str

class ResearchPaper(BaseModel):
    title: str
    slug: str
    research_type: Literal['new', 'update']
    abstract: str
    proposedChange: Optional[ProposedChange] = None
    new_dinosaur: Optional[NewDinosaur] = None

class CommentCreate(BaseModel):
    title: str
    author: str
    text: str

