from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "vuanalytics-backend"
    assert data["version"] == "4.0.0"

def test_get_models():
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert "LightGCN" in data["models"]
    assert "MF" in data["models"]
    assert "NGCF" in data["models"]
    assert data["live"] is True

def test_get_model_status():
    response = client.get("/api/models/status")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "vuanalytics-backend"
    assert "LightGCN" in data["models"]
    assert data["models"]["LightGCN"]["checkpoint_loaded"] is True
    assert data["dataset"]["users"] == 16
    assert data["dataset"]["items"] == 20

def test_get_benchmarks():
    response = client.get("/api/benchmarks")
    assert response.status_code == 200
    data = response.json()
    assert "metadata" in data
    assert "empirical_models" in data
    assert "theoretical_simulations" in data
    assert "LightGCN" in data["empirical_models"]
    assert data["empirical_models"]["LightGCN"]["metrics"]["recall@10"] > 0
    assert data["empirical_models"]["LightGCN"]["metrics"]["ndcg@10"] > 0
    assert data["metadata"]["checkpoint_sha256"] != ""

def test_get_embeddings_pca():
    response = client.get("/api/embeddings/pca")
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert "items" in data
    assert len(data["users"]) == 16
    assert len(data["items"]) == 20
    assert "x" in data["users"][0] and "y" in data["users"][0]

def test_get_profiles():
    response = client.get("/api/recommendation/profiles")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 16
    assert data[0]["id"] == "usr_00"

def test_get_recommendations_lightgcn_live():
    payload = {
        "user_id": "usr_00",
        "model": "LightGCN",
        "top_k": 5
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "LIVE_INFERENCE"
    assert len(data["items"]) == 5
    # Strict descending score check
    scores = [item["score"] for item in data["items"]]
    assert scores == sorted(scores, reverse=True)

def test_get_recommendations_simulation_fallback():
    payload = {
        "user_id": "usr_00",
        "model": "NGCF",
        "top_k": 3
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "SIMULATION"
    assert len(data["items"]) == 3

def test_graphrag_query():
    payload = {"query": "Find elegant evening gown"}
    response = client.post("/api/graphrag/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Query" in data["stages"]
    assert data["mode"] == "SIMULATION"

def test_rate_limiter_and_process_time_header():
    response = client.get("/health")
    assert response.status_code == 200
    assert "x-process-time" in response.headers
    assert response.headers["x-api-version"] == "4.0.0"
