import numpy as np
from typing import List, Dict, Any, Optional

# Reproducible benchmark slice inspired by the Clothing_5core schema
SAMPLE_USERS = ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9", "u10"]

SAMPLE_ITEMS = [
    {"id": "item_101", "name": "Minimalist Silk Slip Dress", "category": "Apparel", "style": "Minimalist"},
    {"id": "item_102", "name": "Satin Evening Gown", "category": "Apparel", "style": "Elegant"},
    {"id": "item_103", "name": "Organic Cotton Summer Maxi", "category": "Apparel", "style": "Casual"},
    {"id": "item_104", "name": "Linen Resort Button-Down", "category": "Apparel", "style": "Casual"},
    {"id": "item_105", "name": "Obsidian Wool Trench Coat", "category": "Outerwear", "style": "Minimalist"},
    {"id": "item_106", "name": "Cashmere Knit Sweater", "category": "Knitwear", "style": "Classic"},
    {"id": "item_107", "name": "Tailored High-Waist Trousers", "category": "Apparel", "style": "Professional"},
    {"id": "item_108", "name": "Pleated Chiffon Midi Skirt", "category": "Apparel", "style": "Elegant"},
    {"id": "item_109", "name": "Structured Leather Tote", "category": "Accessories", "style": "Minimalist"},
    {"id": "item_110", "name": "Silk Satin Scarf", "category": "Accessories", "style": "Elegant"},
    {"id": "item_111", "name": "Pointed Block-Heel Mules", "category": "Footwear", "style": "Minimalist"},
    {"id": "item_112", "name": "Canvas Daily Espadrilles", "category": "Footwear", "style": "Casual"},
]

# Deterministic User-Item Interaction Matrix R (Users x Items)
# Rows: u1..u10, Cols: item_101..item_112
INTERACTION_MATRIX = np.array([
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],  # u1: Formal / Minimalist bias
    [0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],  # u2: Casual / Cotton bias
    [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0],  # u3: Minimalist coat & knitwear
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],  # u4: Elegant silk & satin bias
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],  # u5: Casual linen/cotton
    [1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],  # u6: Formal dresses & heels
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],  # u7: Casual knitwear
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],  # u8: Professional minimalist
    [0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],  # u9: Mixed elegant
    [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],  # u10: Casual essentials
], dtype=np.float32)


class MatrixFactorizationEngine:
    """
    Genuine Matrix Factorization Recommendation Engine.
    Uses Truncated Singular Value Decomposition (SVD) on a deterministic benchmark sample slice.
    Decomposes R into U * Sigma * V^T, producing rank-K dense latent embeddings.
    """
    def __init__(self, rank: int = 4):
        self.rank = rank
        self.user_ids = SAMPLE_USERS
        self.item_catalog = SAMPLE_ITEMS
        self.item_ids = [item["id"] for item in SAMPLE_ITEMS]
        self.user_to_idx = {u: i for i, u in enumerate(self.user_ids)}
        self.item_to_idx = {item["id"]: i for i, item in enumerate(self.item_catalog)}
        
        self.R = INTERACTION_MATRIX
        self.user_factors: np.ndarray = np.zeros((len(self.user_ids), rank), dtype=np.float32)
        self.item_factors: np.ndarray = np.zeros((len(self.item_ids), rank), dtype=np.float32)
        self.reconstructed_matrix: np.ndarray = np.zeros_like(self.R)
        self.item_popularity = np.sum(self.R, axis=0)
        
        self.sparsity = float(1.0 - (np.count_nonzero(self.R) / float(self.R.size)))
        self.explained_variance_ratio: float = 0.0
        self.frobenius_error: float = 0.0

        self._fit()

    def _fit(self):
        """Fit Truncated SVD on interaction matrix R."""
        # Compute SVD: R = U * S * Vt
        u, s, vt = np.linalg.svd(self.R, full_matrices=False)
        
        k = min(self.rank, len(s))
        s_k = np.diag(np.sqrt(s[:k]))
        
        self.user_factors = np.dot(u[:, :k], s_k)
        self.item_factors = np.dot(vt[:k, :].T, s_k)
        
        # Compute predicted continuous preference scores R_hat = U_k * V_k^T
        self.reconstructed_matrix = np.dot(self.user_factors, self.item_factors.T)

        # Compute reproducible numerical evaluation metrics
        total_variance = float(np.sum(s ** 2))
        retained_variance = float(np.sum(s[:k] ** 2))
        self.explained_variance_ratio = round(retained_variance / total_variance, 4) if total_variance > 0 else 0.0
        self.frobenius_error = round(float(np.linalg.norm(self.R - self.reconstructed_matrix, 'fro')), 4)

    def recommend(self, user_id: str, top_k: int = 5, exclude_known: bool = True) -> Dict[str, Any]:
        """
        Produce top-K personalized recommendations using dot-product preference scoring.
        """
        top_k = max(1, min(top_k, len(self.item_ids)))
        
        if user_id not in self.user_to_idx:
            # Cold-start fallback: popularity baseline
            return self._recommend_popularity(user_id, top_k)

        u_idx = self.user_to_idx[user_id]
        scores = self.reconstructed_matrix[u_idx].copy()
        
        if exclude_known:
            # Mask out items the user has already interacted with
            known_items = np.where(self.R[u_idx] > 0)[0]
            scores[known_items] = -1e9

        # Rank candidate indices
        ranked_indices = np.argsort(scores)[::-1][:top_k]
        
        # Min-max normalization for positive scores
        valid_scores = scores[ranked_indices]
        max_score = float(np.max(valid_scores)) if len(valid_scores) > 0 else 1.0
        min_score = float(np.min(valid_scores)) if len(valid_scores) > 0 else 0.0
        denom = (max_score - min_score) if (max_score - min_score) > 1e-6 else 1.0

        items = []
        for idx in ranked_indices:
            raw_score = float(scores[idx])
            norm_score = round(float(0.60 + 0.38 * ((raw_score - min_score) / denom)), 4)
            item_info = self.item_catalog[idx]
            items.append({
                "id": item_info["id"],
                "name": item_info["name"],
                "category": item_info["category"],
                "style": item_info["style"],
                "score": norm_score,
                "raw_latent_score": round(raw_score, 4)
            })

        return {
            "user_id": user_id,
            "engine": "MatrixFactorizationEngine",
            "algorithm": f"TruncatedSVD Latent Factor (Rank {self.rank})",
            "mode": "SAMPLE_SVD_INFERENCE",
            "is_real_inference": True,
            "is_sample_slice": True,
            "dataset_info": {
                "name": "Clothing_5core (Representative Benchmark Slice)",
                "users_count": len(self.user_ids),
                "items_count": len(self.item_ids),
                "matrix_sparsity": round(self.sparsity, 4),
                "disclaimer": "Exact mathematical SVD factorization on a representative sample slice. Not a pre-trained deep neural checkpoint over full 5core dataset."
            },
            "mathematical_metrics": {
                "explained_variance_ratio": self.explained_variance_ratio,
                "frobenius_reconstruction_error": self.frobenius_error,
                "personalization_divergence": self._calculate_divergence(ranked_indices),
            },
            "latent_dimensions": self.rank,
            "items": items,
        }

    def _recommend_popularity(self, user_id: str, top_k: int) -> Dict[str, Any]:
        """Popularity fallback for cold-start users."""
        pop_indices = np.argsort(self.item_popularity)[::-1][:top_k]
        items = []
        for rank, idx in enumerate(pop_indices):
            item_info = self.item_catalog[idx]
            items.append({
                "id": item_info["id"],
                "name": item_info["name"],
                "category": item_info["category"],
                "style": item_info["style"],
                "score": round(0.85 - (rank * 0.05), 4),
                "raw_latent_score": float(self.item_popularity[idx])
            })
        return {
            "user_id": user_id,
            "engine": "PopularityBaselineEngine",
            "algorithm": "Interaction Frequency Counting",
            "mode": "SAMPLE_SVD_INFERENCE",
            "is_real_inference": True,
            "items": items,
            "is_cold_start": True
        }

    def _calculate_divergence(self, ranked_indices: np.ndarray) -> float:
        """Measure how much personalized recommendations diverge from top popular items."""
        top_popular = np.argsort(self.item_popularity)[::-1][:len(ranked_indices)]
        overlap = len(set(ranked_indices).intersection(set(top_popular)))
        return round(1.0 - (overlap / len(ranked_indices)), 3)


# Singleton instance for live API serving
real_mf_engine = MatrixFactorizationEngine(rank=4)
