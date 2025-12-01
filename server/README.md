# TuneTON Self-Hosted Backend

This is the self-hosted backend for the TuneTON music streaming platform, designed to replace the Supabase dependency.

## Features

- User authentication with Telegram WebApp
- Track management and playback tracking
- PostgreSQL database integration
- RESTful API endpoints
- CORS support

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- Telegram bot token

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   - Database credentials
   - Telegram bot token
   - Server port (default: 3001)

4. Set up the database:
   - Create a PostgreSQL database
   - Run the schema.sql script to create tables:
     ```bash
     psql -U your_username -d your_database -f database/schema.sql
     ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. For production, start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/telegram` - Authenticate with Telegram WebApp data

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks/:id` - Get a specific track
- `POST /api/tracks/:id/play` - Increment play count for a track

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_USER | Database user | tuneton |
| DB_PASSWORD | Database password |  |
| DB_NAME | Database name | tuneton |
| TELEGRAM_BOT_TOKEN | Telegram bot token |  |

## Database Schema

The database schema is defined in `database/schema.sql` and includes:

- `users` table for Telegram user data
- `tracks` table for music track metadata
- `playbacks` table for tracking playback counts

## Deployment

For deployment, you can use any Node.js hosting service. Make sure to:

1. Set the environment variables
2. Configure the database connection
3. Expose the configured port (default: 3001)