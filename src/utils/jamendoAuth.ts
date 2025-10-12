// Jamendo OAuth utilities for TuneTON
const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || '8ed40859';
const JAMENDO_CLIENT_SECRET = import.meta.env.VITE_JAMENDO_CLIENT_SECRET || '71300a550108108c5a1ef3316a13edf7';
const JAMENDO_REDIRECT_URI = import.meta.env.VITE_JAMENDO_REDIRECT_URI || 'http://localhost:3000/oauth/jamendo';

// OAuth state management
const OAUTH_STATE_KEY = 'jamendo_oauth_state';
const ACCESS_TOKEN_KEY = 'jamendo_access_token';
const REFRESH_TOKEN_KEY = 'jamendo_refresh_token';
const TOKEN_EXPIRY_KEY = 'jamendo_token_expiry';

export interface JamendoAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  image: string;
}

/**
 * Generate a random state string for OAuth flow
 */
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Start the Jamendo OAuth flow
 */
export function startJamendoOAuth(state?: string): void {
  const oauthState = state || generateState();
  
  // Store state for verification later
  localStorage.setItem(OAUTH_STATE_KEY, oauthState);
  
  // Build authorization URL
  const authUrl = new URL('https://api.jamendo.com/v3.0/oauth/authorize');
  authUrl.searchParams.append('client_id', JAMENDO_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', JAMENDO_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('state', oauthState);
  authUrl.searchParams.append('scope', 'music userinfo playlists_read playlists_write');
  
  // Redirect to Jamendo authorization
  window.location.href = authUrl.toString();
}

/**
 * Handle OAuth callback and exchange code for tokens
 */
export async function handleOAuthCallback(authorizationCode: string, state: string): Promise<boolean> {
  try {
    // Verify state parameter to prevent CSRF
    const storedState = localStorage.getItem(OAUTH_STATE_KEY);
    if (state !== storedState) {
      throw new Error('Invalid OAuth state parameter');
    }
    
    // Exchange authorization code for access token
    const tokenUrl = 'https://api.jamendo.com/v3.0/oauth/grant';
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: JAMENDO_CLIENT_ID,
        client_secret: JAMENDO_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: JAMENDO_REDIRECT_URI,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }
    
    const tokenData = await response.json();
    
    // Store tokens
    const now = Date.now();
    const expiresAt = now + (tokenData.expires_in * 1000);
    
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
    }
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
    
    // Clean up state
    localStorage.removeItem(OAUTH_STATE_KEY);
    
    return true;
  } catch (error) {
    console.error('OAuth callback handling failed:', error);
    return false;
  }
}

/**
 * Get current authentication state
 */
export function getAuthState(): JamendoAuthState {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAtStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
  const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;
  
  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const { accessToken, expiresAt } = getAuthState();
  
  if (!accessToken || !expiresAt) {
    return false;
  }
  
  // Check if token is expired (with 5 minute buffer)
  const now = Date.now();
  return now < (expiresAt - 300000);
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const { refreshToken } = getAuthState();
    
    if (!refreshToken) {
      return false;
    }
    
    const tokenUrl = 'https://api.jamendo.com/v3.0/oauth/grant';
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: JAMENDO_CLIENT_ID,
        client_secret: JAMENDO_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
    }
    
    const tokenData = await response.json();
    
    // Store new tokens
    const now = Date.now();
    const expiresAt = now + (tokenData.expires_in * 1000);
    
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
    }
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
    
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens on refresh failure
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return false;
  }
}

/**
 * Make authenticated API request to Jamendo
 */
export async function jamendoApiRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
  // Check authentication
  if (!isAuthenticated()) {
    const refreshSuccess = await refreshAccessToken();
    if (!refreshSuccess) {
      throw new Error('Not authenticated with Jamendo');
    }
  }
  
  const { accessToken } = getAuthState();
  
  const url = new URL(`https://api.jamendo.com/v3.0/${endpoint}`);
  url.searchParams.append('client_id', JAMENDO_CLIENT_ID);
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
  
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Jamendo API request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Get user's favorite tracks
 */
export async function getUserFavorites(): Promise<JamendoTrack[]> {
  try {
    const response = await jamendoApiRequest('users/favorites', {
      limit: 50,
    });
    
    return response.results[0]?.favorites?.tracks || [];
  } catch (error) {
    console.error('Failed to fetch user favorites:', error);
    return [];
  }
}

/**
 * Search for tracks
 */
export async function searchTracks(query: string, limit: number = 20): Promise<JamendoTrack[]> {
  try {
    const response = await jamendoApiRequest('tracks', {
      search: query,
      limit,
      include: 'musicinfo',
    });
    
    return response.results || [];
  } catch (error) {
    console.error('Failed to search tracks:', error);
    return [];
  }
}

/**
 * Get popular tracks
 */
export async function getPopularTracks(limit: number = 20): Promise<JamendoTrack[]> {
  try {
    const response = await jamendoApiRequest('tracks', {
      limit,
      order: 'popularity_total',
      include: 'musicinfo',
    });
    
    return response.results || [];
  } catch (error) {
    console.error('Failed to fetch popular tracks:', error);
    return [];
  }
}

/**
 * Logout from Jamendo
 */
export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(OAUTH_STATE_KEY);
}