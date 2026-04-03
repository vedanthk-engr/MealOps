import httpx
import base64
import time
import re
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
        # Conservative fallback: default to VEG unless hostel block explicitly signals NONVEG.
        # This prevents false NONVEG classification when mess text is missing.
        if re.search(r"\bnon\s*[- ]?veg\b|\bnv\b", block_l):
            mess_type = MessType.NONVEG
        else:
            mess_type = MessType.VEG

    # If no explicit caterer field, use mess information fallback.
    caterer = (mess_caterer_text or "").strip()
    if not caterer:
        caterer = (mess_info or "").strip()

    return mess_type, caterer

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

        # Some VTOP flows rotate CSRF and/or session after captcha refresh.
        csrf_from_captcha_el = captcha_soup.find('input', {'name': '_csrf'})
        if csrf_from_captcha_el and csrf_from_captcha_el.get('value'):
            csrf_token = csrf_from_captcha_el.get('value', '')

        # Prefer latest session cookie after captcha call.
        jsessionid = client.cookies.get("JSESSIONID") or jsessionid
        
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
    profile_pairs = _extract_table_pairs(soup)

    # Also pull VTOP content page because Hostel Information is often rendered there.
    # User flow reference: My Info -> Your Profile -> Hostel Information.
    content_pairs: Dict[str, str] = {}
    try:
        content_resp = await client.get(f"{base_url}/content", headers={"Referer": f"{base_url}/content"})
        content_soup = BeautifulSoup(content_resp.text, 'lxml')
        content_pairs = _extract_table_pairs(content_soup)
    except Exception:
        # Keep profile parsing resilient even if this fallback endpoint shape changes.
        content_pairs = {}

    def val(*labels: str) -> str:
        return (
            _pick(content_pairs, *labels)
            or _pick(profile_pairs, *labels)
            or _find_value_by_labels(soup, labels)
            or (_find_value_by_labels(content_soup, labels) if 'content_soup' in locals() else "")
        )

    # Core profile fields
    name = val("Name")
    email = val("Email", "Alternate Email")
    gender = val("Gender")
    programme = val("Programme")
    branch = val("Branch")
    school = val("School")
    proctorEmail = val("Proctor Email")

    # Hostel Information block labels from VTOP screenshots/pages.
    hostelBlock = val("Hostel Block", "Block Name")
    roomNo = val("Room No", "Room No.")
    mess_info = val("Mess Information", "Mess Details")
    mess_type_text = val("Mess", "Mess Type")
    mess_caterer_text = val("Mess Caterer", "Caterer")

    mess_type, messCaterer = _derive_mess_details(hostelBlock, mess_info, mess_type_text, mess_caterer_text)

    print(
        f"[VTOP_PARSE] regNo={reg_no} hostelBlock='{hostelBlock}' roomNo='{roomNo}' "
        f"messInfo='{mess_info}' messTypeText='{mess_type_text}' messCaterer='{messCaterer}' "
        f"derivedMessType='{mess_type.value}'"
    )

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
        messType=mess_type,
        messCaterer=messCaterer
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
    if not captcha_solution or not csrf_token:
        raise CaptchaFailureError("Missing captcha solution or session data for VTOP login.")

    async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
        # Load the cookies if provided, else just JSESSIONID
        if cookies:
            for name, value in cookies.items():
                client.cookies.set(name, value)
        if jsessionid:
            client.cookies.set("JSESSIONID", jsessionid)

        # Support both legacy and current VTOP field naming.
        # Different deployments switch between /doLogin and /login payload styles.
        payload = {
            "uname": reg_no,
            "passwd": password,
            "username": reg_no,
            "password": password,
            "captchaCheck": captcha_solution.upper(),
            "captchaStr": captcha_solution.upper(),
            "_csrf": csrf_token,
        }
        
        headers = {
            "Referer": f"{PRIMARY_URL}/login",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }

        # Try legacy endpoint first, then current endpoint as fallback.
        # This keeps the flow stable across VTOP auth changes.
        attempted_responses = []
        for endpoint in ("/doLogin", "/login"):
            resp = await client.post(f"{PRIMARY_URL}{endpoint}", data=payload, headers=headers)
            attempted_responses.append(resp)

            content = resp.text.lower()

            if "invalid captcha" in content:
                raise CaptchaFailureError("Invalid captcha solution.")

            if "invalid" in content and ("credential" in content or "password" in content or "user id" in content):
                raise InvalidCredentialsError("Invalid registration number or password.")

            # Success check: dashboard/content/menu markers or known landing paths.
            if (
                "logout" in content
                or "authorizedid" in content
                or "studentprofileallview" in content
                or "vtop" in str(resp.url).lower() and ("content" in str(resp.url).lower() or "home" in str(resp.url).lower())
            ):
                new_soup = BeautifulSoup(resp.text, 'lxml')
                new_csrf_el = new_soup.find('input', {'name': '_csrf'})
                active_csrf = new_csrf_el.get('value', '') if new_csrf_el else csrf_token
                return await scrape_student_profile(client, PRIMARY_URL, reg_no, active_csrf)
        
        # Diagnostic printing on failure
        if attempted_responses:
            last_resp = attempted_responses[-1]
            print(f"Login failed. Response URL: {last_resp.url}")
            print(f"Sample content: {last_resp.text[:500]}")
        raise VTOPAuthError("Authentication failed: could not establish a valid session.")
