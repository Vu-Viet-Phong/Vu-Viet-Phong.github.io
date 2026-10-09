import random
from typing import List
from app.schemas.schemas import RankedItem

class MMRecAdapter:
    """
    Adapter for MMRec models.
    Requires the following artifacts per model if use_mock is False:
    - MF: 'backend/app/models/mf.pt'
    - NGCF: 'backend/app/models/ngcf.pt'
    - LightGCN: 'backend/app/models/lightgcn.pt'
    - VBPR: 'backend/app/models/vbpr.pt'
    - Mappings: 'backend/app/models/user_mapping.json', 'backend/app/models/item_mapping.json'
    """
    def __init__(self, use_mock: bool = True):
        self.use_mock = use_mock
        if not use_mock:
            self._validate_artifacts()
    
    def _validate_artifacts(self):
        # In a real environment, this checks os.path.exists() for the .pt files
        # Since they are missing, we raise an explicit error.
        raise FileNotFoundError("Missing required artifacts in backend/app/models/: [mf.pt, ngcf.pt, lightgcn.pt, vbpr.pt, user_mapping.json, item_mapping.json]")

    def get_recommendations(self, user_id: str, model_name: str, top_k: int) -> List[RankedItem]:
        if self.use_mock:
            return self._mock_inference(user_id, model_name, top_k)
        
        # Real inference routing
        if model_name == "MF":
            return self._infer_mf(user_id, top_k)
        elif model_name == "NGCF":
            return self._infer_ngcf(user_id, top_k)
        elif model_name == "LightGCN":
            return self._infer_lightgcn(user_id, top_k)
        elif model_name == "VBPR":
            return self._infer_vbpr(user_id, top_k)
        else:
            raise ValueError(f"Unknown model: {model_name}")

    def _mock_inference(self, user_id: str, model_name: str, top_k: int) -> List[RankedItem]:
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

    def _infer_mf(self, user_id: str, top_k: int):
        raise NotImplementedError("MF inference requires mf.pt")

    def _infer_ngcf(self, user_id: str, top_k: int):
        raise NotImplementedError("NGCF inference requires ngcf.pt")

    def _infer_lightgcn(self, user_id: str, top_k: int):
        raise NotImplementedError("LightGCN inference requires lightgcn.pt")

    def _infer_vbpr(self, user_id: str, top_k: int):
        raise NotImplementedError("VBPR inference requires vbpr.pt and visual_embeddings.npy")
