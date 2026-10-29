from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from . import service
from .config import get_settings
from .db import get_db
from .schemas import ProjectCreate, ProjectOut, ProjectUpdate

DbSession = Annotated[Session, Depends(get_db)]

app = FastAPI(title="Nocturne API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in get_settings().cors_origins.split(",") if o.strip()],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health(db: DbSession) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "ok"}


@app.get("/projects", response_model=list[ProjectOut])
def list_projects(db: DbSession):
    return service.list_projects(db)


@app.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(data: ProjectCreate, db: DbSession):
    return service.create_project(db, data)


@app.patch("/projects/{pid}", response_model=ProjectOut)
def update_project(pid: str, data: ProjectUpdate, db: DbSession):
    out = service.update_project(db, pid, data)
    if out is None:
        raise HTTPException(404, "Projet introuvable")
    return out


@app.delete("/projects/{pid}", status_code=204)
def delete_project(pid: str, db: DbSession):
    if not service.delete_project(db, pid):
        raise HTTPException(404, "Projet introuvable")
    return Response(status_code=204)
