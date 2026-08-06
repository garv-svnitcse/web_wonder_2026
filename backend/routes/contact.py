from fastapi import APIRouter
from schemas import contact
from services.email_service import send_email

router = APIRouter()

@router.post("/")
async def contactEmail(contact: contact.Contact):
    try : 
        html_content = f"""
            <h3>New Message from Portfolio Contact Form</h3>
            <p><strong>Name:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Message:</strong></p>
            <p>{contact.message}</p>
            """            
        success = send_email(subject=contact.subject, html_content=html_content)
        if success:
            return {"message" : "Email sent successfully"}
        else:
            return {"error": "Failed to send email"}
    
    except Exception as e :
        return {"error" : str(e)}