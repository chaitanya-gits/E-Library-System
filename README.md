# E-Library System

E-Library System is a full-stack library management application with a Spring Boot backend and a React frontend. The project supports book, category, user, and loan management, includes Google OAuth sign-in, and ships with Docker-based local development.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.1-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4?style=flat-square&logo=google&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white)

## What The Project Includes

- Book catalog management
- Category management
- User registration, login, and profile updates
- Password reset flow
- Loan checkout, return, and extension flows
- Google OAuth 2.0 login
- REST API backend
- React single-page frontend
- Docker Compose local stack
- Production-ready container images
- CI pipelines for backend, frontend, and integration validation

## Architecture

```text
React + Vite + Nginx
        |
        v
Spring Boot REST API
        |
        v
PostgreSQL
```

Local development can also run the backend with the `dev` profile using an in-memory H2 database.

## Tech Stack

### Backend

- Java 17 application target
- Spring Boot 3.2.1
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Boot Actuator
- Spring Security
- Spring Security OAuth2 Client
- PostgreSQL driver
- H2 database for development profile
- Lombok
- Maven Wrapper

### Frontend

- React 18
- React DOM 18
- React Router DOM 6
- Axios
- Vite 5
- Vitest
- ESLint
- `@vitejs/plugin-react`

### Containers And Runtime

- Docker
- Docker Compose
- Nginx
- Eclipse Temurin JDK 21 image for backend build
- Eclipse Temurin JRE 21 image for backend runtime
- Node 20 Alpine image for frontend build and dev

### CI/CD And Deployment

- GitHub Actions workflow in [ci.yml](G:\E-Library-System\.github\workflows\ci.yml)
- GitLab CI file in [.gitlab-ci.yml](G:\E-Library-System\.gitlab-ci.yml)
- Docker Compose deployment files in [docker-compose.yml](G:\E-Library-System\docker-compose.yml) and [docker-compose.override.yml](G:\E-Library-System\docker-compose.override.yml)

## Repository Structure

```text
E-Library-System/
|-- backend/
|   |-- src/main/java/com/elibrary/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- entity/
|   |   |-- repository/
|   |   `-- service/
|   |-- src/main/resources/
|   |-- src/test/
|   |-- Dockerfile
|   |-- mvnw
|   `-- pom.xml
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   |-- public/
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- package.json
|-- init-db/
|-- .github/workflows/
|-- docker-compose.yml
|-- docker-compose.override.yml
`-- README.md
```

## Services And Software Used

### Application Services

- `backend`: Spring Boot API service
- `frontend`: React application served by Nginx
- PostgreSQL: primary persistent database in containerized or production setups
- H2: in-memory database used by the backend `dev` profile
- Google OAuth: external identity provider for social sign-in

### Developer Tooling

- Git for version control
- Maven Wrapper for backend build/test/package
- npm for frontend dependency management and scripts
- Vite dev server for local frontend development
- ESLint for frontend linting
- Vitest for frontend test execution
- Spring Boot Actuator for health endpoints
- Docker health checks for backend and frontend containers

## Backend Overview

The backend is a Spring Boot REST API under [backend](G:\E-Library-System\backend). It exposes CRUD and workflow endpoints for core library operations.

### Backend Modules

- `config`: CORS, Spring Security, OAuth success/failure handlers
- `controller`: REST endpoints
- `service`: business logic
- `repository`: JPA repositories
- `entity`: JPA entities
- `dto`: request and response objects

### Main Backend Endpoints

#### Books

- `GET /api/books`
- `GET /api/books/{id}`
- `GET /api/books/search?keyword=...`
- `GET /api/books/available`
- `GET /api/books/category/{categoryId}`
- `POST /api/books`
- `PUT /api/books/{id}`
- `DELETE /api/books/{id}`

#### Categories

- `GET /api/categories`
- `GET /api/categories/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

#### Users

- `GET /api/users`
- `GET /api/users/{id}`
- `GET /api/users/search?keyword=...`
- `POST /api/users`
- `POST /api/users/login`
- `POST /api/users/reset-password`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

#### Loans

- `GET /api/loans`
- `GET /api/loans/{id}`
- `GET /api/loans/user/{userId}`
- `GET /api/loans/active`
- `GET /api/loans/overdue`
- `POST /api/loans/checkout?bookId=...&userId=...`
- `POST /api/loans/{id}/return`
- `POST /api/loans/{id}/extend`

#### Monitoring

- `GET /actuator/health`
- `GET /actuator/info`
- `GET /actuator/metrics`

## Authentication And Security

The application now includes Spring Security and Google OAuth client support.

### Current Security Setup

- Spring Security filter chain is enabled
- CSRF is disabled in the current API configuration
- Requests are currently permitted by configuration
- Google OAuth login is configured through Spring Security OAuth2 client
- Successful OAuth logins redirect to the frontend OAuth success page
- Password hashing uses BCrypt

### OAuth-Related Files

- [SecurityConfig.java](G:\E-Library-System\backend\src\main\java\com\elibrary\config\SecurityConfig.java)
- [OAuth2AuthenticationSuccessHandler.java](G:\E-Library-System\backend\src\main\java\com\elibrary\config\OAuth2AuthenticationSuccessHandler.java)
- [OAuth2AuthenticationFailureHandler.java](G:\E-Library-System\backend\src\main\java\com\elibrary\config\OAuth2AuthenticationFailureHandler.java)
- [socialAuth.js](G:\E-Library-System\frontend\src\services\socialAuth.js)
- [OAuthSuccessPage.jsx](G:\E-Library-System\frontend\src\pages\OAuthSuccessPage.jsx)

## Frontend Overview

The frontend lives in [frontend](G:\E-Library-System\frontend) and is a Vite-based React application.

### Frontend Features

- Route-based SPA navigation with React Router
- Login and signup pages
- Google sign-in entry points
- OAuth success callback page
- Settings/profile update page
- Sidebar-driven navigation
- Axios-based API service layer

### Frontend Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run test
```

## Profiles And Configuration

### Spring Profiles

- `dev`: H2 in-memory database, H2 console enabled, debug-oriented local development
- `docker`: container-oriented runtime profile
- default profile: PostgreSQL-backed runtime with environment-driven configuration

### Main Environment Variables

Defined across [.env.example](G:\E-Library-System\.env.example), [frontend/.env.example](G:\E-Library-System\frontend\.env.example), and Spring configuration files:

| Variable | Purpose | Example |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_URL` | Full JDBC URL override | `jdbc:postgresql://host:5432/db` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `elibrary` |
| `DB_USER` | Database username | `elibrary` |
| `DB_PASSWORD` | Database password | `change_me` |
| `BACKEND_PORT` | Backend port for local/container use | `8080` |
| `FRONTEND_PORT` | Frontend port for local container mapping | `3000` |
| `FRONTEND_APP_URL` | Frontend base URL used by backend redirects | `http://localhost:3000` |
| `APP_CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:3000,http://localhost:5173` |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `docker` |
| `VITE_API_URL` | Frontend API base URL | `/api` |
| `VITE_BACKEND_PROXY_TARGET` | Vite proxy target in local dev | `http://localhost:8080` |
| `VITE_AUTH_BASE_URL` | Backend auth base URL for OAuth redirect start | `http://localhost:8080` |
| `GOOGLE_CLIENT_ID` | Google OAuth client id | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-client-secret` |

## Running The Project

### Option 1: Docker Compose

```bash
git clone <repository-url>
cd E-Library-System
copy .env.example .env
docker compose up --build
```

Default endpoints:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`
- Health check: `http://localhost:8080/actuator/health`

### Option 2: Run Backend And Frontend Separately

#### Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
```

That uses the H2 in-memory database via [application-dev.yml](G:\E-Library-System\backend\src\main\resources\application-dev.yml).

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend target configured in [vite.config.js](G:\E-Library-System\frontend\vite.config.js).

## Docker Details

### Backend Container

- Multi-stage build
- Built with Temurin JDK 21
- Runs on Temurin JRE 21
- Uses non-root runtime user
- Includes `curl` for health checks
- Exposes port `8080`

### Frontend Container

- Node 20 Alpine build stage
- Nginx production runtime
- Build-time `VITE_API_URL` injection
- Exposes port `80` inside container

## Testing And Validation

### Backend

```bash
cd backend
.\mvnw.cmd test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
npm run test -- --run
```

## CI/CD

The repository contains a GitHub Actions pipeline in [ci.yml](G:\E-Library-System\.github\workflows\ci.yml) with these main jobs:

- Backend build and unit tests
- Frontend install, lint, test, and production build
- Docker image builds for backend and frontend
- Integration validation with PostgreSQL and backend API smoke tests

The repository also contains a GitLab CI file in [\.gitlab-ci.yml](G:\E-Library-System\.gitlab-ci.yml).

## Deployment Support

### Local And Self-Hosted

- Docker Compose stack from [docker-compose.yml](G:\E-Library-System\docker-compose.yml)
- Development overrides from [docker-compose.override.yml](G:\E-Library-System\docker-compose.override.yml)

## Key Project Files

- [README.md](G:\E-Library-System\README.md)
- [.env.example](G:\E-Library-System\.env.example)
- [docker-compose.yml](G:\E-Library-System\docker-compose.yml)
- [backend/pom.xml](G:\E-Library-System\backend\pom.xml)
- [backend/src/main/resources/application.yml](G:\E-Library-System\backend\src\main\resources\application.yml)
- [frontend/package.json](G:\E-Library-System\frontend\package.json)
- [frontend/vite.config.js](G:\E-Library-System\frontend\vite.config.js)

## Current Version Notes

The current codebase reflects these notable updates:

- Spring Security and Google OAuth support added
- Frontend Google sign-in flow added
- OAuth success redirect handling added
- Updated Docker-based local development configuration present in the repo

## License

No license file is currently present in the repository. Add one explicitly if you want the project distributed under a defined license.
