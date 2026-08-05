from fastapi import APIRouter, HTTPException
from db.database import dinosaur_collection

router = APIRouter()

def get_thumbnail_url(url: str) -> str:
    if url and "drive.google.com/file/d/" in url:
        try:
            file_id = url.split("/file/d/")[1].split("/")[0]
            return f"https://drive.google.com/thumbnail?id={file_id}&sz=w600"
        except Exception:
            pass
    return url

@router.get('/preview')
def preview_list():
    data = dinosaur_collection.find().limit(3)
    dinosaurs = list(data)
    dino_list = []
    for i in dinosaurs:
        dino_list.append({
            'name': i.get('name'),
            'era': i.get('period'),
            'image': get_thumbnail_url(i.get('image')),
            'diet': i.get('diet'),
            'threat': i.get('threat'),
            'slug': i.get('slug')
        })
    return dino_list

@router.get('')
def all_list(search: str = "", era: str = "", diet: str = "", sort: str = "name"):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if era:
        query["$or"] = [
            {"era": {"$regex": era, "$options": "i"}},
            {"period": {"$regex": era, "$options": "i"}}
        ]
    if diet:
        query["diet"] = {"$regex": diet, "$options": "i"}
        
    data = dinosaur_collection.find(query)
    
    if sort == "era":
        data = data.sort("million_years_ago", -1)
    elif sort == "danger" or sort == "threat":
        data = data.sort("threat", 1)
    else:
        data = data.sort("name", 1)
        
    dinosaurs = list(data)
    dino_list = []
    for i in dinosaurs:
        stats = i.get("physical_stats") or {}
        length_m = stats.get("length_m", 0)
        weight_tons = stats.get("weight_tons", 0)
        speed_kmph = stats.get("speed_kmph", 0)
        
        if weight_tons and weight_tons < 1.0:
            weight_str = f"{int(weight_tons * 1000)} kg"
        else:
            weight_str = f"{weight_tons} Tons" if weight_tons else "N/A"
            
        dino_list.append({
            "id": str(i.get("_id")),
            "slug": i.get("slug"),
            "name": i.get("name"),
            "scientificName": i.get("scientific_name"),
            "thumbnail": get_thumbnail_url(i.get("image")),
            "era": i.get("period") or i.get("era"),
            "diet": i.get("diet"),
            "threat": i.get("threat"),
            "danger": i.get("threat") or i.get("danger"),
            "description": i.get("description"),
            "length": f"{length_m} m" if length_m else "N/A",
            "weight": weight_str,
            "speed": f"{speed_kmph} km/h" if speed_kmph else "N/A",
            "3d_model_url": i.get("3d_model_url") or f"/models/{str(i.get('slug', '')).split('-')[0]}.glb"
        })
    return dino_list

@router.get("/model-proxy")
def model_proxy(id: str):
    import requests
    from fastapi.responses import StreamingResponse
    url = f"https://docs.google.com/uc?export=download&id={id}"
    
    def stream_chunks():
        with requests.get(url, stream=True, allow_redirects=True) as r:
            for chunk in r.iter_content(chunk_size=102400):
                if chunk:
                    yield chunk

    return StreamingResponse(stream_chunks(), media_type="application/octet-stream")

@router.get('/{slug}')
def dino_detail(slug: str):
    dinosaur_detail = dinosaur_collection.find_one({
        "slug": slug
    })
    if dinosaur_detail is None:
        raise HTTPException(status_code=404, detail='Dinosaur Not Found')
    dinosaur_detail["id"] = str(dinosaur_detail.pop("_id"))
    dinosaur_detail["image"] = get_thumbnail_url(dinosaur_detail.get("image"))
    if "3d_model_url" not in dinosaur_detail or not dinosaur_detail["3d_model_url"]:
        dinosaur_detail["3d_model_url"] = f"/models/{slug.split('-')[0]}.glb"
    return dinosaur_detail