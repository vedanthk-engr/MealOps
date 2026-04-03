from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from services.food_scan import identify_food
from middleware.auth import auth_guard

router = APIRouter(prefix="/api/scan", tags=["Food Recognition"])

@router.post("/identify")
async def scan_and_identify(file: UploadFile = File(...), user=Depends(auth_guard)):
    """
    Identifies food from an image upload using Clarifai and FDC.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        
    try:
        contents = await file.read()
        
        # Identify food
        result = await identify_food(contents)
        
        # TODO: Compare with today's menu from DB for better accuracy if needed
        return result
        
    except Exception as e:
        print(f"Identification error: {e}")
        raise HTTPException(status_code=500, detail="Could not identify food")
