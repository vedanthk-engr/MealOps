from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from datetime import datetime, date
from db_service import glb_db as db

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])

@router.get("/summary")
async def get_nutrition_summary(userId: str):
    """
    Get the nutritional summary for a specific user for today.
    If no entry exists, it returns zeros.
    """
    today = date.today()
    dt_today = datetime(today.year, today.month, today.day)
    
    summary = await db.dailynutrition.find_unique(
        where={
            'studentRegNo_date': {
                'studentRegNo': userId,
                'date': dt_today
            }
        }
    )
    
    if not summary:
        return {
            "totalCalories": 0,
            "totalProtein": 0,
            "totalCarbs": 0,
            "totalFat": 0,
            "targets": {
                "calories": 2500,
                "protein": 60,
                "carbs": 300,
                "fat": 70
            }
        }
    
    return {
        "totalCalories": summary.totalCalories,
        "totalProtein": summary.totalProtein,
        "totalCarbs": summary.totalCarbs,
        "totalFat": summary.totalFat,
        "targets": {
            "calories": 2500,
            "protein": 60,
            "carbs": 300,
            "fat": 70
        }
    }

@router.get("/history")
async def get_nutrition_history(userId: str, days: int = 7):
    """
    Get the nutritional history for the last N days.
    """
    history = await db.dailynutrition.find_many(
        where={'studentRegNo': userId},
        order={'date': 'desc'},
        take=days
    )
    return history
