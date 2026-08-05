from datetime import datetime
import re
from typing import Optional
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from db.database import (
    dinosaur_collection, research_collection, user_collection,
    community_post_collection, community_comment_collection, comment_collection
)
from dependencies.auth import admin_required
from schemas.admin import DinosaurUpsert

router = APIRouter(dependencies=[Depends(admin_required)])


class ResearchUpdate(BaseModel):
    title: str
    author: str
    species: Optional[str] = ""
    status: str


class CommunityPostUpdate(BaseModel):
    title: str
    author: str
    content: str


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def serialize_dinosaur(doc):
    stats = doc.get("physical_stats", {})
    classification = doc.get("classification", {})
    fossil = doc.get("fossil_evidence", {})
    discoveries = fossil.get("discoveries", [])
    discovery = discoveries[0] if discoveries else {}
    dna = doc.get("dna_insights", {})
    behaviour = doc.get("behaviour", {})

    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "scientific_name": doc.get("scientific_name", ""),
        "slug": doc.get("slug", ""),
        "period": doc.get("period") or doc.get("era", ""),
        "diet": doc.get("diet", ""),
        "threat": doc.get("threat", "Low"),
        "description": doc.get("description", ""),
        "image": doc.get("image", ""),
        "video": doc.get("video", ""),
        "habitat": doc.get("habitat", ""),
        "million_years_ago": doc.get("million_years_ago"),

        "length_m": stats.get("length_m"),
        "weight_tons": stats.get("weight_tons"),
        "speed_kmph": stats.get("speed_kmph"),
        "height_m": stats.get("height_m"),
        "bite_force_psi": stats.get("bite_force_psi"),

        "class_kingdom": classification.get("kingdom", "Animalia"),
        "class_phylum": classification.get("phylum", "Chordata"),
        "class_class": classification.get("class", "Reptilia"),
        "class_order": classification.get("order", ""),
        "class_family": classification.get("family", ""),
        "class_genus": classification.get("genus", ""),
        "class_species": classification.get("species", ""),

        "fossil_summary": fossil.get("summary", ""),
        "fossil_discovery_year": discovery.get("year", ""),
        "fossil_discovery_location": discovery.get("location", ""),
        "fossil_discovered_by": discovery.get("discovered_by", ""),

        "dna_status": dna.get("status", ""),
        "dna_summary": dna.get("summary", ""),

        "behaviour_hunting_style": behaviour.get("hunting_style", ""),
        "behaviour_social_behavior": behaviour.get("social_behavior", ""),
        "behaviour_intelligence": behaviour.get("intelligence", ""),
        "behaviour_prey": ", ".join(behaviour.get("prey", [])),
        "behaviour_predators": ", ".join(behaviour.get("predators", [])),
    }


@router.get("/overview")
def overview():
    latest_dinosaurs = dinosaur_collection.find().sort("_id", -1).limit(5)
    latest_research = research_collection.find().sort("createdAt", -1).limit(5)
    latest_posts = community_post_collection.find().sort("created_at", -1).limit(5)
    latest_research_comments = comment_collection.find().sort("createdAt", -1).limit(5)
    latest_community_comments = community_comment_collection.find().sort("created_at", -1).limit(5)

    return {
        "counts": {
            "dinosaurs": dinosaur_collection.count_documents({}),
            "research": research_collection.count_documents({}),
            "pendingResearch": research_collection.count_documents({"status": "pending"}),
            "communityPosts": community_post_collection.count_documents({}),
            "users": user_collection.count_documents({}),
            "communityComments": community_comment_collection.count_documents({}),
        },
        "dinosaurs": [serialize_dinosaur(doc) for doc in latest_dinosaurs],
        "research": [
            {
                "id": str(doc["_id"]), "title": doc.get("title", "Untitled"),
                "researcher": doc.get("author") or doc.get("researcher") or "Unknown",
                "species": doc.get("species", ""), "status": doc.get("status", "pending"),
                "createdAt": doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else "",
            } for doc in latest_research
        ],
        "posts": [
            {"id": str(doc["_id"]), "title": doc.get("title", "Untitled"), "author": doc.get("author", "Explorer"),
             "votes": doc.get("votes", 0)} for doc in latest_posts
        ],
        "research_comments": [
            {
                "id": str(doc["_id"]),
                "research_title": doc.get("research_title", "General"),
                "author": doc.get("author", "Explorer"),
                "text": doc.get("text", ""),
                "createdAt": doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else "",
            } for doc in latest_research_comments
        ],
        "community_comments": [
            {
                "id": str(doc["_id"]),
                "post_id": doc.get("post_id", ""),
                "author": doc.get("author", "Explorer"),
                "content": doc.get("content", ""),
                "createdAt": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else "",
            } for doc in latest_community_comments
        ]
    }


def pack_dinosaur_data(payload: DinosaurUpsert) -> dict:
    data = payload.model_dump()
    data["slug"] = data["slug"] or slugify(data["name"])

    # Physical stats
    data["physical_stats"] = {
        "length_m": data.pop("length_m"),
        "weight_tons": data.pop("weight_tons"),
        "speed_kmph": data.pop("speed_kmph"),
        "height_m": data.pop("height_m"),
        "bite_force_psi": data.pop("bite_force_psi"),
    }

    # Classification
    data["classification"] = {
        "kingdom": data.pop("class_kingdom", "Animalia"),
        "phylum": data.pop("class_phylum", "Chordata"),
        "class": data.pop("class_class", "Reptilia"),
        "order": data.pop("class_order", ""),
        "family": data.pop("class_family", ""),
        "genus": data.pop("class_genus", ""),
        "species": data.pop("class_species", ""),
    }

    # Fossil evidence
    data["fossil_evidence"] = {
        "summary": data.pop("fossil_summary", ""),
        "discoveries": [
            {
                "year": data.pop("fossil_discovery_year", ""),
                "location": data.pop("fossil_discovery_location", ""),
                "discovered_by": data.pop("fossil_discovered_by", ""),
            }
        ]
    }

    # DNA insights
    data["dna_insights"] = {
        "status": data.pop("dna_status", ""),
        "summary": data.pop("dna_summary", ""),
    }

    # Behaviour
    prey_str = data.pop("behaviour_prey", "")
    predators_str = data.pop("behaviour_predators", "")
    data["behaviour"] = {
        "hunting_style": data.pop("behaviour_hunting_style", ""),
        "social_behavior": data.pop("behaviour_social_behavior", ""),
        "intelligence": data.pop("behaviour_intelligence", ""),
        "prey": [p.strip() for p in prey_str.split(",") if p.strip()] if prey_str else [],
        "predators": [p.strip() for p in predators_str.split(",") if p.strip()] if predators_str else [],
    }

    return data


@router.post("/dinosaurs", status_code=status.HTTP_201_CREATED)
def create_dinosaur(payload: DinosaurUpsert):
    data = pack_dinosaur_data(payload)
    if dinosaur_collection.find_one({"slug": data["slug"]}):
        raise HTTPException(status_code=409, detail="A dinosaur with this slug already exists")
    data["createdAt"] = datetime.utcnow()
    result = dinosaur_collection.insert_one(data)
    return serialize_dinosaur(dinosaur_collection.find_one({"_id": result.inserted_id}))


@router.put("/dinosaurs/{dinosaur_id}")
def update_dinosaur(dinosaur_id: str, payload: DinosaurUpsert):
    try:
        object_id = ObjectId(dinosaur_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dinosaur id")
    data = pack_dinosaur_data(payload)
    result = dinosaur_collection.update_one({"_id": object_id}, {"$set": data})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Dinosaur not found")
    return serialize_dinosaur(dinosaur_collection.find_one({"_id": object_id}))


@router.delete("/dinosaurs/{dinosaur_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dinosaur(dinosaur_id: str):
    try:
        result = dinosaur_collection.delete_one({"_id": ObjectId(dinosaur_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dinosaur id")
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Dinosaur not found")


# --- Research Endpoints ---

@router.delete("/research/{research_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_research(research_id: str):
    try:
        object_id = ObjectId(research_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid research id")

    result = research_collection.delete_one({"_id": object_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Research post not found")


# --- Research Comments Endpoints ---

@router.delete("/research-comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_research_comment(comment_id: str):
    try:
        object_id = ObjectId(comment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid comment id")

    result = comment_collection.delete_one({"_id": object_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Comment not found")


# --- Community Posts Endpoints ---


@router.delete("/community/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_community_post(post_id: str):
    try:
        object_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")

    result = community_post_collection.delete_one({"_id": object_id})
    # Also delete associated comments for completeness
    community_comment_collection.delete_many({"post_id": post_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Community post not found")


# --- Community Comments Endpoints ---

@router.delete("/community/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_community_comment(comment_id: str):
    try:
        object_id = ObjectId(comment_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid comment id")

    result = community_comment_collection.delete_one({"_id": object_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Comment not found")


# --- Full Retrieval GET Endpoints ---

@router.get("/dinosaurs")
def get_dinosaurs():
    docs = dinosaur_collection.find().sort("_id", -1)
    return [serialize_dinosaur(doc) for doc in docs]


@router.get("/research")
def get_research():
    docs = research_collection.find().sort("createdAt", -1)
    return [
        {
            "id": str(doc["_id"]), "title": doc.get("title", "Untitled"),
            "researcher": doc.get("author") or doc.get("researcher") or "Unknown",
            "species": doc.get("species", ""), "status": doc.get("status", "pending"),
            "createdAt": doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else "",
        } for doc in docs
    ]


@router.get("/community/posts")
def get_community_posts():
    docs = community_post_collection.find().sort("created_at", -1)
    return [
        {"id": str(doc["_id"]), "title": doc.get("title", "Untitled"), "author": doc.get("author", "Explorer"),
         "votes": doc.get("votes", 0), "content": doc.get("content", "")} for doc in docs
    ]


@router.get("/research-comments")
def get_research_comments():
    docs = comment_collection.find().sort("createdAt", -1)
    return [
        {
            "id": str(doc["_id"]),
            "research_title": doc.get("research_title", "General"),
            "author": doc.get("author", "Explorer"),
            "text": doc.get("text", ""),
            "createdAt": doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else "",
        } for doc in docs
    ]


@router.get("/community-comments")
def get_community_comments():
    docs = community_comment_collection.find().sort("created_at", -1)
    return [
        {
            "id": str(doc["_id"]),
            "post_id": doc.get("post_id", ""),
            "author": doc.get("author", "Explorer"),
            "content": doc.get("content", ""),
            "createdAt": doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else "",
        } for doc in docs
    ]
