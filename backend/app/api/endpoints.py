from fastapi import APIRouter
from app.schemas.schemas import RecommendationRequest, RecommendationResponse, GraphRAGQuery, GraphRAGResponse, Profile
from app.services.inference import MMRecAdapter

router = APIRouter()
mmrec_adapter = MMRecAdapter(use_mock=True)

@router.get("/models")
def get_models():
    return {
        "models": ["MF", "NGCF", "LightGCN", "VBPR"],
        "status": "Simulation Mode (Real checkpoints missing)"
    }

@router.get("/recommendation/profiles", response_model=list[Profile])
def get_profiles():
    return [
        Profile(id="u1", name="Casual User", preferences=["Cotton", "Daywear", "Bright"]),
        Profile(id="u2", name="Formal User", preferences=["Silk", "Evening", "Neutral"]),
    ]

@router.post("/recommendations", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    items = mmrec_adapter.get_recommendations(req.user_id, req.model, req.top_k)
    return RecommendationResponse(
        user_id=req.user_id,
        model=req.model,
        mode="DEMO MODE",
        items=items
    )

@router.post("/graphrag/query", response_model=GraphRAGResponse)
def run_graphrag(req: GraphRAGQuery):
    # Deterministic mock response mapping
    return GraphRAGResponse(
        query=req.query,
        answer="This is a deterministic GraphRAG response. Real LLM backend not connected.",
        mode="DEMO MODE",
        stages={
            "Query": {"status": "Extracted intents"},
            "Vector": {"status": "Mocked vectors"},
        }
    )

@router.get("/system/status")
def system_status():
    return {
        "backend": "online",
        "mmrec_inference": "simulation",
        "graphrag_engine": "simulation"
    }
