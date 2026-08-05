from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from fastapi import UploadFile, Form, File

class ResearchDetail(BaseModel): 
    title: str
    Co_researcher: Optional[str] = ""
    evidence_document: UploadFile
    species: str
    era: str
    key_finding: str
    abstract: str
    reference: Optional[str] = ""
    researcher_name : str
    designation : str
    profile_photo : Optional[UploadFile] = None
    awards : int
    email : EmailStr
    quote : Optional[str] = ""

    class Config:
        arbitrary_types_allowed = True

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        co_researchers: str = Form(""),
        species: str = Form(...),
        era: str = Form(...),
        key_findings: str = Form(...),
        abstract: str = Form(...),
        references: str = Form(""),
        notes: str = Form(""),
        researcher_name: str = Form(...),
        researcher_email: str = Form(...),
        researcher_specialization: str = Form(...),
        researcher_awards: int = Form(...),
        evidence_document: UploadFile = File(...),
        researcher_avatar: UploadFile = File(None)
    ):
        return cls(
            title=title,
            Co_researcher=co_researchers,
            evidence_document=evidence_document,
            species=species,
            era=era,
            key_finding=key_findings,
            abstract=abstract,
            reference=references,
            researcher_name=researcher_name,
            designation=researcher_specialization,
            profile_photo=researcher_avatar,
            awards=researcher_awards,
            email=researcher_email
        )

class CommentCreate(BaseModel):
    title: str
    author: str
    text: str
