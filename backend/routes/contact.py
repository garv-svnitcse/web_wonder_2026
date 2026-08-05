from fastapi import APIRouter
from schemas import contact
# pyrefly: ignore [missing-import]
import resend
from core.config import RESEND_API_KEY, RECEIVER_EMAIL

resend.api_key = RESEND_API_KEY

router = APIRouter()

@router.post("/")
async def contactEmail(contact: contact.Contact):
    try : 
        if not resend.api_key or not RECEIVER_EMAIL :
            raise ValueError("Resend Api key or Receiver Email Not found")
        
        params = {
            "from" : "JurassiVerse <onboarding@resend.dev>",
            "to" : RECEIVER_EMAIL,
            "subject" : contact.subject,
            "html" : f"""
                <h3>New Message from Portfolio Contact Form</h3>
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Message:</strong></p>
                <p>{contact.message}</p>
                """            
        }
        response = resend.Emails.send(params)
        return {"message" : "Email sent successfully"}
    
    except Exception as e :
        return {"error" : str(e)}