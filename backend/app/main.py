from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints

import os

app = FastAPI(title="Vu Analytics AI Backend", version="2.0.0")

# Allow localhost for dev, and vuanalytics.me for production
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,https://vuanalytics.me").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "vuanalytics-backend"}
