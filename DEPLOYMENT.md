# E-Library System Deployment Guide

This project is set up for deployment to Render with three resources:

- `elibrary-db`: Render Postgres
- `elibrary-backend`: Spring Boot web service built from [backend/Dockerfile](G:\E-Library-System\backend\Dockerfile)
- `elibrary-frontend`: Render static site built from [frontend](G:\E-Library-System\frontend)

The recommended setup is defined in [render.yaml](G:\E-Library-System\render.yaml).

## Render Architecture

- Backend runs as a Docker web service
- Frontend runs as a static site
- Backend connects to Render Postgres through `DATABASE_URL`
- The backend container converts Render's `postgresql://...` connection string to JDBC automatically at startup

## Backend Variables

Set these on the Render backend service if you are configuring it manually:

| Variable | Required | Notes |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | yes | Set to `docker` |
| `FRONTEND_APP_URL` | yes | Public frontend URL, for example `https://elibrary-frontend.onrender.com` |
| `APP_CORS_ALLOWED_ORIGINS` | yes | Public frontend URL, or comma-separated list if needed |
| `DATABASE_URL` | yes | Internal Render Postgres connection string |
| `DB_USER` | yes | Render Postgres username |
| `DB_PASSWORD` | yes | Render Postgres password |
| `DB_SSL_MODE` | recommended | Default `require` |
| `GOOGLE_CLIENT_ID` | if using Google login | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | if using Google login | Google OAuth client secret |

Health check path:

```text
/actuator/health
```

## Frontend Variables

Set these on the Render static site:

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | yes | Public backend API URL, for example `https://elibrary-backend.onrender.com/api` |
| `VITE_AUTH_BASE_URL` | yes | Public backend base URL, for example `https://elibrary-backend.onrender.com` |

Notes:

- `VITE_API_URL` is compiled into the frontend at build time
- `VITE_AUTH_BASE_URL` is used for starting Google OAuth login
- `BACKEND_UPSTREAM` is not needed for the Render static-site setup

## Deploy With render.yaml

1. Push this repository with [render.yaml](G:\E-Library-System\render.yaml) committed.
2. In Render, create a new Blueprint and point it at this repository.
3. During setup, provide values for:
   - `FRONTEND_APP_URL`
   - `APP_CORS_ALLOWED_ORIGINS`
   - `VITE_API_URL`
   - `VITE_AUTH_BASE_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
4. Let Render create the Postgres database, backend web service, and frontend static site.
5. After the first deploy, update Google OAuth authorized redirect/origin settings to match the Render URLs.

## Deploy Manually In Render

### Backend

- Create a new Web Service
- Runtime: Docker
- Dockerfile path: `backend/Dockerfile`
- Docker context: `backend`
- Health check path: `/actuator/health`
- Set the backend variables listed above

### Frontend

- Create a new Static Site
- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Add a rewrite from `/*` to `/index.html`
- Set `VITE_API_URL` and `VITE_AUTH_BASE_URL`

## Quick Verification

After deployment:

- backend health should return `200` at `/actuator/health`
- frontend root URL should load successfully
- browser API requests should target the Render backend URL
- Google login redirect should return to the Render frontend URL
