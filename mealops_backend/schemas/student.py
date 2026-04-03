from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class MessType(str, Enum):
    VEG = "VEG"
    NONVEG = "NONVEG"

class StudentProfile(BaseModel):
    regNo: str
    name: str
    programme: Optional[str] = None
    branch: Optional[str] = None
    school: Optional[str] = None
    gender: Optional[str] = None
    hostelBlock: Optional[str] = None
    roomNo: Optional[str] = None
    email: Optional[str] = None
    messType: MessType = MessType.VEG
    proctorEmail: Optional[str] = None
    messCaterer: Optional[str] = None
    
    class Config:
        from_attributes = True
