# API Specification

## Overview

This document provides a comprehensive specification for all APIs used in the TuneTON application, including internal services, external integrations, and third-party APIs. It covers REST endpoints, authentication mechanisms, data formats, and integration patterns.

## API Architecture

### Service APIs

#### 1. Supabase Functions API (Primary)

- **Base URL**: `https://your-project.supabase.co/functions/v1`
- **Protocol**: HTTPS
- **Format**: JSON
- **Authentication**: JWT tokens for authenticated endpoints

#### 2. Legacy Node.js Internal REST API (Deprecated)

- **Base URL**: `/api`
- **Protocol**: HTTPS
- **Format**: JSON
- **Authentication**: None required for public endpoints

#### 3. PHP API Endpoints (Legacy)

- **Base URL**: `/api/*.php`
- **Protocol**: HTTPS
- **Format**: JSON
- **Authentication**: None required for public endpoints

#### 4. Jamendo API

- **Base URL**: `https://api.jamendo.com/v3.0`
- **Protocol**: HTTPS
- **Format**: JSON
- **Authentication**: API key

### API Versioning

All APIs follow semantic versioning:

- **Major**: Breaking changes
- **Minor**: Backward-compatible feature additions
- **Patch**: Backward-compatible bug fixes

## Supabase Functions API (Primary)

### Base URL Structure

```
https://your-project.supabase.co/functions/v1/
```

### Track Management

#### List All Tracks

```
GET /functions/v1/tracks
```

**Response**:

```json
[
  {
    "id": "string",
    "title": "string",
    "artist": "string",
    "duration": "number",
    "playCount": "number",
    "audioUrl": "string"
  }
]
```

**Response Codes**:

- `200`: Success
- `500`: Internal server error

#### Record Playback

```
POST /functions/v1/playbacks/:trackId
```

**Parameters**:

- `trackId` (path): Track identifier

**Response**:

```json
{
  "trackId": "string",
  "playCount": "number",
  "totalPlaybacks": "number"
}
```

**Response Codes**:

- `200`: Success
- `400`: Invalid request
- `404`: Track not found
- `500`: Internal server error

### Health Check

```
GET /functions/v1/health
```

**Response**:

```json
{
  "status": "ok",
  "timestamp": "string (ISO 8601)"
}
```

**Response Codes**:

- `200`: Success

### Error Responses

#### Standard Error Format

```json
{
  "error": "string"
}
```

## Telegram Authentication Function

#### Endpoint

```
POST https://your-project.supabase.co/functions/v1/telegram-auth
```

#### Request

```json
{
  "initData": "string (Telegram WebApp initData)"
}
```

#### Response

```json
{
  "access_token": "string (JWT token)",
  "refresh_token": "string (refresh token)",
  "user": {
    "id": "string (UUID)",
    "aud": "string",
    "role": "string",
    "email": "string",
    "user_metadata": {
      "telegram_id": "string",
      "username": "string",
      "first_name": "string",
      "last_name": "string",
      "photo_url": "string",
      "auth_date": "string (ISO 8601)"
    }
  }
}
```

#### Error Responses

```json
{
  "error": "string"
}
```

#### Error Codes

- `Invalid initData`: Telegram initData validation failed
- `Expired auth`: Authentication data too old (1-hour limit)
- `Rate limited`: Too many authentication attempts (10 requests per 15 minutes per IP)
- `User creation failed`: Failed to create/update user
- `Internal error`: Server-side processing error

## Legacy Node.js Internal REST API (Deprecated)

### Base URL Structure

```
http://localhost:3001/api/
```

### Track Management

#### List All Tracks

```
GET /api/tracks
```

**Response**:

```json
[
  {
    "id": "string",
    "title": "string",
    "artist": "string",
    "duration": "number",
    "playCount": "number",
    "audioUrl": "string"
  }
]
```

**Response Codes**:

- `200`: Success
- `500`: Internal server error

#### Record Playback

```
POST /api/playbacks/:trackId
```

**Parameters**:

- `trackId` (path): Track identifier

**Response**:

```json
{
  "trackId": "string",
  "playCount": "number",
  "totalPlaybacks": "number"
}
```

**Response Codes**:

- `200`: Success
- `400`: Invalid request
- `404`: Track not found
- `500`: Internal server error

### Health Check

```
GET /api/health
```

**Response**:

```json
{
  "status": "ok",
  "timestamp": "string (ISO 8601)"
}
```

**Response Codes**:

- `200`: Success

### Cache Warm-up

```
GET /api/warmup
```

**Response**:

```json
{
  "status": "cache_warmed",
  "tracks": "number"
}
```

**Response Codes**:

- `200`: Success

### Error Responses

#### Standard Error Format

```json
{
  "error": "string"
}
```

## PHP API Endpoints (Legacy)

### Track Listing

```
GET /api/tracks.php
```

**Response**:

```json
{
  "success": "boolean",
  "count": "number",
  "tracks": [
    {
      "id": "string",
      "title": "string",
      "artist": "string",
      "duration": "number",
      "playCount": "number",
      "audioUrl": "string"
    }
  ]
}
```

**Response Codes**:

- `200`: Success
- `500`: Internal server error

### Playback Tracking

```
POST /api/playback.php?id=:trackId
```

**Parameters**:

- `trackId` (query): Track identifier

**Response**:

```json
{
  "trackId": "string",
  "playCount": "number",
  "totalPlaybacks": "number"
}
```

**Response Codes**:

- `200`: Success
- `400`: Invalid request
- `500`: Internal server error

### Simple API Router

```
GET/POST /api.php?path=:endpoint
```

**Parameters**:

- `path` (query): API endpoint (tracks, playbacks/:id)

**Response**:

```json
[
  {
    "id": "string",
    "title": "string",
    "artist": "string",
    "duration": "number",
    "playCount": "number",
    "audioUrl": "string"
  }
]
```

**Response Codes**:

- `200`: Success
- `404`: Not found

## Jamendo API Integration

### Base URL

```
https://api.jamendo.com/v3.0/
```

### Authentication

- **Method**: Client ID in query parameter
- **Parameter**: `client_id=YOUR_CLIENT_ID`

### Track Search

#### Endpoint

```
GET https://api.jamendo.com/v3.0/tracks
```

#### Parameters

- `client_id` (required): Jamendo API client ID
- `format` (optional): Response format (json)
- `limit` (optional): Number of results (default: 10, max: 200)
- `offset` (optional): Pagination offset
- `search` (optional): Search query
- `tags` (optional): Filter by tags
- `genre` (optional): Filter by genre
- `order` (optional): Sort order (popularity, date, etc.)

#### Response

```json
{
  "headers": {
    "status": "string",
    "code": "number",
    "error_message": "string",
    "warnings": "string",
    "results_count": "number"
  },
  "results": [
    {
      "id": "string",
      "name": "string",
      "duration": "number",
      "artist_id": "string",
      "artist_name": "string",
      "album_name": "string",
      "album_id": "string",
      "license_ccurl": "string",
      "position": "number",
      "release_date": "string",
      "genre": "string",
      "tags": ["string"],
      "image": "string (URL)",
      "audio": "string (URL)",
      "audiodownload": "string (URL)",
      "prourl": "string",
      "shorturl": "string",
      "shareurl": "string",
      "waveform": "string (URL)"
    }
  ]
}
```

## Telegram WebApp API

### Initialization Data

#### Data Structure

The Telegram WebApp provides initialization data through `Telegram.WebApp.initData`:

```javascript
{
  "query_id": "string",
  "user": {
    "id": "number",
    "first_name": "string",
    "last_name": "string",
    "username": "string",
    "language_code": "string",
    "is_premium": "boolean",
    "added_to_attachment_menu": "boolean",
    "allows_write_to_pm": "boolean",
    "photo_url": "string"
  },
  "auth_date": "number (Unix timestamp)",
  "hash": "string (HMAC-SHA256 hash)"
}
```

### API Methods

#### User Data Access

```javascript
// Get user information
const user = Telegram.WebApp.initDataUnsafe.user;

// Get authentication date
const authDate = Telegram.WebApp.initDataUnsafe.auth_date;

// Get hash for validation
const hash = Telegram.WebApp.initDataUnsafe.hash;
```

#### Theme Parameters

```javascript
// Get current theme parameters
const themeParams = Telegram.WebApp.themeParams;

// Available theme properties
{
  "bg_color": "#RRGGBB",
  "text_color": "#RRGGBB",
  "hint_color": "#RRGGBB",
  "link_color": "#RRGGBB",
  "button_color": "#RRGGBB",
  "button_text_color": "#RRGGBB"
}
```

#### Viewport Information

```javascript
// Get viewport dimensions
const viewportHeight = Telegram.WebApp.viewportHeight;
const viewportStableHeight = Telegram.WebApp.viewportStableHeight;

// Listen for viewport changes
Telegram.WebApp.onEvent('viewportChanged', (eventData) => {
  console.log('Viewport changed:', eventData);
});
```

## Web Audio API Integration

### Audio Engine API

#### Initialization

```typescript
// Initialize audio engine
const audioEngine = new WebAudioEngine();
```

#### Playback Control

```typescript
// Load and play track
await audioEngine.loadTrack(trackObject);
audioEngine.play();

// Control playback
audioEngine.pause();
audioEngine.stop();
audioEngine.seek(30); // Seek to 30 seconds
```

#### Effect Controls

```typescript
// Tempo and pitch
audioEngine.setTempo(1.2); // 120% speed
audioEngine.setPitchSemitones(2); // +2 semitones

// Lo-Fi effects
audioEngine.setLofiTone(800); // Cutoff frequency
audioEngine.setLofiNoiseLevel(0.5); // Noise level
audioEngine.setLofiWowFlutter(5, 0.5); // Depth and rate

// EQ settings
audioEngine.setEQBand(0, -2); // Set band 0 to -2dB
audioEngine.setEQBand(1, 0);  // Set band 1 to 0dB
// ... set all 7 bands

// Reverb
audioEngine.setReverbMix(0.5);
audioEngine.setReverbPreDelay(20);
audioEngine.setReverbDamping(8000);
audioEngine.setReverbPreset('medium');

// Low-pass filter
audioEngine.setLowPassTone(15000);
audioEngine.setLowPassResonance(0.7);
```

#### State Queries

```typescript
// Get current state
const currentTime = audioEngine.getCurrentTime();
const duration = audioEngine.getDuration();
const analyser = audioEngine.getAnalyser();
```

## Rate Limiting and Throttling

### API Rate Limits

#### Supabase Functions

- **Telegram Auth**: 10 requests per 15 minutes per IP
- **Window**: 15 minutes sliding window
- **Response**: 429 Too Many Requests

#### Jamendo API

- **Limit**: 1000 requests per day per client ID
- **Window**: 24 hours
- **Response**: 429 Too Many Requests

### Client-Side Throttling

Implement exponential backoff for failed requests:

```javascript
async function apiRequestWithRetry(url, options, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        // Wait before retry with exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (i === maxRetries - 1) throw error;
    }
  }

  throw lastError;
}
```

## Data Models

### User Model

```typescript
interface User {
  id: string; // UUID
  aud: string; // Audience
  role: string; // User role
  email: string; // Email (may be empty for Telegram users)
  user_metadata: {
    telegram_id: string; // Telegram user ID
    username: string; // Telegram username
    first_name: string; // First name
    last_name: string; // Last name
    photo_url: string; // Profile photo URL
    auth_date: string; // ISO 8601 timestamp
  };
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
```

### Track Model

```typescript
interface Track {
  id: string; // Track identifier
  title: string; // Track title
  artist: string; // Artist name
  duration: number; // Duration in seconds
  playCount: number; // Number of plays
  audioUrl: string; // Audio file URL
}
```

### Playback Model

```typescript
interface PlaybackResponse {
  trackId: string; // Associated track ID
  playCount: number; // Current play count for this track
  totalPlaybacks: number; // Total playbacks across all tracks
}
```

## Security Considerations

### Authentication Security

- **Telegram Data Validation**: HMAC-SHA256 validation with 1-hour timestamp limit
- **Rate Limiting**: 10 requests per 15 minutes per IP for authentication
- **Token Management**: Secure storage and transmission of JWT tokens
- **Session Management**: Automatic session renewal

### Data Validation

- **Input Sanitization**: All API inputs validated
- **Output Encoding**: Proper encoding for responses
- **Parameter Validation**: Strict validation of all parameters

### Transport Security

- **HTTPS Only**: All API communication over HTTPS in production
- **CORS**: Proper CORS configuration for development
- **Content Security**: Strict Content Security Policy

## Monitoring and Analytics

### API Usage Tracking

- **Request Logging**: All API requests logged in Supabase functions
- **Performance Metrics**: Response times, error rates
- **Usage Analytics**: Feature adoption, user patterns
- **Security Monitoring**: Suspicious activity detection through rate limiting

### Health Checks

```
GET /functions/v1/health
```

**Response**:

```json
{
  "status": "ok",
  "timestamp": "string (ISO 8601)"
}
```

This API specification provides a comprehensive overview of all APIs used in the TuneTON application, including detailed endpoint specifications, data models, and integration patterns.
