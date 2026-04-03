import httpx
import os
from dotenv import load_dotenv

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MODEL_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"

async def analyze_sentiment(text: str) -> dict:
    """
    Analyzes sentiment of text using Hugging Face's SST2 specialized model.
    """
    if not text or len(text.strip()) == 0:
        return {"label": "NEUTRAL", "score": 0.5}

    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(MODEL_URL, headers=headers, json={"inputs": text}, timeout=10.0)
            result = response.json()
            
            # Hugging Face usually returns [[{"label": "...", "score": ...}, ...]]
            if isinstance(result, list) and len(result) > 0 and isinstance(result[0], list):
                top_result = sorted(result[0], key=lambda x: x["score"], reverse=True)[0]
                return {
                    "label": top_result["label"].upper(),
                    "score": top_result["score"]
                }
            elif "error" in result:
                print(f"HF Sentiment API Error: {result['error']}")
        except Exception as e:
            print(f"Sentiment analysis error: {e}")
            
    return {"label": "NEUTRAL", "score": 0.5}
