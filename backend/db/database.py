# pyrefly: ignore [missing-import]
from pymongo import MongoClient
# pyrefly: ignore [missing-import]
from core.config import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

user_collection = db['user']

print("MongoDB connected successfully")
dinosaur_collection = db['dinosaur']