# Backend Database Standardization: PostgreSQL

## Problem
The backend was standardized on PostgreSQL to align with CI, deployment, and relational data requirements.

## Changes Made

### 1. Dependencies (pom.xml)
- Added: `spring-boot-starter-data-jpa`
- Added: `postgresql` driver (runtime scope)
- Added: `h2` database (test scope for in-memory testing)

### 2. Configuration
- **application.yml**: Updated to use PostgreSQL datasource with JPA/Hibernate
- **test/resources/application.yml**: Created H2 in-memory database configuration for tests

### 3. Entity Classes
Standardized all entities to JPA:
- Changed Spring Data `@Id` to JPA `@Id` with `@GeneratedValue`
- Changed ID type from `String` to `Long`
- Replaced `@DBRef` with JPA relationships (`@ManyToOne`, `@JoinColumn`)
- Replaced `@Field` with `@Column`
- Added `@PrePersist` and `@PreUpdate` lifecycle callbacks
- Updated entities: Book, Category, User, Loan

### 4. Repository Interfaces
- Standardized repositories to `JpaRepository<T, Long>`
- Changed ID parameter types from `String` to `Long`

### 5. DTOs
- Updated all DTO ID fields from `String` to `Long`
- Updated: BookDTO, CategoryDTO, UserDTO, LoanDTO

### 6. Database Schema
- System now uses PostgreSQL with auto-generated tables via Hibernate
- Compatible with existing init-db SQL scripts
- Uses IDENTITY strategy for primary key generation

## Testing
- Unit tests now use H2 in-memory database
- No external database required for CI tests
- Docker Compose integration tests use PostgreSQL

## Benefits
1. Consistent with project infrastructure (PostgreSQL in docker-compose)
2. Compatible with managed PostgreSQL providers (for example, Neon)
3. Tests run without external dependencies
4. Proper relational database support with foreign keys
5. Fixes CI/CD pipeline failures


