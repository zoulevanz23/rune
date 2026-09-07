import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.parse_plan_response import parse_and_validate
from app.services.generate_prompt import build_scrum_prompt, build_kanban_prompt
from app.types import GenerationConfig

router = APIRouter()


class GenerateRequest(BaseModel):
    description: str
    methodology: str = "scrum"
    sprint_count: int = 3
    sprint_length: str = "2 weeks"
    scope_mode: str = "MVP"
    team_velocity: int = None
    num_columns: int = 4


@router.post("/generate")
async def generate(config: GenerateRequest):
    try:
        gc = GenerationConfig(**config.model_dump())
        if gc.methodology == "kanban":
            prompt = build_kanban_prompt(gc)
        else:
            prompt = build_scrum_prompt(gc)
        from app.services.gemini_client import GeminiClient
        client = GeminiClient()
        raw = await client.generate_plan(prompt)
        plan = await parse_and_validate(raw)
        # clean project_name: strip markdown, collapse whitespace, word-boundary truncate
        name = config.description.replace('\r',' ').replace('\n',' ').strip()
        name = name.replace('**','').replace('__', '').strip()
        name = ' '.join(name.split())
        if len(name) > 80:
            cut = name[:80]
            if ' ' in cut:
                cut = cut.rsplit(' ', 1)[0]
            name = cut + '…'
        plan.project_name = name or plan.project_name
        return plan.model_dump()
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")