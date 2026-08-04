from fastapi import HTTPException, status, APIRouter
from schemas import auth
from dependencies.auth import get_current_user, admin_required
from core.security import hash_password, verify_password, create_access_token
from db.database import user_collection
import random
import resend
from core.config import RESEND_API_KEY
from db.redis_client import set_otp, get_otp, delete_otp

resend.api_key = RESEND_API_KEY
router = APIRouter()

def send_otp_email(to_email: str, otp: str):
    print(f"\n[OTP SERVICE] Generated OTP for {to_email}: {otp}\n")
    try:
        if not RESEND_API_KEY:
            print("[OTP SERVICE] RESEND_API_KEY not configured. Skipping email.")
            return False
        
        params = {
            "from": "JurassiVerse <onboarding@resend.dev>",
            "to": to_email,
            "subject": "Your JurassiVerse Verification Code",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #07100b; color: #ece4d8;">
                    <h2 style="color: #d6a14b; text-align: center; font-family: 'Cinzel', serif;">Access Verification Portal</h2>
                    <p>Hello Explorer,</p>
                    <p>To access the JurassiVerse archives, please verify your identity using the verification code below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #d6a14b; background-color: rgba(255,255,255,0.05); padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(214,161,75,0.2);">{otp}</span>
                    </div>
                    <p style="font-size: 13px; color: #bbbbbb; text-align: center;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                </div>
            """
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"[OTP SERVICE] Failed to send email: {e}")
        return False

@router.post('/signup')
def signup(user: auth.SignUp):
    existing_user = user_collection.find_one({'email': user.email})
    if existing_user: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    
    # Save signup credentials immediately to MongoDB
    data = user.model_dump()
    data['password'] = hash_password(user.password)
    data['role'] = 'user'
    user_collection.insert_one(data)
    
    # Generate and store OTP in Redis caching
    otp = f"{random.randint(100000, 999999)}"
    try:
        set_otp(user.email, otp, expire_seconds=600)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Redis connection issue: {e}"
        )
        
    send_otp_email(user.email, otp)
    
    return {
        "status": "otp_required",
        "email": user.email,
        "message": "Account created! A verification code has been sent to your email."
    }

@router.post("/login")
def login(user: auth.Login):
    existing_user = user_collection.find_one({'email': user.email})
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    
    if not verify_password(user.password, existing_user['password']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid Password')
    
    # Generate OTP and store in Redis caching
    otp = f"{random.randint(100000, 999999)}"
    try:
        set_otp(user.email, otp, expire_seconds=600)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Redis connection issue: {e}"
        )
        
    send_otp_email(user.email, otp)
    
    return {
        "status": "otp_required",
        "email": user.email,
        "message": "A verification code has been sent to your email."
    }

@router.post("/verify-otp")
def verify_otp(payload: auth.VerifyOTP):
    stored_otp = get_otp(payload.email)
    if not stored_otp or stored_otp != payload.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code."
        )
    
    # Delete verified OTP from Redis caching
    delete_otp(payload.email)
    
    # Fetch verified user from MongoDB
    existing_user = user_collection.find_one({'email': payload.email})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User record not found."
        )
        
    token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "role": existing_user.get("role", "user")
    })
    return {
        'access_token': token,
        'role': existing_user.get('role', 'user'),
        'token_type': 'bearer',
        'message': 'Verification successful'
    }
