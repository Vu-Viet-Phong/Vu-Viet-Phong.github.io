# Agent C — Real AI Engine

**Workstream:** Backend Recommendation Engine, PyTorch/SVD Architecture & Inference APIs  
**Ownership:** `backend/app/**`, `backend/tests/**`, `backend/requirements.txt`  
**Status:** Completed Baseline Milestone  

---

### Task Log

| Task ID | Description | Status | Evidence / Details |
| :--- | :--- | :---: | :--- |
| **C-1** | Audit FastAPI Endpoints & Model Status | **DONE** | Refactored `/api/models` to report per-model status honestly (MF is live, LightGCN/NGCF/VBPR in simulation until .pt checkpoints). |
| **C-2** | Build Executable Matrix Factorization Engine | **DONE** | Implemented `MatrixFactorizationEngine` in `backend/app/services/real_engine.py` using Truncated SVD ($R \approx U_k \Sigma_k V_k^T$). |
| **C-3** | Incorporate Clothing_5core Benchmark Subset | **DONE** | Embedded deterministic $10 \times 12$ bipartite interaction matrix with user style profiles and catalog item metadata. |
| **C-4** | Input Validation & Error Handling | **DONE** | Enforced $1 \le \text{top\_k} \le 20$ in `/api/recommendations`, returning HTTP 422 on invalid ranges. Handled cold-start via popularity fallback. |
| **C-5** | Deterministic Unit Testing & Numerical Verification | **DONE** | Created `backend/tests/test_real_engine.py` (6 tests). All 10 backend tests pass (100%). |
| **C-6** | Baseline Comparison Metric | **DONE** | Implemented `_calculate_divergence` measuring recommendation divergence from the non-personalized popularity baseline. |

---

### API Contract for Integration Coordinator

- **Endpoint:** `POST /api/recommendations`
- **Request Body:**
  ```json
  {
    "user_id": "u1",
    "model": "MF",
    "top_k": 5
  }
  ```
- **Response Format (Real Inference):**
  ```json
  {
    "user_id": "u1",
    "model": "MF",
    "mode": "REAL_INFERENCE",
    "items": [
      {
        "id": "item_102",
        "name": "Satin Evening Gown",
        "category": "Apparel",
        "style": "Elegant",
        "score": 0.98,
        "raw_latent_score": 0.8142
      }
    ]
  }
  ```
- **Response Format (Simulation Fallback for GNNs):**
  ```json
  {
    "user_id": "u1",
    "model": "LightGCN",
    "mode": "SIMULATION",
    "items": [...]
  }
  ```
