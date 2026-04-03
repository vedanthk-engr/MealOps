from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from db_service import glb_db as db
from middleware.auth import auth_guard
from services.sentiment import analyze_sentiment

router = APIRouter(prefix="/api/meals", tags=["Meal Logging"])

class MealLogEntry(BaseModel):
    dishId: str
    status: str # ATE, SKIPPED, HALF
    emoji: Optional[str] = None
    comment: Optional[str] = None

class MealSubmission(BaseModel):
    date: datetime
    mealType: str # BREAKFAST, LUNCH, DINNER
    logs: List[MealLogEntry]

async def process_feedback_sentiment(feedback_id: str, comment: str):
    """
    Background task to process sentiment for comments.
    """
    if not comment: return
    
    analysis = await analyze_sentiment(comment)
    await db.feedback.update(
        where={'id': feedback_id},
        data={
            'sentiment': analysis["label"],
            'sentimentScore': analysis["score"]
        }
    )

@router.post("/log")
async def log_meal(req: MealSubmission, bg: BackgroundTasks, user=Depends(auth_guard)):
    """
    Saves meal consumption log and triggers async sentiment for comments.
    """
    student_id = user["sub"]
    
    # 1. Save logs and update nutrition stats aggregate
    total_kcal = 0
    total_prot = 0
    total_carb = 0
    total_fat = 0
    
    for entry in req.logs:
        # Get dish nutrition for stats
        dish = await db.dish.find_unique(where={'id': entry.dishId})
        if not dish: continue
        
        # Log entry
        await db.meallog.create(data={
            'studentRegNo': student_id,
            'date': req.date,
            'mealType': req.mealType,
            'dishId': entry.dishId,
            'status': entry.status
        })
        
        # Feedback entry
        if entry.emoji:
            fb = await db.feedback.create(data={
                'studentRegNo': student_id,
                'dishId': entry.dishId,
                'date': req.date,
                'emoji': entry.emoji,
                'comment': entry.comment
            })
            
            if entry.comment:
                bg.add_task(process_feedback_sentiment, fb.id, entry.comment)
        
        # Aggregate stats
        mult = 1.0 if entry.status == 'ATE' else (0.5 if entry.status == 'HALF' else 0.0)
        total_kcal += dish.calories * mult
        total_prot += dish.protein * mult
        total_carb += dish.carbs * mult
        total_fat += dish.fat * mult
        
    # 2. Update DailyNutrition summary (simplified version)
    existing_dn = await db.dailynutrition.find_unique(
        where={'studentRegNo_date': {'studentRegNo': student_id, 'date': req.date}}
    )
    
    if existing_dn:
        await db.dailynutrition.update(
            where={'id': existing_dn.id},
            data={
                'totalCalories': existing_dn.totalCalories + total_kcal,
                'totalProtein': existing_dn.totalProtein + total_prot,
                'totalCarbs': existing_dn.totalCarbs + total_carb,
                'totalFat': existing_dn.totalFat + total_fat
            }
        )
    else:
        await db.dailynutrition.create(data={
            'studentRegNo': student_id,
            'date': req.date,
            'totalCalories': total_kcal,
            'totalProtein': total_prot,
            'totalCarbs': total_carb,
            'totalFat': total_fat
        })
        
    return {"message": "Logs saved successfully"}

@router.get("/history")
async def get_history(limit: int = 20, offset: int = 0, user=Depends(auth_guard)):
    """
    Returns paginated meal log history for current student.
    """
    student_id = user["sub"]
    logs = await db.meallog.find_many(
        where={'studentRegNo': student_id},
        include={'dish': True},
        skip=offset,
        take=limit,
        order={'date': 'desc'}
    )
    return logs

@router.get("/today")
async def get_today_logs(user=Depends(auth_guard)):
    """
    Returns today's logs for current student.
    """
    student_id = user["sub"]
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    logs = await db.meallog.find_many(
        where={'studentRegNo': student_id, 'date': today},
        include={'dish': True}
    )
    return logs
