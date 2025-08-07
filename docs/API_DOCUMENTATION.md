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

### Telegram Authentication
**Endpoint:** `POST /auth/telegram`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "initData": "query_id=AAHdF6IQAAAAAN0XohDhr8er&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1608066101&hash=1d29eef37f1668f76a1f8f2718da5d58e3a1a5a7e0b9ab8b2e4f4b1f8a7d6c5e"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 123456789,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "photoUrl": "https://t.me/i/userpic/320/username.jpg",
      "authDate": "2025-08-08T01:01:41.000Z"
    }
  }
}
```

### JWT Token Generation
**Endpoint:** `POST /auth/login`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "userId": "user_123",
  "telegramId": 123456789
}
```

**Response:**
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Refresh Access Token
**Endpoint:** `POST /auth/refresh-token`

**Headers:**
- `Cookie: jwt=<refresh_token>`

**Response:**
```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Logout
**Endpoint:** `POST /auth/logout`

**Headers:**
- `Cookie: jwt=<refresh_token>`

**Response:**
```http
HTTP/1.1 204 No Content
Set-Cookie: jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict
```

## Authentication Flow

1. **Client-Side (Telegram Mini App):**
   - User opens the Mini App in Telegram
   - Telegram provides `initData` containing user information
   - Client sends `initData` to `/auth/telegram` endpoint

2. **Server-Side (Auth Service):**
   - Validates the Telegram `initData` using HMAC-SHA256
   - Creates/updates user in the database
   - Returns user data to the client

3. **JWT Token Generation:**
   - Client calls `/auth/login` with user ID and Telegram ID
   - Server generates and returns JWT access token
   - Server sets HTTP-only cookie with refresh token

4. **Token Usage:**
   - Client includes access token in `Authorization: Bearer <token>` header
   - Access tokens expire after 1 hour (configurable)
   - Client uses refresh token to get new access token when expired

### Security Notes:
- All authentication endpoints must use HTTPS
- Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks
- Access tokens have a short expiration time (1 hour by default)
- Refresh tokens can be revoked server-side if needed
- Implement rate limiting on authentication endpoints to prevent brute force attacks

## User Management

### Get All Users (Admin Only)
**Endpoint:** `GET /users`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "users": [
      {
        "id": "user_1",
        "username": "johndoe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "isAdmin": false,
        "isVerified": true,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  },
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get Current User Profile
**Endpoint:** `GET /users/me`

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "photoUrl": "https://example.com/photo.jpg",
      "preferences": {
        "theme": "dark",
        "language": "en"
      },
      "isAdmin": false,
      "isVerified": true
    }
  }
}
```

### Get User by ID
**Endpoint:** `GET /users/:id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_1",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "photoUrl": "https://example.com/photo.jpg"
    }
  }
}
```

### Update Current User Profile
**Endpoint:** `PATCH /users/me`

**Request Body:**
```json
{
  "email": "new.email@example.com",
  "firstName": "John Updated",
  "lastName": "Doe",
  "photoUrl": "https://example.com/new-photo.jpg",
  "preferences": {
    "theme": "light",
    "language": "ru"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "new.email@example.com",
      "firstName": "John Updated",
      "lastName": "Doe",
      "photoUrl": "https://example.com/new-photo.jpg",
      "preferences": {
        "theme": "light",
        "language": "ru"
      },
      "isAdmin": false,
      "isVerified": true
    }
  }
}
```

### Delete Current User (Soft Delete)
**Endpoint:** `DELETE /users/me`

**Response:**
```http
HTTP/1.1 204 No Content
```

### Create or Update User from Telegram
**Internal Endpoint:** `POST /internal/users/telegram`

**Request Body:**
```json
{
  "id": 123456789,
  "username": "telegramuser",
  "first_name": "Telegram",
  "last_name": "User",
  "photo_url": "https://example.com/telegram/photo.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_telegram_123",
      "telegramId": 123456789,
      "username": "telegramuser",
      "firstName": "Telegram",
      "lastName": "User",
      "photoUrl": "https://example.com/telegram/photo.jpg",
      "isVerified": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

## Audio Processing

### Process Audio File
**Endpoint:** `POST /audio/process`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Audio file to process (required)
- `trackId`: ID of the track (required)
- `format`: Output format (e.g., 'mp3', 'wav', 'ogg') - default: 'mp3'
- `options`: JSON string with processing options (pitch, speed, etc.)

**Example Request:**
```
POST /api/v1/audio/process
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="song.mp3"
Content-Type: audio/mpeg

[binary data]
------WebKitFormBoundary
Content-Disposition: form-data; name="trackId"

track_123
------WebKitFormBoundary
Content-Disposition: form-data; name="format"

mp3
------WebKitFormBoundary
Content-Disposition: form-data; name="options"

{"pitch": 2, "speed": 1.2}
------WebKitFormBoundary--
```

**Response:**
```json
{
  "message": "Audio processing started",
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "trackId": "track_123",
  "statusUrl": "/api/v1/audio/status/550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Job Status
**Endpoint:** `GET /audio/status/:jobId`

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": 100,
  "data": {
    "trackId": "track_123",
    "outputFormats": [
      {
        "format": "mp3",
        "status": "completed",
        "url": "https://storage.tuneton.com/processed/user_123/track_123_processed.mp3"
      }
    ]
  },
  "createdAt": "2025-01-01T12:00:00.000Z",
  "completedAt": "2025-01-01T12:01:30.000Z"
}
```

### List Audio Jobs
**Endpoint:** `GET /audio/jobs`

**Query Parameters:**
- `status`: Filter by job status (waiting, active, completed, failed, delayed)
- `limit`: Number of jobs to return (default: 10)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "audio-processing",
      "data": {
        "trackId": "track_123",
        "outputFormats": [
          {
            "format": "mp3",
            "options": {
              "pitch": 2,
              "speed": 1.2
            }
          }
        ]
      },
      "progress": 100,
      "status": "completed"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

## Streaming

### Stream Audio
Stream audio content with support for range requests (for seeking).

**Endpoint:** `GET /stream/:trackId`

**Headers:**
- `Range`: Optional byte range (e.g., `bytes=0-`)
- `Authorization`: Bearer token (required)

**Parameters:**
- `quality`: Optional. Audio quality ('low', 'medium', 'high'). Default: 'medium'
- `format`: Optional. Output format ('mp3', 'aac', 'ogg'). Default: 'mp3'

**Responses:**
- `200 OK`: Full audio file
- `206 Partial Content`: Partial content (for range requests)
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Track not found
- `416 Range Not Satisfiable`: Invalid range requested

**Example Request:**
```
GET /api/v1/stream/track_123?quality=high
Range: bytes=0-
Authorization: Bearer your-jwt-token
```

### Get Stream Info
Get metadata about a streamable track.

**Endpoint:** `GET /stream/:trackId/info`

**Headers:**
- `Authorization`: Bearer token (required)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "trackId": "track_123",
    "title": "Sample Track",
    "artist": "Sample Artist",
    "album": "Sample Album",
    "duration": 237.5,
    "bitrate": 320,
    "sampleRate": 44100,
    "channels": 2,
    "format": "mp3",
    "size": 9500000,
    "availableQualities": ["low", "medium", "high"],
    "availableFormats": ["mp3", "aac", "ogg"],
    "streamUrl": "/api/v1/stream/track_123"
  }
}
```

### Get Stream URL
Get a signed URL for streaming (useful for CDN integration).

**Endpoint:** `POST /stream/url`

**Headers:**
- `Authorization`: Bearer token (required)
- `Content-Type`: application/json

**Request Body:**
```json
{
  "trackId": "track_123",
  "quality": "high",
  "format": "mp3",
  "expiresIn": 3600
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "url": "https://cdn.tuneton.com/stream/track_123?token=eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2025-08-08T15:30:00.000Z"
  }
}
```

### Get HLS Stream
Get HLS stream URL and playlist (for adaptive bitrate streaming).

**Endpoint:** `GET /stream/hls/:trackId`

**Headers:**
- `Authorization`: Bearer token (required)

**Parameters:**
- `quality`: Optional. Preferred quality ('low', 'medium', 'high'). Default: 'auto'

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "trackId": "track_123",
    "masterPlaylistUrl": "/api/v1/stream/hls/track_123/master.m3u8",
    "variants": [
      {
        "bandwidth": 128000,
        "codecs": "mp4a.40.2",
        "resolution": "audio-only",
        "playlistUrl": "/api/v1/stream/hls/track_123/128k.m3u8"
      },
      {
        "bandwidth": 256000,
        "codecs": "mp4a.40.2",
        "resolution": "audio-only",
        "playlistUrl": "/api/v1/stream/hls/track_123/256k.m3u8"
      },
      {
        "bandwidth": 320000,
        "codecs": "mp4a.40.2",
        "resolution": "audio-only",
        "playlistUrl": "/api/v1/stream/hls/track_123/320k.m3u8"
      }
    ]
  }
}
```

### Stream Health Check
Check if the streaming service is healthy.

**Endpoint:** `GET /stream/health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-08-08T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 12345.67,
  "services": {
    "storage": "ok",
    "database": "ok",
    "cache": "ok"
  }
}
```

## Tracks

### Get All Tracks
**Endpoint:** `GET /tracks`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term to filter tracks by title (optional)
- `genre`: Filter tracks by genre (optional)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "track_1",
      "title": "Track Title",
      "artist": "Artist Name",
      "duration": 240,
      "coverUrl": "https://example.com/cover1.jpg",
      "audioUrl": "https://example.com/audio1.mp3",
      "genre": "Rock",
      "isPublic": true,
      "playCount": 150,
      "userId": "user_1",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get Track by ID
**Endpoint:** `GET /tracks/:id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "track": {
      "id": "track_1",
      "title": "Track Title",
      "artist": "Artist Name",
      "duration": 240,
      "coverUrl": "https://example.com/cover1.jpg",
      "audioUrl": "https://example.com/audio1.mp3",
      "genre": "Rock",
      "isPublic": true,
      "playCount": 151,
      "userId": "user_1",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-02T00:00:00.000Z"
    }
  }
}
```

### Create a Track
**Endpoint:** `POST /tracks`

**Request Body:**
```json
{
  "title": "New Track",
  "artist": "Artist Name",
  "duration": 180,
  "coverUrl": "https://example.com/new-cover.jpg",
  "audioUrl": "https://example.com/new-audio.mp3",
  "genre": "Pop",
  "isPublic": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "track": {
      "id": "new_track_id",
      "title": "New Track",
      "artist": "Artist Name",
      "duration": 180,
      "coverUrl": "https://example.com/new-cover.jpg",
      "audioUrl": "https://example.com/new-audio.mp3",
      "genre": "Pop",
      "isPublic": true,
      "playCount": 0,
      "userId": "user_1",
      "createdAt": "2025-01-03T00:00:00.000Z",
      "updatedAt": "2025-01-03T00:00:00.000Z"
    }
  }
}
```

### Update a Track
**Endpoint:** `PATCH /tracks/:id`

**Request Body:**
```json
{
  "title": "Updated Track Title",
  "artist": "Updated Artist Name",
  "genre": "Rock",
  "isPublic": false
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "track": {
      "id": "track_1",
      "title": "Updated Track Title",
      "artist": "Updated Artist Name",
      "duration": 240,
      "coverUrl": "https://example.com/cover1.jpg",
      "audioUrl": "https://example.com/audio1.mp3",
      "genre": "Rock",
      "isPublic": false,
      "playCount": 151,
      "userId": "user_1",
      "updatedAt": "2025-01-03T12:00:00.000Z"
    }
  }
}
```

### Delete a Track
**Endpoint:** `DELETE /tracks/:id`

**Response:**
```http
HTTP/1.1 204 No Content
```

### Search Tracks
**Endpoint:** `GET /tracks/search`

**Query Parameters:**
- `q`: Search query (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `genre`: Filter by genre (optional)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "track_1",
      "title": "Track Title",
      "artist": "Artist Name",
      "duration": 240,
      "coverUrl": "https://example.com/cover1.jpg",
      "audioUrl": "https://example.com/audio1.mp3",
      "genre": "Rock"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
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
  "isPublic": true,
  "coverImageUrl": "https://example.com/cover.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist_id",
      "name": "My Playlist",
      "description": "Awesome tracks collection",
      "isPublic": true,
      "coverImageUrl": "https://example.com/cover.jpg",
      "userId": "user_id",
      "trackCount": 0,
      "playCount": 0,
      "duration": 0,
      "createdAt": "2025-08-07T15:00:00.000Z",
      "updatedAt": "2025-08-07T15:00:00.000Z"
    }
  }
}
```

### Get Playlist by ID
**Endpoint:** `GET /playlists/:id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist_id",
      "name": "My Playlist",
      "description": "Awesome tracks collection",
      "isPublic": true,
      "coverImageUrl": "https://example.com/cover.jpg",
      "userId": "user_id",
      "trackCount": 5,
      "playCount": 10,
      "duration": 1200,
      "createdAt": "2025-08-07T15:00:00.000Z",
      "updatedAt": "2025-08-07T15:00:00.000Z",
      "tracks": [
        {
          "id": "track_1",
          "title": "Track 1",
          "artist": "Artist 1",
          "duration": 240,
          "coverUrl": "https://example.com/track1.jpg",
          "audioUrl": "https://example.com/track1.mp3"
        }
      ]
    }
  }
}
```

### Update Playlist
**Endpoint:** `PATCH /playlists/:id`

**Request Body:**
```json
{
  "name": "Updated Playlist Name",
  "description": "Updated description",
  "isPublic": false,
  "coverImageUrl": "https://example.com/new-cover.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist_id",
      "name": "Updated Playlist Name",
      "description": "Updated description",
      "isPublic": false,
      "coverImageUrl": "https://example.com/new-cover.jpg",
      "userId": "user_id",
      "trackCount": 5,
      "playCount": 10,
      "duration": 1200,
      "updatedAt": "2025-08-07T15:30:00.000Z"
    }
  }
}
```

### Delete Playlist
**Endpoint:** `DELETE /playlists/:id`

**Response:**
```http
HTTP/1.1 204 No Content
```

### Get User's Playlists
**Endpoint:** `GET /users/:userId/playlists`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "total": 5,
  "page": 1,
  "limit": 20,
  "data": {
    "playlists": [
      {
        "id": "playlist_1",
        "name": "Playlist 1",
        "coverImageUrl": "https://example.com/cover1.jpg",
        "trackCount": 5,
        "isPublic": true
      }
    ]
  }
}
```

### Get Public Playlists
**Endpoint:** `GET /playlists/public`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:** Same as Get User's Playlists

### Add Tracks to Playlist
**Endpoint:** `POST /playlists/:id/tracks`

**Request Body:**
```json
{
  "trackIds": ["track_1", "track_2"]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "playlistTracks": [
      {
        "id": "playlist_track_1",
        "playlistId": "playlist_id",
        "trackId": "track_1",
        "position": 1,
        "addedAt": "2025-08-07T15:35:00.000Z"
      }
    ]
  }
}
```

### Remove Tracks from Playlist
**Endpoint:** `DELETE /playlists/:id/tracks`

**Request Body:**
```json
{
  "trackIds": ["track_1", "track_2"]
}
```

**Response:**
```http
HTTP/1.1 204 No Content
```

### Reorder Tracks in Playlist
**Endpoint:** `PATCH /playlists/:id/tracks/reorder`

**Request Body:**
```json
{
  "trackOrder": [
    { "trackId": "track_2", "position": 0 },
    { "trackId": "track_1", "position": 1 }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

### Search Playlists
**Endpoint:** `GET /playlists/search`

**Query Parameters:**
- `q`: Search query (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "total": 2,
  "page": 1,
  "limit": 20,
  "data": {
    "playlists": [
      {
        "id": "playlist_1",
        "name": "Rock Classics",
        "description": "Best rock songs ever",
        "coverImageUrl": "https://example.com/rock.jpg",
        "trackCount": 15,
        "isPublic": true,
        "userId": "user_1"
      }
    ]
  }
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
