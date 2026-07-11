from fastapi import APIRouter,HTTPException
from db.database import dinosaur_collection

router = APIRouter()

@router.get('/preview')
def preview_list() :
    data = dinosaur_collection.find().limit(3)
    dinosaurs = list(data)
    dino_list = []
    for i in dinosaurs :
        dino_list.append({
            'name' : i.get('name'),
            'era' : i.get('period'),
            'image' : i.get('image'),
            'diet' : i.get('diet'),
            'threat' : i.get('threat'),
            'slug' : i.get('slug')
        })
    return dino_list

@router.get('/all')
def all_list():
    data = dinosaur_collection.find()
    dinosaurs = list(data)
    dino_list = []
    for i in dinosaurs :
        dino_list.append({
            'name' : i.get('name'),
            'era' : i.get('period'),
            'image' : i.get('image'),
            'diet' : i.get('diet'),
            'threat' : i.get('threat'),
            'slug' : i.get('slug')
        })
    return dino_list

@router.get('/{slug}')
def dino_detail(slug : str):
    dinosaur_detail = dinosaur_collection.find_one({
        "slug":slug
    })
    if dinosaur_detail is None :
        raise HTTPException(status_code=404,detail='Dinosaur Not Found')
    dinosaur_detail["id"] = str(dinosaur_detail.pop("_id"))
    return dinosaur_detail