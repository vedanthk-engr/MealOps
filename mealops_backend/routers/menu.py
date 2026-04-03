from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict
from datetime import datetime
from db_service import glb_db as db
from middleware.auth import auth_guard

router = APIRouter(prefix="/api/menu", tags=["Menu"])

@router.get("/today")
async def get_today_menu():
    """
    Returns the meal menu for today, grouped by slot.
    """
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    items = await db.menuitem.find_many(
        where={'date': today},
        include={'dish': {'include': {'ingredients': True}}}
    )
    
    grouped = {"BREAKFAST": [], "LUNCH": [], "DINNER": []}
    for item in items:
        grouped[item.mealSlot].append(item.dish)
        
    return grouped

@router.get("/week")
async def get_week_menu():
    """
    Returns 7 days of menu starting from today.
    """
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    items = await db.menuitem.find_many(
        where={'date': {'gte': today}},
        include={'dish': True},
        order={'date': 'asc'}
    )
    
    # Organize by date then slot
    res = {}
    for item in items:
        date_str = item.date.strftime("%Y-%m-%d")
        if date_str not in res:
            res[date_str] = {"BREAKFAST": [], "LUNCH": [], "DINNER": []}
        res[date_str][item.mealSlot].append(item.dish)
        
    return res

@router.get("/{date}")
async def get_menu_by_date(date: str):
    """
    Returns menu for a specific date (YYYY-MM-DD).
    """
    try:
        dt = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
    items = await db.menuitem.find_many(
        where={'date': dt},
        include={'dish': True}
    )
    
    grouped = {"BREAKFAST": [], "LUNCH": [], "DINNER": []}
    for item in items:
        grouped[item.mealSlot].append(item.dish)
        
    return grouped
