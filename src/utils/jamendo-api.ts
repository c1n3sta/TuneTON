// Jamendo API integration for TuneTON music streaming
const JAMENDO_CLIENT_ID = '8ed40859';
const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  artist_idstr: string;
  album_id: string;
  album_name: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  waveform: string;
  image: string;
  musicinfo?: {
    vocalinstrumental: string;
    lang: string;
    gender: string;
    speed: string;
    acousticelectric: string;
    tags?: {
      genres: string[];
      instruments: string[];
      vartags: string[];
    };
  };
}

export interface JamendoArtist {
  id: string;
  name: string;
  website: string;
  joindate: string;
  image: string;
  shorturl: string;
  shareurl: string;
}

export interface JamendoAlbum {
  id: string;
  name: string;
  releasedate: string;
  artist_id: string;
  artist_name: string;
  image: string;
  zip: string;
  shorturl: string;
  shareurl: string;
}

export interface JamendoSearchParams {
  format?: 'json' | 'jsonpretty' | 'xml';
  limit?: number;
  offset?: number;
  order?: 'popularity_total' | 'popularity_month' | 'popularity_week' | 'buzzrate' | 'downloads_week' | 'downloads_month' | 'downloads_total' | 'listens_week' | 'listens_month' | 'listens_total' | 'releasedate' | 'album_name' | 'artist_name' | 'name' | 'duration';
  tags?: string[];
  search?: string;
  include?: string[];
  boost?: 'popularity_total' | 'popularity_month' | 'downloads_total' | 'listens_total';
  fuzzytags?: string;
  speed?: 'verylow' | 'low' | 'medium' | 'high' | 'veryhigh';
  vocalinstrumental?: 'vocal' | 'instrumental';
  gender?: 'male' | 'female';
  lang?: string;
  acousticelectric?: 'acoustic' | 'electric';
  ccsa?: boolean;
}

// Mock data for fallback when API fails
const mockTracks: JamendoTrack[] = [
  {
    id: "mock-1",
    name: "Midnight Jazz",
    duration: 180,
    artist_id: "artist-1",
    artist_name: "Jazz Collective",
    artist_idstr: "artist-1",
    album_id: "album-1",
    album_name: "Evening Sessions",
    album_image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    audio: "",
    audiodownload: "",
    prourl: "",
    shorturl: "",
    shareurl: "",
    waveform: "",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    musicinfo: {
      vocalinstrumental: "instrumental",
      lang: "en",
      gender: "",
      speed: "medium",
      acousticelectric: "acoustic",
      tags: {
        genres: ["jazz", "ambient"],
        instruments: ["piano", "saxophone"],
        vartags: ["chill", "relaxing"]
      }
    }
  },
  {
    id: "mock-2",
    name: "Electric Dreams",
    duration: 210,
    artist_id: "artist-2",
    artist_name: "Synth Masters",
    artist_idstr: "artist-2",
    album_id: "album-2",
    album_name: "Digital Horizons",
    album_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    audio: "",
    audiodownload: "",
    prourl: "",
    shorturl: "",
    shareurl: "",
    waveform: "",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    musicinfo: {
      vocalinstrumental: "vocal",
      lang: "en", 
      gender: "male",
      speed: "high",
      acousticelectric: "electric",
      tags: {
        genres: ["electronic", "synthwave"],
        instruments: ["synthesizer", "drums"],
        vartags: ["energetic", "futuristic"]
      }
    }
  },
  {
    id: "mock-3",
    name: "Ocean Waves",
    duration: 240,
    artist_id: "artist-3",
    artist_name: "Nature Sounds",
    artist_idstr: "artist-3",
    album_id: "album-3",
    album_name: "Natural Ambience",
    album_image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?w=400",
    audio: "",
    audiodownload: "",
    prourl: "",
    shorturl: "",
    shareurl: "",
    waveform: "",
    image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?w=400",
    musicinfo: {
      vocalinstrumental: "instrumental",
      lang: "",
      gender: "",
      speed: "low",
      acousticelectric: "acoustic",
      tags: {
        genres: ["ambient", "nature"],
        instruments: ["field-recording"],
        vartags: ["peaceful", "meditation"]
      }
    }
  },
  {
    id: "mock-4",
    name: "Urban Beats",
    duration: 195,
    artist_id: "artist-4",
    artist_name: "City Rhythms",
    artist_idstr: "artist-4",
    album_id: "album-4",
    album_name: "Street Sounds",
    album_image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
    audio: "",
    audiodownload: "",
    prourl: "",
    shorturl: "",
    shareurl: "",
    waveform: "",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
    musicinfo: {
      vocalinstrumental: "vocal",
      lang: "en",
      gender: "female",
      speed: "high",
      acousticelectric: "electric",
      tags: {
        genres: ["hiphop", "urban"],
        instruments: ["beats", "vocals"],
        vartags: ["energetic", "urban"]
      }
    }
  }
];

class JamendoAPI {
  private clientId: string;
  private baseUrl: string;
  private apiAvailable: boolean = true;
  private lastFailTime: number = 0;
  private retryDelay: number = 60000; // 1 minute retry delay

  constructor() {
    this.clientId = JAMENDO_CLIENT_ID;
    this.baseUrl = JAMENDO_BASE_URL;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    // Check if we should retry the API after some time
    const now = Date.now();
    if (!this.apiAvailable && (now - this.lastFailTime) > this.retryDelay) {
      console.log('Retrying Jamendo API after delay...');
      this.apiAvailable = true;
    }

    // If API previously failed and retry delay hasn't passed, return mock data
    if (!this.apiAvailable) {
      console.log('Using mock data - Jamendo API unavailable, retry in', Math.round((this.retryDelay - (now - this.lastFailTime)) / 1000), 'seconds');
      return this.getMockResponse<T>(endpoint);
    }

    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    // Add client_id to all requests
    url.searchParams.append('client_id', this.clientId);
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
      console.log('Making Jamendo API request:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Jamendo API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Jamendo API response:', data);
      
      // Check if we got valid data
      if (!data || !data.results) {
        throw new Error('Invalid response format from Jamendo API');
      }
      
      return data;
    } catch (error: unknown) {
      console.error('Jamendo API request failed:', error);
      console.error('Failed URL:', url.toString());
      
      // Mark API as unavailable and set retry time
      this.apiAvailable = false;
      this.lastFailTime = Date.now();
      console.log('Falling back to mock data, will retry API in', this.retryDelay / 1000, 'seconds');
      return this.getMockResponse<T>(endpoint);
    }
  }

  private getMockResponse<T>(_endpoint: string): T {
    // Return appropriate mock data based on endpoint
    const mockResponse = {
      results: mockTracks
    };
    
    return mockResponse as T;
  }

  // Search for tracks
  async searchTracks(params: JamendoSearchParams = {}): Promise<{ results: JamendoTrack[] }> {
    const defaultParams = {
      limit: 20,
      include: ['musicinfo'],
      ...params
    };
    
    return this.makeRequest<{ results: JamendoTrack[] }>('tracks', defaultParams);
  }

  // Get popular tracks
  async getPopularTracks(limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      limit,
      order: 'popularity_total',
      include: ['musicinfo']
    });
  }

  // Get tracks by genre
  async getTracksByGenre(genre: string, limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      tags: [genre],
      limit,
      order: 'popularity_total',
      include: ['musicinfo']
    });
  }

  // Search for artists
  async searchArtists(params: Partial<JamendoSearchParams> = {}): Promise<{ results: JamendoArtist[] }> {
    const defaultParams = {
      limit: 20,
      ...params
    };
    
    return this.makeRequest<{ results: JamendoArtist[] }>('artists', defaultParams);
  }

  // Get artist by ID
  async getArtist(artistId: string): Promise<{ results: JamendoArtist[] }> {
    return this.makeRequest<{ results: JamendoArtist[] }>('artists', {
      id: artistId
    });
  }

  // Get popular artists
  async getPopularArtists(limit: number = 20): Promise<{ results: JamendoArtist[] }> {
    return this.searchArtists({
      limit,
      order: 'popularity_total'
    });
  }

  // Get artist's tracks
  async getArtistTracks(artistId: string, limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.makeRequest<{ results: JamendoTrack[] }>('artists/tracks', {
      id: artistId,
      limit,
      include: ['musicinfo']
    });
  }

  // Search for albums
  async searchAlbums(params: Partial<JamendoSearchParams> = {}): Promise<{ results: JamendoAlbum[] }> {
    const defaultParams = {
      limit: 20,
      ...params
    };
    
    return this.makeRequest<{ results: JamendoAlbum[] }>('albums', defaultParams);
  }

  // Get album tracks
  async getAlbumTracks(albumId: string): Promise<{ results: JamendoTrack[] }> {
    return this.makeRequest<{ results: JamendoTrack[] }>('albums/tracks', {
      id: albumId,
      include: ['musicinfo']
    });
  }

  // Get tracks for remix challenges (high-energy, popular tracks)
  async getRemixCandidates(limit: number = 10): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      limit,
      order: 'popularity_total',
      speed: 'high',
      include: ['musicinfo'],
      boost: 'popularity_total'
    });
  }

  // Get lo-fi suitable tracks (slower tempo, instrumental preferred)
  async getLoFiTracks(limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      limit,
      speed: 'low',
      vocalinstrumental: 'instrumental',
      tags: ['ambient', 'chillout', 'downtempo'],
      include: ['musicinfo']
    });
  }

  // Get trending tracks for discover page
  async getTrendingTracks(limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      limit,
      order: 'popularity_week',
      boost: 'popularity_total',
      include: ['musicinfo']
    });
  }

  // Search with text query
  async textSearch(query: string, limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      search: query,
      limit,
      order: 'popularity_total', // Changed from 'relevance' which might not be supported
      include: ['musicinfo']
    });
  }

  // Get tracks by multiple genres for variety
  async getGenreMix(genres: string[], limit: number = 20): Promise<{ results: JamendoTrack[] }> {
    return this.searchTracks({
      tags: genres,
      limit,
      order: 'popularity_total',
      include: ['musicinfo'],
      fuzzytags: genres.join(' ')
    });
  }

  // Check if API is available
  isApiAvailable(): boolean {
    return this.apiAvailable;
  }

  // Reset API availability (for retry)
  resetApiAvailability(): void {
    this.apiAvailable = true;
  }
}

// Export singleton instance
export const jamendoAPI = new JamendoAPI();

// Helper functions for TuneTON specific use cases
export const getTuneTONRecommendations = async () => {
  try {
    console.log('Fetching TuneTON recommendations...');
    
    const [popular, trending, lofi, remixable] = await Promise.all([
      jamendoAPI.getPopularTracks(10),
      jamendoAPI.getTrendingTracks(10),
      jamendoAPI.getLoFiTracks(10),
      jamendoAPI.getRemixCandidates(10)
    ]);

    console.log('TuneTON recommendations fetched successfully:', {
      popular: popular.results.length,
      trending: trending.results.length,
      lofi: lofi.results.length,
      remixable: remixable.results.length
    });

    return {
      popular: popular.results,
      trending: trending.results,
      lofi: lofi.results,
      remixable: remixable.results
    };
  } catch (error) {
    console.error('Failed to get TuneTON recommendations:', error);
    
    // Return mock data with proper structure
    return {
      popular: mockTracks.slice(0, 10),
      trending: mockTracks.slice(0, 10),
      lofi: mockTracks.filter(t => t.musicinfo?.speed === 'low').slice(0, 10),
      remixable: mockTracks.filter(t => t.musicinfo?.speed === 'high').slice(0, 10)
    };
  }
};

export const searchMusicForRemix = async (query: string) => {
  try {
    const results = await jamendoAPI.textSearch(query, 15);
    return results.results;
  } catch (error) {
    console.error('Music search failed:', error);
    return mockTracks.filter(track => 
      track.name.toLowerCase().includes(query.toLowerCase()) ||
      track.artist_name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 15);
  }
};

export const getGenreBasedRecommendations = async (genres: string[]) => {
  try {
    const results = await jamendoAPI.getGenreMix(genres, 25);
    return results.results;
  } catch (error) {
    console.error('Genre recommendations failed:', error);
    return mockTracks.slice(0, 25);
  }
};

// Utility function to test API connectivity
export const testJamendoAPI = async (): Promise<boolean> => {
  try {
    console.log('Testing Jamendo API connectivity...');
    jamendoAPI.resetApiAvailability(); // Force a fresh attempt
    const result = await jamendoAPI.getPopularTracks(1);
    console.log('API test result:', result);
    return result.results.length > 0;
  } catch (error) {
    console.error('Jamendo API test failed:', error);
    return false;
  }
};

// Debug function to manually test API call
export const debugJamendoAPI = async () => {
  console.log('=== Jamendo API Debug ===');
  console.log('Client ID:', JAMENDO_CLIENT_ID);
  console.log('Base URL:', JAMENDO_BASE_URL);
  
  // Test direct fetch to Jamendo API - simple tracks call
  const testUrl = `${JAMENDO_BASE_URL}/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1`;
  console.log('Test URL (basic):', testUrl);
  
  try {
    const response = await fetch(testUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data (basic):', data);
      
      // Test with speed parameter that was causing issues
      const speedTestUrl = `${JAMENDO_BASE_URL}/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1&speed=high&include=musicinfo`;
      console.log('Test URL (with speed):', speedTestUrl);
      
      const speedResponse = await fetch(speedTestUrl);
      console.log('Speed test response status:', speedResponse.status);
      
      if (speedResponse.ok) {
        const speedData = await speedResponse.json();
        console.log('Speed test response data:', speedData);
        return { basicCall: data, speedCall: speedData } as { basicCall: any; speedCall: any; speedError?: string };
      } else {
        const errorText = await speedResponse.text();
        console.error('Speed test error:', errorText);
        return { basicCall: data, speedCall: null, speedError: errorText } as { basicCall: any; speedCall: null; speedError: string };
      }
    } else {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error body:', errorText);
      return { error: errorText };
    }
  } catch (error: unknown) {
    console.error('Fetch error:', error);
    // Type guard to safely access error properties
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: 'Unknown error occurred' };
    }
  }
};