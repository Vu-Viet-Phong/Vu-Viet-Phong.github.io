# API Integration

## Connecting Frontend to Backend

The frontend uses a unified HTTP client (`src/api/client.ts`) designed to handle timeouts, generic error catching, and dynamic endpoints.

### Environment Setup
For local development:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```
For production (set via GitHub Actions Secrets):
```env
VITE_API_BASE_URL=https://<your-render-url>/api
```

### Endpoints
- `GET /health` : Returns system health.
- `GET /api/models` : Returns available recommendation models and their live/simulation status.
- `GET /api/system/status` : Extended health and configuration states.
- `POST /api/recommendations` : Request Top-K items for a given model and user profile.
- `POST /api/graphrag/query` : Submit a natural language query for the RAG pipeline.
