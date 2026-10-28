from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class Profile(BaseModel):
    id: str
    name: str
    preferences: List[str]
    profile_type: Optional[str] = None

class RecommendationRequest(BaseModel):
    user_id: str
    model: str = "LightGCN"
    top_k: int = Field(default=5, ge=1, le=20)

class RankedItem(BaseModel):
    id: str
    name: str
    score: float
    category: str
    style: Optional[str] = None
    price: Optional[float] = None
    raw_latent_score: Optional[float] = None
    attributes: Optional[Dict[str, str]] = None

class RecommendationResponse(BaseModel):
    user_id: str
    model: str
    mode: str = "LIVE_INFERENCE"
    dataset: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    items: List[RankedItem]

class GraphRAGQuery(BaseModel):
    query: str

class GraphRAGResponse(BaseModel):
    query: str
    answer: str
    mode: str = "SIMULATION"
    stages: Dict[str, dict]

class BenchmarkMetric(BaseModel):
    name: str
    type: str
    mode: str
    live: bool
    metrics: Dict[str, Any]
    latency_ms: float
    parameters: int
    provenance: Optional[str] = None
    note: Optional[str] = None

class BenchmarkResponse(BaseModel):
    metadata: Dict[str, Any]
    models: Dict[str, Any]

class PCAEmbeddingNode(BaseModel):
    id: str
    name: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    style: Optional[str] = None
    profile: Optional[str] = None
    price: Optional[float] = None
    x: float
    y: float
    type: str  # "user" or "item"

class PCAEmbeddingResponse(BaseModel):
    algorithm: str
    explained_variance_ratio: List[float]
    users: List[PCAEmbeddingNode]
    items: List[PCAEmbeddingNode]
