// Jamendo API integration for TuneTON music streaming
const JAMENDO_CLIENT_ID = '8ed40859';
const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

// Supabase proxy URL for bypassing CORS restrictions
const JAMENDO_PROXY_URL = 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/jamendo-proxy';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTU3ODUsImV4cCI6MjA3MDg3MTc4NX0.Ts_PJLD0zEHjEg3iSFJfpqpIOm1FLAhEuzKud3ZFUjg';

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
  namesearch?: string;
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

export class JamendoAPI {
  private clientId: string;
  private baseUrl: string;
  private proxyUrl: string;

  constructor() {
    this.clientId = JAMENDO_CLIENT_ID;
    this.baseUrl = JAMENDO_BASE_URL;
    this.proxyUrl = JAMENDO_PROXY_URL;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    // Use Supabase proxy to bypass CORS restrictions
    const url = new URL(this.proxyUrl);
    
    // Add endpoint and params as query parameters for the proxy
    url.searchParams.append('endpoint', endpoint);
    url.searchParams.append('params', JSON.stringify(params));

    console.log('Making Jamendo API request through proxy:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`Jamendo API proxy error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Jamendo API proxy response:', data);
    
    // Check if we got valid data
    if (!data || !data.results) {
      throw new Error('Invalid response format from Jamendo API');
    }
    
    return data;
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
  async searchArtists(params: JamendoSearchParams = {}): Promise<{ results: JamendoArtist[] }> {
    const defaultParams: JamendoSearchParams = {
      limit: 20,
      include: [],
      ...params
    };
    
    return this.makeRequest<{ results: JamendoArtist[] }>('artists', defaultParams);
  }

  // Search for artists by name
  async searchArtistsByName(query: string, limit: number = 20): Promise<{ results: JamendoArtist[] }> {
    return this.searchArtists({
      namesearch: query,
      limit,
      order: 'popularity_total'
    });
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
  async searchAlbums(params: JamendoSearchParams = {}): Promise<{ results: JamendoAlbum[] }> {
    const defaultParams: JamendoSearchParams = {
      limit: 20,
      include: [],
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
    throw error;
  }
};

export const searchMusicForRemix = async (query: string) => {
  try {
    const results = await jamendoAPI.textSearch(query, 15);
    return results.results;
  } catch (error) {
    console.error('Music search failed:', error);
    throw error;
  }
};

export const getGenreBasedRecommendations = async (genres: string[]) => {
  try {
    const results = await jamendoAPI.getGenreMix(genres, 25);
    return results.results;
  } catch (error) {
    console.error('Genre recommendations failed:', error);
    throw error;
  }
};

// Utility function to test API connectivity
export const testJamendoAPI = async (): Promise<boolean> => {
  try {
    console.log('Testing Jamendo API connectivity through proxy...');
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
  console.log('Proxy URL:', JAMENDO_PROXY_URL);
  
  // Test proxy call - simple tracks call
  const testUrl = `${JAMENDO_PROXY_URL}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify({limit: 1}))}`;
  console.log('Test URL (basic):', testUrl);
  
  try {
    const response = await fetch(testUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data (basic):', data);
      
      // Test with speed parameter that was causing issues
      const speedTestUrl = `${JAMENDO_PROXY_URL}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify({limit: 1, speed: 'high', include: ['musicinfo']}))}`;
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