import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.parse_plan_response import parse_and_validate
from app.services.refine_prompt import build_refine_prompt

router = APIRouter()


class RefineRequest(BaseModel):
    plan: dict
    instruction: str


@router.post("/refine")
async def refine(request: RefineRequest):
    try:
        from app.services.gemini_client import GeminiClient
        prompt = build_refine_prompt(request.plan, request.instruction)
        client = GeminiClient()
        raw = await client.refine_plan(prompt)
        updated = await parse_and_validate(raw)
        return updated.model_dump()
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {str(e)}")