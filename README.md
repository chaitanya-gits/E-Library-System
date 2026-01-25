# E-Library System

A containerized library management system built with **Spring Boot** (backend) and **React** (frontend), featuring Docker Compose for simplified local development and CI/CD pipeline with GitHub Actions.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

---

## Features

- 📚 **Book Management** - Add, search, and manage books with categories
- 👥 **User Management** - Register and manage library members
- 📖 **Loan System** - Checkout, return, and extend book loans
- 🐳 **Containerized** - Multi-stage Docker builds for optimized images
- 🔄 **CI/CD Pipeline** - Automated builds and tests with GitHub Actions
- 💾 **Persistent Storage** - PostgreSQL with volume mounts

---

## Quick Start

### Prerequisites

- Docker Desktop installed
- Git

### Run with Docker Compose

```bash
# Clone the repository
git clone <your-repo-url>
cd E-Library-System

# Create environment file
cp .env.example .env

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Health Check: http://localhost:8080/actuator/health

### Stop Services

```bash
docker compose down        # Stop containers
docker compose down -v     # Stop and remove volumes
```

---

## Project Structure

```
E-Library-System/
├── backend/                    # Spring Boot application
│   ├── src/main/java/         # Java source code
│   ├── src/test/java/         # Unit tests
│   ├── Dockerfile             # Multi-stage Docker build
│   └── pom.xml                # Maven configuration
├── frontend/                   # React application
│   ├── src/                   # React components
│   ├── Dockerfile             # Multi-stage Docker build
│   └── package.json           # NPM dependencies
├── init-db/                    # Database initialization
├── .github/workflows/          # CI/CD pipeline
├── docker-compose.yml          # Production compose
├── docker-compose.override.yml # Development overrides
└── .env.example               # Environment template
```

---

## API Endpoints

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Books | GET | `/api/books` | List all books |
| Books | GET | `/api/books/search?keyword=` | Search books |
| Books | POST | `/api/books` | Create book |
| Users | GET | `/api/users` | List all users |
| Users | POST | `/api/users` | Create user |
| Loans | GET | `/api/loans` | List all loans |
| Loans | POST | `/api/loans/checkout?bookId=&userId=` | Checkout book |
| Loans | POST | `/api/loans/{id}/return` | Return book |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `elibrary` |
| `DB_USER` | Database user | `elibrary` |
| `DB_PASSWORD` | Database password | `elibrary_secret` |
| `BACKEND_PORT` | Backend port | `8080` |
| `FRONTEND_PORT` | Frontend port | `3000` |

---

## Development

### Backend Only

```bash
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### Frontend Only

```bash
cd frontend
npm install
npm run dev
```

### Run Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm run test
```

---

## CI/CD Pipeline

The GitHub Actions workflow runs on every push:

1. **Backend Build & Test** - Compiles and runs unit tests
2. **Frontend Build** - Lints and builds React app
3. **Docker Build** - Creates container images
4. **Integration Test** - Runs full stack with Docker Compose

---

## License

MIT License
