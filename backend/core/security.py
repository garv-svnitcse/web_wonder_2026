from typing_extensions import deprecated
from datetime import datetime, timedelta
from jose import JWTError, jwt
# pyrefly: ignore [missing-import]
from passlib.context import CryptContext
from core.config import SECRET_KEY, ALGORITHM, EXPIRY_TIME

pwd_context = CryptContext(schemes=['argon2'], deprecated='auto')

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool: 
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPIRY_TIME)
    payload['exp'] = expire
    encoded_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_token

def decode_access_token(token: str):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
