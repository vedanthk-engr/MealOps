import asyncio
import httpx
import base64
from bs4 import BeautifulSoup
from typing import Tuple, Dict, Any, Optional
from ..utils.captcha_utils import solve_captcha
from ..schemas.student import StudentProfile, MessType

PRIMARY_URL = 'https://vtopcc.vit.ac.in/vtop'
FALLBACK_URL = 'https://vtop.vit.ac.in/vtop'

MAX_RETRIES = 5

class VTOPAuthError(Exception):
    pass

class InvalidCredentialsError(VTOPAuthError):
    pass

class CaptchaFailureError(VTOPAuthError):
    pass

class VTOPDownError(VTOPAuthError):
    pass

async def get_session_and_captcha(client: httpx.AsyncClient, base_url: str) -> Tuple[str, str]:
    """
    Extracts JSESSIONID and captcha from VTOP initial process.
    """
    try:
        resp = await client.get(f"{base_url}/initialProcess", timeout=10.0)
        jsessionid = resp.cookies.get("JSESSIONID") or ""
        
        soup = BeautifulSoup(resp.text, 'lxml')
        captcha_img = soup.find('img', alt='vtopCaptcha')
        
        if not captcha_img:
            raise CaptchaFailureError("Captcha image not found")
            
        captcha_b64 = captcha_img.get('src', '').split(',')[-1]
        return jsessionid, captcha_b64
    except Exception as e:
        raise VTOPDownError(f"Could not connect to VTOP: {e}")

async def scrape_student_profile(client: httpx.AsyncClient, base_url: str, jsessionid: str) -> StudentProfile:
    """
    Scrapes student profile details from VTOP StudentProfileAllDetails page.
    """
    headers = {"Cookie": f"JSESSIONID={jsessionid}"}
    resp = await client.get(f"{base_url}/studentsRecord/StudentProfileAllDetails", headers=headers)
    soup = BeautifulSoup(resp.text, 'lxml')
    
    def get_val_by_label(label_text: str) -> Optional[str]:
        label_td = soup.find('td', string=lambda s: s and label_text in s)
        if label_td and label_td.find_next_sibling('td'):
            return label_td.find_next_sibling('td').text.strip()
        return None

    regNo = get_val_by_label("Register No") or ""
    name = get_val_by_label("Name") or ""
    email = get_val_by_label("Email") or ""
    gender = get_val_by_label("Gender") or ""
    hostelBlock = get_val_by_label("Hostel Block") or ""
    roomNo = get_val_by_label("Room No") or ""
    programme = get_val_by_label("Programme") or ""
    branch = get_val_by_label("Branch") or ""
    school = get_val_by_label("School") or ""
    proctorEmail = get_val_by_label("Proctor Email") or ""

    # Mock mess type for now, as it might not be in profile details easily
    mess_type = MessType.VEG if "veg" in hostelBlock.lower() or "girls" in hostelBlock.lower() else MessType.NONVEG

    return StudentProfile(
        regNo=regNo,
        name=name,
        email=email,
        gender=gender,
        hostelBlock=hostelBlock,
        roomNo=roomNo,
        programme=programme,
        branch=branch,
        school=school,
        proctorEmail=proctorEmail,
        messType=mess_type
    )

async def vtop_login(reg_no: str, password: str) -> StudentProfile:
    """
    Authenticates with VTOP using multiple endpoints and retries for captcha failures.
    """
    async with httpx.AsyncClient(follow_redirects=True) as client:
        for attempt in range(MAX_RETRIES):
            for base_url in [PRIMARY_URL, FALLBACK_URL]:
                try:
                    jsessionid, captcha_b64 = await get_session_and_captcha(client, base_url)
                    solved_captcha = solve_captcha(captcha_b64)
                    
                    if not solved_captcha:
                        continue
                    
                    # Endpoints to try
                    login_endpoints = ["doLogin", "processLogin", "frmlogin", "loginprocess"]
                    
                    for endpoint in login_endpoints:
                        payload = {
                            "uname": reg_no,
                            "passwd": password,
                            "captchaCheck": solved_captcha
                        }
                        
                        headers = {
                            "Cookie": f"JSESSIONID={jsessionid}",
                            "Referer": f"{base_url}/initialProcess",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
                        }
                        
                        resp = await client.post(f"{base_url}/{endpoint}", data=payload, headers=headers)
                        content = resp.text.lower()
                        
                        if "invalid captcha" in content:
                            break # Retry captcha
                        
                        if "invalid" in content and ("credential" in content or "password" in content):
                            raise InvalidCredentialsError("Invalid credentials provided")
                            
                        # Success check: look for profile indicators or successful redirect to student home
                        if "logout" in content or "menu" in content or "vtopcc" in resp.url.path:
                            return await scrape_student_profile(client, base_url, jsessionid)
                            
                except InvalidCredentialsError:
                    raise
                except Exception as e:
                    print(f"VTOP Login attempt {attempt+1} on {base_url} failed: {e}")
                    continue
                    
        raise VTOPAuthError("Authentication failed after multiple retries. VTOP might be down or captcha is failing.")
