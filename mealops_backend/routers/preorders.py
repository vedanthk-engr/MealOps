from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, date
from db_service import glb_db as db

router = APIRouter(prefix="/api/preorders", tags=["Pre-orders"])

@router.get("/tomorrow")
async def get_tomorrow_preorders():
    """
    Check if the student has a pre-order for tomorrow's meal.
    """
    tomorrow = date.today() + timedelta(days=1)
    dt_tomorrow_start = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 0, 0, 0)
    dt_tomorrow_end = datetime(tomorrow.year, tomorrow.month, tomorrow.day, 23, 59, 59)
    
    preorders = await db.preorder.find_many(
        where={
            'date': {
                'gte': dt_tomorrow_start,
                'lte': dt_tomorrow_end
            }
        },
        include={'dish': True}
    )
    
    return preorders

@router.post("/")
async def create_preorder(studentRegNo: str, dishId: str, mealType: str):
    """
    Create a pre-order for tomorrow.
    """
    tomorrow = date.today() + timedelta(days=1)
    dt_tomorrow = datetime(tomorrow.year, tomorrow.month, tomorrow.day)
    
    preorder = await db.preorder.create(
        data={
            'studentRegNo': studentRegNo,
            'dishId': dishId,
            'date': dt_tomorrow,
            'mealType': mealType,
            'menuType': 'REGULAR'
        }
    )
    return preorder
