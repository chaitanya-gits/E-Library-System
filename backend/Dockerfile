# ================================
# Multi-Stage Dockerfile for E-Library System Backend
# ================================

# Stage 1: Build the application
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normalize line endings for Linux containers, then make mvnw executable
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds, tests run in CI)
RUN ./mvnw package -DskipTests -B

# ================================
# Stage 2: Create the runtime image
# ================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Install curl for health checks
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r appgroup && \
    useradd -r -g appgroup appuser

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM optimizations for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0"

# Render provides Postgres URLs as postgresql://...; convert that to JDBC when needed.
ENTRYPOINT ["sh", "-c", "if [ -z \"$DB_URL\" ] && [ -n \"$DATABASE_URL\" ]; then case \"$DATABASE_URL\" in postgresql://*|postgres://*) export DB_URL=\"jdbc:${DATABASE_URL}\"; case \"$DB_URL\" in *\\?*) ;; *) export DB_URL=\"${DB_URL}?sslmode=${DB_SSL_MODE:-require}\" ;; esac ;; esac; fi; java $JAVA_OPTS -jar app.jar"]
