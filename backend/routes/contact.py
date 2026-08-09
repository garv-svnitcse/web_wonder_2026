from fastapi import APIRouter
from schemas import contact
from services.email_service import send_email

router = APIRouter()

@router.post("/")
def contactEmail(contact_data: contact.Contact):
    try: 
        subject_title = contact_data.subject or "Jurassic Journey Explorer Feedback"
        html_content = f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid rgba(214,161,75,0.3); border-radius: 12px; background: #08110B; color: #ECE4D8;">
                <h2 style="color: #D6A14B; border-bottom: 2px solid #D6A14B; padding-bottom: 12px; font-family: serif;">New Expedition Feedback Received</h2>
                <p style="font-size: 15px;"><strong>Name:</strong> {contact_data.name}</p>
                <p style="font-size: 15px;"><strong>Email:</strong> {contact_data.email}</p>
                <p style="font-size: 15px;"><strong>Subject:</strong> {subject_title}</p>
                <p style="font-size: 15px; margin-top: 20px;"><strong>Feedback / Message:</strong></p>
                <div style="background: rgba(214,161,75,0.12); padding: 18px; border-left: 4px solid #D6A14B; border-radius: 6px; color: #ECE4D8; line-height: 1.6; font-size: 15px;">
                    {contact_data.message}
                </div>
            </div>
            """            
        success = send_email(subject=f"Contact: {subject_title}", html_content=html_content)
        if success:
            return {"message": "Email sent successfully"}
        else:
            return {"error": "Failed to send email"}
    
    except Exception as e:
        print(f"Error processing contact email: {e}")
        return {"error": str(e)}