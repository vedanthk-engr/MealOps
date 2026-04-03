import httpx
import re
from typing import Dict, Any, Optional, Tuple
from schemas.student import StudentProfile, MessType

VTOP_AUTH_SERVER = "http://localhost:4000"

class VTOPAuthError(Exception):
    pass

class InvalidCredentialsError(VTOPAuthError):
    pass

class CaptchaFailureError(VTOPAuthError):
    pass

class VTOPDownError(VTOPAuthError):
    pass

def _derive_mess_details(data: Dict[str, str]) -> Tuple[MessType, str]:
    # Look for mess related keys in the normalized data
    mess_info = data.get("mess_information", data.get("mess_details", data.get("mess_selection", "")))
    mess_type_text = data.get("mess", data.get("mess_type", data.get("mess_opted", "")))
    mess_caterer_text = data.get("mess_caterer", data.get("caterer", data.get("contractor", "")))
    hostel_block = data.get("hostel_block", data.get("block_name", ""))

    merged = " | ".join([mess_info, mess_type_text, mess_caterer_text])
    merged_l = merged.lower()

    if re.search(r"\bnon\s*[- ]?veg\b|\bnv\b", merged_l):
        mess_type = MessType.NONVEG
    elif re.search(r"\bveg\b", merged_l):
        mess_type = MessType.VEG
    else:
        block_l = hostel_block.lower()
        if re.search(r"\bnon\s*[- ]?veg\b|\bnv\b", block_l):
            mess_type = MessType.NONVEG
        else:
            mess_type = MessType.VEG

    caterer = mess_caterer_text.strip()
    if not caterer:
        caterer = mess_info.strip()

    return mess_type, caterer

async def vtop_login(
    reg_no: str, password: str, captcha_solution: Optional[str] = None,
    jsessionid: Optional[str] = None, csrf_token: Optional[str] = None,
    cookies: Optional[Dict[str, str]] = None
) -> StudentProfile:
    """
    Calls the external VTOP auth server to perform login and fetch profile.
    """
    print(f"[VTOP-PROXY] Forwarding login request for {reg_no} to port 4000")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(
                f"{VTOP_AUTH_SERVER}/fetch",
                json={"username": reg_no, "password": password}
            )
            
            if resp.status_code != 200:
                raise VTOPDownError(f"VTOP Auth server returned status {resp.status_code}")
            
            result = resp.json()
            if not result.get("success"):
                error_msg = result.get("error", "Unknown error")
                if "invalid captcha" in error_msg.lower():
                    raise CaptchaFailureError(error_msg)
                if "invalid" in error_msg.lower() or "credential" in error_msg.lower():
                    raise InvalidCredentialsError(error_msg)
                raise VTOPAuthError(error_msg)
            
            data = result.get("data", {})
            
            # Map normalized keys back to StudentProfile
            # The JS server uses: key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
            
            # Helper to pick from multiple potential keys
            def pick(*keys: str) -> str:
                for k in keys:
                    if k in data: return data[k]
                return ""

            mess_type, mess_caterer = _derive_mess_details(data)
            
            profile = StudentProfile(
                regNo=reg_no,
                name=pick("student_name", "name"),
                email=pick("email", "alternate_email", "student_email"),
                gender=pick("gender", "sex"),
                hostelBlock=pick("hostel_block", "block_name", "hostel_name"),
                roomNo=pick("room_no", "room_number"),
                programme=pick("programme", "degree"),
                branch=pick("branch", "subject_area"),
                school=pick("school", "department"),
                proctorEmail=pick("proctor_email", "adviser_email"),
                messType=mess_type,
                messCaterer=mess_caterer,
                dob=pick("date_of_birth", "dob", "birth_date")
            )
            
            print(f"[VTOP-PROXY] Successfully fetched profile for {reg_no}")
            return profile
            
        except httpx.ConnectError:
            raise VTOPDownError("VTOP Auth server is not running on port 4000.")
        except Exception as e:
            if isinstance(e, VTOPAuthError): raise
            raise VTOPAuthError(f"Failed to communicate with VTOP Auth server: {e}")

async def get_vtop_captcha_setup() -> Dict[str, Any]:
    """
    Since the JS server handles the entire flow in one go, 
    this might be redundant or could be simplified if needed.
    However, if other parts of the app still need it, we might need an endpoint for it.
    For now, we'll keep it as a placeholder or implement it if the JS server provides it.
    """
    # The current index.js doesn't seem to have a separate captcha setup endpoint.
    # If the UI needs to show a captcha, we might need to add an endpoint to index.js.
    # Given the user's request "now make the backend server call this for vtop data",
    # the main flow is likely the full login/fetch.
    return {
        "captcha_b64": "",
        "captcha_solved": "",
        "jsessionid": "",
        "csrf_token": "",
        "cookies": {}
    }
