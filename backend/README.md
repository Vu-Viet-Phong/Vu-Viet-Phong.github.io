# VuAnalytics AI Backend

FastAPI-based modular backend for the VuAnalytics platform.

## Features
- Provides mock simulation data for deterministic frontend UI demonstrations.
- Standardized API contracts matching frontend components (MMRec & GraphRAG).
- Pluggable `MMRecAdapter` ready for live PyTorch inference.

## Local Development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\\Scripts\\activate on Windows
pip install -r requirements.txt
```

### Run Server

```bash
uvicorn app.main:app --reload --port 8000
```

### Run Tests

```bash
pytest
```

## Production Deployment

This backend is designed to be hosted on any platform that supports Python (Render, Railway, Heroku, AWS, etc.).

### Environment Variables

- `ALLOWED_ORIGINS`: Comma-separated list of origins. (e.g. `http://localhost:5173,https://vuanalytics.me`)

### Docker Deployment

A `Dockerfile` is included for containerized environments.

```bash
docker build -t vuanalytics-backend .
docker run -p 8000:8000 -e ALLOWED_ORIGINS="https://vuanalytics.me" vuanalytics-backend
```

## Model Integration (Missing Artifacts)

Currently, real PyTorch checkpoints for MMRec are **not** present in the repository. The backend falls back to a deterministic `_mock_inference` provider.

To enable live inference, the following artifacts must be provided:
1. `model.pt` or checkpoint weights.
2. `user_mapping.json` (ID mappings).
3. Update `backend/app/services/inference.py` to set `use_mock=False` and load the artifacts.
