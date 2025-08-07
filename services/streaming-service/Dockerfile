# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apk --no-cache add ffmpeg

# Copy built application from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/packages/shared ./packages/shared

# Create directory for audio files
RUN mkdir -p /app/uploads/audio

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3005
ENV AUDIO_FILES_DIR=/app/uploads/audio

# Expose the port the app runs on
EXPOSE 3005

# Command to run the application
CMD ["node", "dist/index.js"]