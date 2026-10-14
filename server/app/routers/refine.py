from typing import Optional
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings
from app.services.parse_plan_response import parse_and_validate
from app.services.refine_prompt import build_refine_prompt, build_action_prompt

router = APIRouter()


class RefineRequest(BaseModel):
    plan: dict
    instruction: str


class RefineActionRequest(BaseModel):
    plan: dict
    action: str


async def _run(prompt: str) -> dict:
    from app.services.gemini_client import GeminiClient

    try:
        raw = await asyncio.wait_for(
            GeminiClient().refine_plan(prompt),
            timeout=settings.GENERATION_TIMEOUT_SECONDS,
        )
        plan = await parse_and_validate(raw)
        return plan.model_dump()
    except (asyncio.TimeoutError, TimeoutError):
        raise HTTPException(
            status_code=504,
            detail=f"Refinement timed out after {settings.GENERATION_TIMEOUT_SECONDS}s. Please retry.",
        )
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {e}")


@router.post("/refine")
async def refine(request: RefineRequest):
    return await _run(build_refine_prompt(request.plan, request.instruction))


@router.post("/refine-action")
async def refine_action(request: RefineActionRequest):
    return await _run(build_action_prompt(request.plan, request.action))