import uuid
import io
from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Header, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, func, text
from app.db import get_db
from app.models import Evaluation, Feature, CoachMessage
from app.auth.dependencies import require_user, parse_bearer, decode_token
from app.minio_utils import get_minio_client, get_minio_bucket, presigned_upload_url
import json
import os
import pika

def _publish_job_sync(routing_key: str, body: dict) -> None:
    """Publish a job message using a short-lived pika BlockingConnection (no global state)."""
    url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
    try:
        params = pika.URLParameters(url)
        conn = pika.BlockingConnection(params)
        ch = conn.channel()
        ch.queue_declare(queue=routing_key, durable=True)
        ch.basic_publish(
            exchange="",
            routing_key=routing_key,
            body=json.dumps(body).encode(),
            properties=pika.BasicProperties(delivery_mode=2),
        )
        conn.close()
    except Exception as exc:
        import logging
        logging.getLogger("jupiter.evaluations").error(f"[rabbitmq] publish_job_sync failed: {exc}")
from app.evaluations.schemas import CreateEvaluationRequest, EvaluationCreateResponse
from app.billing.evaluation import billing_enforced, MIN_AT_TO_START_EVALUATION

router = APIRouter(prefix="/api/evaluations", tags=["evaluations"])

async def async_precheck_evaluation_balance(db: AsyncSession, tenant_id: str) -> None:
    if not billing_enforced():
        return
    # Check if there is enough AT in wallet
    result = await db.execute(
        text("SELECT balance FROM wallets WHERE tenant_id = :tenant_id FOR UPDATE"),
        {"tenant_id": tenant_id}
    )
    wallet = result.fetchone()
    if not wallet or wallet[0] < MIN_AT_TO_START_EVALUATION:
        raise HTTPException(
            status_code=402,
            detail={
                "detail": "insufficient_at_balance",
                "needed": MIN_AT_TO_START_EVALUATION,
                "available": wallet[0] if wallet else 0,
            }
        )

def _row_to_evaluation(eval_obj: Evaluation) -> dict[str, Any]:
    return {
        "id": str(eval_obj.id),
        "tenant_id": str(eval_obj.tenant_id),
        "user_id": str(eval_obj.user_id),
        "title": eval_obj.title,
        "video_key": eval_obj.video_key,
        "status": eval_obj.status,
        "score": eval_obj.score * 100.0 if eval_obj.score is not None and eval_obj.score <= 1.0 else eval_obj.score,
        "features": eval_obj.features,
        "created_at": eval_obj.created_at.isoformat() if hasattr(eval_obj.created_at, "isoformat") else str(eval_obj.created_at),
        "updated_at": eval_obj.updated_at.isoformat() if hasattr(eval_obj.updated_at, "isoformat") else str(eval_obj.updated_at),
    }

@router.post("", status_code=201)
async def create_evaluation(
    req: CreateEvaluationRequest,
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    user_id, tenant_id = require_user(authorization)
    eval_id = uuid.uuid4()
    video_key = f"{tenant_id}/{eval_id}/original.mp4"
    
    new_eval = Evaluation(
        id=eval_id,
        tenant_id=tenant_id,
        user_id=user_id,
        title=req.title,
        video_key=video_key,
        status="pending",
        context_id=req.context_id,
        difficulty=req.difficulty or "neutral"
    )
    db.add(new_eval)
    await db.commit()
    await db.refresh(new_eval)
    
    upload_url = presigned_upload_url(video_key)
    return {
        "evaluation": _row_to_evaluation(new_eval),
        "upload_url": upload_url,
        "expires_in_sec": 900,
    }

@router.put("/{evaluation_id}/upload")
async def upload_video(
    evaluation_id: str,
    request: Request,
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    require_user(authorization)
    
    result = await db.execute(select(Evaluation).where(Evaluation.id == evaluation_id))
    eval_obj = result.scalars().first()
    
    if not eval_obj:
        raise HTTPException(status_code=404, detail="evaluation not found")
        
    video_key = eval_obj.video_key or f"{eval_obj.tenant_id}/{evaluation_id}/original.mp4"
    body = await request.body()
    
    try:
        client = get_minio_client()
        client.put_object(
            get_minio_bucket(),
            video_key,
            data=io.BytesIO(body),
            length=len(body),
            content_type=request.headers.get("content-type", "video/webm"),
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"storage write failed: {exc}")
        
    eval_obj.status = "uploading"
    eval_obj.video_key = video_key
    eval_obj.updated_at = datetime.now(timezone.utc)
    await db.commit()
    
    return {"status": "uploaded", "evaluation_id": evaluation_id}

@router.post("/{evaluation_id}/complete", status_code=202)
async def complete_evaluation(
    evaluation_id: str,
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    from sqlalchemy import text
    user_id, tenant_id = require_user(authorization)
    
    await async_precheck_evaluation_balance(db, tenant_id)
    
    # Retrieve evaluation with FOR UPDATE
    result = await db.execute(
        select(Evaluation).where(Evaluation.id == evaluation_id).with_for_update()
    )
    eval_obj = result.scalars().first()
    
    if not eval_obj:
        raise HTTPException(status_code=404, detail="evaluation not found")
    if eval_obj.status not in ("pending", "uploading"):
        raise HTTPException(status_code=400, detail="evaluation already in progress or completed")
        
    eval_obj.status = "processing"
    eval_obj.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(eval_obj)
    
    video_url = f"s3://{get_minio_bucket()}/{tenant_id}/{evaluation_id}/original.mp4"
    
    # Publish to the 3 workers. Fan-in logic will publish to scoring.jobs later.
    import asyncio
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _publish_job_sync, "pose.jobs", {
        "job_id": f"{evaluation_id}-pose",
        "evaluation_id": evaluation_id,
        "tenant_id": tenant_id,
        "video_url": video_url,
    })
    await loop.run_in_executor(None, _publish_job_sync, "whisper.jobs", {
        "job_id": f"{evaluation_id}-whisper",
        "evaluation_id": evaluation_id,
        "tenant_id": tenant_id,
        "video_url": video_url,
    })
    await loop.run_in_executor(None, _publish_job_sync, "prosody.jobs", {
        "job_id": f"{evaluation_id}-prosody",
        "evaluation_id": evaluation_id,
        "tenant_id": tenant_id,
        "video_url": video_url,
    })
    
    return _row_to_evaluation(eval_obj)

@router.get("/{evaluation_id}")
async def get_evaluation(
    evaluation_id: str,
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    require_user(authorization)
    
    result = await db.execute(select(Evaluation).where(Evaluation.id == evaluation_id))
    eval_obj = result.scalars().first()
    
    if not eval_obj:
        raise HTTPException(status_code=404, detail="evaluation not found")
    return _row_to_evaluation(eval_obj)

@router.get("")
async def list_evaluations(
    authorization: str | None = Header(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    user_id, _tenant_id = require_user(authorization)
    
    count_result = await db.execute(select(func.count(Evaluation.id)).where(Evaluation.user_id == user_id))
    total = count_result.scalar()
    
    offset = (page - 1) * limit
    eval_result = await db.execute(
        select(Evaluation).where(Evaluation.user_id == user_id).order_by(Evaluation.created_at.desc()).offset(offset).limit(limit)
    )
    items = eval_result.scalars().all()
    
    return {
        "data": [_row_to_evaluation(e) for e in items],
        "total": total,
        "page": page,
        "limit": limit,
    }
