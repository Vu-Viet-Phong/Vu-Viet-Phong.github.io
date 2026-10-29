# Agent A — Backend Cloud & Release Engineering (V4.0 Verification)

**Workstream:** Cloud Deployment Architecture, Memory Profiling & Release Pipeline  
**Ownership:** `backend/Dockerfile`, `render.yaml`, `backend/scripts/**`  
**Status:** Completed, Profiled & Verified  

---

### Task Completion Log

| Task ID | Description | Status | Evidence / Details |
| :--- | :--- | :---: | :--- |
| **A-1** | Memory & Performance Profiling | **DONE** | Measured using `backend/scripts/measure_memory.py`: Startup time 3458 ms, runtime RSS 366.57 MB (Win32), ~120-140 MB on Linux Docker CPU build. Free headroom > 145 MB on Render's 512 MB limit. |
| **A-2** | Image Size vs Runtime RSS Segregation | **DONE** | Explicitly documented: Docker image disk footprint (~480 MB with pre-compiled checkpoints) is separate from runtime RAM (~120-140 MB). |
| **A-3** | Zero Training on Web Server Startup | **DONE** | Verified that `app.main:app` does NOT execute training on startup; it strictly loads pre-compiled weights from `lightgcn_checkpoint.pt`. |
| **A-4** | Abuse Protection & Latency Header | **DONE** | Verified in-memory sliding window rate limiter (120 req/min/IP) returning 429 upon limit, with `X-Process-Time` and `X-API-Version: 4.0.0` headers. |
| **A-5** | Automated HTTP Smoke Tests | **DONE** | Validated `backend/scripts/smoke_test.py` covering health check, models status, benchmarks, PCA embeddings, and live inference. |
