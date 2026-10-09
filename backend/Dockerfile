FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port uvicorn will run on
EXPOSE 8000

# Set environment variables for production
ENV ALLOWED_ORIGINS="https://vuanalytics.me"

# Use the PORT environment variable provided by Render, fallback to 8000
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
