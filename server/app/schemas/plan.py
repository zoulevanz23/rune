from pydantic import BaseModel, Field
from typing import Optional


class Epic(BaseModel):
    id: str
    name: str
    risk: Optional[str] = None
    definition_of_done: Optional[list[str]] = Field(default_factory=list)


class Story(BaseModel):
    id: str
    epic_id: str
    title: str
    criteria: list[str] = Field(default_factory=list)
    points: Optional[int] = None
    priority: str = "Medium"
    depends_on: Optional[list[str]] = Field(default_factory=list)
    done: bool = False


class SprintGroup(BaseModel):
    type: str = "sprint"
    number: int
    name: str
    goal: str
    stories: list[Story] = Field(default_factory=list)


class ColumnGroup(BaseModel):
    type: str = "column"
    name: str
    wip_limit: Optional[int] = None
    stories: list[Story] = Field(default_factory=list)


Group = SprintGroup | ColumnGroup


class Plan(BaseModel):
    project_name: str = ""
    methodology: str = "scrum"
    epics: list[Epic] = Field(default_factory=list)
    groups: list[Group] = Field(default_factory=list)
