import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_system_status():
    response = client.get("/api/system-status")
    assert response.status_code == 200
    data = response.json()
    assert "active_jobs" in data

def test_jobs_active():
    response = client.get("/api/jobs/active")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_jobs_recent():
    response = client.get("/api/jobs/recent")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_spiders():
    response = client.get("/api/spiders")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_jobs():
    response = client.get("/api/jobs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
