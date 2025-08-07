# Track Service

The Track Service is a core component of the TuneTON platform, responsible for managing audio track metadata, search functionality, and track-related operations.

## Features

- **Track Management**: CRUD operations for audio tracks
- **Search & Filtering**: Powerful search with filters for genre, title, and more
- **Pagination**: Efficient data retrieval with pagination support
- **Authentication**: JWT-based authentication and authorization
- **Validation**: Request validation and error handling
- **Logging**: Comprehensive logging for debugging and monitoring

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Testing**: Jest, Supertest
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL (v13+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tuneton.git
   cd tuneton/services/track-service
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables (copy `.env.example` to `.env` and update values):
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   npm run typeorm migration:run
   ```

### Running the Service

- **Development mode**:
  ```bash
  npm run dev
  ```

- **Production build**:
  ```bash
  npm run build
  npm start
  ```

### Testing

Run the test suite:

```bash
npm test
```

## API Documentation

### Base URL

```
http://localhost:3001/api/v1/tracks
```

### Endpoints

#### Get All Tracks

```
GET /
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term for track title
- `genre` - Filter by genre

#### Get Track by ID

```
GET /:id
```

#### Create Track

```
POST /
```

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Track Title",
  "description": "Track description",
  "filePath": "/path/to/audio.mp3",
  "duration": 180,
  "genre": "Electronic",
  "isPublic": true
}
```

#### Update Track

```
PUT /:id
```

**Authentication:** Required (only track owner or admin)

#### Delete Track

```
DELETE /:id
```

**Authentication:** Required (only track owner or admin)

## Environment Variables

```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/tuneton_tracks
JWT_SECRET=your-jwt-secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/your-username/tuneton](https://github.com/your-username/tuneton)
