# pyrefly: ignore [missing-import]
from pymongo import MongoClient
# pyrefly: ignore [missing-import]
from core.config import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

user_collection = db['user']
dinosaur_collection = db['dinosaur']
research_collection = db['research']
quiz_collection = db['quiz']
quiz_attempt_collection = db['quiz_attempt']
researcher_detail = db['researcher_detail']
comment_collection = db['comment']
community_post_collection = db['community_posts']
community_comment_collection = db['community_comments']

print("MongoDB connected successfully")