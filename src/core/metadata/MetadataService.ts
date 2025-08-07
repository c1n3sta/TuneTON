import { IAudioMetadata, parseBlob } from 'music-metadata';
import { AudioTrack } from '../../types/audio';

export interface IMetadataExtractor {
  extract(file: File): Promise<Partial<AudioTrack>>;
}

export class DefaultMetadataExtractor implements IMetadataExtractor {
  async extract(file: File): Promise<Partial<AudioTrack>> {
    try {
      const metadata = await parseBlob(file);
      return this.mapMetadataToTrack(metadata, file);
    } catch (error) {
      console.warn('Error extracting metadata:', error);
      return this.getFallbackMetadata(file);
    }
  }

  private mapMetadataToTrack(metadata: IAudioMetadata, file: File): Partial<AudioTrack> {
    const { common } = metadata;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    
    return {
      title: common.title || baseName,
      artist: common.artist || common.artists?.join(', ') || 'Unknown Artist',
      album: common.album || 'Unknown Album',
      duration: metadata.format.duration || 0,
      coverArt: this.extractCoverArt(common.picture?.[0])
    };
  }

  private extractCoverArt(picture?: { data: Uint8Array; format: string }): string | undefined {
    if (!picture) return undefined;
    
    const base64String = btoa(
      new Uint8Array(picture.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    return `data:${picture.format};base64,${base64String}`;
  }

  private getFallbackMetadata(file: File): Partial<AudioTrack> {
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return {
      title: baseName,
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0
    };
  }
}

// Factory function for creating metadata extractor
export function createMetadataExtractor(): IMetadataExtractor {
  return new DefaultMetadataExtractor();
}

// Default export for convenience
export const metadataExtractor = createMetadataExtractor();
