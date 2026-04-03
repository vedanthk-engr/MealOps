import httpx
from bs4 import BeautifulSoup

def test_full_flow():
    UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.178 Safari/537.36"
    # Using follow_redirects=True for initial Setup, BUT follow_redirects=False for Login
    client = httpx.Client(verify=False, headers={"User-Agent": UA}, follow_redirects=True)
    
    # 1. Setup GET
    print("1. GET /prelogin/setup...")
    r1 = client.get("https://vtopcc.vit.ac.in/vtop/prelogin/setup")
    soup1 = BeautifulSoup(r1.text, 'lxml')
    initial_csrf = soup1.find('input', {'name': '_csrf'})['value']
    print(f"   Initial CSRF: {initial_csrf}")

    # 2. Setup POST
    print("2. POST /prelogin/setup (flag=VTOP)...")
    r2 = client.post("https://vtopcc.vit.ac.in/vtop/prelogin/setup", 
                     data={"flag": "VTOP", "_csrf": initial_csrf})
    print(f"   POST Status: {r2.status_code}")

    # 3. Login GET
    print("3. GET /login...")
    r3 = client.get("https://vtopcc.vit.ac.in/vtop/login")
    soup3 = BeautifulSoup(r3.text, 'lxml')
    
    login_csrf_el = soup3.find('input', {'name': '_csrf'})
    login_csrf = login_csrf_el['value'] if login_csrf_el else "NOT_FOUND"
    print(f"   Login CSRF: {login_csrf}")

    # 4. Check for Static Captcha
    print("4. Checking static captcha in HTML...")
    captcha_img = soup3.find('img', {'alt': 'vtop captcha'}) or soup3.find('img', src=lambda s: 'captcha' in str(s).lower())
    if captcha_img:
        src = captcha_img.get('src', '')
        print(f"   FOUND STATIC CAPTCHA: {src[:50]}...")
    else:
        print("   NO STATIC CAPTCHA FOUND.")

    # 5. Check for AJAX Captcha
    print("5. GET /get/new/captcha (AJAX)...")
    r5 = client.get("https://vtopcc.vit.ac.in/vtop/get/new/captcha")
    soup5 = BeautifulSoup(r5.text, 'lxml')
    ajax_img = soup5.find('img', src=lambda s: s and s.startswith('data:image'))
    if ajax_img:
        print(f"   FOUND AJAX CAPTCHA: {ajax_img.get('src')[:50]}...")
    else:
        print("   NO AJAX CAPTCHA FOUND.")

if __name__ == "__main__":
    test_full_flow()
