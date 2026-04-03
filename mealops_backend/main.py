import uvicorn
import os
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from .prisma import glb_db as db
from .routers import auth, menu, scan, meals

load_dotenv()

app = FastAPI(
    title="MealOps Backend API",
    description="Intelligent Smart Mess Nutrition and Meal Tracking Backend for VIT Chennai.",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your mobile/web origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Rate Limiting initialization
# (Handled in routers/auth.py for login specifically)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Database lifecycle management
@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

# Include Routers
app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(scan.router)
app.include_router(meals.router)

@app.get("/")
async def root():
    return {"status": "online", "message": "MealOps API is functional."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
