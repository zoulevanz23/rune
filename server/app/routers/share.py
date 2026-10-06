import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.plan import Plan

router = APIRouter()

_plans: dict[str, dict] = {}


class ShareRequest(BaseModel):
    plan: dict


@router.post("/share")
async def create_share(request: ShareRequest):
    try:
        plan = Plan(**request.plan)
        share_id = str(uuid.uuid4())[:8]
        _plans[share_id] = plan.model_dump()
        return {"share_id": share_id, "url": f"/share/{share_id}"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid plan: {str(e)}")


@router.get("/share/{share_id}")
async def get_share(share_id: str):
    if share_id not in _plans:
        raise HTTPException(status_code=404, detail="Shared plan not found")
    return _plans[share_id]
