from fastapi import APIRouter,HTTPException
from schemas.timeline import Timeline
from db.database import dinosaur_collection

router = APIRouter()

@router.get("/preview")
def preview_timeline():
    data = dinosaur_collection.find().sort("million_years_ago", 1).limit(3)
    dinosaurs = list(data)
    dinosaurs_list = []
    for i in dinosaurs:
        dinosaurs_list.append({
            "id": str(i.get('_id', '')),
            "name": str(i.get("name", "")),
            "slug": str(i.get('slug', '')),
            "scientific_name": str(i.get('scientific_name', '')),
            "nickname": str(i.get('nickname', '')),
            "description": str(i.get('description', '')),
            "image": str(i.get('image', '')),
            "era": str(i.get('era', '')),
            "period": str(i.get('period', '')),
            "million_years_ago": i.get('million_years_ago', 0),
            "diet": str(i.get('diet', '')),
            "habitat": str(i.get('habitat', '')),
            "continent": str(i.get('continent', '')),
            "physical_stats": i.get('physical_stats', {}),
            "classification": i.get('classification', {}),
            "fossil_evidence": i.get('fossil_evidence', {}),
            "dna_insights": i.get('dna_insights', {}),
            "behaviour": i.get('behaviour', {}),
            "fun_facts": i.get('fun_facts', []),
            "conservation": i.get('conservation', {})
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