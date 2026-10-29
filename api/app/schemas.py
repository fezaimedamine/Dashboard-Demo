from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

ProjectType = Literal["Branding", "Video", "Campagne IA", "Web", "Social"]
ProjectStatus = Literal["En cours", "Revue", "Planifie", "Termine"]


class ProjectCreate(BaseModel):
    name: str = Field(min_length=3, max_length=60)
    client: str = Field(min_length=2, max_length=80)
    type: ProjectType
    budget: int = Field(ge=500, le=1_000_000)
    dueDate: date

    @field_validator("name", "client", mode="before")
    @classmethod
    def strip(cls, v: object) -> object:
        return v.strip() if isinstance(v, str) else v


class ProjectUpdate(BaseModel):
    progress: int | None = Field(default=None, ge=0, le=100)
    status: ProjectStatus | None = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    client: str
    type: ProjectType
    budget: int
    dueDate: date
    progress: int
    status: ProjectStatus
    team: list[str]
