# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import Any

class CreateEvaluationRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    context_id: str | None = None
    difficulty: str | None = Field(default=None, pattern=r"^(accesible|neutral|exigente)$")

class EvaluationCreateResponse(BaseModel):
    evaluation: dict[str, Any]
    upload_url: str
    expires_in_sec: int = 900
