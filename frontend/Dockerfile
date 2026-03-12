# ================================
# Multi-Stage Dockerfile for React Frontend
# ================================

# Stage 1: Development
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]

# ================================
# Stage 2: Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Build the app
RUN npm run build

# ================================
# Stage 3: Production (Nginx)
# ================================
FROM nginx:alpine AS production

# Default upstream for containerized local deployments.
ENV BACKEND_UPSTREAM=http://backend:8080

# Copy templated nginx config
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
