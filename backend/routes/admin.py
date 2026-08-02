from datetime import datetime
import re

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from db.database import (
    dinosaur_collection, research_collection, user_collection,
    community_post_collection, community_comment_collection,
)
from dependencies.auth import admin_required
from schemas.admin import DinosaurUpsert

router = APIRouter(dependencies=[Depends(admin_required)])


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def serialize_dinosaur(doc):
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
        "physical_stats": doc.get("physical_stats", {}),
    }


@router.get("/overview")
def overview():
    latest_dinosaurs = dinosaur_collection.find().sort("_id", -1).limit(5)
    latest_research = research_collection.find().sort("createdAt", -1).limit(5)
    latest_posts = community_post_collection.find().sort("created_at", -1).limit(5)
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
                "researcher": doc.get("researcher", "Unknown"),
                "species": doc.get("species", ""), "status": doc.get("status", "pending"),
                "createdAt": doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else "",
            } for doc in latest_research
        ],
        "posts": [
            {"id": str(doc["_id"]), "title": doc.get("title", "Untitled"), "author": doc.get("author", "Explorer"),
             "votes": doc.get("votes", 0)} for doc in latest_posts
        ],
    }


@router.post("/dinosaurs", status_code=status.HTTP_201_CREATED)
def create_dinosaur(payload: DinosaurUpsert):
    data = payload.model_dump()
    data["slug"] = data["slug"] or slugify(data["name"])
    if dinosaur_collection.find_one({"slug": data["slug"]}):
        raise HTTPException(status_code=409, detail="A dinosaur with this slug already exists")
    data["physical_stats"] = {
        "length_m": data.pop("length_m"), "weight_tons": data.pop("weight_tons"),
        "speed_kmph": data.pop("speed_kmph"),
    }
    data["createdAt"] = datetime.utcnow()
    result = dinosaur_collection.insert_one(data)
    return serialize_dinosaur(dinosaur_collection.find_one({"_id": result.inserted_id}))


@router.put("/dinosaurs/{dinosaur_id}")
def update_dinosaur(dinosaur_id: str, payload: DinosaurUpsert):
    try:
        object_id = ObjectId(dinosaur_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dinosaur id")
    data = payload.model_dump()
    data["slug"] = data["slug"] or slugify(data["name"])
    data["physical_stats"] = {
        "length_m": data.pop("length_m"), "weight_tons": data.pop("weight_tons"),
        "speed_kmph": data.pop("speed_kmph"),
    }
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
