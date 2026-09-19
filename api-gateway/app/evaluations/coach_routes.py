import os
import json
import httpx
import base64
import re
from datetime import datetime, timezone
from typing import Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.db import get_db
from app.models import Evaluation, CoachMessage, Feature
from app.auth.dependencies import parse_user_id_from_auth

router = APIRouter(prefix="/api/evaluations", tags=["coach"])

class CoachChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=3000)

class CoachChatResponse(BaseModel):
    reply: str
    audio_base64_mp3: str | None = None
    transcript: str | None = None

COACH_SYSTEM_PROMPT = """You are Apex Voice Coach, an executive bilingual (Spanish/English) sales coach.
Default language is Spanish unless the user asks otherwise.

Your tasks:
1) FIRST: read the "transcript" field in the evaluation context — this is exactly what the user said. 
2) Analyze what they said: structure, clarity, persuasiveness, and delivery.
3) Write a CORRECTED version of their pitch that fixes the problems you identified. 
   The corrected_pitch MUST be a rewritten, improved version of their original words — NOT a generic template.
   Keep their core message but make it sharper, more confident and persuasive.
4) Provide 3-6 concrete coaching points based on their actual transcript.

CRITICAL RULES:
- NEVER say the presenter didn't speak if there IS a transcript. Always work with what they said.
- The corrected_pitch must sound like an improved version of THEIR pitch, not a completely different one.
- If the transcript is very short or empty, acknowledge it and give general advice for a first pitch.

Output format (always):
analysis:
<short diagnosis referencing what they actually said>

original_transcript:
<repeat the transcript you analyzed>

corrected_pitch:
<rewritten, improved pitch based on their words — ready to say out loud>

coaching_points:
- <3-6 concrete, specific actions addressing weaknesses in their actual transcript>
"""

async def call_deepseek(history: list[dict[str, str]], user_message: str, context_payload: dict[str, Any], transcript: str = "") -> str:
    key = os.getenv("DEEPSEEK_API_KEY", "").strip()
    if not key:
        raise HTTPException(status_code=424, detail="Missing DEEPSEEK_API_KEY")

    messages = [{"role": "system", "content": COACH_SYSTEM_PROMPT}]
    messages.append({"role": "system", "content": "Evaluation context JSON:\n" + json.dumps(context_payload, ensure_ascii=False)})
    messages.extend(history)

    enriched_message = user_message
    if transcript:
        enriched_message = f'ORIGINAL TRANSCRIPT (exact words the user said):\n"""\n{transcript}\n"""\n\nUSER MESSAGE: {user_message}'

    messages.append({
        "role": "user",
        "content": enriched_message + "\n\nRemember: return analysis, original_transcript, corrected_pitch and coaching_points. Keep it actionable and concise."
    })

    payload = {"model": "deepseek-chat", "messages": messages, "temperature": 0.6, "max_tokens": 1200}
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            "https://api.deepseek.com/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json=payload,
        )
    if resp.status_code >= 300:
        raise HTTPException(status_code=502, detail=f"DeepSeek error: {resp.status_code}")
    data = resp.json()
    try:
        reply = data["choices"][0]["message"]["content"].strip()
    except Exception:
        raise HTTPException(status_code=502, detail="DeepSeek response parse error")
    if not reply:
        raise HTTPException(status_code=502, detail="DeepSeek returned empty response")
    return reply

def extract_corrected_pitch(reply: str) -> str:
    m = re.search(r"corrected_pitch\s*:\s*(.*?)(?:\n\s*coaching_points\s*:|\Z)", reply, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return reply
    return m.group(1).strip() or reply

async def synthesize_elevenlabs(text: str) -> str | None:
    key = os.getenv("ELEVENLABS_API_KEY", "").strip()
    if not key:
        return None

    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL").strip()
    model_id = os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2").strip()
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.75, "style": 0.2, "use_speaker_boost": True},
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
                json=payload,
            )
        if resp.status_code >= 300:
            return None
        return base64.b64encode(resp.content).decode("utf-8")
    except Exception:
        return None

async def fetch_evaluation_context(db: AsyncSession, evaluation_id: str) -> dict[str, Any] | None:
    result = await db.execute(select(Evaluation).where(Evaluation.id == evaluation_id))
    eval_obj = result.scalars().first()
    if not eval_obj:
        return None

    feat_result = await db.execute(
        select(Feature.payload).where(Feature.evaluation_id == evaluation_id, Feature.kind == "transcript")
    )
    transcript_payload = feat_result.scalars().first()
    transcript_text = transcript_payload.get("text", "") if transcript_payload else ""

    return {
        "evaluation_id": str(eval_obj.id),
        "tenant_id": str(eval_obj.tenant_id),
        "title": eval_obj.title,
        "status": eval_obj.status,
        "video_key": eval_obj.video_key,
        "score": eval_obj.score * 100.0 if eval_obj.score is not None and eval_obj.score <= 1 else eval_obj.score,
        "features": eval_obj.features or {},
        "transcript": transcript_text,
    }

async def load_history(db: AsyncSession, evaluation_id: str, user_id: str | None, limit: int = 12) -> list[dict[str, str]]:
    query = select(CoachMessage).where(CoachMessage.evaluation_id == evaluation_id)
    if user_id:
        query = query.where(CoachMessage.user_id == user_id)
    query = query.order_by(desc(CoachMessage.created_at)).limit(limit)
    result = await db.execute(query)
    messages = result.scalars().all()
    
    rows = [{"role": m.role, "content": m.content} for m in messages]
    rows.reverse()
    return rows

async def save_message(db: AsyncSession, evaluation_id: str, user_id: str | None, role: str, content: str) -> None:
    import uuid
    msg = CoachMessage(
        id=uuid.uuid4(),
        evaluation_id=evaluation_id,
        user_id=user_id,
        role=role,
        content=content
    )
    db.add(msg)
    await db.commit()

@router.post("/{evaluation_id}/coach/chat", response_model=CoachChatResponse)
async def coach_chat(evaluation_id: str, req: CoachChatRequest, authorization: str | None = Header(default=None), db: AsyncSession = Depends(get_db)) -> CoachChatResponse:
    user_id = parse_user_id_from_auth(authorization)
    
    context_payload = await fetch_evaluation_context(db, evaluation_id)
    if not context_payload:
        raise HTTPException(status_code=404, detail="evaluation not found")
        
    history = await load_history(db, evaluation_id, user_id, limit=12)
    await save_message(db, evaluation_id, user_id, "user", req.message)

    reply = await call_deepseek(history, req.message, context_payload, context_payload.get("transcript", ""))
    await save_message(db, evaluation_id, user_id, "assistant", reply)

    corrected_pitch = extract_corrected_pitch(reply)
    audio_b64 = await synthesize_elevenlabs(corrected_pitch)
    transcript = context_payload.get("transcript", "")
    
    return CoachChatResponse(reply=reply, audio_base64_mp3=audio_b64, transcript=transcript if transcript else None)

@router.get("/{evaluation_id}/coach/history")
async def coach_history(evaluation_id: str, authorization: str | None = Header(default=None), db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    user_id = parse_user_id_from_auth(authorization)
    
    context_payload = await fetch_evaluation_context(db, evaluation_id)
    if not context_payload:
        raise HTTPException(status_code=404, detail="evaluation not found")
        
    messages = await load_history(db, evaluation_id, user_id, limit=30)
    
    return {
        "evaluation_id": evaluation_id,
        "messages": messages,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
    }
