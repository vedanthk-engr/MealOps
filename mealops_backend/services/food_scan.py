import httpx
import os
from dotenv import load_dotenv
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
from typing import Dict, Any, List, Optional

load_dotenv()

CLARIFAI_PAT = os.getenv("CLARIFAI_PAT")
USDA_API_KEY = os.getenv("USDA_API_KEY")

CLARIFAI_USER_ID = "clarifai"
CLARIFAI_APP_ID = "main"
CLARIFAI_MODEL_ID = "bd367be194cf45149e75f01d59f77ba7"

async def enrich_nutrition(food_name: str) -> Dict[str, float]:
    """
    Fetch nutritional data from USDA FoodData Central API.
    """
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={food_name}&api_key={USDA_API_KEY}&pageSize=1"
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            data = resp.json()
            
            if "foods" in data and len(data["foods"]) > 0:
                food = data["foods"][0]
                nutrients = food.get("foodNutrients", [])
                
                # FDC IDs: 1008 (Calories), 1003 (Protein), 1005 (Carbs), 1004 (Fat)
                def get_nutrient(nm):
                    for n in nutrients:
                        if nm.lower() in n.get("nutrientName", "").lower():
                            return n.get("value", 0.0)
                    return 0.0

                return {
                    "calories": get_nutrient("Energy"),
                    "protein": get_nutrient("Protein"),
                    "carbs": get_nutrient("Carbohydrate, by difference"),
                    "fat": get_nutrient("Total lipid (fat)")
                }
        except Exception as e:
            print(f"USDA API error: {e}")
            
    # Default nutritional values if API fails
    return {"calories": 150, "protein": 5, "carbs": 20, "fat": 5}

async def identify_food(image_bytes: bytes) -> Dict[str, Any]:
    """
    Uses Clarifai to identify food name and then enriches it with USDA data.
    """
    channel = ClarifaiChannel.get_grpc_channel()
    stub = service_pb2_grpc.V2Stub(channel)
    metadata = (('authorization', 'Key ' + CLARIFAI_PAT),)

    userDataObject = resources_pb2.UserAppIDSet(user_id=CLARIFAI_USER_ID, app_id=CLARIFAI_APP_ID)

    post_model_outputs_response = stub.PostModelOutputs(
        service_pb2.PostModelOutputsRequest(
            user_app_id=userDataObject,
            model_id=CLARIFAI_MODEL_ID,
            inputs=[resources_pb2.Input(data=resources_pb2.Data(image=resources_pb2.Image(base64=image_bytes)))]
        ),
        metadata=metadata
    )

    if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
        raise Exception(f"Clarifai API failed: {post_model_outputs_response.status.description}")

    output = post_model_outputs_response.outputs[0]
    top_concept = sorted(output.data.concepts, key=lambda x: x.value, reverse=True)[0]
    
    food_name = top_concept.name
    confidence = top_concept.value

    # Enrichment
    nutrition = await enrich_nutrition(food_name)

    return {
        "foodName": food_name.capitalize(),
        "confidence": confidence,
        "weight_estimate_g": 250,
        "nutrition": nutrition,
        "ingredients": [
            {"name": food_name.capitalize(), "percentage": 100.0, "imageUrl": None}
        ]
    }
