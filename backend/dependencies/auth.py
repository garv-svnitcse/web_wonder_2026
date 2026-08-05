from fastapi import HTTPException, Depends, status, Request
from db.database import user_collection
# pyrefly: ignore [missing-import]
from clerk_backend_api import Clerk, AuthenticateRequestOptions
from core.config import CLERK_SECRET_KEY, CLERK_JWT_KEY

clerk_client = Clerk(bearer_auth=CLERK_SECRET_KEY)

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )
    
    token = auth_header.split(" ")[1]
    
    # Fallback to a mock state if credentials are not filled yet
    if CLERK_SECRET_KEY in ("mock_secret_key", "", None) and token.startswith("mock_"):
        clerk_id = f"user_{token}"
        email = f"{token}@example.com"
        name = token.replace("mock_", "").capitalize()
    else:
        try:
            options = AuthenticateRequestOptions(
                secret_key=CLERK_SECRET_KEY,
                jwt_key=CLERK_JWT_KEY
            )
            request_state = clerk_client.authenticate_request(request, options)
            if not request_state.is_signed_in:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Unauthorized: {request_state.reason or 'Invalid session token'}"
                )
            clerk_id = request_state.payload.get("sub")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication failed: {e}"
            )
            
    # Lookup or create user in MongoDB
    user = user_collection.find_one({"clerk_id": clerk_id})
    if not user:
        if CLERK_SECRET_KEY in ("mock_secret_key", "", None) and token.startswith("mock_"):
            pass
        else:
            try:
                clerk_user = clerk_client.users.get(user_id=clerk_id)
                email = None
                if clerk_user.email_addresses:
                    for email_obj in clerk_user.email_addresses:
                        if email_obj.id == clerk_user.primary_email_address_id:
                            email = email_obj.email_address
                            break
                    if not email:
                        email = clerk_user.email_addresses[0].email_address
                
                name = (
                    f"{clerk_user.first_name or ''} {clerk_user.last_name or ''}".strip()
                    or clerk_user.username
                    or (email.split("@")[0] if email else "Explorer")
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to retrieve user profile from Clerk: {e}"
                )
                
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Clerk user profile must have a valid email address."
            )
            
        user = user_collection.find_one({"email": email})
        if user:
            user_collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"clerk_id": clerk_id}}
            )
            user["clerk_id"] = clerk_id
        else:
            user_doc = {
                "clerk_id": clerk_id,
                "email": email,
                "name": name,
                "role": "user",
                "highest_score": 0,
                "average_score": 0,
                "average_accuracy": 0,
                "total_attempts": 0,
                "level": "easy"
            }
            result = user_collection.insert_one(user_doc)
            user_doc["_id"] = result.inserted_id
            user = user_doc
            
    return user

async def admin_required(current_user=Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access Denied'
        )
    return current_user
