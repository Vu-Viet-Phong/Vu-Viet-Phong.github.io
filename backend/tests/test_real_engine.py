import pytest
from app.services.real_engine import MatrixFactorizationEngine, SAMPLE_USERS, SAMPLE_ITEMS
from fastapi.testclient import TestClient
from app.main import app
from app.ml.dataset import AmazonClothingBenchmark, compute_ranking_metrics

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

def test_api_gnn_honesty_labels():
    # LightGCN is live with PyTorch weights
    res_live = client.post("/api/recommendations", json={"user_id": "u1", "model": "LightGCN", "top_k": 3})
    assert res_live.status_code == 200
    assert res_live.json()["mode"] == "LIVE_INFERENCE"

    # NGCF remains in simulation mode
    res_sim = client.post("/api/recommendations", json={"user_id": "u1", "model": "NGCF", "top_k": 3})
    assert res_sim.status_code == 200
    assert res_sim.json()["mode"] == "SIMULATION"

def test_api_input_validation():
    # Invalid top_k (0)
    res = client.post("/api/recommendations", json={"user_id": "u1", "model": "MF", "top_k": 0})
    assert res.status_code == 422
    
    # Invalid top_k (25 > 20)
    res = client.post("/api/recommendations", json={"user_id": "u1", "model": "MF", "top_k": 25})
    assert res.status_code == 422

def test_dataset_leak_free_split():
    benchmark = AmazonClothingBenchmark(random_seed=42)
    train_set = set(benchmark.train_interactions)
    test_set = set(benchmark.test_interactions)
    val_set = set(benchmark.val_interactions)
    
    # Assert zero overlap (strict leakage prevention)
    assert len(train_set.intersection(test_set)) == 0
    assert len(train_set.intersection(val_set)) == 0
    assert len(val_set.intersection(test_set)) == 0

def test_amazon_ingestion_pipeline_authenticity():
    from app.ml.amazon_ingest import AmazonClothingIngestionPipeline
    pipeline = AmazonClothingIngestionPipeline()
    res = pipeline.run_pipeline()
    assert res["provenance"]["raw_sha256"] != ""
    assert res["provenance"]["leak_free_verified"] is True
    assert res["statistics"]["total_interactions"] == 81
    assert res["statistics"]["num_users"] == 16
    assert res["statistics"]["num_items"] == 20

def test_inference_score_and_dot_product_consistency():
    """Verify that live backend inference exactly matches precomputed checkpoint rankings down to < 1e-4."""
    import json
    import os
    res = client.post("/api/recommendations", json={"user_id": "usr_00", "model": "LightGCN", "top_k": 5})
    assert res.status_code == 200
    live_data = res.json()
    assert live_data["mode"] == "LIVE_INFERENCE"

    pca_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "ml", "checkpoints", "embeddings_pca.json")
    assert os.path.exists(pca_path)
    with open(pca_path, "r", encoding="utf-8") as f:
        pca_data = json.load(f)

    precomp = pca_data["precomputed_16d_rankings"]["usr_00"][:5]
    for i in range(5):
        live_item = live_data["items"][i]
        precomp_item = precomp[i]
        assert live_item["id"] == precomp_item["id"], f"Rank mismatch at #{i+1}"
        assert abs(live_item["score"] - precomp_item["score"]) < 1e-4, f"Score mismatch: {live_item['score']} vs {precomp_item['score']}"
        assert abs(live_item["latent_dot_product"] - precomp_item["latent_dot_product"]) < 1e-4, f"Dot mismatch: {live_item['latent_dot_product']} vs {precomp_item['latent_dot_product']}"

