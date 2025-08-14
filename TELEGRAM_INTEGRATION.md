# Telegram Web App Integration

This document explains how the Telegram Web App integration works in the MelodyMix application.

## Features

- Seamless authentication with Telegram accounts
- Protected routes that require authentication
- Responsive onboarding experience
- Development mode support for testing outside Telegram

## How It Works

1. **Authentication Flow**:
   - When the app loads, it checks if it's running inside Telegram WebView
   - If running in Telegram, it initializes the WebApp and checks for user data
   - If not authenticated, users are redirected to the onboarding screen
   - Users can connect their Telegram account via the onboarding flow

2. **Development Mode**:
   - When running outside Telegram (e.g., in a browser), a mock user is used
   - This allows for easier development and testing

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_APP_URL=http://localhost:3000
```

## Testing in Telegram

1. Set up a Telegram bot using [@BotFather](https://t.me/botfather)
2. Enable the Web App feature for your bot
3. Set the Web App URL to your local tunnel (e.g., `https://your-app.ngrok.io`)
4. Open the bot in Telegram and click the "Start" button

## Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Use a tunneling service like ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```

3. Update your bot's Web App URL with the ngrok URL

## Production Deployment

For production, make sure to:
1. Set `NODE_ENV=production`
2. Update the Web App URL in your bot settings
3. Use HTTPS for all connections
4. Implement proper error handling and logging

## Security Notes

- Always validate Telegram WebApp data on the server side
- Never expose your bot token in client-side code
- Use environment variables for sensitive configuration
- Implement rate limiting on authentication endpoints
