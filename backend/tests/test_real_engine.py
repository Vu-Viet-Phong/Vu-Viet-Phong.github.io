import pytest
from app.services.real_engine import MatrixFactorizationEngine, SAMPLE_USERS, SAMPLE_ITEMS
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_engine_svd_latent_factors():
    engine = MatrixFactorizationEngine(rank=4)
    assert engine.user_factors.shape == (len(SAMPLE_USERS), 4)
    assert engine.item_factors.shape == (len(SAMPLE_ITEMS), 4)
    assert engine.reconstructed_matrix.shape == (len(SAMPLE_USERS), len(SAMPLE_ITEMS))

def test_engine_recommendation_sorting():
    engine = MatrixFactorizationEngine(rank=4)
    res = engine.recommend(user_id="u1", top_k=5)
    assert res["is_real_inference"] is True
    assert res["engine"] == "MatrixFactorizationEngine"
    assert len(res["items"]) == 5
    
    # Assert strictly descending score order
    scores = [item["score"] for item in res["items"]]
    assert scores == sorted(scores, reverse=True)
    for s in scores:
        assert 0.0 <= s <= 1.0

def test_engine_cold_start():
    engine = MatrixFactorizationEngine(rank=4)
    res = engine.recommend(user_id="unknown_user_999", top_k=4)
    assert res["is_cold_start"] is True
    assert len(res["items"]) == 4

def test_api_mf_real_inference():
    payload = {"user_id": "u1", "model": "MF", "top_k": 3}
    res = client.post("/api/recommendations", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["mode"] == "SAMPLE_SVD_INFERENCE"
    assert data["model"] == "MF"
    assert len(data["items"]) == 3

def test_engine_transparency_metrics():
    engine = MatrixFactorizationEngine(rank=4)
    res = engine.recommend(user_id="u1", top_k=5)
    assert res["is_sample_slice"] is True
    assert "disclaimer" in res["dataset_info"]
    assert "explained_variance_ratio" in res["mathematical_metrics"]
    assert res["mathematical_metrics"]["explained_variance_ratio"] > 0.5

def test_api_gnn_simulation_honesty():
    payload = {"user_id": "u1", "model": "LightGCN", "top_k": 3}
    res = client.post("/api/recommendations", json=payload)
    assert res.status_code == 200
    data = res.json()
    # GNN must be labeled as SIMULATION until checkpoints are present
    assert data["mode"] == "SIMULATION"

def test_api_input_validation():
    # Invalid top_k (0)
    res = client.post("/api/recommendations", json={"user_id": "u1", "model": "MF", "top_k": 0})
    assert res.status_code == 422
    
    # Invalid top_k (25 > 20)
    res = client.post("/api/recommendations", json={"user_id": "u1", "model": "MF", "top_k": 25})
    assert res.status_code == 422
