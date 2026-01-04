# Backend Migration Summary: MongoDB to PostgreSQL

## Problem
The backend was configured to use MongoDB, but MongoDB was not available in the CI environment, causing test failures. The system should use PostgreSQL (Supabase-compatible).

## Changes Made

### 1. Dependencies (pom.xml)
- Removed: `spring-boot-starter-data-mongodb`
- Added: `spring-boot-starter-data-jpa`
- Added: `postgresql` driver (runtime scope)
- Added: `h2` database (test scope for in-memory testing)

### 2. Configuration
- **application.yml**: Updated to use PostgreSQL datasource with JPA/Hibernate
- **test/resources/application.yml**: Created H2 in-memory database configuration for tests

### 3. Entity Classes
Migrated all entities from MongoDB to JPA:
- Changed `@Document` to `@Entity` and `@Table`
- Changed Spring Data `@Id` to JPA `@Id` with `@GeneratedValue`
- Changed ID type from `String` to `Long`
- Replaced `@DBRef` with JPA relationships (`@ManyToOne`, `@JoinColumn`)
- Replaced `@Field` with `@Column`
- Added `@PrePersist` and `@PreUpdate` lifecycle callbacks
- Updated entities: Book, Category, User, Loan

### 4. Repository Interfaces
- Changed all repositories from `MongoRepository<T, String>` to `JpaRepository<T, Long>`
- Updated custom query methods from MongoDB syntax to JPQL
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
2. Compatible with Supabase
3. Tests run without external dependencies
4. Proper relational database support with foreign keys
5. Fixes CI/CD pipeline failures
