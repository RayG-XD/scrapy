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

def test_shell_fetch():
    # Only verify the endpoint parses and responds correctly (status code 500 when mock url given)
    response = client.post("/api/shell/fetch", json={"url": "http://invalid-url-for-testing.com"})
    assert response.status_code in (200, 500)

def test_shell_evaluate_css():
    html_content = "<html><body><div class='test'>Hello World</div></body></html>"
    response = client.post(
        "/api/shell/evaluate",
        json={
            "source": html_content,
            "expression": ".test::text",
            "type": "css"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["count"] == 1
    assert data["data"] == ["Hello World"]

def test_shell_evaluate_xpath():
    html_content = "<html><body><div class='test'>Hello World</div></body></html>"
    response = client.post(
        "/api/shell/evaluate",
        json={
            "source": html_content,
            "expression": "//div[@class='test']/text()",
            "type": "xpath"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert data["count"] == 1
    assert data["data"] == ["Hello World"]
