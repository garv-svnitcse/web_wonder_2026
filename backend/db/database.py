import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# pyrefly: ignore [missing-import]
from pymongo import MongoClient
# pyrefly: ignore [missing-import]
from core.config import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

user_collection = db['user']

print("MongoDB connected successfully", flush=True)