from fastapi import HTTPException, status
from fastapi import APIRouter
from schemas import auth
from dependencies.auth import get_current_user, admin_required
from core.security import hash_password, verify_password, create_access_token
from db.database import user_collection

router = APIRouter()

@router.post('/signup')
def signup(user: auth.SignUp):
    existing_user = user_collection.find_one({'email': user.email})
    if existing_user: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    data = user.model_dump()
    data['password'] = hash_password(user.password)
    data['role'] = 'user'
    result = user_collection.insert_one(data)
    return {
        'id': str(result.inserted_id),
        "message": "Account Created Successfully"
    }

@router.post("/login")
def login(user: auth.Login):
    existing_user = user_collection.find_one({'email': user.email})
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    
    if not verify_password(user.password, existing_user['password']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid Password')
    
    token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "role": existing_user.get("role", "user")
    })
    return {
        'access_token': token,
        'role': existing_user.get('role', 'user'),
        'token_type': 'bearer'
    }
