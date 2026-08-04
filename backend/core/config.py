from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRY_TIME = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
raw_redis_uri = (os.getenv("REDIS_URI") or os.getenv("REDIS_URL") or "redis://localhost:6379").strip()
if "redis-cli -u " in raw_redis_uri:
    raw_redis_uri = raw_redis_uri.split("redis-cli -u ")[1].strip()
REDIS_URL = raw_redis_uri

