import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

def upload_image(file_path: str, folder: str = "mealops"):
    """
    Uploads an image to Cloudinary and returns the URL.
    """
    try:
        result = cloudinary.uploader.upload(file_path, folder=folder)
        return result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

def upload_image_bytes(file_bytes: bytes, folder: str = "mealops"):
    """
    Uploads image bytes to Cloudinary.
    """
    try:
        result = cloudinary.uploader.upload(file_bytes, folder=folder)
        return result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary bytes upload error: {e}")
        return None
