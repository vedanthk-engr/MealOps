import httpx
import base64
import time
from bs4 import BeautifulSoup
from typing import Tuple, Dict, Any, Optional
from schemas.student import StudentProfile, MessType

PRIMARY_URL = 'https://vtopcc.vit.ac.in/vtop'

class VTOPAuthError(Exception):
    pass

class InvalidCredentialsError(VTOPAuthError):
    pass

class CaptchaFailureError(VTOPAuthError):
    pass

class VTOPDownError(VTOPAuthError):
    pass

async def get_session_and_captcha(client: httpx.AsyncClient, base_url: str) -> Tuple[str, str, str]:
    """
    Extracts JSESSIONID, CSRF token, and captcha from VTOP login process.
    Matches the traced browser flow.
    """
    try:
        # Step 1: Initial visit to login page
        resp = await client.get(f"{base_url}/login", timeout=15.0)
        jsessionid = resp.cookies.get("JSESSIONID") or ""
        
        soup = BeautifulSoup(resp.text, 'lxml')
        csrf_token_el = soup.find('input', {'name': '_csrf'})
        csrf_token = csrf_token_el.get('value', '') if csrf_token_el else ""
        
        # Step 2: Request the built-in captcha via AJAX endpoint
        captcha_resp = await client.get(f"{base_url}/get/new/captcha", timeout=10.0)
        captcha_soup = BeautifulSoup(captcha_resp.text, 'lxml')
        
        captcha_img = captcha_soup.find('img', src=lambda s: s and s.startswith('data:image'))
        if not captcha_img:
            raise CaptchaFailureError("Captcha image not found in AJAX response")
            
        captcha_src = captcha_img.get('src', '')
        captcha_b64 = captcha_src.split(',')[-1]
        
        return jsessionid, csrf_token, captcha_b64
    except Exception as e:
        raise VTOPDownError(f"Could not connect to VTOP: {e}")

async def get_vtop_captcha_setup() -> Dict[str, Any]:
    """
    Exposes captcha setup to the frontend for manual solving.
    """
    async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
        jsessionid, csrf_token, captcha_b64 = await get_session_and_captcha(client, PRIMARY_URL)
        # Return all cookies as a name-value dict
        cookies = {name: value for name, value in client.cookies.items()}
        return {
            "captcha_b64": captcha_b64,
            "jsessionid": jsessionid,
            "csrf_token": csrf_token,
            "cookies": cookies
        }

async def scrape_student_profile(client: httpx.AsyncClient, base_url: str, reg_no: str, csrf_token: str) -> StudentProfile:
    """
    Scrapes student profile details from VTOP using the traced POST flow.
    """
    headers = {
        "Referer": f"{base_url}/content",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    
    # Payload matches the traced browser request
    payload = {
        "verifyMenu": "true",
        "authorizedID": reg_no,
        "_csrf": csrf_token,
        "nocache": str(int(time.time() * 1000))
    }
    
    # Target URL for full student profile details (POST method revealed in trace)
    resp = await client.post(f"{base_url}/studentsRecord/StudentProfileAllView", data=payload, headers=headers)
    soup = BeautifulSoup(resp.text, 'lxml')
    
    def get_val_by_label(label_text: str) -> Optional[str]:
        # Search for text matching the label
        label_td = soup.find('td', string=lambda s: s and label_text in s)
        if label_td and label_td.find_next_sibling('td'):
            return label_td.find_next_sibling('td').text.strip()
        return None

    # Extraction using specific labels found in the VTOP Profile view
    name = get_val_by_label("Name") or ""
    email = get_val_by_label("Email") or get_val_by_label("Alternate Email") or ""
    gender = get_val_by_label("Gender") or ""
    programme = get_val_by_label("Programme") or ""
    branch = get_val_by_label("Branch") or ""
    school = get_val_by_label("School") or ""
    
    # Hostel and Mess details
    hostelBlock = get_val_by_label("Hostel Block") or ""
    roomNo = get_val_by_label("Room No") or ""
    proctorEmail = get_val_by_label("Proctor Email") or ""
    
    # Precise Mess Type detection from the profile table
    mess_label_val = get_val_by_label("Mess") or get_val_by_label("Mess Type") or ""
    if "non" in mess_label_val.lower():
        mess_type = MessType.NONVEG
    elif "veg" in mess_label_val.lower():
        mess_type = MessType.VEG
    else:
        # Fallback to heuristic if specific label fails
        mess_type = MessType.VEG if "veg" in hostelBlock.lower() or "girls" in hostelBlock.lower() else MessType.NONVEG

    return StudentProfile(
        regNo=reg_no,
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

async def vtop_login(
    reg_no: str, 
    password: str, 
    captcha_solution: str,
    jsessionid: str,
    csrf_token: str,
    cookies: Optional[Dict[str, str]] = None
) -> StudentProfile:
    """
    Authenticates with VTOP using human-solved captcha.
    """
    print(f"VTOP LOGIN: RegNo={reg_no}, Captcha={captcha_solution}, SID={jsessionid}, CSRF={csrf_token}")
    if not captcha_solution or not jsessionid or not csrf_token:
        raise CaptchaFailureError("Missing captcha solution or session data for VTOP login.")

    async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
        # Load the cookies if provided, else just JSESSIONID
        if cookies:
            for name, value in cookies.items():
                client.cookies.set(name, value)
        else:
            client.cookies.set("JSESSIONID", jsessionid)
        
        # Payload fields matched to browser trace: uname, passwd, captchaCheck
        payload = {
            "uname": reg_no,
            "passwd": password,
            "captchaCheck": captcha_solution.upper(),
            "_csrf": csrf_token
        }
        
        headers = {
            "Referer": f"{PRIMARY_URL}/login",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        
        # Login endpoint from trace: /doLogin
        resp = await client.post(f"{PRIMARY_URL}/doLogin", data=payload, headers=headers)
        content = resp.text.lower()
        
        if "invalid captcha" in content:
            raise CaptchaFailureError("Invalid captcha solution.")
        
        if "invalid" in content and ("credential" in content or "password" in content or "user id" in content):
            raise InvalidCredentialsError("Invalid registration number or password.")
            
        # Success check: dashboard presence or menu
        if "logout" in content or "menu" in content or "authorizedid" in content or "content" in resp.url.path:
            # Re-fetch CSRF if needed for the profile request (common in VTOP flows)
            new_soup = BeautifulSoup(resp.text, 'lxml')
            new_csrf_el = new_soup.find('input', {'name': '_csrf'})
            active_csrf = new_csrf_el.get('value', '') if new_csrf_el else csrf_token
            
            return await scrape_student_profile(client, PRIMARY_URL, reg_no, active_csrf)
        
        # Diagnostic printing on failure
        print(f"Login failed. Response URL: {resp.url}")
        print(f"Sample content: {resp.text[:500]}")
        raise VTOPAuthError("Authentication failed: could not establish a valid session.")
