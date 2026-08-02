from pydantic import BaseModel, Field
from typing import Optional


class DinosaurUpsert(BaseModel):
    name: str = Field(min_length=2)
    scientific_name: Optional[str] = ""
    slug: Optional[str] = ""
    period: str = Field(min_length=2)
    diet: str = Field(min_length=2)
    threat: Optional[str] = "Low"
    description: Optional[str] = ""
    image: Optional[str] = ""
    video: Optional[str] = ""
    habitat: Optional[str] = ""
    million_years_ago: Optional[float] = None
    length_m: Optional[float] = None
    weight_tons: Optional[float] = None
    speed_kmph: Optional[float] = None
