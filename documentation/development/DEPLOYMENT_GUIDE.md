# TuneTON Deployment Guide

## Prerequisites

1. Node.js (version 16 or higher)
2. npm (version 7 or higher)
3. Git
4. Supabase account and project

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tuneTON_3.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Make sure your `.env` and `.env.production` files are properly configured with the required variables:

```properties
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
VITE_APP_ENV=production
VITE_API_URL=https://your-project.supabase.co/functions/v1
VITE_API_BASE_URL=https://your-project.supabase.co/functions/v1

# Telegram Web App Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_WEBAPP_PLATFORM=web
VITE_TELEGRAM_WEBAPP_URL=your_app_url

# Jamendo API (for music data)
VITE_JAMENDO_CLIENT_ID=your_jamendo_client_id
```

### 4. Supabase Setup

1. Create a Supabase project
2. Run database migrations:
   ```bash
   supabase db push
   ```
3. Deploy serverless functions:
   ```bash
   supabase functions deploy
   ```
4. Set environment secrets:
   ```bash
   supabase secrets set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

### 5. Data Migration

Migrate existing data from JSON files to the database:

```bash
npm run migrate:data
```

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access the Application

- Frontend: http://localhost:3001
- API Endpoints: https://your-project.supabase.co/functions/v1/

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Serve the Application

You can serve the built application using any static file server. For example, using Vite's preview server:

```bash
npm run preview
```

Or using a production-ready server like Nginx or Apache.

### 3. Deploy to Supabase

1. Deploy database schema:
   ```bash
   supabase db push
   ```
2. Deploy functions:
   ```bash
   supabase functions deploy
   ```
3. Set secrets:
   ```bash
   supabase secrets set TELEGRAM_BOT_TOKEN=your_production_telegram_bot_token
   ```

## Troubleshooting

### Common Issues

1. **Infinite Loading Screen**:
   - Ensure environment variables are correctly set
   - Check browser console for errors
   - Verify Supabase functions are deployed

2. **API Connection Errors**:
   - Verify Supabase project URL is correct
   - Check that functions are deployed
   - Ensure CORS is properly configured

3. **Telegram Authentication Issues**:
   - Verify `VITE_TELEGRAM_BOT_TOKEN` is correctly set
   - Ensure the Telegram WebApp is properly configured
   - Check Supabase configuration

### Debugging Steps

1. Check Supabase function logs:
   ```bash
   supabase functions logs
   ```
2. Verify all environment variables are set
3. Test API endpoints directly:
   ```bash
   curl https://your-project.supabase.co/functions/v1/health
   ```
4. Check browser developer tools console and network tabs

## Environment Variables Explanation

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key for client-side operations
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for server-side operations
- `VITE_API_URL`: Supabase functions URL for authentication
- `VITE_API_BASE_URL`: Base URL for API requests (Supabase functions URL)
- `VITE_TELEGRAM_BOT_TOKEN`: Telegram bot token for authentication
- `VITE_TELEGRAM_WEBAPP_URL`: URL where the app is hosted
- `VITE_JAMENDO_CLIENT_ID`: Jamendo API client ID for music content

## Additional Notes

- The application uses Supabase for authentication, database operations, and serverless functions
- Telegram WebApp integration requires proper bot configuration
- Audio files should be placed in the `public/audio` directory
- All backend functionality is implemented as Supabase Edge Functions
