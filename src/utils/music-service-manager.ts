// Universal music service manager for TuneTON
import { JamendoAPI, JamendoTrack } from "./jamendo-api";
import { soundcloudAPI, SoundCloudTrack } from "./soundcloud-api";
import type { AudioTrack } from "../types/audio";

// Universal track interface that works with all services
export interface UniversalTrack {
  id: string; // Universal ID with service prefix (e.g., "soundcloud_12345" or "jamendo_67890")
  originalId: string | number; // Original ID from the service
  title: string;
  artist: string;
  duration: number; // in seconds
  source: 'soundcloud' | 'jamendo';
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
      return [];
    }
  }

  async getTrack(trackId: string): Promise<UniversalTrack> {
    const originalId = trackId.replace('jamendo_', '');
    const response = await this.api.searchTracks({ id: originalId, include: ['musicinfo'] });
    
    if (response.results.length === 0) {
      throw new Error('Track not found');
    }
    
    const track = response.results[0];
    return {
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
    };
  }

  async getStreamUrl(trackId: string): Promise<string> {
    const originalId = trackId.replace('jamendo_', '');
    const response = await this.api.searchTracks({ id: originalId, include: ['musicinfo'] });
    
    if (response.results.length === 0) {
      throw new Error('Track not found');
    }
    
    return response.results[0].audiodownload;
  }

  async getPopularTracks(limit: number = 20): Promise<UniversalTrack[]> {
    const response = await this.api.getPopularTracks(limit);
    
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
  }

  getServiceName(): string {
    return 'jamendo';
  }
}

// SoundCloud service implementation
export class SoundCloudService implements MusicService {
  private api: typeof soundcloudAPI;

  constructor() {
    this.api = soundcloudAPI;
  }

  async searchTracks(params: UniversalSearchParams): Promise<UniversalTrack[]> {
    try {
      const searchParams: any = {
        limit: params.limit || 20,
        ...(params.query && { q: params.query })
      };

      const response = await this.api.searchTracks(searchParams);
      
      return response.collection
        .filter(track => track.streamable)
        .map(track => ({
          id: `soundcloud_${track.id}`,
          originalId: track.id,
          title: track.title,
          artist: track.user.username,
          duration: track.duration / 1000, // Convert from ms to seconds
          source: 'soundcloud',
          coverArt: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : undefined,
          audioUrl: track.stream_url,
          permalink: track.permalink_url,
          streamable: track.streamable,
          genre: track.genre || undefined
        }));
    } catch (error) {
      console.error('SoundCloud search failed:', error);
      return [];
    }
  }

  async getTrack(trackId: string): Promise<UniversalTrack> {
    const originalId = parseInt(trackId.replace('soundcloud_', ''));
    const track = await this.api.getTrack(originalId);
    
    return {
      id: `soundcloud_${track.id}`,
      originalId: track.id,
      title: track.title,
      artist: track.user.username,
      duration: track.duration / 1000, // Convert from ms to seconds
      source: 'soundcloud',
      coverArt: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : undefined,
      audioUrl: track.stream_url,
      permalink: track.permalink_url,
      streamable: track.streamable,
      genre: track.genre || undefined
    };
  }

  async getStreamUrl(trackId: string): Promise<string> {
    const originalId = parseInt(trackId.replace('soundcloud_', ''));
    return await this.api.getStreamUrl(originalId);
  }

  async getPopularTracks(limit: number = 20): Promise<UniversalTrack[]> {
    const response = await this.api.getPopularTracks(limit);
    
    return response.collection
      .filter(track => track.streamable)
      .map(track => ({
        id: `soundcloud_${track.id}`,
        originalId: track.id,
        title: track.title,
        artist: track.user.username,
        duration: track.duration / 1000, // Convert from ms to seconds
        source: 'soundcloud',
        coverArt: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : undefined,
        audioUrl: track.stream_url,
        permalink: track.permalink_url,
        streamable: track.streamable,
        genre: track.genre || undefined
      }));
  }

  getServiceName(): string {
    return 'soundcloud';
  }
}

// Universal music service manager
export class MusicServiceManager {
  private services: Map<string, MusicService> = new Map();
  private currentService: string | null = null;

  constructor() {
    // Register default services
    this.registerService('jamendo', new JamendoService());
    this.registerService('soundcloud', new SoundCloudService());
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
    const service = this.getCurrentService();
    if (!service) {
      throw new Error('No service selected');
    }
    
    return await service.searchTracks(params);
  }

  async getTrack(trackId: string): Promise<UniversalTrack> {
    // Determine service from track ID prefix
    const servicePrefix = trackId.split('_')[0];
    const service = this.services.get(servicePrefix);
    
    if (!service) {
      throw new Error(`Service for prefix ${servicePrefix} not found`);
    }
    
    return await service.getTrack(trackId);
  }

  async getStreamUrl(trackId: string): Promise<string> {
    // Determine service from track ID prefix
    const servicePrefix = trackId.split('_')[0];
    const service = this.services.get(servicePrefix);
    
    if (!service) {
      throw new Error(`Service for prefix ${servicePrefix} not found`);
    }
    
    return await service.getStreamUrl(trackId);
  }

  async getPopularTracks(limit?: number): Promise<UniversalTrack[]> {
    const service = this.getCurrentService();
    if (!service) {
      throw new Error('No service selected');
    }
    
    return await service.getPopularTracks(limit);
  }

  // Search across all services
  async searchAllServices(params: UniversalSearchParams): Promise<UniversalTrack[]> {
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
    
    // Sort by source priority (Jamendo first, then SoundCloud)
    return allResults.sort((a, b) => {
      const sourcePriority: Record<string, number> = { jamendo: 1, soundcloud: 2 };
      return (sourcePriority[a.source] || 999) - (sourcePriority[b.source] || 999);
    });
  }

  // Get available services
  getAvailableServices(): string[] {
    return Array.from(this.services.keys());
  }

  // Get current service name
  getCurrentServiceName(): string | null {
    return this.currentService;
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