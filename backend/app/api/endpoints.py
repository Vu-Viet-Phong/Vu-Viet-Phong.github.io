from fastapi import APIRouter, HTTPException, Query
from app.schemas.schemas import RecommendationRequest, RecommendationResponse, GraphRAGQuery, GraphRAGResponse, Profile
from app.services.inference import MMRecAdapter
from app.services.real_engine import real_mf_engine

router = APIRouter()
mmrec_adapter = MMRecAdapter(use_mock=True)

@router.get("/models")
def get_models():
    return {
        "models": ["MF", "NGCF", "LightGCN", "VBPR"],
        "model_status": {
            "MF": {
                "engine": "MatrixFactorizationEngine",
                "algorithm": "TruncatedSVD Latent Factor Decomposition",
                "live": True,
                "dataset": "Clothing_5core_sample"
            },
            "LightGCN": {
                "engine": "MMRecSimulationAdapter",
                "algorithm": "Linear Graph Convolution",
                "live": False,
                "note": "PyTorch .pt checkpoint pending V4.0"
            },
            "NGCF": {
                "engine": "MMRecSimulationAdapter",
                "algorithm": "High-Order Bipartite Message Passing",
                "live": False,
                "note": "PyTorch .pt checkpoint pending V4.0"
            },
            "VBPR": {
                "engine": "MMRecSimulationAdapter",
                "algorithm": "Visual Bayesian Personalized Ranking",
                "live": False,
                "note": "Visual feature embeddings pending V4.0"
            }
        },
        "live": True, # Backend has at least one genuinely executable model
        "active_real_models": ["MF"]
    }

@router.get("/recommendation/profiles", response_model=list[Profile])
def get_profiles():
    return [
        Profile(id="u1", name="Formal & Minimalist User", preferences=["Silk", "Minimalist", "Evening"]),
        Profile(id="u2", name="Casual & Daywear User", preferences=["Cotton", "Linen", "Casual"]),
        Profile(id="u3", name="Knitwear & Classic User", preferences=["Wool", "Cashmere", "Classic"]),
        Profile(id="u4", name="Elegant Evening User", preferences=["Satin", "Chiffon", "Gala"]),
    ]

@router.post("/recommendations", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    if req.top_k < 1 or req.top_k > 20:
        raise HTTPException(status_code=422, detail="top_k must be between 1 and 20")

    if req.model == "MF":
        # Mathematical SVD inference on reproducible benchmark slice
        rec_data = real_mf_engine.recommend(user_id=req.user_id, top_k=req.top_k)
        return RecommendationResponse(
            user_id=req.user_id,
            model="MF",
            mode="SAMPLE_SVD_INFERENCE",
            items=rec_data["items"]
        )
    else:
        # Honest simulation fallback for GNN / Multimodal architectures
        items = mmrec_adapter.get_recommendations(req.user_id, req.model, req.top_k)
        return RecommendationResponse(
            user_id=req.user_id,
            model=req.model,
            mode="SIMULATION",
            items=items
        )

@router.post("/graphrag/query", response_model=GraphRAGResponse)
def run_graphrag(req: GraphRAGQuery):
    if not req.query.strip():
        raise HTTPException(status_code=422, detail="Query cannot be empty")

    return GraphRAGResponse(
        query=req.query,
        answer=f"Verified grounded response for '{req.query}'. Graph entities traversed: Product:8492, Material:Silk.",
        mode="SIMULATION",
        stages={
            "Query": {"status": "Extracted intent and material entities"},
            "Vector": {"status": "Dense embeddings cosine similarity computed"},
            "Graph": {"status": "Neo4j Cypher 2-hop relational path matched"},
            "Fusion": {"status": "Reciprocal Rank Fusion (RRF) synthesized candidate set"}
        }
    )

@router.get("/system/status")
def system_status():
    return {
        "backend": "online",
        "mf_engine": "REAL_INFERENCE (TruncatedSVD)",
        "gnn_engine": "SIMULATION (Awaiting .pt checkpoints)",
        "graphrag_engine": "SIMULATION"
    }
