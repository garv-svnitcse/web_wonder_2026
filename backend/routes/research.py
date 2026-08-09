from fastapi import APIRouter, HTTPException, status, Depends, Form, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from schemas import research
from db.database import research_collection, dinosaur_collection, researcher_detail, comment_collection
from datetime import datetime
from dependencies import auth
# pyrefly: ignore [missing-import]
from bson import ObjectId
from schemas.research import CommentCreate, ResearchDetail
from pydantic import EmailStr, ValidationError
from typing import Optional
from services.cloudinary_service import upload_file_to_cloudinary
from core.config import RECEIVER_EMAIL
from services.email_service import send_email

router = APIRouter()


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
def get_preview(
    limit: Optional[int] = 50,
    search: Optional[str] = None,
    status: Optional[str] = None,
    era: Optional[str] = None,
    sortBy: Optional[str] = "latest"
):
    try:
        query = {}
        
        if status and status.strip():
            query["status"] = {"$regex": f"^{status.strip()}$", "$options": "i"}
            
        if era and era.strip():
            query["era"] = {"$regex": era.strip(), "$options": "i"}

        if search and search.strip():
            search_term = search.strip()
            regex_pattern = {"$regex": search_term, "$options": "i"}
            query["$or"] = [
                {"title": regex_pattern},
                {"species": regex_pattern},
                {"researcher": regex_pattern},
                {"era": regex_pattern},
                {"abstract": regex_pattern},
                {"key_findings": regex_pattern}
            ]

        research_docs = list(research_collection.find(query))
        
        updated_research = []
        for doc in research_docs:
            species = doc.get("species", "")
            researcher_name = doc.get("researcher", "")
            dino_doc = dinosaur_collection.find_one({"name": species}) or {"image": "/images/fossil.jpg"}
            dino_image = dino_doc.get("image", "/images/fossil.jpg") if isinstance(dino_doc, dict) else "/images/fossil.jpg"
            res_doc = researcher_detail.find_one({"full_name": researcher_name}) or {"profile_photo": "", "specialization": "Researcher"}
            researcher_image = res_doc.get("profile_photo", "") if isinstance(res_doc, dict) else ""
            designation = res_doc.get("specialization", "Researcher") if isinstance(res_doc, dict) else "Researcher"
            key_find = doc.get("key_findings")
            if isinstance(key_find, list) and len(key_find) > 0:
                key_find = key_find[0]
            title = doc.get("title", "")
            doc_status = doc.get("status", "pending")
            doc_era = doc.get("era", "Unknown")
               
            comment_count = comment_collection.count_documents({'research_title': title})
            last_comment_doc = comment_collection.find_one({'research_title': title}, sort=[('createdAt', -1)])
            last_comment = None
            if last_comment_doc and isinstance(last_comment_doc, dict):
                last_comment = {
                    "author": last_comment_doc.get("author", "Explorer"),
                    "text": last_comment_doc.get("text", "")
                }
                
            created_at = doc.get("createdAt")
            date_str = created_at.strftime("%B %d, %Y") if isinstance(created_at, datetime) else str(created_at or "May 14, 2026")
            
            raw_views = doc.get("views", 0)
            numeric_views = 0
            if isinstance(raw_views, (int, float)):
                numeric_views = int(raw_views)
            elif isinstance(raw_views, str):
                clean_v = raw_views.lower().replace('k', '000').replace('.', '').replace('m', '000000')
                try:
                    numeric_views = int(''.join(filter(str.isdigit, clean_v)) or 0)
                except ValueError:
                    numeric_views = 0
            
            sort_date = datetime.min
            if isinstance(created_at, datetime):
                sort_date = created_at

            updated_research.append({
                "title": title,
                "image": dino_image,
                "species": species,
                "status": doc_status,
                "era": doc_era,
                "date": date_str,
                "views": raw_views,
                "numeric_views": numeric_views,
                "comments": comment_count,
                "lastComment": last_comment,
                "scientist": {
                    "name": researcher_name,
                    "role": designation,
                    "avatar": researcher_image
                },
                "description": key_find or "",
                "_sort_date": sort_date
            })

        # Sort based on sortBy parameter
        if sortBy == "popular":
            updated_research.sort(key=lambda x: x["numeric_views"], reverse=True)
        elif sortBy == "discussed":
            updated_research.sort(key=lambda x: x["comments"], reverse=True)
        else: # "latest"
            updated_research.sort(key=lambda x: x["_sort_date"], reverse=True)

        # Clean up internal sorting properties
        for item in updated_research:
            item.pop("numeric_views", None)
            item.pop("_sort_date", None)

        if limit and limit > 0:
            updated_research = updated_research[:limit]
            
        return updated_research

    except Exception as e:
        print(f"Error in get_preview: {e}")
        return []

@router.put("/view")
def update_view(title : str) :
    research_page = research_collection.find_one({"title" : title})
    if research_page:
        research_page["views"] = research_page["views"] + 1
        research_collection.update_one({"title" : title}, {"$set" : {"views" : research_page["views"]}})
        return {"message" : "View updated successfully"}
    return {"message" : "Research page not found"}

@router.get("/{title}")
def title_detail(title : str) :
    research_page = research_collection.find_one({"title" : title})
    if not research_page:
        raise HTTPException(status_code=404, detail="Research page not found")
        
    dino_doc = dinosaur_collection.find_one({"name" : research_page.get("species")})
    if dino_doc:
        species_image = dino_doc.get("image", "/images/fossil.jpg")
        diet = dino_doc.get("diet", "Unknown")
        threat = dino_doc.get("threat", dino_doc.get("threats", "Low"))
    else:
        species_image = "/images/fossil.jpg"
        diet = "Unknown"
        threat = "Low"

    status = research_page.get("status", "pending")
    era = research_page.get("era", "Unknown")
    
    res_doc = researcher_detail.find_one({"full_name" : research_page.get("researcher")})
    if res_doc:
        researcher_image = res_doc.get("profile_photo", f"https://i.pravatar.cc/150?u={research_page.get('researcher')}")
        designation = res_doc.get("specialization", "Researcher")
    else:
        researcher_image = f"https://i.pravatar.cc/150?u={research_page.get('researcher')}"
        designation = "Researcher"
        
    name = research_page.get("researcher", "Unknown Researcher")
    
    created_at = research_page.get("createdAt")
    date = created_at.strftime("%B %d, %Y") if isinstance(created_at, datetime) else "May 14, 2026"
    
    views = research_page.get("views", 0)
    comments = comment_collection.find({'research_title': research_page.get("title")})
    abstract = research_page.get("abstract", "")
    
    updated_comment = []
    for com in comments : 
        created_at_com = com.get("createdAt")
        com_date = created_at_com.strftime("%B %d, %Y") if isinstance(created_at_com, datetime) else "May 14, 2026"
        updated_comment.append({
            "author": com.get("author", "Anonymous"),
            "text": com.get("text", ""),
            "date": com_date,
            "_id": str(com.get("_id"))
        })
        
    return {
        "title": title,
        "image": species_image,
        "status": status,
        "era": era,
        "date": date,
        "views": views,
        "comments": updated_comment,
        "scientist": {
            "name": name,
            "role": designation,
            "avatar": researcher_image
        },
        "diet": diet,
        "threat": threat,
        "abstract": abstract
    }

@router.post("/research")
def research_create(
    request: Request,
    title: str = Form(...),
    co_researchers: str = Form(""),
    species: str = Form(...),
    era: str = Form(...),
    key_findings: str = Form(...),
    abstract: str = Form(...),
    references: str = Form(""),
    researcher_name: str = Form(...),
    researcher_email: str = Form(...),
    researcher_specialization: str = Form(...),
    researcher_awards: int = Form(...),
    researcher_quote: Optional[str] = Form("Seeking secrets in the bones of time."),
    notes: Optional[str] = Form(""),
    evidence_document: UploadFile = File(...),
    researcher_avatar: Optional[UploadFile] = File(None)
):
    try:
        researchData = ResearchDetail(
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
            email=researcher_email,
            quote=researcher_quote
        )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Save files to Cloudinary
    try:
        evidence_url = upload_file_to_cloudinary(
            researchData.evidence_document, 
            researchData.evidence_document.filename
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    avatar_url = ""
    if researchData.profile_photo and researchData.profile_photo.filename:
        try:
            avatar_url = upload_file_to_cloudinary(
                researchData.profile_photo,
                researchData.profile_photo.filename
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
    res_doc = researcher_detail.find_one({"full_name" : researchData.researcher_name})
    if res_doc is None:
        researcher_detail.insert_one({
            "full_name" : researchData.researcher_name,
            "email" : researchData.email,
            "specialization" : researchData.designation,
            "profile_photo" : avatar_url,
            "awards_won" : researchData.awards,
            "citations_count" : 0,
            "published_studies" : 0,
            "featured_quote" : researchData.quote
        })
    else :
        researcher_detail.update_one(
            {"full_name": researchData.researcher_name},
            {
                "$set": {
                    "full_name": researchData.researcher_name,
                    "email": researchData.email,
                    "specialization": researchData.designation,
                    "awards_won": researchData.awards,
                    "profile_photo": avatar_url or res_doc.get("profile_photo") or f"https://i.pravatar.cc/150?u={researchData.researcher_name}",
                    "featured_quote" : researchData.quote
                }
            },
        )
    
    # Create research paper record in DB
    research_collection.insert_one({
        "title": researchData.title,
        "co_researchers": researchData.Co_researcher,
        "evidence_document": evidence_url,
        "species": researchData.species,
        "era": researchData.era,
        "key_findings": [researchData.key_finding],
        "abstract": researchData.abstract,
        "references": researchData.reference,
        "notes": notes,
        "researcher": researchData.researcher_name,
        "status": "pending",
        "createdAt": datetime.utcnow(),
        "views": 0
    })
    
    import urllib.parse
    encoded_title = urllib.parse.quote(researchData.title)
    base_url = str(request.base_url)
    approve_url = f"{base_url}research/approve/{encoded_title}"
    reject_url = f"{base_url}research/reject/{encoded_title}"

    html_content = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Research Dossier Submitted</h2>
            <p style="font-size: 16px;">A new research finding has been logged and is awaiting your verification.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                    <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 120px;">Title:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">{researchData.title}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Researcher:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">{researchData.researcher_name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Species:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">{researchData.species}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Era:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">{researchData.era}</td>
                </tr>
            </table>
            
            <h3 style="margin-top: 20px; color: #333;">Key Findings</h3>
            <p style="background: #f9f9f9; padding: 12px; border-left: 4px solid #4CAF50; font-style: italic;">{researchData.key_finding}</p>
            
            <h3 style="margin-top: 20px; color: #333;">Abstract</h3>
            <p style="line-height: 1.6; color: #555;">{researchData.abstract}</p>
            
            <h3 style="margin-top: 20px; color: #333;">References</h3>
            <p style="color: #555;">{researchData.reference}</p>
            
            <h3 style="margin-top: 20px; color: #333;">Additional Notes</h3>
            <p style="color: #555;">{notes}</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                <a href="{approve_url}" style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 15px; display: inline-block;">Approve Research</a>
                <a href="{reject_url}" style="background-color: #F44336; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reject Research</a>
            </div>
        </div>
        """
    send_email(
        subject=f"New Research Submitted: {researchData.title}",
        html_content=html_content,
        to_email=RECEIVER_EMAIL
    )
        
    return {"message": "Research and profile submitted successfully"}

def render_status_card(paper_title: str, status_type: str, title_heading: str, message: str):
    is_success = status_type == "approved"
    badge_color = "#4C8A4F" if is_success else ("#F44336" if status_type == "rejected" else "#D6A14B")
    icon_char = "&#10004;" if is_success else ("&#10007;" if status_type == "rejected" else "&#8505;")
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_heading} | JurassiVerse Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            background: #08110B;
            background-image: 
                radial-gradient(circle at 50% 30%, rgba(76, 138, 79, 0.18) 0%, transparent 60%),
                radial-gradient(circle at 80% 80%, rgba(214, 161, 75, 0.1) 0%, transparent 50%);
            color: #ECE4D8;
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }}
        .card {{
            background: rgba(14, 26, 18, 0.9);
            border: 1px solid rgba(214, 161, 75, 0.35);
            border-radius: 20px;
            padding: 44px 36px;
            max-width: 520px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(214, 161, 75, 0.12);
            backdrop-filter: blur(16px);
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }}
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(24px) scale(0.96); }}
            to {{ opacity: 1; transform: translateY(0) scale(1); }}
        }}
        .icon-badge {{
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            border-radius: 50%;
            background: rgba(214, 161, 75, 0.08);
            border: 2px solid {badge_color};
            color: {badge_color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 38px;
            box-shadow: 0 0 30px {badge_color}40;
        }}
        .heading {{
            font-family: 'Cinzel', serif;
            font-size: 24px;
            font-weight: 700;
            color: #D6A14B;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            text-transform: uppercase;
        }}
        .paper-title {{
            font-size: 16px;
            font-weight: 500;
            color: #ECE4D8;
            background: rgba(214, 161, 75, 0.08);
            border-left: 3px solid #D6A14B;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 6px;
            text-align: left;
            line-height: 1.5;
        }}
        .message {{
            font-size: 15px;
            color: rgba(236, 228, 216, 0.85);
            line-height: 1.6;
            margin-bottom: 28px;
        }}
        .btn {{
            display: inline-block;
            background: linear-gradient(135deg, #D6A14B 0%, #B58232 100%);
            color: #08110B;
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 14px 32px;
            border-radius: 30px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(214, 161, 75, 0.3);
        }}
        .btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(214, 161, 75, 0.5);
        }}
        .footer-brand {{
            margin-top: 28px;
            font-size: 11px;
            color: rgba(214, 161, 75, 0.5);
            letter-spacing: 2px;
            text-transform: uppercase;
        }}
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-badge">{icon_char}</div>
        <h1 class="heading">{title_heading}</h1>
        <div class="paper-title">"{paper_title}"</div>
        <p class="message">{message}</p>
        <a href="/" class="btn">Return To Expedition</a>
        <div class="footer-brand">&#9830; JurassiVerse Administration &#9830;</div>
    </div>
</body>
</html>"""
    return HTMLResponse(content=html, status_code=200)

@router.get("/approve/{title}")
def approve_research(title: str):
    research_page = research_collection.find_one({"title": title})
    if not research_page:
        return render_status_card(title, "not_found", "Research Not Found", "The requested research submission could not be located in our records.")
        
    if research_page.get("status") == "approved":
        return render_status_card(title, "approved", "Already Approved", "This research paper has already been approved and registered in the archives.")
        
    # Update status to approved
    research_collection.update_one({"title": title}, {"$set": {"status": "approved"}})
    
    # Increment published_studies for the researcher
    researcher_name = research_page.get("researcher")
    researcher_email = None
    if researcher_name:
        res_doc = researcher_detail.find_one({"full_name": researcher_name})
        if res_doc:
            researcher_email = res_doc.get("email")
            
        researcher_detail.update_one(
            {"full_name": researcher_name},
            {"$inc": {"published_studies": 1}}
        )
        
    if researcher_email:
        send_to = RECEIVER_EMAIL if RECEIVER_EMAIL else researcher_email
        html_content = f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Research Approved &#10003;</h2>
                <p style="font-size: 16px;">Dear {researcher_name},</p>
                <p style="font-size: 16px; line-height: 1.6;">We are pleased to inform you that your research paper titled <strong>"{title}"</strong> has been approved by the administrators.</p>
                <p style="font-size: 16px; line-height: 1.6;">Your credentials and findings are now registered in the explorer archives, and your published studies count has been updated.</p>
                <br/>
                <p style="font-size: 14px; color: #777;">Best regards,<br/>The JurassiVerse Team</p>
            </div>
        """
        send_email(
            subject=f"Your Research has been Approved: {title}",
            html_content=html_content,
            to_email=send_to
        )
            
    return render_status_card(title, "approved", "Research Approved", "The research paper has been approved successfully. The researcher has been notified, and the paper is now live in the explorer archives.")

@router.get("/reject/{title}")
def reject_research(title: str):
    research_page = research_collection.find_one({"title": title})
    if not research_page:
        return render_status_card(title, "not_found", "Research Not Found", "The requested research submission could not be located in our records.")
        
    was_approved = research_page.get("status") == "approved"
    
    # Update status to rejected
    research_collection.update_one({"title": title}, {"$set": {"status": "rejected"}})
    
    # Find researcher details
    researcher_name = research_page.get("researcher")
    researcher_email = None
    if researcher_name:
        res_doc = researcher_detail.find_one({"full_name": researcher_name})
        if res_doc:
            researcher_email = res_doc.get("email")
            
        if was_approved:
            researcher_detail.update_one(
                {"full_name": researcher_name},
                {"$inc": {"published_studies": -1}}
            )
            
    if researcher_email:
        send_to = RECEIVER_EMAIL if RECEIVER_EMAIL else researcher_email
        html_content = f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #F44336; border-bottom: 2px solid #F44336; padding-bottom: 10px;">Research Declined &#10007;</h2>
                <p style="font-size: 16px;">Dear {researcher_name},</p>
                <p style="font-size: 16px; line-height: 1.6;">Thank you for submitting your research paper titled <strong>"{title}"</strong> to the JurassiVerse archives.</p>
                <p style="font-size: 16px; line-height: 1.6;">Unfortunately, after review, your research submission has been declined at this time. Please feel free to revise and resubmit.</p>
                <br/>
                <p style="font-size: 14px; color: #777;">Best regards,<br/>The JurassiVerse Team</p>
            </div>
        """
        send_email(
            subject=f"Update on Your Research Submission: {title}",
            html_content=html_content,
            to_email=send_to
        )
            
    return render_status_card(title, "rejected", "Research Declined", "The research paper submission has been declined. The submitter has been notified via email.")

@router.post("/{title}")
def add_comment(comment : CommentCreate,title : str) :
    comment_collection.insert_one({
        "author": comment.author,
        "text": comment.text,
        "research_title": title,
        "createdAt": datetime.now()
    })
    return {"message" : "Comment sent successfully"}
    