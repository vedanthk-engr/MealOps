from fastapi import APIRouter, HTTPException, Depends, status, Request
from pydantic import BaseModel
from typing import Optional
from ..services.vtop_auth import vtop_login, VTOPAuthError, InvalidCredentialsError
from ..utils.jwt_utils import create_access_token, get_password_hash, verify_password
from ..prisma import glb_db as db
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)

class VTOPLoginRequest(BaseModel):
    regNo: str
    password: str

class AdminLoginRequest(BaseModel):
    email: str
    password: str

@router.post("/vtop-login")
@limiter.limit("5/minute")
async def login_vtop(req: VTOPLoginRequest, request: Request):
    """
    Authenticate a student using VTOP credentials and upsert their profile.
    """
    try:
        profile = await vtop_login(req.regNo, req.password)
        
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
                    'hostelBlock': profile.hostelBlock or "",
                    'roomNo': profile.roomNo or "",
                    'messType': profile.messType.value
                },
                'update': {
                    'name': profile.name,
                    'hostelBlock': profile.hostelBlock or "",
                    'roomNo': profile.roomNo or ""
                }
            }
        )
        
        # Generate token
        token = create_access_token({"sub": student.regNo, "role": "STUDENT"})
        return {"token": token, "student": student}
        
    except InvalidCredentialsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid VTOP credentials")
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
