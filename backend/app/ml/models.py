"""
Machine Learning Recommendation Models for VuAnalytics 4.0:
1. PopularityBaseline: Non-personalized frequency baseline.
2. TruncatedSVDModel: Linear Latent Factor Decomposition (Matrix Factorization).
3. LightGCN (PyTorch): Graph Convolutional Collaborative Filtering (He et al., SIGIR 2020).
"""

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from typing import Dict, Any, Tuple, Optional
from app.ml.dataset import AmazonClothingBenchmark


class PopularityModel:
    """Non-personalized baseline recommending items with highest train frequency."""
    def __init__(self, benchmark: AmazonClothingBenchmark):
        self.benchmark = benchmark
        self.item_counts = np.sum(benchmark.train_matrix, axis=0)
        self.name = "Popularity Baseline"
        self.version = "1.0.0"

    def predict(self) -> np.ndarray:
        """Broadcast popularity scores across all users."""
        return np.tile(self.item_counts, (self.benchmark.num_users, 1))


class TruncatedSVDModel:
    """Matrix Factorization via Truncated Singular Value Decomposition."""
    def __init__(self, benchmark: AmazonClothingBenchmark, rank: int = 4):
        self.benchmark = benchmark
        self.rank = rank
        self.name = f"Truncated SVD (MF Rank-{rank})"
        self.user_factors: Optional[np.ndarray] = None
        self.item_factors: Optional[np.ndarray] = None
        self.predictions: Optional[np.ndarray] = None
        self.explained_variance_ratio: float = 0.0

    def fit(self):
        R = self.benchmark.train_matrix
        u, s, vt = np.linalg.svd(R, full_matrices=False)
        k = min(self.rank, len(s))
        s_k = np.diag(np.sqrt(s[:k]))
        
        self.user_factors = np.dot(u[:, :k], s_k)
        self.item_factors = np.dot(vt[:k, :].T, s_k)
        self.predictions = np.dot(self.user_factors, self.item_factors.T)
        
        total_var = float(np.sum(s ** 2))
        retained_var = float(np.sum(s[:k] ** 2))
        self.explained_variance_ratio = round(retained_var / total_var, 4) if total_var > 0 else 0.0

    def predict(self) -> np.ndarray:
        if self.predictions is None:
            self.fit()
        return self.predictions


class PyTorchLightGCN(nn.Module):
    """
    LightGCN: Simplifying and Powering Graph Convolution Network for Recommendation.
    (He et al., SIGIR 2020 - ACM).
    Lightweight PyTorch implementation using normalized bipartite adjacency.
    """
    def __init__(self, num_users: int, num_items: int, embedding_dim: int = 16, num_layers: int = 3):
        super(PyTorchLightGCN, self).__init__()
        self.num_users = num_users
        self.num_items = num_items
        self.embedding_dim = embedding_dim
        self.num_layers = num_layers
        
        # Initial 0-th layer embeddings E^(0)
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        
        # Xavier normal initialization
        nn.init.normal_(self.user_embedding.weight, std=0.1)
        nn.init.normal_(self.item_embedding.weight, std=0.1)

    def compute_normalized_adj(self, train_matrix: np.ndarray, device: torch.device) -> torch.Tensor:
        """
        Build symmetric normalized Laplacian adjacency matrix:
        A_tilde = D^(-1/2) * A * D^(-1/2)
        where A is bipartite graph [[0, R], [R^T, 0]].
        """
        n_nodes = self.num_users + self.num_items
        A = np.zeros((n_nodes, n_nodes), dtype=np.float32)
        A[:self.num_users, self.num_users:] = train_matrix
        A[self.num_users:, :self.num_users] = train_matrix.T
        
        # Degree vector D
        degrees = np.sum(A, axis=1)
        # Avoid division by zero
        d_inv_sqrt = np.power(np.maximum(degrees, 1e-12), -0.5)
        d_mat_inv_sqrt = np.diag(d_inv_sqrt)
        
        # Symmetric normalized adjacency: D^(-1/2) * A * D^(-1/2)
        norm_adj = d_mat_inv_sqrt @ A @ d_mat_inv_sqrt
        return torch.tensor(norm_adj, dtype=torch.float32, device=device)

    def forward(self, norm_adj: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Multi-layer graph convolution:
        E^(k+1) = A_tilde * E^(k)
        Final embedding = (1 / (K + 1)) * sum_{k=0}^K E^(k)
        """
        all_embeddings = torch.cat([self.user_embedding.weight, self.item_embedding.weight], dim=0)
        layer_embeddings = [all_embeddings]
        
        current_emb = all_embeddings
        for _ in range(self.num_layers):
            current_emb = torch.matmul(norm_adj, current_emb)
            layer_embeddings.append(current_emb)
            
        final_embeddings = torch.stack(layer_embeddings, dim=0).mean(dim=0)
        final_users = final_embeddings[:self.num_users]
        final_items = final_embeddings[self.num_users:]
        
        return final_users, final_items

    def predict_all(self, norm_adj: torch.Tensor) -> np.ndarray:
        """Compute all user-item prediction scores (inner product)."""
        self.eval()
        with torch.no_grad():
            users_emb, items_emb = self.forward(norm_adj)
            scores = torch.matmul(users_emb, items_emb.T)
            return scores.cpu().numpy()


class LightGCNTrainer:
    """Trainer for LightGCN using Bayesian Personalized Ranking (BPR) loss."""
    def __init__(
        self,
        benchmark: AmazonClothingBenchmark,
        embedding_dim: int = 16,
        num_layers: int = 2,
        lr: float = 0.05,
        reg_weight: float = 1e-4,
        epochs: int = 50,
        random_seed: int = 42
    ):
        self.benchmark = benchmark
        self.embedding_dim = embedding_dim
        self.num_layers = num_layers
        self.lr = lr
        self.reg_weight = reg_weight
        self.epochs = epochs
        self.random_seed = random_seed
        
        # Fix seeds
        torch.manual_seed(random_seed)
        np.random.seed(random_seed)
        
        self.device = torch.device("cpu")
        self.model = PyTorchLightGCN(
            num_users=benchmark.num_users,
            num_items=benchmark.num_items,
            embedding_dim=embedding_dim,
            num_layers=num_layers
        ).to(self.device)
        
        self.norm_adj = self.model.compute_normalized_adj(benchmark.train_matrix, self.device)
        self.optimizer = optim.Adam(self.model.parameters(), lr=lr)
        self.train_losses = []

    def train(self) -> Dict[str, Any]:
        """Train LightGCN using BPR pairwise ranking loss."""
        rng = np.random.RandomState(self.random_seed)
        train_pairs = self.benchmark.train_interactions
        num_items = self.benchmark.num_items
        
        self.model.train()
        for epoch in range(self.epochs):
            self.optimizer.zero_grad()
            users_emb, items_emb = self.model(self.norm_adj)
            
            # Sample negative items
            loss_total = torch.tensor(0.0, device=self.device)
            for u, pos_i in train_pairs:
                # Negative sampling
                neg_i = rng.randint(0, num_items)
                while self.benchmark.train_matrix[u, neg_i] > 0:
                    neg_i = rng.randint(0, num_items)
                    
                u_vec = users_emb[u]
                pos_vec = items_emb[pos_i]
                neg_vec = items_emb[neg_i]
                
                pos_score = torch.dot(u_vec, pos_vec)
                neg_score = torch.dot(u_vec, neg_vec)
                
                # BPR loss: -ln(sigmoid(pos - neg))
                bpr_loss = -torch.log(torch.sigmoid(pos_score - neg_score) + 1e-8)
                reg_loss = self.reg_weight * (u_vec.norm(2).pow(2) + pos_vec.norm(2).pow(2) + neg_vec.norm(2).pow(2))
                
                loss_total = loss_total + bpr_loss + reg_loss
                
            loss_total = loss_total / len(train_pairs)
            loss_total.backward()
            self.optimizer.step()
            
            self.train_losses.append(round(float(loss_total.item()), 4))
            
        final_scores = self.model.predict_all(self.norm_adj)
        return {
            "final_loss": self.train_losses[-1],
            "epochs": self.epochs,
            "predictions": final_scores
        }
