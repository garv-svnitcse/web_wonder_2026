import os
import time
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from core.config import CLOUD_NAME, API_KEY, API_SECRET



CLOUDINARY_CONFIGURED = bool(CLOUD_NAME and API_KEY and API_SECRET)

if CLOUDINARY_CONFIGURED:
    cloudinary.config(
        cloud_name=CLOUD_NAME,
        api_key=API_KEY,
        api_secret=API_SECRET,
        secure=True
    )
else:
    print("WARNING: Cloudinary is not configured in .env. Uploading files will fail at runtime.")

def upload_file_to_cloudinary(file_obj, filename: str) -> str:
    if not CLOUDINARY_CONFIGURED:
        raise RuntimeError("Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your backend/.env file.")

    response = cloudinary.uploader.upload(
        file_obj.file,
        public_id=f"{int(time.time())}_{os.path.splitext(filename)[0]}",
        resource_type="auto"
    )
    # Seek back to start for safety in case of future reads
    file_obj.file.seek(0)
    
    secure_url = response.get("secure_url")
    if not secure_url:
        raise Exception("Failed to retrieve secure URL from Cloudinary response.")
    return secure_url
