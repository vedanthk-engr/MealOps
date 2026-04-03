import uvicorn
import os
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from db_service import glb_db as db
from routers import auth, menu, scan, meals, nutrition, preorders

load_dotenv()

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Database lifecycle management
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(
    title="MealOps Backend API",
    description="Intelligent Smart Mess Nutrition and Meal Tracking Backend for VIT Chennai.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Include Routers
app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(scan.router)
app.include_router(meals.router)
app.include_router(nutrition.router)
app.include_router(preorders.router)

@app.get("/")
async def root():
    return {"status": "online", "message": "MealOps API is functional."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
