import { describe, expect, it } from 'vitest';
import { convertJamendoToTrack, isValidAudioUrl } from './utils';

describe('Audio URL Validation', () => {
  it('should validate standard audio URLs', () => {
    expect(isValidAudioUrl('https://example.com/audio.mp3')).toBe(true);
    expect(isValidAudioUrl('https://example.com/audio.wav')).toBe(true);
    expect(isValidAudioUrl('https://example.com/audio.ogg')).toBe(true);
    expect(isValidAudioUrl('http://example.com/audio.mp3')).toBe(true);
  });

  it('should validate Jamendo streaming URLs', () => {
    expect(isValidAudioUrl('https://jamendo.com/track/12345/?format=mp3')).toBe(true);
    expect(isValidAudioUrl('https://api.jamendo.com/v3.0/tracks/file?track_id=12345')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidAudioUrl('')).toBe(false);
    expect(isValidAudioUrl('not-a-url')).toBe(false);
    expect(isValidAudioUrl('https://example.com/audio')).toBe(true); // With enhanced validation, URLs with /audio should be valid
  });
});

describe('Jamendo Track Conversion', () => {
  it('should properly convert Jamendo tracks with audio URLs', () => {
    const jamendoTrack = {
      id: '12345',
      name: 'Test Track',
      artist_name: 'Test Artist',
      duration: 180,
      image: 'https://example.com/image.jpg',
      audio: 'https://jamendo.com/track/12345/?format=mp3',
      audiodownload: 'https://jamendo.com/download/track/12345/mp3',
      artist_id: '67890',
      artist_idstr: 'testartist',
      album_id: '54321',
      album_name: 'Test Album',
      album_image: 'https://example.com/album.jpg',
      prourl: 'https://jamendo.com/track/12345/prourl',
      shorturl: 'https://jamendo.com/s/12345',
      shareurl: 'https://jamendo.com/share/track/12345',
      waveform: 'https://jamendo.com/waveform/12345'
    };

    const audioTrack = convertJamendoToTrack(jamendoTrack);
    expect(audioTrack).not.toBeNull();
    expect(audioTrack?.id).toBe('12345');
    expect(audioTrack?.title).toBe('Test Track');
    expect(audioTrack?.artist).toBe('Test Artist');
    expect(audioTrack?.audioUrl).toBe('https://jamendo.com/track/12345/?format=mp3');
  });

  it('should handle tracks with missing audio URLs', () => {
    const jamendoTrack = {
      id: '12346',
      name: 'Test Track 2',
      artist_name: 'Test Artist 2',
      duration: 240,
      image: 'https://example.com/image2.jpg',
      audio: '',
      audiodownload: 'https://example.com/track2.mp3',
      artist_id: '67891',
      artist_idstr: 'testartist2',
      album_id: '54322',
      album_name: 'Test Album 2',
      album_image: 'https://example.com/album2.jpg',
      prourl: 'https://example.com/prourl2',
      shorturl: 'https://example.com/s/12346',
      shareurl: 'https://example.com/share/track/12346',
      waveform: 'https://example.com/waveform/12346'
    };

    const audioTrack = convertJamendoToTrack(jamendoTrack);
    expect(audioTrack).not.toBeNull();
    expect(audioTrack?.audioUrl).toBe('https://example.com/track2.mp3');
  });

  it('should handle null tracks', () => {
    const audioTrack = convertJamendoToTrack(null);
    expect(audioTrack).toBeNull();
  });
});
describe('Enhanced Audio URL Validation', () => {
  it('should validate Jamendo streaming URLs with query parameters', () => {
    expect(isValidAudioUrl('https://prod-1.storage.jamendo.com/?trackid=168&format=mp31&from=hash')).toBe(true);
    expect(isValidAudioUrl('https://api.jamendo.com/v3.0/tracks/file?track_id=12345')).toBe(true);
  });

  it('should validate streaming endpoints', () => {
    expect(isValidAudioUrl('https://example.com/stream/12345')).toBe(true);
    expect(isValidAudioUrl('https://example.com/audio/12345')).toBe(true);
  });

  it('should handle edge cases in URL validation', () => {
    expect(isValidAudioUrl('https://jamendo.com/track/12345')).toBe(true);
    expect(isValidAudioUrl('http://example.com/audio')).toBe(true);
  });
});
