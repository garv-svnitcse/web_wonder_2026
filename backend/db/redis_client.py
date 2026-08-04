import redis
import json
from core.config import REDIS_URL

try:
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    print("Redis connected successfully")
except Exception as e:
    print(f"WARNING: Could not connect to Redis at {REDIS_URL}: {e}")
    redis_client = None

def set_otp(email: str, otp: str, expire_seconds: int = 600):
    if not redis_client:
        raise RuntimeError("Redis client is not connected. OTP cannot be stored.")
    redis_client.set(f"otp:{email}", otp, ex=expire_seconds)

def get_otp(email: str) -> str:
    if not redis_client:
        raise RuntimeError("Redis client is not connected.")
    return redis_client.get(f"otp:{email}")

def delete_otp(email: str):
    if not redis_client:
        return
    redis_client.delete(f"otp:{email}")

def set_temp_signup(email: str, data: dict, expire_seconds: int = 600):
    if not redis_client:
        raise RuntimeError("Redis client is not connected. Temporary registration cannot be stored.")
    redis_client.set(f"temp_signup:{email}", json.dumps(data), ex=expire_seconds)

def get_temp_signup(email: str) -> dict:
    if not redis_client:
        raise RuntimeError("Redis client is not connected.")
    val = redis_client.get(f"temp_signup:{email}")
    if val:
        return json.loads(val)
    return None

def delete_temp_signup(email: str):
    if not redis_client:
        return
    redis_client.delete(f"temp_signup:{email}")
