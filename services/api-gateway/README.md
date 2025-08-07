# API Gateway Service

The API Gateway is the main entry point for all client requests in the TuneTON microservices architecture. It handles request routing, authentication, rate limiting, and request/response transformation.

## Features

- **Request Routing**: Routes requests to appropriate microservices using shared configuration
- **Authentication**: Validates JWT tokens and manages user sessions
- **Rate Limiting**: Protects against abuse with configurable rate limits
- **Request Validation**: Validates incoming requests using shared types
- **Logging**: Comprehensive request/response logging
- **CORS**: Handles Cross-Origin Resource Sharing
- **Error Handling**: Consistent error responses
- **Shared Configuration**: Uses `@tuneton/shared` for common types and config

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for containerized deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd services/api-gateway
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your configuration:
   ```bash
   cp .env.example .env
   ```

## Shared Package

The API Gateway uses the `@tuneton/shared` package for:
- Common TypeScript types and interfaces
- Centralized configuration management
- Shared utilities and helpers

### Configuration

Configuration is managed through the shared package. Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development

# Service Configuration (via @tuneton/shared)
SERVICE_NAME=api-gateway
PORT=3000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=tuneton-api
JWT_AUDIENCE=tuneton-client

# Service URLs (with fallbacks)
AUTH_SERVICE_URL=http://auth-service:3001
USER_SERVICE_URL=http://user-service:3002
TRACK_SERVICE_URL=http://track-service:3003
AUDIO_SERVICE_URL=http://audio-service:3004

# Logging
LOG_LEVEL=info

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Running the Service

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build
npm start
```

#### Docker

```bash
docker build -t tuneton/api-gateway .
docker run -p 3000:3000 --env-file .env tuneton/api-gateway
```

## API Documentation

For detailed API documentation, see the [API Documentation](../docs/API_DOCUMENTATION.md).

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

The service is configured to be deployed as a Docker container. Update the `docker-compose.yml` file with your production environment variables.

## Monitoring

- **Logs**: Check container logs with `docker logs <container_id>`
- **Health Check**: `GET /health`
- **Metrics**: Prometheus metrics available at `/metrics`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.