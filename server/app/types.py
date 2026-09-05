from pydantic import BaseModel, Field
from typing import Optional


class GenerationConfig(BaseModel):
    description: str
    methodology: str = "scrum"
    sprint_count: int = 3
    sprint_length: str = "2 weeks"
    scope_mode: str = "MVP"
    team_velocity: Optional[int] = None
    num_columns: int = 4
