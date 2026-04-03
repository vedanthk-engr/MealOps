from datetime import datetime, timedelta
from prisma import glb_db as db

async def predict_wastage(dish_id: str, date: datetime, meal_type: str) -> dict:
    """
    Predict portion size and estimated wastage based on pre-order data 
    and historical attendance rates for the specific dish.
    """
    # 1. Count actual pre-orders for this dish+date+meal
    pre_order_count = await db.preorder.count(
        where={
            "dishId": dish_id,
            "date": date,
            "mealType": meal_type
        }
    )
    
    # 2. Query historical logs for SAME dish (last 30 days) to find pattern
    start_date = datetime.now() - timedelta(days=30)
    history = await db.meallog.find_many(
        where={
            "dishId": dish_id,
            "date": {"gte": start_date}
        }
    )
    
    total_logs = len(history)
    if total_logs == 0:
        eat_rate = 0.85 # Default fallback
    else:
        ate_count = len([l for l in history if l.status == "ATE"])
        skipped_count = len([l for l in history if l.status == "SKIPPED"])
        half_count = len([l for l in history if l.status == "HALF"])
        
        # eat_rate = (portions_actually_consumed_estimate) / (total_logged)
        # We value ATE as 1.0, HALF as 0.5, SKIPPED as 0.0
        eat_rate = (ate_count * 1.0 + half_count * 0.5) / total_logs

    # 3. Predict Portions to Prepare
    # preparation = PreOrders / EatRate
    predicted_portions = int(pre_order_count / max(eat_rate, 0.1))
    
    # 4. Predict Wastage in KG (assuming avg 350g per dish)
    # Wastage = PreOrders - PortionsConsumed
    portions_consumed = pre_order_count * eat_rate
    predicted_wastage_kg = max(0.0, (pre_order_count - portions_consumed) * 0.35)
    
    risk_level = "LOW"
    if eat_rate < 0.6: risk_level = "HIGH"
    elif eat_rate < 0.8: risk_level = "MEDIUM"

    return {
        "pre_order_count": pre_order_count,
        "predicted_portions": predicted_portions,
        "predicted_wastage_kg": round(predicted_wastage_kg, 2),
        "eat_rate": round(eat_rate, 2),
        "risk_level": risk_level
    }
