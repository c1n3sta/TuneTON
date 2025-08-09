const API_BASE_URL = '/api';

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
      const response = await fetch(`${this.baseUrl}/tracks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
      return [];
    }
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
