# Auth Service

Authentication service for TuneTON, handling Telegram Mini Apps authentication and JWT token management.

## Features

- **Telegram Authentication**: Secure validation of Telegram WebApp initData using HMAC-SHA256
- **JWT Token Management**: Generation and validation of access and refresh tokens
- **Session Management**: Secure cookie-based session handling
- **RESTful API**: Clean, well-documented endpoints for authentication flows

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0
- Docker (for containerized deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Build the project:
   ```bash
   npm run build
   ```

### Running Locally

```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
NODE_ENV=development
SERVICE_NAME=auth-service
PORT=3001

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=7
JWT_ISSUER=tuneton-api
JWT_AUDIENCE=tuneton-client

# Telegram Bot Token
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/telegram/auth` - Authenticate with Telegram WebApp initData
- `POST /api/v1/auth/login` - Login with user credentials (for non-Telegram clients)
- `POST /api/v1/auth/refresh-token` - Refresh access token using refresh token
- `POST /api/v1/auth/logout` - Invalidate the current session
- `GET /api/v1/auth/protected` - Example protected route (for testing)

### Health Check

- `GET /health` - Service health status

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

### Docker

Build the Docker image:

```bash
docker build -t tuneton/auth-service .
```

Run the container:

```bash
docker run -p 3001:3001 --env-file .env tuneton/auth-service
```

### Kubernetes

Deploy to Kubernetes using the provided manifests in the `k8s` directory.

## Security Considerations

- Always use HTTPS in production
- Keep your JWT and Telegram bot tokens secure
- Implement rate limiting in production
- Regularly rotate your JWT secrets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.