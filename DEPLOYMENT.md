# E-Library System Deployment Guide

This project is set up for deployment to Railway with separate backend and frontend services.

## Railway Services

- `elibrary-backend`: Spring Boot API
- `elibrary-frontend`: React app served by Nginx
- PostgreSQL service: Railway Postgres plugin or external PostgreSQL

## Why The Previous Deployment Failed

The Railway failure shown for the backend health check was consistent with `/actuator/health` returning `503`, which usually means the application started but one of its health contributors, typically the database, was down.

This repository previously expected custom `DB_*` variables only. Railway commonly provides PostgreSQL values as `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`. The backend is now updated to support those Railway variables directly.

The frontend also had two Railway-specific problems:

- the container health check used `curl` even though the production Nginx image did not install it
- Nginx proxied `/api` to `http://backend:8080`, which works in Docker Compose but is not valid for Railway’s separate public services unless explicitly configured

Both issues are now fixed in the repo.

## Backend Railway Variables

Set these on the Railway backend service:

| Variable | Required | Notes |
|---|---|---|
| `PORT` | yes | Railway injects this automatically |
| `SPRING_PROFILES_ACTIVE` | yes | Set to `docker` |
| `FRONTEND_APP_URL` | yes | Public frontend URL, for example `https://your-frontend.up.railway.app` |
| `APP_CORS_ALLOWED_ORIGINS` | yes | Public frontend URL, or comma-separated list if needed |
| `GOOGLE_CLIENT_ID` | if using Google login | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | if using Google login | Google OAuth client secret |

Database variables:

- Railway Postgres exposes `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, and `DATABASE_URL`
- Railway service variables are not assumed automatically across services; create reference variables on the backend service
- Recommended backend variable:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

- If your database service has a different name, replace `Postgres` with that exact Railway service name
- You can also set `DB_URL`, `DB_USER`, and `DB_PASSWORD` manually if you prefer

Health check path:

```text
/actuator/health
```

## Frontend Railway Variables

Set these on the Railway frontend service:

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | yes | Public backend API URL, for example `https://your-backend.up.railway.app/api` |
| `VITE_AUTH_BASE_URL` | yes | Public backend base URL, for example `https://your-backend.up.railway.app` |
| `BACKEND_UPSTREAM` | yes | Public backend base URL, for example `https://your-backend.up.railway.app` |

Notes:

- `VITE_API_URL` is compiled into the frontend at build time
- `VITE_AUTH_BASE_URL` is used for starting Google OAuth login
- `BACKEND_UPSTREAM` is used by Nginx for `/api` proxying in the production container

## Recommended Railway Setup

### Backend

- Source: GitHub repo
- Root directory: `backend`
- Builder: Dockerfile
- Health check path: `/actuator/health`

### Frontend

- Source: GitHub repo
- Root directory: `frontend`
- Builder: Dockerfile

## Redeploy Checklist

1. Attach PostgreSQL or configure external database variables
2. In backend service variables, add `DATABASE_URL=${{Postgres.DATABASE_URL}}` or reference the actual DB service name
3. Set `SPRING_PROFILES_ACTIVE=docker`
4. Set `FRONTEND_APP_URL` to the frontend Railway URL
5. Set `APP_CORS_ALLOWED_ORIGINS` to the frontend Railway URL
6. Set frontend `VITE_API_URL`, `VITE_AUTH_BASE_URL`, and `BACKEND_UPSTREAM` to the backend Railway URL
7. Redeploy backend
8. Redeploy frontend

## Quick Verification

After deployment:

- backend health should return `200` at `/actuator/health`
- frontend root URL should load successfully
- browser requests to the API should target the Railway backend URL
- Google login redirect should return to the Railway frontend URL
