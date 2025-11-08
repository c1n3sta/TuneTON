// Universal music service manager for TuneTON
import { JamendoAPI, JamendoTrack } from "./jamendo-api";
import type { AudioTrack } from "../types/audio";

// Universal track interface that works with all services
export interface UniversalTrack {
  id: string; // Universal ID with service prefix (e.g., "jamendo_67890")
  originalId: string | number; // Original ID from the service
  title: string;
  artist: string;
  duration: number; // in seconds
  source: 'jamendo';
  coverArt?: string;
  audioUrl?: string;
  permalink?: string;
  streamable?: boolean;
  genre?: string;
}

// Search parameters for universal search
export interface UniversalSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
  genres?: string[];
  tags?: string[];
}

// Service interface
export interface MusicService {
  searchTracks(params: UniversalSearchParams): Promise<UniversalTrack[]>;
  getTrack(trackId: string): Promise<UniversalTrack>;
  getStreamUrl(trackId: string): Promise<string>;
  getPopularTracks(limit?: number): Promise<UniversalTrack[]>;
  getServiceName(): string;
}

// Jamendo service implementation
export class JamendoService implements MusicService {
  private api: JamendoAPI;

  constructor() {
    this.api = new JamendoAPI();
  }

  async searchTracks(params: UniversalSearchParams): Promise<UniversalTrack[]> {
    try {
      const searchParams: any = {
        limit: params.limit || 20,
        ...(params.query && { search: params.query }),
        ...(params.genres && { tags: params.genres }),
        include: ['musicinfo']
      };

      const response = await this.api.searchTracks(searchParams);
      
      return response.results.map(track => ({
        id: `jamendo_${track.id}`,
        originalId: track.id,
        title: track.name,
        artist: track.artist_name,
        duration: track.duration,
        source: 'jamendo',
        coverArt: track.image,
        audioUrl: track.audiodownload,
        permalink: track.shareurl,
        streamable: true,
        genre: track.musicinfo?.tags?.genres?.[0]
      }));
    } catch (error) {
      console.error('Jamendo search failed:', error);
      // Return empty array instead of throwing error to prevent app crash
      return [];
    }
  }

  async getTrack(trackId: string): Promise<UniversalTrack> {
    try {
      const originalId = trackId.replace('jamendo_', '');
      // Use search parameter instead of id since it's not in the interface
      const response = await this.api.searchTracks({ search: originalId, include: ['musicinfo'] });
      
      if (response.results.length === 0) {
        // Instead of throwing an error, return a placeholder track with safe defaults
        return this.createPlaceholderTrack(trackId, originalId);
      }
      
      // Find the exact track by ID
      const track = response.results.find(t => t.id === originalId) || response.results[0];
      
      return {
        id: `jamendo_${track.id}`,
        originalId: track.id,
        title: track.name || 'Unknown Track',
        artist: track.artist_name || 'Unknown Artist',
        duration: track.duration || 0,
        source: 'jamendo',
        coverArt: track.image,
        audioUrl: track.audiodownload,
        permalink: track.shareurl,
        streamable: true,
        genre: track.musicinfo?.tags?.genres?.[0]
      };
    } catch (error) {
      console.error('Failed to get track:', error);
      // Return a placeholder track instead of throwing error
      return this.createPlaceholderTrack(trackId, trackId.replace('jamendo_', ''));
    }
  }

  async getStreamUrl(trackId: string): Promise<string> {
    try {
      const originalId = trackId.replace('jamendo_', '');
      // Use search parameter instead of id since it's not in the interface
      const response = await this.api.searchTracks({ search: originalId, include: ['musicinfo'] });
      
      if (response.results.length === 0) {
        return ''; // Return empty string instead of throwing error
      }
      
      // Find the exact track by ID
      const track = response.results.find(t => t.id === originalId) || response.results[0];
      
      return track.audiodownload || '';
    } catch (error) {
      console.error('Failed to get stream URL:', error);
      // Return empty string instead of throwing error
      return '';
    }
  }

  async getPopularTracks(limit: number = 20): Promise<UniversalTrack[]> {
    try {
      const response = await this.api.getPopularTracks(limit);
      
      return response.results.map(track => ({
        id: `jamendo_${track.id}`,
        originalId: track.id,
        title: track.name || 'Unknown Track',
        artist: track.artist_name || 'Unknown Artist',
        duration: track.duration || 0,
        source: 'jamendo',
        coverArt: track.image,
        audioUrl: track.audiodownload,
        permalink: track.shareurl,
        streamable: true,
        genre: track.musicinfo?.tags?.genres?.[0]
      }));
    } catch (error) {
      console.error('Failed to get popular tracks:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  getServiceName(): string {
    return 'jamendo';
  }

  // Helper method to create a placeholder track with safe defaults
  private createPlaceholderTrack(trackId: string, originalId: string | number): UniversalTrack {
    return {
      id: trackId,
      originalId: originalId,
      title: 'Track Unavailable',
      artist: 'Unknown Artist',
      duration: 0,
      source: 'jamendo',
      coverArt: undefined,
      audioUrl: undefined,
      permalink: undefined,
      streamable: false,
      genre: 'Unknown'
    };
  }
}

// Universal music service manager
export class MusicServiceManager {
  private services: Map<string, MusicService> = new Map();
  private currentService: string | null = null;

  constructor() {
    // Register only Jamendo service
    this.registerService('jamendo', new JamendoService());
    this.currentService = 'jamendo'; // Default to Jamendo
  }

  registerService(name: string, service: MusicService): void {
    this.services.set(name, service);
  }

  setService(name: string): void {
    if (this.services.has(name)) {
      this.currentService = name;
    } else {
      throw new Error(`Service ${name} not registered`);
    }
  }

  getCurrentService(): MusicService | null {
    if (this.currentService && this.services.has(this.currentService)) {
      return this.services.get(this.currentService) || null;
    }
    return null;
  }

  async searchTracks(params: UniversalSearchParams): Promise<UniversalTrack[]> {
    try {
      const service = this.getCurrentService();
      if (!service) {
        throw new Error('No service selected');
      }
      
      return await service.searchTracks(params);
    } catch (error) {
      console.error('Search tracks failed:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  async getTrack(trackId: string): Promise<UniversalTrack> {
    try {
      // Determine service from track ID prefix
      const servicePrefix = trackId.split('_')[0];
      const service = this.services.get(servicePrefix);
      
      if (!service) {
        // Instead of throwing an error, return a placeholder track
        return this.createPlaceholderTrack(trackId);
      }
      
      return await service.getTrack(trackId);
    } catch (error) {
      console.error('Get track failed:', error);
      // Return a placeholder track instead of throwing error
      return this.createPlaceholderTrack(trackId);
    }
  }

  async getStreamUrl(trackId: string): Promise<string> {
    try {
      // Determine service from track ID prefix
      const servicePrefix = trackId.split('_')[0];
      const service = this.services.get(servicePrefix);
      
      if (!service) {
        return ''; // Return empty string instead of throwing error
      }
      
      return await service.getStreamUrl(trackId);
    } catch (error) {
      console.error('Get stream URL failed:', error);
      // Return empty string instead of throwing error
      return '';
    }
  }

  async getPopularTracks(limit?: number): Promise<UniversalTrack[]> {
    try {
      const service = this.getCurrentService();
      if (!service) {
        throw new Error('No service selected');
      }
      
      return await service.getPopularTracks(limit);
    } catch (error) {
      console.error('Get popular tracks failed:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  // Search across all services (only Jamendo now)
  async searchAllServices(params: UniversalSearchParams): Promise<UniversalTrack[]> {
    try {
      const allResults: UniversalTrack[] = [];
      const promises: Promise<UniversalTrack[]>[] = [];
      
      for (const [name, service] of this.services) {
        try {
          promises.push(service.searchTracks(params));
        } catch (error) {
          console.error(`Failed to search in ${name}:`, error);
        }
      }
      
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        } else {
          console.error(`Search failed for service ${Array.from(this.services.keys())[index]}:`, result.reason);
        }
      });
      
      return allResults;
    } catch (error) {
      console.error('Search all services failed:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  // Get available services
  getAvailableServices(): string[] {
    return Array.from(this.services.keys());
  }

  // Get current service name
  getCurrentServiceName(): string | null {
    return this.currentService;
  }

  // Helper method to create a placeholder track with safe defaults
  private createPlaceholderTrack(trackId: string): UniversalTrack {
    const servicePrefix = trackId.split('_')[0];
    const originalId = trackId.replace(`${servicePrefix}_`, '');
    
    return {
      id: trackId,
      originalId: originalId,
      title: 'Track Unavailable',
      artist: 'Unknown Artist',
      duration: 0,
      source: servicePrefix as 'jamendo',
      coverArt: undefined,
      audioUrl: undefined,
      permalink: undefined,
      streamable: false,
      genre: 'Unknown'
    };
  }
}

// Export singleton instance
export const musicServiceManager = new MusicServiceManager();

// Utility function to convert UniversalTrack to AudioTrack
export function universalTrackToAudioTrack(track: UniversalTrack): AudioTrack {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    source: track.audioUrl || '',
    coverArt: track.coverArt,
    audioUrl: track.audioUrl,
    album: track.genre,
    cover: track.coverArt
  };
}