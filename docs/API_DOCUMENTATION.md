# TuneTON API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Tracks](#tracks)
4. [Playlists](#playlists)
5. [Streaming](#streaming)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [WebSocket API](#websocket-api)

## Base URL
```
https://api.tuneton.com/v1
```

## Authentication
All endpoints (except `/health`) require JWT authentication.

### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Health Check
Check if the API Gateway is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-07T15:00:00.000Z"
}
```

## Authentication

### Login with Telegram
**Endpoint:** `POST /auth/telegram`

**Request Body:**
```json
{
  "initData": "telegram_init_data_string"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "telegramId": "telegram_id",
    "username": "telegram_username",
    "role": "user"
  }
}
```

## User Management

### Get Current User Profile
**Endpoint:** `GET /users/me`

**Response:**
```json
{
  "id": "user_id",
  "username": "username",
  "email": "user@example.com",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

## Tracks

### Search Tracks
**Endpoint:** `GET /tracks/search?q={query}&limit=10&offset=0`

**Query Parameters:**
- `q`: Search query (required)
- `limit`: Number of results (default: 10)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "tracks": [
    {
      "id": "track_id",
      "title": "Track Title",
      "artist": "Artist Name",
      "duration": 240,
      "coverUrl": "https://...",
      "audioUrl": "https://..."
    }
  ],
  "total": 42
}
```

## Playlists

### Create Playlist
**Endpoint:** `POST /playlists`

**Request Body:**
```json
{
  "name": "My Playlist",
  "description": "Awesome tracks collection",
  "isPublic": true
}
```

**Response:**
```json
{
  "id": "playlist_id",
  "name": "My Playlist",
  "description": "Awesome tracks collection",
  "isPublic": true,
  "ownerId": "user_id",
  "tracks": []
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later."
}
```

## Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Authentication: 10 requests per 15 minutes per IP

## WebSocket API
For real-time updates, connect to:
```
wss://api.tuneton.com/ws
```

### Events
- `track_played`: When a track is played
- `playlist_updated`: When a playlist is modified
- `user_online`: When a user comes online

## SDKs
Official SDKs are available for:
- JavaScript/TypeScript
- Python
- iOS (Swift)
- Android (Kotlin)

## Support
For support, please contact support@tuneton.com or visit our [developer portal](https://developer.tuneton.com).
