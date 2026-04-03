import httpx
import asyncio
from bs4 import BeautifulSoup

async def debug_vtop_captcha():
    base_url = "https://vtopcc.vit.ac.in/vtop"
    async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
        # Get session first
        await client.get(f"{base_url}/login")
        
        # Try to get new captcha
        print("Requesting /vtop/get/new/captcha...")
        resp = await client.get(f"{base_url}/get/new/captcha")
        print(f"Status: {resp.status_code}")
        print(f"Response snippet: {resp.text[:200]}")
        
        soup = BeautifulSoup(resp.text, 'lxml')
        captcha = soup.find('img', src=lambda s: s and s.startswith('data:image'))
        if captcha:
            print("CAPTCHA IMAGE FOUND in AJAX response!")
        else:
            print("CAPTCHA IMAGE NOT FOUND in AJAX response.")

if __name__ == "__main__":
    asyncio.run(debug_vtop_captcha())
