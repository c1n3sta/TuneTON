# Playlist Service

Playlist Service is a microservice responsible for managing playlists in the TuneTON music streaming platform. It provides CRUD operations for playlists, track management within playlists, and playlist discovery features.

## Features

- **Playlist Management**: Create, read, update, and delete playlists
- **Track Management**: Add, remove, and reorder tracks in playlists
- **Playlist Discovery**: Browse public playlists and search functionality
- **User Playlists**: Manage user-specific playlists
- **Playlist Analytics**: Track play counts and other metrics
- **Access Control**: Public/private playlist visibility

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Web Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Logging**: Winston
- **Containerization**: Docker
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js 18 or later
- PostgreSQL 12 or later
- Redis (for rate limiting, optional)
- Docker (for containerization)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tuneton.git
cd tuneton/services/playlist-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

### 4. Database Setup

Make sure PostgreSQL is running and create a database:

```sql
CREATE DATABASE tuneton_playlist;
```

### 5. Run Migrations

```bash
npm run typeorm migration:run
```

### 6. Start the Service

Development mode with hot-reload:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

The service will be available at `http://localhost:3004` by default.

## API Documentation

### Base URL

```
http://localhost:3004/api/v1/playlists
```

### Endpoints

#### Playlist Endpoints

- `POST /` - Create a new playlist
- `GET /:id` - Get a playlist by ID
- `PATCH /:id` - Update a playlist
- `DELETE /:id` - Delete a playlist
- `GET /user/:userId` - Get user's playlists
- `GET /public` - Get public playlists
- `GET /search` - Search playlists

#### Track Management Endpoints

- `POST /:id/tracks` - Add tracks to a playlist
- `DELETE /:id/tracks` - Remove tracks from a playlist
- `PATCH /:id/reorder` - Reorder tracks in a playlist
- `POST /:id/play` - Increment play count

### Authentication

All endpoints require authentication except for:

- `GET /public`
- `GET /search` (for public playlists)
- `GET /health`

Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Development

### Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── entities/         # Database models
├── middleware/       # Express middleware
├── migrations/       # Database migrations
├── routes/           # API routes
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── index.ts          # Application entry point
└── app.ts            # Express app setup
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Docker

### Build the Docker Image

```bash
docker build -t tuneton/playlist-service .
```

### Run with Docker Compose

1. Update the `docker-compose.yml` file with your configuration
2. Run the service:

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Port to listen on | `3004` |
| `JWT_SECRET` | Secret for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `tuneton_playlist` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `LOG_LEVEL` | Logging level | `info` |
| `LOG_TO_FILE` | Enable file logging | `true` |
| `LOG_DIRECTORY` | Directory for log files | `logs` |

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
