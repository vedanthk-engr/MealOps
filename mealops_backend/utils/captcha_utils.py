import base64
import io
from PIL import Image, ImageOps
import pytesseract

def solve_captcha(captcha_b64: str) -> str:
    """
    Decodes a base64 captcha image, processes it and extracts the text using Tesseract.
    """
    try:
        # Decode and open image
        image_data = base64.b64decode(captcha_b64.split(',')[-1])
        img = Image.open(io.BytesIO(image_data))
        
        # Preprocessing: convert to grayscale and invert if necessary
        img = ImageOps.grayscale(img)
        
        # Apply binary threshold at 128
        fn = lambda x : 255 if x > 128 else 0
        img = img.point(fn, mode='1')
        
        # Tesseract config for 6-char uppercase/digits
        config = '--psm 8 --oem 3 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        
        text = pytesseract.image_to_string(img, config=config)
        return text.strip().upper()
    except Exception as e:
        print(f"Captcha recognition error: {e}")
        # In actual VIT students' experience, we often have to retry anyway
        return ""
