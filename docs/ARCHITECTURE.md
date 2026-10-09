# VuAnalytics Architecture

## High-Level Design
VuAnalytics is designed as a decoupled, modular system:
1. **Frontend (React + Vite):** A static Single Page Application (SPA) hosted on GitHub Pages. It manages visual storytelling, complex graph rendering (Cytoscape.js), and interactive demonstrations.
2. **Backend (Python + FastAPI):** A RESTful API hosted on a cloud provider (e.g., Render). It provides model inference, dataset querying, and simulated GraphRAG logic.

## Data Flow
- User interactions on the frontend trigger calls via `src/api/client.ts`.
- The client attempts to reach `VITE_API_BASE_URL`.
- If the backend is unreachable, the frontend gracefully falls back to deterministic local mock functions (ensuring the portfolio never appears broken).
- If the backend is reachable, it parses the request via Pydantic schemas, routes it to `app/services/inference.py`, and returns Live or Simulated data depending on the presence of physical ML artifacts.
