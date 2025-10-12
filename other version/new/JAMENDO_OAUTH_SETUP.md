# Jamendo OAuth Setup for TuneTON Telegram Mini App

This guide explains how to configure the OAuth Redirect URL for Jamendo API integration in your TuneTON Telegram Mini App.

## 🔑 What is OAuth Redirect URL?

The OAuth Redirect URL (also called "callback URL") is where Jamendo sends users back to your app after they authorize or deny access to their account. It's a crucial part of the OAuth 2.0 flow.

## 🏗️ How to Configure Redirect URL

### Step 1: Access Jamendo Developer Console

1. Go to [Jamendo Developer Console](https://devportal.jamendo.com/)
2. Log in with your Jamendo account
3. Navigate to your application settings
4. Find the "OAuth Redirect URIs" or "Callback URLs" section

### Step 2: Configure Redirect URLs

You need to add different URLs for different environments:

#### For Development (localhost):
```
http://localhost:3000/oauth/jamendo
```

#### For Production (your deployed app):
```
https://your-actual-domain.com/oauth/jamendo
```

#### For Telegram Mini App (alternative):
```
https://t.me/your_bot_name?start=oauth_callback
```

### Step 3: Environment Configuration

Update your `.env` file:

```env
# Jamendo API Configuration
VITE_JAMENDO_CLIENT_ID=8ed40859
VITE_JAMENDO_CLIENT_SECRET=71300a550108108c5a1ef3316a13edf7
VITE_JAMENDO_REDIRECT_URI=https://your-tuneton-app.com/oauth/jamendo
```

## 🚀 Implementation Options

### Option 1: Web App Redirect (Recommended)

**Best for:** Most Telegram Mini Apps

1. **Set redirect URL to:** `https://your-domain.com/oauth/jamendo`
2. **Create a simple callback page** that:
   - Extracts the authorization code from URL parameters
   - Exchanges it for an access token
   - Redirects back to Telegram Mini App
3. **The app automatically handles** token storage and API calls

```javascript
// Example callback URL structure:
https://your-domain.com/oauth/jamendo?code=AUTH_CODE&state=OPTIONAL_STATE
```

### Option 2: Telegram Deep Link

**Best for:** Advanced integrations with Telegram Bot

1. **Set redirect URL to:** `https://t.me/your_bot_name?start=oauth_callback`
2. **Handle OAuth response** in your Telegram Bot
3. **Pass tokens back** to Mini App via Bot API

### Option 3: Localhost (Development Only)

**Best for:** Local development and testing

1. **Set redirect URL to:** `http://localhost:3000/oauth/jamendo`
2. **Only works** when testing locally
3. **Must change to production URL** before deployment

## 📱 Telegram Mini App Integration

### Method 1: Redirect Flow (Recommended)

```typescript
import { startJamendoOAuth } from './utils/jamendo-oauth';

// Start OAuth flow
const handleConnectJamendo = () => {
  startJamendoOAuth('user_state_data');
};
```

### Method 2: Popup Window

```typescript
// Open OAuth in popup (may be blocked)
const authUrl = jamendoOAuth.getAuthorizationUrl();
window.open(authUrl, 'jamendo_oauth', 'width=600,height=700');
```

## 🔧 Required OAuth Scopes

Configure these scopes in Jamendo Developer Console:

- `music` - Access to music catalog
- `userinfo` - Access to user profile information
- `playlists_read` - Read user's playlists
- `playlists_write` - Create and modify playlists

## 🛡️ Security Considerations

### State Parameter
Always use the `state` parameter to prevent CSRF attacks:

```typescript
const state = generateRandomString(); // Store this temporarily
startJamendoOAuth(state);
```

### Token Storage
Tokens are automatically stored in localStorage with expiration handling:

```typescript
// Check if user is authenticated
if (jamendoOAuth.isAuthenticated()) {
  // User has valid tokens
  const favorites = await jamendoOAuth.getUserFavorites();
}
```

### HTTPS Required
- Production redirect URLs **must use HTTPS**
- HTTP only allowed for localhost development
- Telegram Mini Apps require HTTPS for OAuth

## 🔄 OAuth Flow Diagram

```
1. User clicks "Connect Jamendo" in TuneTON
   ↓
2. App redirects to Jamendo authorization
   ↓
3. User authorizes (or denies) access
   ↓
4. Jamendo redirects to your callback URL
   ↓
5. Callback page exchanges code for tokens
   ↓
6. User redirected back to TuneTON with access
```

## 📝 Example Redirect URL Configuration

### In Jamendo Developer Console:
```
Application Name: TuneTON
Redirect URIs:
  - http://localhost:3000/oauth/jamendo (development)
  - https://tuneton-app.vercel.app/oauth/jamendo (production)
  - https://your-custom-domain.com/oauth/jamendo (custom domain)
```

### In your code:
```typescript
// The OAuth system automatically detects environment
// and uses appropriate redirect URI
const authUrl = jamendoOAuth.getAuthorizationUrl();
```

## 🚨 Common Issues

### Issue: "Invalid Redirect URI"
**Solution:** Ensure exact match between configured URI and actual callback URL

### Issue: "Popup Blocked"
**Solution:** Use redirect flow instead of popup for Telegram Mini Apps

### Issue: "CORS Error"
**Solution:** OAuth redirects don't trigger CORS - this happens during token exchange

### Issue: "Token Expired"
**Solution:** Tokens auto-refresh when possible, or user needs to re-authenticate

## 🎯 Benefits of OAuth Integration

With OAuth authentication, your TuneTON app can:

- ✅ Access user's personal Jamendo playlists
- ✅ Save tracks to user's favorites
- ✅ Create custom playlists on Jamendo
- ✅ Sync user preferences across devices
- ✅ Get higher API rate limits
- ✅ Access premium Jamendo features

## 📞 Need Help?

If you're having issues with OAuth setup:

1. Check [Jamendo API Documentation](https://developer.jamendo.com/)
2. Verify redirect URLs match exactly
3. Test with localhost first, then production
4. Check browser console for error messages
5. Ensure your app uses HTTPS in production

---

**Important:** The current TuneTON implementation works without OAuth for basic music streaming. OAuth is only needed for advanced features like user playlists and favorites.