from fastapi import APIRouter, HTTPException, status, Depends
from schemas import research
from db.database import research_collection, dinosaur_collection, researcher_detail, comment_collection
from datetime import datetime
from dependencies import auth
# pyrefly: ignore [missing-import]
from bson import ObjectId
from schemas.research import CommentCreate

router = APIRouter()

@router.post("/")
def submit_research(research_paper: research.ResearchPaper, current_user = Depends(auth.get_current_user)):
    data = research_paper.model_dump()
    data['researcher_id'] = str(current_user['_id'])
    data['researcher_name'] = current_user['name']
    data['status'] = 'pending'
    data['createdAt'] = datetime.utcnow()
    data['views'] = 0
    result = research_collection.insert_one(data)
    #todo,email service,notification
    return {
        'message': 'research submitted successfully',
        'id': str(result.inserted_id)
    }

@router.get('')
def latest_research():
    data = research_collection.find().sort('createdAt', -1).limit(8)
    return [{**doc, '_id': str(doc['_id'])} for doc in data]

@router.get('/me')
def my_research(current_user = Depends(auth.get_current_user)):
    data = research_collection.find({'researcher_id': str(current_user['_id'])})
    return [{**doc, '_id': str(doc['_id'])} for doc in data]

@router.get('/pending')
def pending_research(current_user = Depends(auth.admin_required)):
    data = research_collection.find({'status': 'pending'})
    return [{**doc, '_id': str(doc['_id'])} for doc in data]

@router.get("/stats")
def get_research_stats():
    count_research = research_collection.count_documents({})
    count_researcher = researcher_detail.count_documents({})
    count_research_pending = research_collection.count_documents({'status': 'pending'})
    count_research_approved = research_collection.count_documents({'status': 'approved'})
    return {
        "total research" : count_research,
        "researchers" : count_researcher,
        "research pending" : count_research_pending,
        "research approved" : count_research_approved
    }

@router.get('/leaderboard')
def get_leaderboard():
    top_researchers = researcher_detail.find().sort('published_studies', -1).limit(5)
    top_researcher_list = list(top_researchers)
    
    updated_top_researcher = []
    rank = 1
    for doc in top_researcher_list:
        doc["_id"] = str(doc["_id"])
        doc["rank"] = rank
        doc["name"] = doc.get("full_name", "")
        doc["role"] = doc.get("specialization", "")
        doc["papers"] = doc.get("published_studies", 0)
        
        # Map known profile photo files to beautiful pravatar images, or use fallback
        photo = doc.get("profile_photo", "")
        if photo.startswith("/researchers/"):
            name_lower = doc["name"].lower()
            if "amelia" in name_lower:
                doc["avatar"] = "https://i.pravatar.cc/150?img=47"
            elif "sophia" in name_lower:
                doc["avatar"] = "https://i.pravatar.cc/150?img=32"
            elif "noah" in name_lower:
                doc["avatar"] = "https://i.pravatar.cc/150?img=12"
            elif "ethan" in name_lower:
                doc["avatar"] = "https://i.pravatar.cc/150?img=53"
            elif "kevin" in name_lower:
                doc["avatar"] = "https://i.pravatar.cc/150?img=11"
            elif "olivia" in name_lower:
                doc["avatar"] = "https://i.pravatar.cc/150?img=45"
            else:
                doc["avatar"] = f"https://i.pravatar.cc/150?u={doc['name']}"
        else:
            doc["avatar"] = photo or f"https://i.pravatar.cc/150?u={doc['name']}"
            
        updated_top_researcher.append(doc)
        rank += 1
        
    return updated_top_researcher

@router.get('/leading')
def get_leading_researcher():
    doc = researcher_detail.find_one(sort=[('published_studies', -1)])
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No leading researcher found")
    
    doc["_id"] = str(doc["_id"])
    name = doc.get("full_name", "")
    role = doc.get("specialization", "")
    quote = doc.get("featured_quote", "")
    published_studies = doc.get("published_studies", 0)
    awards_won = doc.get("awards_won", 0)
    citations_count = doc.get("citations_count", 0)
    
    # Map known profile photo files to beautiful pravatar images, or use fallback
    photo = doc.get("profile_photo", "")
    avatar = photo
    if photo.startswith("/researchers/"):
        name_lower = name.lower()
        if "amelia" in name_lower:
            avatar = "https://i.pravatar.cc/300?img=47"
        elif "sophia" in name_lower:
            avatar = "https://i.pravatar.cc/300?img=32"
        elif "noah" in name_lower:
            avatar = "https://i.pravatar.cc/300?img=12"
        elif "ethan" in name_lower:
            avatar = "https://i.pravatar.cc/300?img=53"
        elif "kevin" in name_lower:
            avatar = "https://i.pravatar.cc/300?img=11"
        elif "olivia" in name_lower:
            avatar = "https://i.pravatar.cc/300?img=45"
        else:
            avatar = f"https://i.pravatar.cc/300?u={name}"
    else:
        avatar = photo or f"https://i.pravatar.cc/300?u={name}"
        
    return {
        "name": name,
        "role": role,
        "avatar": avatar,
        "quote": quote,
        "published_studies": published_studies,
        "awards_won": awards_won,
        "citations_count": citations_count
    }

def get_direct_image_url(url: str) -> str:
    if not url:
        return ""
    if "drive.google.com" in url:
        file_id = ""
        if "/d/" in url:
            parts = url.split("/d/")
            if len(parts) > 1:
                file_id = parts[1].split("/")[0].split("?")[0]
        elif "id=" in url:
            parts = url.split("id=")
            if len(parts) > 1:
                file_id = parts[1].split("&")[0]
        if file_id:
            return f"https://drive.google.com/thumbnail?id={file_id}&sz=w1000"
    return url

@router.get('/preview')
def get_preview(limit: int = 3):
    # Fetch 3 latest research papers
    research_docs = research_collection.find().sort('createdAt', -1).limit(limit)
    research_list = list(research_docs)
    
    updated_research = []
    for doc in research_list:
        species = doc.get("species", "")
        researcher_name = doc.get("researcher", "")
        dino_doc = dinosaur_collection.find_one({"name" : species}) or {"image": "/images/fossil.jpg"}
        dino_image = dino_doc["image"]
        res_doc = researcher_detail.find_one({"full_name" : researcher_name}) or {"profile_photo": "", "specialization": "Researcher"}
        researcher_image = res_doc["profile_photo"]
        designation = res_doc["specialization"]
        key_find = doc.get("key_findings")
        title = doc.get("title")
        status = doc.get("status")
        era = doc.get("era")
           
        # 3. Fetch comments count and last comment
        comment_count = comment_collection.count_documents({'research_title': title})
        last_comment_doc = comment_collection.find_one({'research_title': title}, sort=[('createdAt', -1)])
        last_comment = None
        if last_comment_doc:
            last_comment = {
                "author": last_comment_doc.get("author", "Explorer"),
                "text": last_comment_doc.get("text", "")
            }
            
        # 4. Format date
        created_at = doc.get("createdAt")
        date_str = created_at.strftime("%B %d, %Y") if isinstance(created_at, datetime) else "May 14, 2026"
        
        # 7. Views
        views = doc.get("views", "1.2K")
        
        updated_research.append({
            "title": title,
            "image": dino_image,
            "status": status,
            "era": era,
            "date": date_str,
            "views": views,
            "comments": comment_count,
            "lastComment": last_comment,
            "scientist": {
                "name": researcher_name,
                "role": designation,
                "avatar": researcher_image
            }
        })
        
    return updated_research

@router.put("/view")
def update_view(title : str) :
    research_page = research_collection.find_one({"title" : title})
    if not research_page:
        research_page = research_collection.find_one({"slug" : title})
    if research_page:
        current_views = research_page.get("views", 0) or 0
        research_collection.update_one({"_id" : research_page["_id"]}, {"$set" : {"views" : current_views + 1}})
        return {"message" : "View updated successfully"}
    return {"message" : "Research page not found"}

@router.get("/{title}")
def title_detail(title : str) :
    # Look up by title first, then slug, then by matching slugified title/species
    research_page = research_collection.find_one({"title" : title})
    if not research_page:
        research_page = research_collection.find_one({"slug" : title})
    if not research_page:
        all_docs = list(research_collection.find())
        for doc in all_docs:
            doc_species = doc.get("species", "")
            doc_title = doc.get("title", "")
            if doc_species and doc_species.lower().replace(" ", "-") == title.lower():
                research_page = doc
                break
            if doc_title and doc_title.lower().replace(" ", "-") == title.lower():
                research_page = doc
                break
    if not research_page:
        raise HTTPException(status_code=404, detail="Research page not found")
        
    species = research_page.get("species", "")
    dino_doc = dinosaur_collection.find_one({"name" : species}) or {}
    species_image = get_direct_image_url(dino_doc.get("image", "/images/fossil.jpg"))
    diet = dino_doc.get("diet", "Unknown Diet")
    threat = dino_doc.get("threats", "Unknown Threats")
    
    status = research_page.get("status", "pending")
    era = research_page.get('era', "Unknown Era")
    
    researcher_name = research_page.get("researcher", "")
    res_doc = researcher_detail.find_one({"full_name" : researcher_name}) or {"profile_photo": "", "specialization": "Researcher"}
    designation = res_doc.get('specialization', "Researcher")
    photo = res_doc.get('profile_photo', '')
    
    # Avatar mapping
    researcher_image = photo
    if photo.startswith("/researchers/"):
        r_name_lower = researcher_name.lower()
        if "amelia" in r_name_lower:
            researcher_image = "https://i.pravatar.cc/150?img=47"
        elif "sophia" in r_name_lower:
            researcher_image = "https://i.pravatar.cc/150?img=32"
        elif "noah" in r_name_lower:
            researcher_image = "https://i.pravatar.cc/150?img=12"
        elif "ethan" in r_name_lower:
            researcher_image = "https://i.pravatar.cc/150?img=53"
        elif "kevin" in r_name_lower:
            researcher_image = "https://i.pravatar.cc/150?img=11"
        elif "olivia" in r_name_lower:
            researcher_image = "https://i.pravatar.cc/150?img=45"
        else:
            researcher_image = f"https://i.pravatar.cc/150?u={researcher_name}"
    else:
        researcher_image = photo or f"https://i.pravatar.cc/150?u={researcher_name or 'Explorer'}"

    date_val = research_page.get('createdAt')
    date = date_val.strftime("%B %d, %Y") if isinstance(date_val, datetime) else "May 14, 2026"
    views = research_page.get('views', 0)
    comments = comment_collection.find({'research_title': research_page.get('title')})
    abstract = research_page.get("abstract", "")
    
    updated_comment = []
    for com in comments : 
        created_at_val = com.get("createdAt")
        date_str = created_at_val.strftime("%B %d, %Y") if isinstance(created_at_val, datetime) else "May 14, 2026"
        updated_comment.append({
            "author": com.get("author", "Explorer"),
            "text": com.get("text", ""),
            "date": date_str,
            "_id": str(com["_id"])
        })
        
    return {
        "title": research_page.get("title", title),
        "image": species_image,
        "status": status,
        "era": era,
        "date": date,
        "views": views,
        "comments": updated_comment,
        "scientist": {
            "name": researcher_name,
            "role": designation,
            "avatar": researcher_image
        },
        "diet": diet,
        "threat": threat,
        "abstract": abstract
    }

@router.post("/{title}")
def add_comment(comment : CommentCreate, title : str) :
    # Map title parameter (which might be the slug) back to the actual research title
    research_page = research_collection.find_one({"title" : title})
    if not research_page:
        research_page = research_collection.find_one({"slug" : title})
    if not research_page:
        # Fallback to matching slugified title/species
        all_docs = list(research_collection.find())
        for doc in all_docs:
            doc_species = doc.get("species", "")
            doc_title = doc.get("title", "")
            if doc_species and doc_species.lower().replace(" ", "-") == title.lower():
                research_page = doc
                break
            if doc_title and doc_title.lower().replace(" ", "-") == title.lower():
                research_page = doc
                break
                
    db_title = research_page.get("title", title) if research_page else title
    
    comment_collection.insert_one({
        "author": comment.author,
        "text": comment.text,
        "research_title": db_title,
        "createdAt": datetime.utcnow()
    })
    return {"message" : "Comment sent successfully"}