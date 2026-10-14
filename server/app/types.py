from typing import Optional
from pydantic import BaseModel


class GenerationConfig(BaseModel):
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