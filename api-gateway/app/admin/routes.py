import secrets
from typing import Any
from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func
from app.db import get_db
from app.models import Evaluation, RegistrationCode, User
from app.auth.dependencies import require_admin
from app.evaluations.routes import _row_to_evaluation

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/evaluations")
async def admin_list_evaluations(
    authorization: str | None = Header(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    admin_id, tenant_id = require_admin(authorization)

    count_result = await db.execute(select(func.count(Evaluation.id)).where(Evaluation.tenant_id == tenant_id))
    total = count_result.scalar()

    offset = (page - 1) * limit
    # We join with User to get seller_email and seller_role
    query = (
        select(Evaluation, User.email, User.role)
        .join(User, Evaluation.user_id == User.id)
        .where(Evaluation.tenant_id == tenant_id)
        .order_by(desc(Evaluation.created_at))
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(query)
    
    items = []
    for eval_obj, email, role in result.all():
        item = _row_to_evaluation(eval_obj)
        item["seller_email"] = email
        item["seller_role"] = role
        items.append(item)

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
    }

@router.post("/registration-codes")
async def generate_registration_code(authorization: str | None = Header(default=None), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    admin_id, tenant_id = require_admin(authorization)
    
    rand_part1 = "".join(secrets.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(4))
    rand_part2 = "".join(secrets.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(4))
    code = f"APEX-{rand_part1}-{rand_part2}"

    reg_code = RegistrationCode(
        code=code,
        tenant_id=tenant_id
    )
    db.add(reg_code)
    await db.commit()

    return {"code": code, "tenant_id": str(tenant_id)}

@router.get("/registration-codes")
async def list_registration_codes(authorization: str | None = Header(default=None), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    admin_id, tenant_id = require_admin(authorization)
    
    result = await db.execute(
        select(RegistrationCode).where(RegistrationCode.tenant_id == tenant_id).order_by(desc(RegistrationCode.created_at))
    )
    codes = result.scalars().all()
    
    items = []
    for c in codes:
        items.append({
            "code": c.code,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "used_at": c.used_at.isoformat() if c.used_at else None,
            "used_by_user_id": str(c.used_by_user_id) if c.used_by_user_id else None
        })
        
    return {"items": items}
