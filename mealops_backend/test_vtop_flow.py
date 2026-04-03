import asyncio
import sys
import os

# Add parent directory to sys.path to import services and utils
sys.path.append(os.getcwd())

from services.vtop_auth import vtop_login, VTOPAuthError, InvalidCredentialsError

async def test_full_login():
    # Use real or dummy credentials if needed for testing (but better to mock/check fail reason)
    # If using dummy, it should at least reach "Invalid Credentials" and NOT "Captcha image not found"
    try:
        # Testing with dummy credentials to verify flow
        profile = await vtop_login("20BCE0000", "dummy123")
        print("Profile fetched successfully!")
    except InvalidCredentialsError:
        print("Success: Caught 'Invalid credentials' error (This means flow is working!).")
    except Exception as e:
        print(f"Error caught: {e}")

if __name__ == "__main__":
    asyncio.run(test_full_login())
