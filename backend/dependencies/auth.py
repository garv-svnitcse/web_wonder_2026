from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends, status
from db.database import user_collection
from core.security import decode_access_token
# pyrefly: ignore [missing-import]
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid token"
        )
    user = user_collection.find_one({
        "_id": ObjectId(payload["user_id"])
    })
    if not user: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found"
        )
    return user

async def admin_required(current_user=Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access Denied'
        )
    return current_user
