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

print("MongoDB connected successfully")