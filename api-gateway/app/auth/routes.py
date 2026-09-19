import bcrypt
import uuid
from datetime import timedelta, datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Body, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.db import get_db
from app.models import User, RegistrationCode
from app.auth.schemas import LoginRequest, RegisterRequest, RefreshRequest, TokenPair
from app.auth.dependencies import build_token, decode_token, parse_bearer

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenPair)
async def auth_register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    hashed = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    code_norm = req.code.strip().upper()
    
    # Check registration code with FOR UPDATE
    result = await db.execute(
        select(RegistrationCode).where(RegistrationCode.code == code_norm, RegistrationCode.used_at.is_(None)).with_for_update()
    )
    reg_code = result.scalars().first()
    
    if not reg_code:
        raise HTTPException(status_code=400, detail="invalid or already used registration code")
    
    tenant_id = reg_code.tenant_id
    
    # Check if user exists
    user_exists = await db.execute(select(User.id).where(User.email == req.email))
    if user_exists.scalars().first():
        raise HTTPException(status_code=400, detail="already registered")
    
    # Create user
    new_user = User(
        id=uuid.uuid4(),
        tenant_id=tenant_id,
        email=req.email,
        password_hash=hashed,
        role="member"
    )
    db.add(new_user)
    
    # Update registration code
    reg_code.used_at = datetime.now(timezone.utc)
    reg_code.used_by_user_id = new_user.id
    
    await db.commit()
    
    access = build_token(str(new_user.id), str(tenant_id), "member", "access", timedelta(minutes=15))
    refresh = build_token(str(new_user.id), str(tenant_id), "member", "refresh", timedelta(days=7))
    return TokenPair(access_token=access, refresh_token=refresh)

@router.post("/login", response_model=TokenPair)
async def auth_login(request: Request, req: LoginRequest = Body(...), db: AsyncSession = Depends(get_db)):
    # Rate limit check should happen via slowapi in the router / app level
    result = await db.execute(
        select(User).where(User.email == req.email)
    )
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="invalid credentials")
        
    if not bcrypt.checkpw(req.password.encode("utf-8"), user.password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="invalid credentials")
        
    access = build_token(str(user.id), str(user.tenant_id), user.role, "access", timedelta(minutes=15))
    refresh = build_token(str(user.id), str(user.tenant_id), user.role, "refresh", timedelta(days=7))
    return TokenPair(access_token=access, refresh_token=refresh)

@router.post("/refresh", response_model=TokenPair)
async def auth_refresh(req: RefreshRequest):
    payload = decode_token(req.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="invalid token type")
    
    user_id = str(payload.get("user_id", ""))
    tenant_id = str(payload.get("tenant_id", ""))
    role = str(payload.get("role", "member"))
    
    if not user_id or not tenant_id:
        raise HTTPException(status_code=401, detail="invalid token")
        
    access = build_token(user_id, tenant_id, role, "access", timedelta(minutes=15))
    refresh = build_token(user_id, tenant_id, role, "refresh", timedelta(days=7))
    return TokenPair(access_token=access, refresh_token=refresh)

# Add me endpoint here, but prefix is /api instead of /api/auth
user_router = APIRouter(prefix="/api", tags=["users"])

@user_router.get("/me")
async def get_me(authorization: str | None = Header(default=None), db: AsyncSession = Depends(get_db)):
    token = parse_bearer(authorization)
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="invalid token type")
        
    user_id = str(payload.get("user_id", ""))
    tenant_id = str(payload.get("tenant_id", ""))
    
    result = await db.execute(
        select(User).where(User.id == user_id, User.tenant_id == tenant_id)
    )
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
        
    return {
        "id": str(user.id),
        "tenant_id": str(user.tenant_id),
        "email": user.email,
        "role": user.role,
    }
