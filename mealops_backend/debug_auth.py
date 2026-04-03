import asyncio
import httpx
from bs4 import BeautifulSoup
import base64
import re
from services.vtop_auth import vtop_login, VTOPAuthError, InvalidCredentialsError

async def test_debug():
    print("DEBUG: Starting VTOP Auth Test...")
    try:
        profile = await vtop_login("24BRS1302", "VITOnTop@123456")
        print(f"SUCCESS: {profile.name}")
    except VTOPAuthError as e:
        print(f"VTOP AUTH ERROR: {e}")
    except Exception as e:
        print(f"GENERAL ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_debug())
