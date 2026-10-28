FROM python:3.11-slim

WORKDIR /app

# Install dependencies; use CPU-only PyTorch wheel to prevent 2GB+ CUDA bloat
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure trained weights and artifacts are compiled into image
RUN python -m app.ml.train_evaluate

# Expose the port uvicorn will run on
EXPOSE 8000

# Set production environment defaults
ENV ALLOWED_ORIGINS="https://vuanalytics.me,https://vu-viet-phong.github.io,http://localhost:5173"
ENV ENV="production"

# Use PORT from Render or default to 8000
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
