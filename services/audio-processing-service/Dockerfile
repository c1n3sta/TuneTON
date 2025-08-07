# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    ffmpeg

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install runtime dependencies
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example ./.env

# Create necessary directories
RUN mkdir -p /app/logs \
    && mkdir -p /app/uploads \
    && mkdir -p /app/processed \
    && mkdir -p /app/temp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002
ENV STORAGE_UPLOAD_PATH=/app/uploads
ENV STORAGE_PROCESSED_PATH=/app/processed
ENV STORAGE_TEMP_PATH=/app/temp
ENV LOG_LEVEL=info

# Expose the application port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Command to run the application
CMD ["node", "dist/index.js"]