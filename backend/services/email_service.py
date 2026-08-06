import requests
import json
import resend
from core.config import BREVO_API_KEY, RESEND_API_KEY, RECEIVER_EMAIL

resend.api_key = RESEND_API_KEY

def send_email(subject: str, html_content: str, to_email: str = None):
    """
    Sends an email using Brevo (primary) or Resend (fallback).
    """
    target_email = to_email or RECEIVER_EMAIL
    if not target_email:
        print("ERROR: No recipient email specified.")
        return False

    # 1. Attempt to send via Brevo if key is configured
    if BREVO_API_KEY:
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }
        payload = {
            "sender": {
                "name": "JurassiVerse",
                "email": RECEIVER_EMAIL or "garv.agarwal2409@gmail.com"
            },
            "to": [
                {
                    "email": target_email
                }
            ],
            "subject": subject,
            "htmlContent": html_content
        }

        try:
            print(f"Attempting to send email via Brevo to {target_email}...")
            response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=10)
            if response.status_code in [200, 201, 202]:
                print(f"SUCCESS: Email sent via Brevo. Response: {response.text}")
                return True
            else:
                print(f"WARNING: Brevo failed with status code {response.status_code}: {response.text}")
                print("Falling back to Resend...")
        except Exception as e:
            print(f"WARNING: Brevo request failed: {str(e)}. Falling back to Resend...")

    # 2. Fallback to Resend
    if RESEND_API_KEY:
        try:
            print(f"Attempting to send email via Resend to {target_email}...")
            params = {
                "from": "JurassiVerse <onboarding@resend.dev>",
                "to": target_email,
                "subject": subject,
                "html": html_content
            }
            resend.Emails.send(params)
            print("SUCCESS: Email sent via Resend.")
            return True
        except Exception as e:
            print(f"ERROR: Resend email sending failed: {str(e)}")
            return False
    else:
        print("ERROR: Neither Brevo nor Resend are configured or succeeded.")
        return False
