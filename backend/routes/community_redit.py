from fastapi import APIRouter, HTTPException, status, WebSocket, WebSocketDisconnect
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

from db.database import community_post_collection, community_comment_collection
from schemas.community import CreatePost, CreateComment, VoteSchema

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

def format_post_doc(post):
    post_id = str(post["_id"])
    created_at = post.get("created_at") or post.get("createdAt")
    if isinstance(created_at, datetime):
        date_str = created_at.strftime("%b %d, %Y • %H:%M")
    else:
        date_str = str(created_at or "Just now")

    comment_count = community_comment_collection.count_documents({"post_id": post_id})

    return {
        "id": post_id,
        "title": post.get("title", ""),
        "author": post.get("author", "explorer"),
        "author_role": post.get("author_role", "Prehistoric explorer"),
        "content": post.get("content", ""),
        "votes": post.get("votes", post.get("vote", 1)),
        "createdAt": date_str,
        "created_at": date_str,
        "comment_count": comment_count
    }

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@router.get("/posts")
def get_posts(
    search: Optional[str] = None,
    sort: Optional[str] = "popular"
):
    query = {}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]

    posts = community_post_collection.find(query)
    if sort == "popular":
        posts = posts.sort("votes", -1)
    else:
        posts = posts.sort("created_at", -1)

    post_list = [format_post_doc(post) for post in list(posts)]

    # Initial seed if DB empty
    if not post_list and not search:
        initial_seed = [
            {
                "title": "Unearthed a well-preserved Spinosaurus neural spine in Morocco!",
                "content": "Our field team just recovered a massive 1.6m dorsal spine exhibiting unique vascular grooves. What are your thoughts on sail thermoregulation vs display?",
                "author": "Dr. Alan Grant",
                "author_role": "Chief Paleontologist",
                "votes": 342,
                "created_at": datetime.now()
            },
            {
                "title": "Debate: Did Tyrannosaurus Rex hunt in packs or solitary ambush?",
                "content": "Recent multi-specimen bonebeds in South Dakota suggest co-located adult and juvenile T. rex remains.",
                "author": "Dr. Ellie Sattler",
                "author_role": "Paleobotanist & Biologist",
                "votes": 218,
                "created_at": datetime.now()
            }
        ]
        for item in initial_seed:
            community_post_collection.insert_one(item)
        posts = community_post_collection.find().sort("votes", -1)
        post_list = [format_post_doc(post) for post in list(posts)]

    return post_list

@router.get("/posts/{post_id}")
def get_post_comment(post_id: str):
    try:
        post = community_post_collection.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="invalid post id")

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post_data = format_post_doc(post)

    comments_docs = community_comment_collection.find({"post_id": post_id}).sort("created_at", 1)
    raw_comments = list(comments_docs)
    comment_docs = {}
    root_comments = []

    for c in raw_comments:
        c_created = c.get("created_at") or c.get("createdAt")
        date_str = c_created.strftime("%b %d, %Y • %H:%M") if isinstance(c_created, datetime) else "Just now"
        fc = {
            "id": str(c.get("_id")),
            "post_id": c.get("post_id"),
            "content": c.get("content", ""),
            "parent_id": c.get("parent_id"),
            "reply_to": c.get("reply_to") or c.get("reply_to_author"),
            "reply_to_author": c.get("reply_to") or c.get("reply_to_author"),
            "author": c.get("author", "explorer"),
            "createdAt": date_str,
            "created_at": date_str,
            "votes": c.get("votes", 1),
            "replies": []
        }
        comment_docs[fc["id"]] = fc

    for fc in comment_docs.values():
        parent_id = fc.get("parent_id")
        if parent_id and parent_id in comment_docs:
            comment_docs[parent_id]["replies"].append(fc)
        else:
            root_comments.append(fc)

    post_data["comments_list"] = root_comments
    post_data["comment_list"] = root_comments
    return post_data

@router.post("/posts")
async def create_post(postDetail: CreatePost):
    if not postDetail.title or not postDetail.content:
        raise HTTPException(status_code=400, detail="title and content are required")

    new_docs = {
        "title": postDetail.title.strip(),
        "content": postDetail.content.strip(),
        "author": postDetail.author or "explorer",
        "author_role": postDetail.author_role or "Prehistoric explorer",
        "votes": 1,
        "created_at": datetime.now()
    }
    result = community_post_collection.insert_one(new_docs)
    created_doc = community_post_collection.find_one({"_id": result.inserted_id})
    formatted = format_post_doc(created_doc)

    await manager.broadcast({
        "type": "NEW_POST",
        "post": formatted
    })

    return formatted

@router.post("/posts/{post_id}/vote")
async def vote_post(post_id: str, payload: VoteSchema):
    try:
        obj_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid post id")

    delta = 1 if payload.direction > 0 else -1
    community_post_collection.update_one(
        {"_id": obj_id},
        {"$inc": {"votes": delta}}
    )
    doc = community_post_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="post not found")

    new_votes = doc.get("votes", 0)

    await manager.broadcast({
        "type": "VOTE_POST",
        "post_id": post_id,
        "votes": new_votes
    })

    return {"votes": new_votes}

@router.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, commentDetail: CreateComment):
    if not commentDetail.content:
        raise HTTPException(status_code=400, detail="comment content cannot be empty")

    try:
        if not community_post_collection.find_one({"_id": ObjectId(post_id)}):
            raise HTTPException(status_code=404, detail="post not found")
    except Exception:
        raise HTTPException(status_code=400, detail="invalid post id")

    reply_target = commentDetail.reply_to or getattr(commentDetail, "reply_to_author", None)

    new_comment = {
        "post_id": post_id,
        "parent_id": commentDetail.parent_id if commentDetail.parent_id else None,
        "reply_to": reply_target,
        "reply_to_author": reply_target,
        "content": commentDetail.content.strip(),
        "author": commentDetail.author or "explorer",
        "votes": 1,
        "created_at": datetime.now()
    }

    result = community_comment_collection.insert_one(new_comment)
    created_comment = community_comment_collection.find_one({"_id": result.inserted_id})
    created_at_val = created_comment.get("created_at")
    date_str = created_at_val.strftime("%b %d, %Y • %H:%M") if isinstance(created_at_val, datetime) else "Just now"

    formatted = {
        "id": str(created_comment.get("_id")),
        "post_id": created_comment.get("post_id"),
        "parent_id": created_comment.get("parent_id"),
        "reply_to": created_comment.get("reply_to"),
        "reply_to_author": created_comment.get("reply_to"),
        "content": created_comment.get("content"),
        "author": created_comment.get("author"),
        "createdAt": date_str,
        "created_at": date_str,
        "votes": 1,
        "replies": []
    }

    comment_count = community_comment_collection.count_documents({"post_id": post_id})

    await manager.broadcast({
        "type": "NEW_COMMENT",
        "post_id": post_id,
        "comment": formatted,
        "comment_count": comment_count
    })

    return formatted
