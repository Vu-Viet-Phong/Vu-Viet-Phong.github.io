import os
import time
import logging
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import endpoints

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("vuanalytics-api")

app = FastAPI(
    title="VuAnalytics 4.0 AI Backend",
    version="4.0.0",
    description="Production-ready AI Research Lab Inference API supporting PyTorch LightGCN, SVD & GraphRAG"
)

# Allowed CORS origins
default_origins = [
    "https://vuanalytics.me",
    "https://vu-viet-phong.github.io",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:8000"
]
env_origins = os.getenv("ALLOWED_ORIGINS")
origins = [o.strip() for o in env_origins.split(",") if o.strip()] if env_origins else default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Lightweight In-Memory Abuse Protection (Sliding Window Rate Limiter: 120 req / minute / IP)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 120
request_history = defaultdict(list)

@app.middleware("http")
async def rate_limit_and_timing_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Exclude health check from rate limit
    if request.url.path != "/health":
        timestamps = request_history[client_ip]
        # Clean older than window
        request_history[client_ip] = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
        if len(request_history[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=429,
                content={"error": "Rate limit exceeded. Maximum 120 requests per minute permitted."}
            )
        request_history[client_ip].append(now)

    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-API-Version"] = "4.0.0"
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "details": str(exc) if os.getenv("ENV") == "development" else "Hidden"}
    )

app.include_router(endpoints.router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "vuanalytics-backend",
        "version": "4.0.0",
        "environment": os.getenv("ENV", "production")
    }
