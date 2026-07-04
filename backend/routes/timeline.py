from fastapi import APIRouter,HTTPException
from schemas.timeline import Timeline
from db.database import dinosaur_collection

router = APIRouter()

@router.get("/preview")
def preview_timeline():
    data = dinosaur_collection.find().sort("million_years_ago", 1).limit(8)
    dinosaurs = list(data)
    dinosaurs_list = []
    for i in dinosaurs:
        dinosaurs_list.append({
            "id": str(i.get('_id', '')),
            "name": str(i.get("name", "")),
            "slug": str(i.get('slug', '')),
            "million_years_ago": str(i.get('million_years_ago', '')),
            "icon": str(i.get('icon_url', i.get('icon', '')))
        })
    return dinosaurs_list

@router.get("")
def full_timeline():
    data = dinosaur_collection.find().sort('million_years_ago', 1)
    dinosaurs = list(data)
    dinosaurs_list = []
    for i in dinosaurs:
        dinosaurs_list.append({
            "id": str(i.get('_id', '')),
            "name": str(i.get("name", "")),
            "slug": str(i.get('slug', '')),
            "million_years_ago": str(i.get('million_years_ago', '')),
            "icon": str(i.get('icon_url', i.get('icon', '')))
        })
    return dinosaurs_list

@router.post('/search')
def search(data: Timeline):
    query = {}
    if data.keyword:
        query["name"] = {
            "$regex": data.keyword,
            "$options": "i"
        }
    if data.habitat:
        query['habitat'] = data.habitat
    if data.era:
        query['era'] = data.era
    if data.period:
        query['period'] = data.period
    if data.diet:
        query['diet'] = data.diet
    data = dinosaur_collection.find(query).sort("million_years_ago", 1)
    dinosaurs = list(data)
    dinosaurs_list = []
    for i in dinosaurs:
        dinosaurs_list.append({
            "id": str(i.get('_id', '')),
            "name": str(i.get("name", "")),
            "slug": str(i.get('slug', '')),
            "million_years_ago": str(i.get('million_years_ago', '')),
            "icon": str(i.get('icon_url', i.get('icon', '')))
        })
    return dinosaurs_list

@router.get("/{slug}")
def dinosaur(slug : str) :
    dinosaur_detail = dinosaur_collection.find_one({
        "slug":slug
    })
    if dinosaur_detail is None :
        raise HTTPException(status_code=404,detail='Dinosaur Not Found')
    dinosaur_detail["id"] = str(dinosaur_detail.pop("_id"))
    return dinosaur_detail