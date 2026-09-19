import os
from datetime import datetime, timedelta, timezone
from typing import Any
# pyrefly: ignore [missing-import]
from fastapi import HTTPException
# pyrefly: ignore [missing-import]
import jwt

def _jwt_secret() -> str:
    return os.getenv("JWT_SECRET", "change-me-insecure-dev-only")

def build_token(user_id: str, tenant_id: str, role: str, token_type: str, expires_in: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "tenant_id": tenant_id,
        "role": role,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_in).timestamp()),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm="HS256")

def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, _jwt_secret(), algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="invalid or expired token")

def parse_bearer(authorization: str | None) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="authorization header required")
    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="authorization header required")
    return token

def require_claims(authorization: str | None) -> dict[str, Any]:
    token = parse_bearer(authorization)
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="invalid token type")
    return payload

def require_user(authorization: str | None) -> tuple[str, str]:
    payload = require_claims(authorization)
    user_id = str(payload.get("user_id", ""))
    tenant_id = str(payload.get("tenant_id", ""))
    if not user_id or not tenant_id:
        raise HTTPException(status_code=401, detail="invalid token")
    return user_id, tenant_id

def require_admin(authorization: str | None) -> tuple[str, str]:
    payload = require_claims(authorization)
    user_id = str(payload.get("user_id", ""))
    tenant_id = str(payload.get("tenant_id", ""))
    role = str(payload.get("role", ""))
    if not user_id or not tenant_id:
        raise HTTPException(status_code=401, detail="invalid token")
    if role != "admin":
        raise HTTPException(status_code=403, detail="admin role required")
    return user_id, tenant_id

def parse_user_id_from_auth(authorization: str | None) -> str | None:
    if not authorization:
        return None
    if not authorization.lower().startswith("bearer "):
        return None
    try:
        payload = decode_token(authorization[7:].strip())
    except HTTPException:
        return None
    return str(payload.get("user_id", ""))
