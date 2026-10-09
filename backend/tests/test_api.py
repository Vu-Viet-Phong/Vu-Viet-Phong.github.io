from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "vuanalytics-backend"}

def test_get_models():
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert "MF" in data["models"]

def test_get_recommendations():
    payload = {
        "user_id": "u1",
        "model": "LightGCN",
        "top_k": 3
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "DEMO MODE"
    assert len(data["items"]) == 3
    assert data["items"][0]["score"] > 0

def test_graphrag_query():
    payload = {"query": "Find elegant evening gown"}
    response = client.post("/api/graphrag/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Query" in data["stages"]
