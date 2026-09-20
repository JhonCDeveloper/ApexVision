"""Streaming LLM for the live agent.

Uses OpenAI (gpt-4o-mini) as the LLM provider.
"""

from __future__ import annotations

import json
import logging
import os
from typing import AsyncIterator

import httpx

logger = logging.getLogger("jupiter.gateway.live.llm")

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODEL = os.getenv("LIVE_LLM_MODEL", "gpt-4o-mini")

async def _stream_openai_compatible(
    *,
    provider: str,
    url: str,
    key: str,
    model: str,
    messages: list[dict[str, str]],
) -> AsyncIterator[str]:
    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": 220,
        "stream": True,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream(
                "POST",
                url,
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json=payload,
            ) as resp:
                if resp.status_code >= 300:
                    body = await resp.aread()
                    logger.warning("%s stream failed: status=%s body=%s", provider, resp.status_code, body[:200])
                    return
                async for line in resp.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        break
                    try:
                        chunk = json.loads(data)
                        delta = chunk["choices"][0]["delta"].get("content")
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue
                    if delta:
                        yield delta
    except Exception as exc:  # pragma: no cover
        logger.warning("%s stream error: %s", provider, exc)
        return

async def stream_reply(
    system_prompt: str,
    history: list[dict[str, str]],
) -> AsyncIterator[str]:
    """Yield response token deltas using OpenAI."""
    messages = [{"role": "system", "content": system_prompt}, *history]
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    if not openai_key:
        logger.warning("No live LLM key configured; set OPENAI_API_KEY")
        return

    async for delta in _stream_openai_compatible(
        provider="OpenAI",
        url=OPENAI_URL,
        key=openai_key,
        model=OPENAI_MODEL,
        messages=messages,
    ):
        yield delta
