from pydantic import BaseModel
from typing import List, Dict, Optional

class Profile(BaseModel):
    id: str
    name: str
    preferences: List[str]

class RecommendationRequest(BaseModel):
    user_id: str
    model: str
    top_k: int = 5

class RankedItem(BaseModel):
    id: str
    name: str
    score: float
    category: str
    attributes: Optional[Dict[str, str]] = None

class RecommendationResponse(BaseModel):
    user_id: str
    model: str
    mode: str = "DEMO MODE"
    items: List[RankedItem]

class GraphRAGQuery(BaseModel):
    query: str

class GraphRAGResponse(BaseModel):
    query: str
    answer: str
    mode: str = "DEMO MODE"
    stages: Dict[str, dict]
