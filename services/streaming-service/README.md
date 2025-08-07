# TuneTON Streaming Service

The Streaming Service is responsible for handling audio streaming to clients with support for range requests, enabling seeking and efficient bandwidth usage.

## Features

- **Audio Streaming**: Stream audio files with support for range requests
- **Authentication**: JWT-based authentication for secure access
- **Range Requests**: Support for HTTP range requests for seeking
- **Metadata API**: Retrieve track metadata
- **Health Checks**: Built-in health check endpoint
- **Logging**: Comprehensive logging with Winston
- **Docker Support**: Ready for containerized deployment

## Prerequisites

- Node.js 16+ and npm 7+
- Docker and Docker Compose (for containerized deployment)
- Redis (for rate limiting and caching)
- FFmpeg (for audio processing)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/tuneton.git
   cd tuneton/services/streaming-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration.

### Running Locally

Start the development server:
```bash
npm run dev
```

The service will be available at `http://localhost:3005`

### Building for Production

```bash
npm run build
npm start
```

### Docker

Build and run with Docker Compose:
```bash
docker-compose up --build
```

## API Endpoints

### Stream Audio
```
GET /api/stream/:trackId
```

**Parameters:**
- `trackId` (required): ID of the track to stream

**Headers:**
- `Range`: Optional byte range for partial content (e.g., `bytes=0-`)
- `Authorization`: Bearer token (e.g., `Bearer your-jwt-token`)

**Responses:**
- `200 OK`: Full audio file
- `206 Partial Content`: Partial content with range request
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Track not found

### Get Track Metadata
```
GET /api/stream/:trackId/metadata
```

**Parameters:**
- `trackId` (required): ID of the track

**Headers:**
- `Authorization`: Bearer token (e.g., `Bearer your-jwt-token`)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "track-123",
    "title": "Sample Track",
    "artist": "Unknown Artist",
    "duration": 180,
    "bitrate": 192,
    "format": "mp3",
    "size": 5242880
  }
}
```

### Health Check
```
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "memoryUsage": {
    "rss": 12345678,
    "heapTotal": 8765432,
    "heapUsed": 1234567,
    "external": 12345
  },
  "env": "development"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3005` |
| `NODE_ENV` | Node environment | `development` |
| `JWT_SECRET` | Secret key for JWT verification | - |
| `AUDIO_FILES_DIR` | Directory containing audio files | `./uploads/audio` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Deployment

### Docker

Build the Docker image:
```bash
docker build -t tuneton/streaming-service .
```

Run the container:
```bash
docker run -p 3005:3005 tuneton/streaming-service
```

### Kubernetes

Example deployment configuration:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: streaming-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: streaming-service
  template:
    metadata:
      labels:
        app: streaming-service
    spec:
      containers:
      - name: streaming-service
        image: tuneton/streaming-service:latest
        ports:
        - containerPort: 3005
        env:
        - name: NODE_ENV
          value: production
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        - name: REDIS_URL
          value: redis://redis:6379
---
apiVersion: v1
kind: Service
metadata:
  name: streaming-service
spec:
  selector:
    app: streaming-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3005
  type: ClusterIP
```

## License

[MIT](LICENSE)