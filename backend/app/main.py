import os
import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import endpoints

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("vuanalytics-api")

app = FastAPI(title="Vu Analytics AI Backend", version="2.1.0", description="Production-ready AI Inference API")

# Allow localhost for dev, and vuanalytics.me for production
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,https://vuanalytics.me,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
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
    return {"status": "ok", "service": "vuanalytics-backend"}
