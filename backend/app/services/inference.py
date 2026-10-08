import random
from typing import List
from app.schemas.schemas import RankedItem

class MMRecAdapter:
    def __init__(self, use_mock: bool = True):
        self.use_mock = use_mock
        # Real model loaded here if available
        # self.model = torch.load('model.pt') if not use_mock else None
    
    def get_recommendations(self, user_id: str, model_name: str, top_k: int) -> List[RankedItem]:
        if self.use_mock:
            return self._mock_inference(user_id, model_name, top_k)
        else:
            raise NotImplementedError("Real model artifacts not found. Missing: checkpoint.pt, user_mapping.json")

    def _mock_inference(self, user_id: str, model_name: str, top_k: int) -> List[RankedItem]:
        # Deterministic generation based on user and model to simulate consistent rankings
        seed = hash(user_id + model_name) % 10000
        random.seed(seed)
        
        items = []
        categories = ['Apparel', 'Footwear', 'Accessories']
        base_score = 0.95
        
        for i in range(top_k):
            score = round(base_score - (i * 0.04) - (random.random() * 0.02), 4)
            items.append(RankedItem(
                id=f"item_{random.randint(1000, 9999)}",
                name=f"Synthetic {model_name} Product {i+1}",
                score=score,
                category=categories[i % len(categories)]
            ))
        return items
