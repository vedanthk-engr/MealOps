from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel
from typing import Optional, Dict
from services.vtop_auth import vtop_login, get_vtop_captcha_setup, VTOPAuthError, InvalidCredentialsError, CaptchaFailureError
from utils.jwt_utils import create_access_token, get_password_hash, verify_password
from db_service import glb_db as db
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)

class VTOPLoginRequest(BaseModel):
    regNo: str
    password: str
    captchaSolution: Optional[str] = None
    jsessionid: Optional[str] = None
    csrfToken: Optional[str] = None
    cookies: Optional[Dict[str, str]] = None

class AdminLoginRequest(BaseModel):
    email: str
    password: str

@router.get("/vtop-captcha")
async def get_captcha():
    """
    Get a fresh VTOP captcha and session tokens for manual solving.
    """
    try:
        data = await get_vtop_captcha_setup()
        return data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Failed to fetch captcha: {e}")

@router.post("/vtop-login")
@limiter.limit("5/minute")
async def login_vtop(req: VTOPLoginRequest, request: Request):
    """
    Authenticate a student using VTOP credentials and upsert their profile.
    """
    print(f"Received login request: {req.model_dump()}")
    try:
        profile = await vtop_login(
            req.regNo, 
            req.password, 
            captcha_solution=req.captchaSolution,
            jsessionid=req.jsessionid,
            csrf_token=req.csrfToken,
            cookies=req.cookies
        )
        
        # Upsert Student in DB
        student = await db.student.upsert(
            where={'regNo': profile.regNo},
            data={
                'create': {
                    'regNo': profile.regNo,
                    'name': profile.name,
                    'email': profile.email,
                    'gender': profile.gender or "",
                    'branch': profile.branch or "",
                    'programme': profile.programme or "",
                    'school': profile.school or "",
                    'proctorEmail': profile.proctorEmail or "",
                    'hostelBlock': profile.hostelBlock or "",
                    'roomNo': profile.roomNo or "",
                    'messCaterer': profile.messCaterer or "",
                    'messType': profile.messType.value
                },
                'update': {
                    'name': profile.name,
                    'programme': profile.programme or "",
                    'branch': profile.branch or "",
                    'proctorEmail': profile.proctorEmail or "",
                    'hostelBlock': profile.hostelBlock or "",
                    'roomNo': profile.roomNo or "",
                    'messCaterer': profile.messCaterer or "",
                }
            }
        )
        
        # Generate token
        token = create_access_token({"sub": student.regNo, "role": "STUDENT"})
        return {"token": token, "student": student}
        
    except InvalidCredentialsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid VTOP credentials")
    except CaptchaFailureError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except VTOPAuthError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An internal error occurred during login")

@router.post("/admin-login")
async def login_admin(req: AdminLoginRequest):
    """
    Authenticate an admin.
    """
    admin = await db.admin.find_unique(where={'email': req.email})
    if not admin or not verify_password(req.password, admin.passwordHash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")
        
    token = create_access_token({"sub": admin.email, "role": admin.role})
    return {"token": token, "admin": admin}

@router.post("/refresh")
async def refresh_token(request: Request):
    # Validated by middleware usually, or here
    # Placeholder
    return {"token": "NEW_TOKEN"}
