from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
VALID = {"name": "Test pytest", "client": "QA", "type": "Web", "budget": 1200, "dueDate": "2026-12-01"}


def test_health():
    assert client.get("/health").json() == {"status": "ok", "database": "ok"}


def test_crud_roundtrip():
    r = client.post("/projects", json=VALID)
    assert r.status_code == 201
    p = r.json()
    assert p["status"] == "Planifie" and p["progress"] == 0
    assert any(x["id"] == p["id"] for x in client.get("/projects").json())

    r = client.patch(f"/projects/{p['id']}", json={"progress": 90, "status": "Revue"})
    assert r.status_code == 200 and r.json()["progress"] == 90

    assert client.delete(f"/projects/{p['id']}").status_code == 204
    assert client.delete(f"/projects/{p['id']}").status_code == 404


def test_validation_errors():
    assert client.post("/projects", json={**VALID, "budget": 100}).status_code == 422
    assert client.post("/projects", json={**VALID, "type": "Autre"}).status_code == 422
    assert client.post("/projects", json={**VALID, "name": "  a "}).status_code == 422
    assert client.patch("/projects/inconnu", json={"progress": 10}).status_code == 404
    assert client.patch("/projects/p1", json={"progress": 150}).status_code == 422
