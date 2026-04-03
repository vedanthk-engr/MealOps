from fastapi import Request, HTTPException, status
from ..utils.jwt_utils import verify_token

class AuthMiddleware:
    """
    Dependency to verify JWT token and extract user information.
    """
    async def __call__(self, request: Request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
            )
        
        token = auth_header.split(" ")[1]
        payload = verify_token(token)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        
        # Add payload to request state for access in endpoints
        request.state.user = payload
        return payload

auth_guard = AuthMiddleware()
