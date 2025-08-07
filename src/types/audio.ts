export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  source: string | ArrayBuffer | File;
  coverArt?: string;
}

export interface AudioState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  pitch: number;
  eqSettings: {
    low: number;
    mid: number;
    high: number;
  };
}

export type AudioEffect = {
  id: string;
  name: string;
  type: 'pitch' | 'tempo' | 'eq' | 'filter' | 'reverb';
  params: Record<string, number | boolean>;
  enabled: boolean;
};

export interface AudioEngine {
  loadTrack(track: AudioTrack): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  setPlaybackRate(rate: number): void;
  setPitch(pitch: number): void;
  setEQ(band: 'low' | 'mid' | 'high', value: number): void;
  applyEffect(effect: AudioEffect): void;
  removeEffect(effectId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  getCurrentTrack(): AudioTrack | null;
  destroy(): void;
}
