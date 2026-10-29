import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Project
from .schemas import ProjectCreate, ProjectOut, ProjectUpdate


def to_out(p: Project) -> ProjectOut:
    return ProjectOut(id=p.id, name=p.name, client=p.client, type=p.type, budget=p.budget,
                      dueDate=p.due_date, progress=p.progress, status=p.status, team=list(p.team))


def list_projects(db: Session) -> list[ProjectOut]:
    rows = db.scalars(select(Project).order_by(Project.created_at.desc(), Project.id)).all()
    return [to_out(p) for p in rows]


def create_project(db: Session, data: ProjectCreate) -> ProjectOut:
    p = Project(id=f"p{uuid.uuid4().hex[:12]}", name=data.name, client=data.client, type=data.type,
                budget=data.budget, due_date=data.dueDate, progress=0, status="Planifie", team=["VO"])
    db.add(p)
    db.commit()
    db.refresh(p)
    return to_out(p)


def update_project(db: Session, pid: str, data: ProjectUpdate) -> ProjectOut | None:
    p = db.get(Project, pid)
    if p is None:
        return None
    if data.progress is not None:
        p.progress = data.progress
    if data.status is not None:
        p.status = data.status
    db.commit()
    return to_out(p)


def delete_project(db: Session, pid: str) -> bool:
    p = db.get(Project, pid)
    if p is None:
        return False
    db.delete(p)
    db.commit()
    return True
