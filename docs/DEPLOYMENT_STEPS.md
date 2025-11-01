# Deployment Steps for Telegram Authentication Function

## Prerequisites
1. Install Docker Desktop (https://www.docker.com/products/docker-desktop/)
2. Ensure Supabase CLI is installed (https://supabase.com/docs/guides/cli/getting-started)
3. Verify you have the correct project reference (dthrpvpuzinmevrvqlhv)

## Deployment Process

### 1. Start Docker
- Open Docker Desktop application
- Wait for Docker to start completely

### 2. Verify Environment Variables
```bash
# Check that the Telegram bot token is set
supabase secrets list
```

If the token is not set, set it:
```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
```

### 3. Deploy the Function
```bash
# Navigate to your project directory
cd /path/to/tuneTON_3.0

# Deploy the telegram-auth function
supabase functions deploy telegram-auth --project-ref dthrpvpuzinmevrvqlhv
```

### 4. Verify Deployment
- Go to Supabase Dashboard: https://supabase.com/dashboard/project/dthrpvpuzinmevrvqlhv/functions
- Check that the telegram-auth function is listed and active
- Verify the function code matches the updated implementation

### 5. Test the Function
- Open your Telegram Mini App
- Try to authenticate
- Check the function logs in the Supabase Dashboard for any errors

## Testing the Updated Function

### 1. Test Endpoint Accessibility
```bash
curl -X POST https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/telegram-auth \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -d '{"initData": "test_data"}'
```

### 2. Test with Valid Telegram Data
Use the test script:
```bash
node test_telegram_auth.js
```

## Monitoring and Debugging

### 1. Check Function Logs
```bash
supabase functions logs telegram-auth
```

### 2. Monitor Database
Verify users are being created in both:
- `auth.users` table
- `public.users` table

### 3. Check Rate Limiting
Monitor the `rate_limit` table for proper rate limiting behavior.

## Troubleshooting

### Common Issues
1. **Docker not running**: Ensure Docker Desktop is started
2. **Deployment timeout**: Try deploying again or check your internet connection
3. **Function not updating**: Clear any cached versions and redeploy
4. **Environment variables not set**: Verify secrets are set correctly
5. **Authentication fails**: Check that TELEGRAM_BOT_TOKEN is set correctly as secret
6. **User creation issues**: Verify database permissions and table structure

### Checking Function Logs
- In Supabase Dashboard, navigate to Edge Functions
- Select the telegram-auth function
- View the logs tab to see real-time execution logs

### Verifying Database Changes
- Check the `users` table to see if new users are being created
- Check the `rate_limit` table to verify rate limiting is working
- Verify users appear in both `auth.users` and `public.users` tables

## Rollback Procedure

If issues occur after deployment:

1. Revert to previous function version:
```bash
supabase functions deploy telegram-auth --project-ref dthrpvpuzinmevrvqlhv --replace-existing
```

2. Check Supabase logs for error details
3. Review function code and make necessary fixes
4. Redeploy with fixes

## Security Considerations

1. Never commit TELEGRAM_BOT_TOKEN to version control
2. Always use Supabase function secrets for sensitive data
3. Monitor function logs for suspicious activity
4. Regularly review rate limiting effectiveness