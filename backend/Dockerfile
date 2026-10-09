FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port uvicorn will run on
EXPOSE 8000

# Set environment variables for production
ENV ALLOWED_ORIGINS="https://vuanalytics.me"
ENV PORT=8000

# Use the PORT environment variable provided by Render/Heroku
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
