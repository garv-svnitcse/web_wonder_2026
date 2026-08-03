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
    
    # Newly added fields matching the frontend Dinosaur page
    height_m: Optional[float] = None
    bite_force_psi: Optional[float] = None
    
    # Classification
    class_kingdom: Optional[str] = "Animalia"
    class_phylum: Optional[str] = "Chordata"
    class_class: Optional[str] = "Reptilia"
    class_order: Optional[str] = ""
    class_family: Optional[str] = ""
    class_genus: Optional[str] = ""
    class_species: Optional[str] = ""
    
    # Fossil Evidence
    fossil_summary: Optional[str] = ""
    fossil_discovery_year: Optional[str] = ""
    fossil_discovery_location: Optional[str] = ""
    fossil_discovered_by: Optional[str] = ""
    
    # DNA Insights
    dna_status: Optional[str] = ""
    dna_summary: Optional[str] = ""
    
    # Behaviour
    behaviour_hunting_style: Optional[str] = ""
    behaviour_social_behavior: Optional[str] = ""
    behaviour_intelligence: Optional[str] = ""
    behaviour_prey: Optional[str] = ""
    behaviour_predators: Optional[str] = ""
