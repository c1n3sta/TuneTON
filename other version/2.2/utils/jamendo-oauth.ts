// Jamendo OAuth integration for TuneTON Telegram Mini App
const JAMENDO_CLIENT_ID = '8ed40859';
const JAMENDO_CLIENT_SECRET = '71300a550108108c5a1ef3316a13edf7'; // From .env.example
const JAMENDO_AUTH_URL = 'https://api.jamendo.com/v3.0/oauth/authorize';
const JAMENDO_TOKEN_URL = 'https://api.jamendo.com/v3.0/oauth/grant';

interface JamendoOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

interface JamendoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export class JamendoOAuth {
  private config: JamendoOAuthConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // For Telegram Mini App, we have several redirect URL options:
    this.config = {
      clientId: JAMENDO_CLIENT_ID,
      clientSecret: JAMENDO_CLIENT_SECRET,
      // Option 1: Use your deployed web app URL
      redirectUri: this.getRedirectUri(),
      // Available scopes: music, userinfo, playlists_read, playlists_write
      scope: 'music userinfo playlists_read playlists_write'
    };

    // Try to load existing tokens from localStorage
    this.loadStoredTokens();
  }

  /**
   * Determine the correct redirect URI based on environment
   * 
   * For Jamendo OAuth Redirect URL configuration:
   * 
   * 1. PRODUCTION (Telegram Mini App):
   *    - Use your web app domain: https://your-domain.com/oauth/jamendo
   *    - Create a simple webpage that handles the OAuth callback
   *    - This page extracts the authorization code and redirects back to Telegram
   * 
   * 2. DEVELOPMENT:
   *    - Use localhost: http://localhost:3000/oauth/jamendo
   *    - For testing outside Telegram
   * 
   * 3. ALTERNATIVE (Telegram Bot Deep Link):
   *    - Use Telegram deep link: https://t.me/your_bot_name?start=oauth_callback
   *    - Handle OAuth response in your bot
   */
  private getRedirectUri(): string {
    // Check if we're in development mode
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000/oauth/jamendo';
    }
    
    // Production - replace with your actual domain
    // This should be the URL where your TuneTON app is hosted
    return 'https://your-tuneton-app.com/oauth/jamendo';
    
    // Alternative: Use a dedicated OAuth handling service
    // return 'https://oauth-handler.your-domain.com/jamendo';
  }

  /**
   * Generate OAuth authorization URL
   * User will be redirected to this URL to authorize your app
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
      ...(state && { state })
    });

    return `${JAMENDO_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * This happens after user returns from Jamendo authorization
   */
  async exchangeCodeForToken(authorizationCode: string): Promise<JamendoTokenResponse> {
    const response = await fetch(JAMENDO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code',
        code: authorizationCode
      })
    });

    if (!response.ok) {
      throw new Error(`OAuth token exchange failed: ${response.status} ${response.statusText}`);
    }

    const tokenData: JamendoTokenResponse = await response.json();
    
    // Store tokens
    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token || null;
    this.storeTokens(tokenData);

    return tokenData;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<JamendoTokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(JAMENDO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
    }

    const tokenData: JamendoTokenResponse = await response.json();
    
    // Update stored tokens
    this.accessToken = tokenData.access_token;
    if (tokenData.refresh_token) {
      this.refreshToken = tokenData.refresh_token;
    }
    this.storeTokens(tokenData);

    return tokenData;
  }

  /**
   * Make authenticated API request
   */
  async makeAuthenticatedRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    const url = new URL(`https://api.jamendo.com/v3.0/${endpoint}`);
    
    // Add OAuth access token
    url.searchParams.append('access_token', this.accessToken);
    url.searchParams.append('format', 'json');
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join('+'));
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (response.status === 401) {
        // Token might be expired, try to refresh
        try {
          await this.refreshAccessToken();
          // Retry the request with new token
          url.searchParams.set('access_token', this.accessToken!);
          const retryResponse = await fetch(url.toString());
          
          if (!retryResponse.ok) {
            throw new Error(`API request failed: ${retryResponse.status} ${retryResponse.statusText}`);
          }
          
          return await retryResponse.json();
        } catch (refreshError) {
          // Refresh failed, user needs to re-authenticate
          this.clearTokens();
          throw new Error('Authentication expired. Please log in again.');
        }
      }
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Authenticated API request failed:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite tracks (requires OAuth)
   */
  async getUserFavorites(limit: number = 20): Promise<any> {
    return this.makeAuthenticatedRequest('users/favorites', { limit });
  }

  /**
   * Get user's playlists (requires OAuth)
   */
  async getUserPlaylists(limit: number = 20): Promise<any> {
    return this.makeAuthenticatedRequest('users/playlists', { limit });
  }

  /**
   * Add track to user's favorites (requires OAuth)
   */
  async addToFavorites(trackId: string): Promise<any> {
    return this.makeAuthenticatedRequest('users/favorites', { 
      track_id: trackId,
      action: 'add'
    });
  }

  /**
   * Create a new playlist (requires OAuth)
   */
  async createPlaylist(name: string, trackIds: string[] = []): Promise<any> {
    return this.makeAuthenticatedRequest('users/playlists', {
      name,
      track_ids: trackIds.join(','),
      action: 'create'
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Clear all tokens and logout
   */
  logout(): void {
    this.clearTokens();
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(tokenData: JamendoTokenResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jamendo_access_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('jamendo_refresh_token', tokenData.refresh_token);
      }
      // Store expiration time
      const expiresAt = Date.now() + (tokenData.expires_in * 1000);
      localStorage.setItem('jamendo_token_expires_at', expiresAt.toString());
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadStoredTokens(): void {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('jamendo_access_token');
      const refreshToken = localStorage.getItem('jamendo_refresh_token');
      const expiresAt = localStorage.getItem('jamendo_token_expires_at');

      if (accessToken && expiresAt) {
        const expirationTime = parseInt(expiresAt);
        if (Date.now() < expirationTime) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
        } else {
          // Token expired, clear it
          this.clearTokens();
        }
      }
    }
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jamendo_access_token');
      localStorage.removeItem('jamendo_refresh_token');
      localStorage.removeItem('jamendo_token_expires_at');
    }
  }
}

// Export singleton instance
export const jamendoOAuth = new JamendoOAuth();

/**
 * Utility function to handle OAuth callback
 * Call this when user returns from Jamendo authorization
 */
export const handleOAuthCallback = async (authorizationCode: string, state?: string): Promise<boolean> => {
  try {
    await jamendoOAuth.exchangeCodeForToken(authorizationCode);
    console.log('Jamendo OAuth authentication successful');
    return true;
  } catch (error) {
    console.error('Jamendo OAuth callback failed:', error);
    return false;
  }
};

/**
 * Start OAuth flow for Telegram Mini App
 * This opens Jamendo authorization in a new window/tab
 */
export const startJamendoOAuth = (state?: string): void => {
  const authUrl = jamendoOAuth.getAuthorizationUrl(state);
  
  // For Telegram Mini App, we can use window.open or redirect
  if (typeof window !== 'undefined') {
    // Option 1: Open in new window (might be blocked by popup blockers)
    // window.open(authUrl, 'jamendo_oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
    
    // Option 2: Redirect current window (recommended for Telegram Mini Apps)
    window.location.href = authUrl;
  }
};