---
description: Comprehensive deployment guide for the E-Library System
---

# Deployment Guide

## 1. Backend Deployment (Railway)

The backend is a Spring Boot application located in the `/backend` directory.

### Steps:
1.  **Create New Project on Railway**:
    *   Select "Deploy from GitHub repo".
    *   Choose `E-Library-System`.
2.  **Configure Service Settings** (CRITICAL):
    *   Click on the new service card.
    *   Go to **Settings**.
    *   Scroll down to **Root Directory**.
    *   Set it to `/backend`.
    *   *Reason*: This tells Railway to find the `Dockerfile` and `pom.xml` inside the backend folder, not the root.
3.  **Add Database (MongoDB)**:
    *   In the Railway canvas, right-click (or click "New") -> **Database** -> **MongoDB**.
    *   Wait for it to deploy.
4.  **Connect Backend to Database**:
    *   Click on the **MongoDB** service -> **Variables**.
    *   Copy the `MONGO_URL` value (it looks like `mongodb://mongo:...`).
    *   Go to your **Backend Service** -> **Variables**.
    *   Add a new variable:
        *   Key: `SPRING_DATA_MONGODB_URI`
        *   Value: [Paste the MONGO_URL here]
5.  **Build & Deploy**:
    *   The service should now redeploy automatically. If not, click "Redeploy".

## 2. Frontend Deployment (Vercel)

The frontend is a React/Vite app located in the `/frontend` directory.

### Steps:
1.  **Import Project in Vercel**:
    *   Select the GitHub repo.
2.  **Configure Project**:
    *   **Root Directory**: Click Edit and select `frontend`.
    *   **Framework Preset**: Vite (should be auto-detected).
3.  **Environment Variables**:
    *   Vercel will ask for environment variables.
    *   Add `VITE_API_URL` -> Set this to your **Railway Backend URL**.
        *   You can find the domain in Railway -> Backend Service -> Settings -> Networking -> Public Networking (Generate Domain).
        *   Format: `https://your-backend-app.up.railway.app/api`
4.  **Deploy**.
