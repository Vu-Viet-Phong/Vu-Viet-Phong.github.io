# VuAnalytics 4.0 — Cloud Deployment & Release Guide

## 1. Architecture Overview

VuAnalytics 4.0 follows a decoupled hybrid architecture:
- **Frontend Presentation Layer**: Static Single-Page Application (React + Vite + Tailwind CSS + Framer Motion + Cytoscape) hosted globally on **GitHub Pages** with Cloudflare Edge acceleration at `https://vuanalytics.me`.
- **Backend Inference API**: Containerized FastAPI service with PyTorch 2.5 CPU inference, NumPy linear algebra routines, and in-memory rate limiting hosted on **Render** (Free tier Web Service).
- **Offline Resilience Fallback**: If the backend service is offline, sleeping, or cold-starting, the frontend automatically falls back to verified static pre-compiled benchmark artifacts (`public/data/benchmark_results.json` and `public/data/embeddings_pca.json`), alerting the user with an transparent status pill.

---

## 2. Environment Variables & Secrets

### Backend Environment Variables (Render Dashboard / `render.yaml`)

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `ALLOWED_ORIGINS` | `https://vuanalytics.me,https://vu-viet-phong.github.io,http://localhost:5173,http://localhost:4173,http://localhost:8000,http://127.0.0.1:4173` | Comma-separated allowed CORS origins |
| `ENV` | `production` | Set environment mode; hides internal exception stack traces |
| `PORT` | `8000` (Injected automatically by Render) | Listening web port |

### Frontend GitHub Secrets / Variables (Repository Settings -> Secrets and variables -> Actions)

| Variable Type | Name | Production Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Repository Variable** | `VITE_API_BASE_URL` | `https://vuanalytics-backend.onrender.com` | Base URL of deployed FastAPI backend |

> [!NOTE]
> No paid third-party API keys or sensitive external secrets are required for the core recommendation engine. All model weights and SVD matrices run natively on local CPU compute.

---

## 3. Render Deployment Procedure

1. **Connect Repository**:
   - Log in to [Render](https://dashboard.render.com).
   - Click **New +** -> **Blueprint**.
   - Select the GitHub repository `Vu-Viet-Phong/Vu-Viet-Phong.github.io`.
   - Render detects `render.yaml` automatically.
2. **Deploy Service**:
   - Service Name: `vuanalytics-backend`
   - Environment: `Docker` (Builds using `backend/Dockerfile` with lightweight PyTorch CPU)
   - Health Check Path: `/health`
   - Instance Type: Free (512 MB RAM, 0.1 CPU)
3. **Verify Deployment**:
   - Run the smoke test:
     ```bash
     python backend/scripts/smoke_test.py https://vuanalytics-backend.onrender.com
     ```

---

## 4. Zero-Downtime Rollback Procedure

In the event of an unexpected regression or memory spike on the backend:
1. **Render Instant Rollback**:
   - In Render Dashboard -> `vuanalytics-backend` -> **Deploys**.
   - Select the previous stable commit deployment -> click **Rollback to this deploy**.
2. **Frontend Offline Grace**:
   - The frontend SPA never crashes if the backend goes down; it gracefully catches `FetchError` and falls back to local pre-rendered benchmark data with a notice: `Offline Fallback: Local Verified Artifacts`.
