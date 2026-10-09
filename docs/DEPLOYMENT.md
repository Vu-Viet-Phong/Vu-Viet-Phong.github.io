# Deployment Guide

## 1. Frontend (GitHub Pages)
The frontend deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`) on pushes to the `main` branch.
- **Custom Domain:** Configured via `public/CNAME`.
- **Environment Variables:** `VITE_API_BASE_URL` must be injected as a Repository Variable in GitHub Settings.

## 2. Backend (Render.com)
The backend is Dockerized and prepared for Render deployment via `render.yaml`.
1. Connect Render to the GitHub repository.
2. The infrastructure-as-code configuration will create a `vuanalytics-backend` service.
3. Add the `ALLOWED_ORIGINS` environment variable.
4. Retrieve the public URL and update `VITE_API_BASE_URL` on GitHub Actions.
