# Audio Processing Service

The Audio Processing Service is a core component of the TuneTON platform, responsible for handling audio file processing, including format conversion, pitch shifting, and tempo adjustment. It uses a distributed task queue to process audio files asynchronously and efficiently.

## Features

- **Audio Processing**: Convert between various audio formats (MP3, AAC, OGG, WAV, FLAC)
- **Pitch Shifting**: Adjust audio pitch by semitones
- **Tempo Adjustment**: Change playback speed without affecting pitch
- **Bitrate Control**: Customize output quality and file size
- **Distributed Processing**: Uses BullMQ for job queuing and processing
- **FFmpeg Integration**: Leverages FFmpeg for high-quality audio processing
- **RESTful API**: Easy integration with other services
- **Scalable**: Designed to handle high volumes of audio processing tasks

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Queue**: BullMQ with Redis
- **Audio Processing**: FFmpeg
- **Containerization**: Docker
- **Testing**: Jest, Supertest
- **Linting/Formatting**: ESLint, Prettier

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Redis (for job queue)
- FFmpeg (for audio processing)
- Docker (optional, for containerization)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tuneton.git
   cd tuneton/services/audio-processing-service
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Install FFmpeg (required for audio processing):
   - **macOS**: `brew install ffmpeg`
   - **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
   - **Windows**: Download from [FFmpeg official website](https://ffmpeg.org/download.html)

4. Set up environment variables (copy `.env.example` to `.env` and update values):
   ```bash
   cp .env.example .env
   ```

## Configuration

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Redis Configuration (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Storage Paths
STORAGE_UPLOAD_PATH=./uploads
STORAGE_PROCESSED_PATH=./processed
STORAGE_TEMP_PATH=./temp

# Logging
LOG_LEVEL=info
```

## Running the Service

### Development Mode

```bash
# Start Redis server (in a separate terminal)
redis-server

# Start the service
npm run dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start the service
npm start
```

### Using Docker

```bash
# Build the Docker image
docker build -t tuneton/audio-processing-service .

# Run the container
docker run -p 3002:3002 tuneton/audio-processing-service
```

## API Documentation

### Base URL

```
http://localhost:3002/api/v1/audio
```

### Endpoints

#### Process Audio

```
POST /process
```

Process an audio file with the specified options.

**Authentication:** Required

**Form Data:**
- `audio`: Audio file to process (required)
- `trackId`: ID of the track being processed (required)
- `format`: Output format (mp3, aac, ogg, wav, flac) (default: mp3)
- `options`: Processing options (optional)
  - `pitchShift`: Number of semitones to shift pitch (-12 to 12)
  - `tempo`: Playback speed (0.5 to 2.0)
  - `bitrate`: Output bitrate in kbps (64-320)

**Example Request:**
```bash
curl -X POST http://localhost:3002/api/v1/audio/process \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "audio=@/path/to/audio.wav" \
  -F "trackId=12345" \
  -F "format=mp3" \
  -F "options={\"pitchShift\":2,\"tempo\":1.2}"
```

#### Get Job Status

```
GET /status/:jobId
```

Get the status of an audio processing job.

**Authentication:** Required

**Example Response:**
```json
{
  "id": "job-123",
  "state": "completed",
  "progress": 100,
  "data": {
    "trackId": "12345",
    "format": "mp3"
  },
  "returnValue": {
    "status": "success",
    "outputPath": "/path/to/processed/audio.mp3",
    "duration": 180.5,
    "size": 4234567,
    "processingTime": 3456
  }
}
```

#### List Jobs

```
GET /jobs
```

List all audio processing jobs for the authenticated user.

**Query Parameters:**
- `status`: Filter by job status (waiting, active, completed, failed, delayed)
- `limit`: Number of jobs to return (default: 10)
- `offset`: Number of jobs to skip (default: 0)

## Development

### Running Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Deployment

### Docker Compose

A sample `docker-compose.yml` is provided for local development and testing:

```bash
docker-compose up -d
```

### Kubernetes

For production deployment, you can use the provided Kubernetes manifests in the `k8s/` directory.

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
