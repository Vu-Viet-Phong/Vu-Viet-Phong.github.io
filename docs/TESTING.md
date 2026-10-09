# Testing Strategy

## Frontend Testing
- **Framework:** Vitest
- **Run Command:** `npm run test`
- **Scope:** Utility functions (e.g., matching scoring logic), component state boundaries, and deterministic fallbacks.

## Backend Testing
- **Framework:** Pytest, FastAPI TestClient
- **Run Command:** `pytest` (Run inside the `backend/` directory)
- **Scope:** API route validation, schema adherence, error handling, mock data generation logic.

## End-to-End Verification
Before deployment, run the unified check:
```bash
npm run test
cd backend && pytest
cd .. && npm run build
```
Do not deploy if any of the above commands fail.
