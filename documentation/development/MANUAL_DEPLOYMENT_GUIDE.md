# Manual Deployment Guide

## Overview

This document provides detailed instructions for manually deploying the TuneTON application to various hosting platforms and environments.

## Prerequisites

1. Node.js (version 16 or higher)
2. npm (version 7 or higher)
3. Git
4. Access to target deployment environment
5. Supabase account and project

## Build Process

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tuneTON_3.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.production` file with the following variables:

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

### 4. Create Production Build

```bash
npm run build:prod
```

This will generate the production build in the `dist/` directory.

## Deployment Options

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

#### Netlify

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

#### Vercel

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

#### GitHub Pages

1. Install gh-pages:

   ```bash
   npm install gh-pages --save-dev
   ```

2. Add deployment scripts to `package.json`:

   ```json
   {
     "scripts": {
       "predeploy": "npm run build:prod",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Option 2: Traditional Web Server (Apache, Nginx)

#### Apache

1. Copy the contents of the `dist/` directory to your web server's document root.

2. Configure `.htaccess` for routing:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

#### Nginx

1. Copy the contents of the `dist/` directory to your web server's document root.

2. Configure nginx for routing:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

### Option 3: Docker Deployment

1. Create a `Dockerfile`:

   ```dockerfile
   FROM nginx:alpine
   COPY dist/ /usr/share/nginx/html/
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Build and run:
   ```bash
   docker build -t tuneton .
   docker run -p 8080:80 tuneton
   ```

## Supabase Configuration

### 1. Database Setup

1. Create Supabase project
2. Run database migrations:
   ```bash
   supabase db push
   ```

### 2. Function Deployment

1. Deploy serverless functions:

   ```bash
   supabase functions deploy
   ```

2. Set environment secrets:
   ```bash
   supabase secrets set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

### 3. Data Migration

Migrate existing data from JSON files to the database:

```bash
npm run migrate:data
```

## Telegram Integration

### 1. Bot Configuration

1. Create a Telegram bot using BotFather
2. Set the WebApp URL in BotFather settings
3. Configure the bot token in your environment variables

### 2. WebApp Settings

1. Ensure your deployed URL matches the WebApp URL configured in BotFather
2. Test the integration by opening the WebApp from your bot

## Post-Deployment Verification

### 1. Functionality Testing

- Test audio playback
- Verify Telegram authentication
- Check Jamendo API integration
- Test all UI components

### 2. Performance Testing

- Verify page load times
- Check audio streaming performance
- Test on different devices and browsers

### 3. Security Testing

- Verify HTTPS is properly configured
- Check that sensitive information is not exposed
- Test authentication flows

## Monitoring and Maintenance

### 1. Error Tracking

- Set up error tracking (e.g., Sentry)
- Monitor console errors in browser dev tools
- Check Supabase function logs

### 2. Performance Monitoring

- Monitor page load performance
- Track audio playback quality
- Monitor API response times

### 3. Regular Updates

- Regularly update dependencies
- Apply security patches
- Monitor for breaking changes in dependencies

## Troubleshooting Common Issues

### 1. Blank Page or Loading Issues

- Verify all environment variables are set correctly
- Check browser console for errors
- Ensure routing is properly configured on your server

### 2. Audio Playback Problems

- Check browser console for Web Audio API errors
- Verify audio files are accessible
- Test with different audio formats

### 3. Authentication Failures

- Verify Telegram bot token is correct
- Check Supabase configuration
- Ensure CORS is properly configured

### 4. API Connection Errors

- Verify Supabase project URL is correct
- Check that functions are deployed
- Ensure network connectivity

## Rollback Procedure

### 1. Identify Previous Working Version

- Check deployment history
- Identify the last known good version

### 2. Revert Changes

- Restore previous build from backup
- Revert database changes if necessary
- Update environment variables if needed

### 3. Verify Functionality

- Test all critical functionality
- Monitor for any issues
- Notify users if necessary

## Conclusion

This manual deployment guide provides comprehensive instructions for deploying the TuneTON application to various environments. By following these steps, you can successfully deploy the application while ensuring proper configuration and functionality.
