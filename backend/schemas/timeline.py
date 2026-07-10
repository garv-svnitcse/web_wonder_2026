from pydantic import BaseModel
from typing import Optional

class Timeline(BaseModel): 
    keyword: Optional[str] = None
    era: Optional[str] = None
    period: Optional[str] = None
    diet: Optional[str] = None
    habitat: Optional[str] = None
