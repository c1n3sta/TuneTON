# User Service

The User Service is a core microservice in the TuneTON platform, responsible for managing user profiles, authentication, and authorization. It provides RESTful APIs for user management and integrates with the Auth Service for secure authentication.

## Features

- User profile management (CRUD operations)
- JWT-based authentication and authorization
- Role-based access control (Admin/User roles)
- Integration with Telegram authentication
- Secure password handling
- Input validation and sanitization
- Comprehensive error handling

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (for session management)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/tuneton.git
   cd services/user-service
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables with your configuration

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=3002
SERVICE_NAME=user-service

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tuneton_users
DB_LOGGING=true

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_ISSUER=tuneton
JWT_AUDIENCE=tuneton-users

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Database Setup

1. Make sure PostgreSQL is running
2. Run migrations:
   ```bash
   npm run migration:run
   # or
   yarn migration:run
   ```

## Running the Service

### Development

```bash
npm run dev
# or
yarn dev
```

### Production

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

## API Documentation

### Authentication

All endpoints except `/health` require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Health Check

- `GET /health` - Check service status

#### User Management

- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update current user profile
- `DELETE /api/v1/users/me` - Delete current user account (soft delete)

#### Admin Endpoints

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Linting

```bash
npm run lint
# or
yarn lint
```

## Code Formatting

```bash
npm run format
# or
yarn format
```

## Deployment

The service is designed to be deployed as a Docker container. A `Dockerfile` and `docker-compose.yml` are provided in the root directory.

### Building the Docker Image

```bash
docker build -t tuneton/user-service .
```

### Running with Docker Compose

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Port to run the server on | `3002` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `tuneton_users` |
| `JWT_SECRET` | Secret for signing JWT tokens | - |
| `JWT_ACCESS_EXPIRATION_MINUTES` | JWT access token expiration time | `15` |
| `JWT_REFRESH_EXPIRATION_DAYS` | JWT refresh token expiration time | `30` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the development team.
