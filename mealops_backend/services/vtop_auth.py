import httpx
import base64
import time
import re
from datetime import datetime
from bs4 import BeautifulSoup
from typing import Tuple, Dict, Any, Optional, List
from schemas.student import StudentProfile, MessType
from PIL import Image
import io
from . import vtop_captcha

PRIMARY_URL = 'https://vtopcc.vit.ac.in/vtop'

class VTOPAuthError(Exception):
    pass

class InvalidCredentialsError(VTOPAuthError):
    pass

class CaptchaFailureError(VTOPAuthError):
    pass

class VTOPDownError(VTOPAuthError):
    pass

# Helper functions for robust scraping
def _normalize_label(label: str) -> str:
    return re.sub(r"\s+", " ", (label or "").strip()).lower().rstrip(":")

def _extract_table_pairs(soup: BeautifulSoup) -> Dict[str, str]:
    """
    Extract key/value pairs from generic VTOP profile tables.
    Works for rows like: <td>Label</td><td>Value</td>.
    """
    pairs: Dict[str, str] = {}
    for row in soup.select("tr"):
        cells = row.find_all(["td", "th"])
        if len(cells) < 2:
            continue
        key = _normalize_label(cells[0].get_text(" ", strip=True))
        val = cells[1].get_text(" ", strip=True)
        if key and val:
            pairs[key] = val
    return pairs

def _find_value_by_labels(soup: BeautifulSoup, labels: Tuple[str, ...]) -> str:
    """
    Fuzzy lookup for VTOP key/value tables where structure can be inconsistent.
    Looks for any cell containing label text and returns nearest sibling value cell.
    """
    label_set = tuple(_normalize_label(l) for l in labels)
    for cell in soup.find_all(["td", "th", "span", "label", "div"]):
        raw = cell.get_text(" ", strip=True)
        if not raw:
            continue
        norm = _normalize_label(raw)
        if not any(ls == norm or ls in norm for ls in label_set):
            continue

        sib = cell.find_next_sibling(["td", "th"])
        if sib:
            val = sib.get_text(" ", strip=True)
            if val:
                return val

        row = cell.find_parent("tr")
        if row:
            cells = row.find_all(["td", "th"])
            if len(cells) >= 2:
                # Value is commonly the second cell in VTOP profile rows.
                val = cells[1].get_text(" ", strip=True)
                if val:
                    return val
    return ""

def _pick(pairs: Dict[str, str], *labels: str) -> str:
    for label in labels:
        key = _normalize_label(label)
        if key in pairs and pairs[key]:
            return pairs[key]
    return ""

def _derive_mess_details(hostel_block: str, mess_info: str, mess_type_text: str, mess_caterer_text: str) -> Tuple[MessType, str]:
    merged = " | ".join([mess_info or "", mess_type_text or "", mess_caterer_text or ""])
    merged_l = merged.lower()

    # Prefer explicit non-veg before veg to avoid false hits where both appear.
    if re.search(r"\bnon\s*[- ]?veg\b|\bnv\b", merged_l):
        mess_type = MessType.NONVEG
    elif re.search(r"\bveg\b", merged_l):
        mess_type = MessType.VEG
    else:
        block_l = (hostel_block or "").lower()
        if re.search(r"\bnon\s*[- ]?veg\b|\bnv\b", block_l):
            mess_type = MessType.NONVEG
        else:
            mess_type = MessType.VEG

    caterer = (mess_caterer_text or "").strip()
    if not caterer:
        caterer = (mess_info or "").strip()

    return mess_type, caterer

async def get_session_and_captcha(client: httpx.AsyncClient, base_url: str) -> Tuple[str, str, str, str]:
    """
    Extracts JSESSIONID, CSRF token, and captcha from VTOP login process.
    Returns: (jsessionid, csrf_token, captcha_b64, captcha_solution)
    """
    UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.178 Safari/537.36"
    try:
        # Step 1: Pre-login Setup Handshake
        setup_page = await client.get(f"{base_url}/prelogin/setup", timeout=15.0, follow_redirects=True)
        s_soup = BeautifulSoup(setup_page.text, 'lxml')
        initial_csrf = s_soup.find('input', {'name': '_csrf'}).get('value', '') if s_soup.find('input', {'name': '_csrf'}) else ""
        
        setup_payload = {"flag": "VTOP", "_csrf": initial_csrf}
        setup_headers = {
            "Referer": f"{base_url}/prelogin/setup",
            "Origin": "https://vtopcc.vit.ac.in",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": UA
        }
        await client.post(f"{base_url}/prelogin/setup", data=setup_payload, headers=setup_headers)
        
        # Step 2: Login Page CSRF and Captcha Extraction
        login_page_resp = await client.get(f"{base_url}/login", headers={"User-Agent": UA})
        jsessionid = login_page_resp.cookies.get("JSESSIONID") or ""
        l_soup = BeautifulSoup(login_page_resp.text, 'lxml')
        login_csrf = l_soup.find('input', {'name': '_csrf'}).get('value', '') if l_soup.find('input', {'name': '_csrf'}) else initial_csrf
        
        # VIT uses either embedded base64 img or an endpoint
        captcha_img_tag = l_soup.find('img', alt="vtop-captcha") or l_soup.find('img', {'src': re.compile(r'captcha')})
        captcha_b64 = ""
        
        if captcha_img_tag:
            img_src = captcha_img_tag.get('src', '')
            if img_src.startswith('data:image'):
                captcha_b64 = img_src.split(',')[-1]
            else:
                if not img_src.startswith('http'):
                    img_url = f"https://vtopcc.vit.ac.in{img_src}" if img_src.startswith('/') else f"{base_url}/{img_src}"
                else:
                    img_url = img_src
                captcha_resp = await client.get(img_url, timeout=10.0, headers={"User-Agent": UA})
                captcha_b64 = base64.b64encode(captcha_resp.content).decode('ascii')
        
        if not captcha_b64:
            # Fallback to direct AJAX
            captcha_resp = await client.get(f"{base_url}/get/new/captcha", timeout=10.0, headers={"Referer": f"{base_url}/login", "User-Agent": UA})
            if "data:image" in captcha_resp.text:
                match = re.search(r'data:image/[^;]+;base64,([^"]+)', captcha_resp.text)
                if match: captcha_b64 = match.group(1)
        
        if not captcha_b64:
            raise CaptchaFailureError("Captcha image could not be retrieved.")
            
        # Solve it immediately
        try:
            image_bytes = base64.b64decode(captcha_b64)
            captcha_solution = vtop_captcha.solve_captcha(image_bytes)
            print(f"[CAPTCHA SOLVER] Solved as: {captcha_solution}")
        except Exception as e:
            print(f"[CAPTCHA SOLVER] Failed: {e}")
            captcha_solution = ""
            
        return jsessionid, login_csrf, captcha_b64, captcha_solution
    except Exception as e:
        if isinstance(e, VTOPAuthError): raise
        raise VTOPDownError(f"Could not connect to VTOP: {e}")

async def get_vtop_captcha_setup() -> Dict[str, Any]:
    async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
        jsessionid, csrf_token, captcha_b64, captcha_solution = await get_session_and_captcha(client, PRIMARY_URL)
        cookies = {name: value for name, value in client.cookies.items()}
        return {
            "captcha_b64": captcha_b64,
            "captcha_solved": captcha_solution,
            "jsessionid": jsessionid,
            "csrf_token": csrf_token,
            "cookies": cookies
        }

async def scrape_student_profile(client: httpx.AsyncClient, base_url: str, reg_no: str, csrf_token: str, real_auth_id: str) -> StudentProfile:
    headers = {
        "Referer": f"{base_url}/content",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.178 Safari/537.36",
    }

    auth_id_to_use = real_auth_id if real_auth_id else reg_no
    payload = {
        "verifyMenu": "true",
        "authorizedID": auth_id_to_use,
        "_csrf": csrf_token,
        "nocache": f"@{int(time.time() * 1000)}"
    }
    
    resp = await client.post(f"{base_url}/studentsRecord/StudentProfileAllView", data=payload, headers=headers)
    
    preview = resp.text[:1000].lower()
    if resp.status_code == 404 or ("login" in preview and "username" in preview) or len(resp.text) == 20678:
        msg = f"[SCRAPER REJECTION] Account {reg_no} failed profile fetch. (Possible Survey/Password reset required)"
        print(msg)
        raise VTOPAuthError(msg)

    soup = BeautifulSoup(resp.text, 'lxml')
    profile_pairs = _extract_table_pairs(soup)

    # Pull content page for Hostel Info fallback
    content_pairs: Dict[str, str] = {}
    content_soup: Optional[BeautifulSoup] = None
    try:
        content_resp = await client.get(f"{base_url}/content", headers={"Referer": f"{base_url}/content"})
        content_soup = BeautifulSoup(content_resp.text, 'lxml')
        content_pairs = _extract_table_pairs(content_soup)
    except Exception: pass

    def val(*labels: str) -> str:
        return (
            _pick(content_pairs, *labels)
            or _pick(profile_pairs, *labels)
            or _find_value_by_labels(soup, labels)
            or (_find_value_by_labels(content_soup, labels) if content_soup else "")
        )

    # Extract fields using fuzzy matching
    name = val("Name", "Student Name")
    email = val("Email", "Alternate Email", "Mail")
    gender = val("Gender", "Sex")
    programme = val("Programme", "Course")
    branch = val("Branch", "Major")
    school = val("School", "Department")
    proctorEmail = val("Proctor Email", "Faculty Proctor")

    hostelBlock = val("Hostel Block", "Block", "Block Name")
    roomNo = val("Room No", "Room Number")
    mess_info = val("Mess Information", "Mess Details")
    mess_type_text = val("Mess", "Mess Type")
    mess_caterer_text = val("Mess Caterer", "Caterer")

    mess_type, messCaterer = _derive_mess_details(hostelBlock, mess_info, mess_type_text, mess_caterer_text)

    print(f"[SCRAPER] Extracted -> Name: {name}, Block: {hostelBlock}, Room: {roomNo}, Mess: {mess_type.value}")
    
    return StudentProfile(
        regNo=reg_no, name=name, email=email, gender=gender,
        hostelBlock=hostelBlock, roomNo=roomNo, programme=programme,
        branch=branch, school=school, proctorEmail=proctorEmail,
        messType=mess_type, messCaterer=messCaterer
    )

async def vtop_login(
    reg_no: str, password: str, captcha_solution: Optional[str] = None,
    jsessionid: Optional[str] = None, csrf_token: Optional[str] = None,
    cookies: Optional[Dict[str, str]] = None
) -> StudentProfile:
    print(f"VTOP LOGIN ACTION: RegNo={reg_no}")
    
    UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.178 Safari/537.36"
    MAX_ATTEMPTS = 5

    for attempt in range(MAX_ATTEMPTS):
        async with httpx.AsyncClient(follow_redirects=False, verify=False) as client:
            try:
                # 1. SETUP SESSION IF MISSING
                handshake_done = False
                if not jsessionid or not csrf_token or not captcha_solution:
                    if attempt > 0: print(f"[AUTO-LOGIN] Resetting session for attempt {attempt+1}")
                    jsessionid, csrf_token, _, captcha_solution = await get_session_and_captcha(client, PRIMARY_URL)
                    handshake_done = True
                    
                if not captcha_solution:
                    raise CaptchaFailureError("Could not solve captcha automatically.")

                if not handshake_done:
                    if cookies:
                        for k, v in cookies.items(): client.cookies.set(k, v, domain="vtopcc.vit.ac.in")
                    else:
                        client.cookies.set("JSESSIONID", jsessionid, domain="vtopcc.vit.ac.in")
                    
                # 2. MANDATORY RE-HANDSHAKE
                try:
                    await client.post(f"{PRIMARY_URL}/prelogin/setup", data={"flag": "VTOP", "_csrf": csrf_token}, headers={"Referer": f"{PRIMARY_URL}/prelogin/setup", "User-Agent": UA})
                except Exception: pass

                # 3. SUBMIT LOGIN
                payload = {
                    "username": reg_no,
                    "password": password,
                    "captchaStr": captcha_solution.upper(),
                    "_csrf": csrf_token
                }
                headers = {"Referer": f"{PRIMARY_URL}/login", "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded"}
                resp = await client.post(f"{PRIMARY_URL}/login", data=payload, headers=headers)
                
                # Manual Redirect
                count = 0
                while resp.status_code == 302 and count < 6:
                    loc = resp.headers.get("Location", "")
                    if not loc.startswith("http"):
                        loc = f"https://vtopcc.vit.ac.in{loc}" if loc.startswith("/") else f"{PRIMARY_URL}/{loc}"
                    print(f"[BOUNCE {count}] -> {loc}")
                    resp = await client.get(loc, headers={"User-Agent": UA})
                    count += 1

                content_lower = resp.text.lower()
                if "invalid captcha" in content_lower:
                    raise CaptchaFailureError("Invalid captcha solution.")
                if "invalid" in content_lower and ("password" in content_lower or "credential" in content_lower):
                    raise InvalidCredentialsError("Invalid registration number or password.")
                if "login/error" in str(resp.url).lower():
                    raise InvalidCredentialsError("Invalid registration number or password.")
                    
                if "authorizedid" in content_lower or "/vtop/content" in str(resp.url).lower():
                    soup = BeautifulSoup(resp.text, 'lxml')
                    auth_id_el = soup.find('input', {'id': 'authorizedID'}) or soup.find('input', {'name': 'authorizedID'})
                    extracted_auth_id = auth_id_el.get('value', '') if auth_id_el else reg_no
                    
                    new_csrf = ""
                    csrf_input = soup.find('input', {'name': '_csrf'})
                    if csrf_input:
                        new_csrf = csrf_input.get('value', '')
                    else:
                        csrf_match = re.search(r'var csrfValue\s*=\s*"([^"]+)"', resp.text)
                        if csrf_match: new_csrf = csrf_match.group(1)
                    
                    effective_csrf = new_csrf if new_csrf else csrf_token
                    print(f"[SUCCESS] Login Verified. CSRF Rotated: {'Yes' if new_csrf else 'No'} | AuthID: {extracted_auth_id}")
                    return await scrape_student_profile(client, PRIMARY_URL, reg_no, effective_csrf, extracted_auth_id)
                
                if "blocked" in content_lower:
                    raise VTOPAuthError("Account is blocked.")

                msg = f"Auth failed. Final URL: {resp.url} (Status: {resp.status_code})"
                print(f"[AUTH FAILURE] {msg}")
                raise VTOPAuthError(msg)

            except CaptchaFailureError as ce:
                if attempt == MAX_ATTEMPTS - 1: raise ce
                print(f"[RETRY {attempt+1}] Captcha solve was incorrect. Retrying...")
                jsessionid = csrf_token = captcha_solution = cookies = None
            except InvalidCredentialsError: raise
            except Exception as e:
                if attempt == MAX_ATTEMPTS - 1: raise
                print(f"[RETRY {attempt+1}] Protocol error: {e}. Retrying...")
                jsessionid = csrf_token = captcha_solution = cookies = None
