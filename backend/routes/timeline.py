from fastapi import APIRouter
from schemas.timeline import Timeline
from db.database import dinosaur_collection

router = APIRouter()

@router.get("/preview")
def preview_timeline():
    data = dinosaur_collection.find().sort("million_years_ago", -1).limit(8)
    dinosaurs = list(data)
    dinosaurs_list = []
    for i in dinosaurs:
        dinosaurs_list.append({
            "id": str(i['_id']),
            "name": str(i["name"]),
            "slug": str(i['slug']),
            "million_years_ago": str(i['million_years_ago']),
            "icon": str(i['icon_url'])
        })
    return dinosaurs_list
