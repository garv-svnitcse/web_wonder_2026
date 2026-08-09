from fastapi import APIRouter, HTTPException
from schemas.timeline import Timeline
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

def safe_float(val):
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        try:
            cleaned = ''.join(c for c in val if c.isdigit() or c == '.')
            return float(cleaned) if cleaned else 0.0
        except ValueError:
            return 0.0
    return 0.0

@router.get("/preview")
def preview_timeline():
    try:
        data = dinosaur_collection.find().sort("million_years_ago", 1).limit(3)
        dinosaurs = list(data)
        dinosaurs_list = []
        for i in dinosaurs:
            stats = i.get("physical_stats")
            if not isinstance(stats, dict):
                stats = {}
            
            length_m = safe_float(stats.get("length_m"))
            weight_tons = safe_float(stats.get("weight_tons"))
            speed_kmph = safe_float(stats.get("speed_kmph"))
            
            # Format weight dynamically
            if weight_tons > 0 and weight_tons < 1.0:
                weight_str = f"{int(weight_tons * 1000)} kg"
            elif weight_tons >= 1.0:
                weight_str = f"{weight_tons} Tons"
            else:
                raw_w = stats.get("weight_tons")
                weight_str = str(raw_w) if raw_w else "N/A"
                
            dinosaurs_list.append({
                "name": str(i.get("name", "")).upper(),
                "era": str(i.get("period", i.get("era", ""))),
                "length": f"{length_m} m" if length_m else "N/A",
                "weight": weight_str,
                "speed": f"{speed_kmph} km/h" if speed_kmph else "N/A",
                "diet": str(i.get("diet", "")),
                "slug": str(i.get("slug", "")),
                "video": get_thumbnail_url(str(i.get("video", "")))
            })
        return dinosaurs_list
    except Exception as e:
        print(f"Error in preview_timeline: {e}")
        return []

@router.get("")
def full_timeline():
    try:
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
    except Exception as e:
        print(f"Error in full_timeline: {e}")
        return []

@router.post('/search')
def search(data: Timeline):
    try:
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
        dino_data = dinosaur_collection.find(query).sort("million_years_ago", 1)
        dinosaurs = list(dino_data)
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
    except Exception as e:
        print(f"Error in search: {e}")
        return []

@router.get("/{slug}")
def dinosaur(slug : str) :
    try:
        dinosaur_detail = dinosaur_collection.find_one({
            "slug": slug
        })
        if dinosaur_detail is None:
            raise HTTPException(status_code=404, detail='Dinosaur Not Found')
        dinosaur_detail["id"] = str(dinosaur_detail.pop("_id"))
        if "3d_model_url" not in dinosaur_detail or not dinosaur_detail["3d_model_url"]:
            dinosaur_detail["3d_model_url"] = f"/models/{slug.split('-')[0]}.glb"
        return dinosaur_detail
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in dinosaur slug endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))