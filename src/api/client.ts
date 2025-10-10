// Base URL for API requests - in production, this will be '/api' as defined in .env.production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// In production, we'll use the real API, not mock data
const USE_MOCK_DATA = import.meta.env.PROD ? false : (import.meta.env.VITE_USE_MOCK_DATA === 'true');

// Log environment for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Using mock data:', USE_MOCK_DATA);

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

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getTracks(): Promise<Track[]> {
    try {
      const apiUrl = `${this.baseUrl}${this.baseUrl.endsWith('/') ? '' : '/'}tracks`;
      console.log('Fetching tracks from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      });

      // First check if response is HTML (which would indicate a PHP error)
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // If we can't parse as JSON, it's likely a PHP error
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
      
      // Log additional debug info in development
      if (!import.meta.env.PROD) {
        console.group('Debug Info');
        console.log('API Base URL:', this.baseUrl);
        console.log('Environment:', import.meta.env.MODE);
        console.log('Current URL:', window.location.href);
        console.groupEnd();
        
        // Try to access the API directly
        const testUrl = new URL('api/tracks', window.location.origin).href;
        console.log('Test API URL:', testUrl);
        
        // Try a direct fetch to help with debugging
        fetch(testUrl)
          .then(r => r.text())
          .then(text => {
            console.log('Direct API response:', text.substring(0, 500));
          })
          .catch(e => {
            console.error('Direct API test failed:', e);
          });
      }
      
      // In production, don't fall back to mock data - return empty array instead
      if (import.meta.env.PROD) {
        return [];
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
      const response = await fetch(`${this.baseUrl}/playbacks/${trackId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
