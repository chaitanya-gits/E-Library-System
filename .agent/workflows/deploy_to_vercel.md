---
description: Deploy the frontend to Vercel
---

# Deploying the Frontend to Vercel

Since your application uses a **Spring Boot backend** and a **React frontend**, you can deploy the frontend to Vercel, but the backend must be hosted elsewhere (like Render, Railway, or AWS) because Vercel is optimized for static sites and serverless functions, not long-running Java applications.

## Prerequisites

1.  **Push your code to GitHub/GitLab/Bitbucket**: Ensure your project is in a remote repository.
2.  **Backend Deployment**: Your backend must be running on a public URL (e.g., `https://my-backend.onrender.com`).

## Deployment Steps

1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and sign up/log in.
2.  **Add New Project**:
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your `E-Library-System` repository.
3.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: It should auto-detect as **Vite**.
    *   **Environment Variables**:
        *   Expand the "Environment Variables" section.
        *   Add `VITE_API_URL` with the value of your *deployed* backend URL (e.g., `https://your-backend-url.com/api`).
        *   *Note: Do not use `http://localhost:8088/api` here, as Vercel cannot access your local machine.*
4.  **Deploy**: Click **"Deploy"**.

## If you want to test locally with Vercel CLI (Optional)

If you have the `vercel` CLI installed:

```bash
cd frontend
vercel
```

Follow the prompts to link and deploy.
