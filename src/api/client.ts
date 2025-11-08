// Base URL for API requests - use Supabase functions URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For Telegram authentication, we use the Supabase functions URL
const TELEGRAM_AUTH_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/telegram-auth`
  : `${API_BASE_URL}/telegram-auth`;

// In production, we'll use the real API, not mock data
const USE_MOCK_DATA = import.meta.env.PROD ? false : (import.meta.env.VITE_USE_MOCK_DATA === 'true');

// Log environment for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Using mock data:', USE_MOCK_DATA);
console.log('Environment:', import.meta.env.MODE);

// Import Supabase client
import { supabase } from '../utils/telegramAuth';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  playCount: number;
  audioUrl: string;
}

export interface PlaybackResponse {
  trackId: string;
  playCount: number;
  totalPlaybacks: number;
}

// Add logging function
function logEvent(event: string, details: any = {}) {
  console.log(`[ApiClient] ${event}:`, details);
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    if (!baseUrl) {
      throw new Error('VITE_API_BASE_URL environment variable is required');
    }
    this.baseUrl = baseUrl;
  }

  async getTracks(): Promise<Track[]> {
    try {
      const apiUrl = `${this.baseUrl}${this.baseUrl.endsWith('/') ? '' : '/'}tracks`;
      console.log('Fetching tracks from:', apiUrl);
      
      // Get the Supabase session to include auth headers
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest'
      };
      
      // Add authorization header if we have a session
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Add API key header
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const response = await fetch(apiUrl, {
        headers,
        credentials: 'same-origin'
      });

      // First check if response is HTML (which would indicate an error)
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // If we can't parse as JSON, it's likely an error
        console.error('Non-JSON response from server:', responseText.substring(0, 200));
        throw new Error('Server returned an error. Check console for details.');
      }
      
      console.log('API Response:', data);
      
      if (!response.ok) {
        const errorMessage = data?.error || data?.message || response.statusText;
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }
      
      // Handle different response formats
      if (data && Array.isArray(data.tracks)) {
        return data.tracks;
      } else if (Array.isArray(data)) {
        return data; // Fallback for array response
      } else if (data && data.success === false) {
        throw new Error(data.error || 'Request failed');
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
      
      // Log additional debug info
      console.group('Debug Info');
      console.log('API Base URL:', this.baseUrl);
      console.log('Environment:', import.meta.env.MODE);
      console.log('Current URL:', window.location.href);
      console.groupEnd();
      
      // In production, throw error instead of using mock data
      if (import.meta.env.PROD) {
        console.error('No tracks available in production - cannot use mock data');
        throw new Error('Failed to fetch real tracks from server in production');
      }
      
      // Only use mock data in development if explicitly enabled
      if (USE_MOCK_DATA) {
        console.warn('Falling back to mock data');
        return this.getMockTracks();
      }
      
      console.error('No tracks available and mock data is disabled');
      return [];
    }
  }

  private getMockTracks(): Track[] {
    // This mock data will be used as fallback in production
    return [
      {
        id: '1',
        title: 'Sample Track 1',
        artist: 'Artist 1',
        duration: 180,
        playCount: 0,
        audioUrl: '/audio/sample1.mp3'
      },
      {
        id: '2',
        title: 'Sample Track 2',
        artist: 'Artist 2',
        duration: 210,
        playCount: 0,
        audioUrl: '/audio/sample2.mp3'
      }
    ];
  }

  async incrementPlayback(trackId: string): Promise<PlaybackResponse | null> {
    try {
      // Get the Supabase session to include auth headers
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if we have a session
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Add API key header
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const response = await fetch(`${this.baseUrl}/playbacks/${trackId}`, {
        method: 'POST',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to increment playback:', error);
      return null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Get the Supabase session to include auth headers
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {};
      
      // Add authorization header if we have a session
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Add API key header
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const response = await fetch(`${this.baseUrl}/health`, {
        headers
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async searchTracks(query: string): Promise<Track[]> {
    try {
      // Get the Supabase session to include auth headers
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {};
      
      // Add authorization header if we have a session
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Add API key header
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
        headers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Search failed:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Add method for Telegram authentication
  async telegramAuth(initData: string): Promise<any> {
    try {
      logEvent('telegram_auth_start');
      
      const response = await fetch(TELEGRAM_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({ initData }),
      });

      logEvent('telegram_auth_response', { status: response.status });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logEvent('telegram_auth_error', { 
          status: response.status, 
          error: errorData.error 
        });
        throw new Error(errorData.error || `Authentication failed: ${response.status}`);
      }

      const result = await response.json();
      logEvent('telegram_auth_success');
      return result;
    } catch (error) {
      logEvent('telegram_auth_exception', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;