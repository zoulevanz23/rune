from typing import Optional
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings
from app.services.parse_plan_response import parse_and_validate
from app.services.generate_prompt import build_prompt
from app.types import GenerationConfig

router = APIRouter()


class GenerateRequest(BaseModel):
    description: str
    methodology: Optional[str] = None
    sprint_count: Optional[int] = None
    sprint_length: Optional[str] = None
    scope_mode: Optional[str] = None
    team_velocity: Optional[int] = None
    num_columns: Optional[int] = None
    team_size: Optional[int] = None
    deadline: Optional[str] = None
    tech_stack: Optional[str] = None
    project_type: Optional[str] = None
    risk_tolerance: Optional[str] = None


@router.post("/generate")
async def generate(config: GenerateRequest):
    from app.services.gemini_client import GeminiClient

    try:
        gc = GenerationConfig(**config.model_dump())
        prompt = build_prompt(gc)
        raw = await asyncio.wait_for(
            GeminiClient().generate_plan(prompt),
            timeout=settings.GENERATION_TIMEOUT_SECONDS,
        )
        plan = await parse_and_validate(raw)
        return plan.model_dump()
    except (asyncio.TimeoutError, TimeoutError):
        raise HTTPException(
            status_code=504,
            detail=f"Generation timed out after {settings.GENERATION_TIMEOUT_SECONDS}s. Please retry.",
        )
    except ValueError as e:
        # Request was valid; the model's output was not usable.
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {e}")