export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  source: string | ArrayBuffer;
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

export type EffectModuleId = 'tempoPitch' | 'lofi' | 'eq';

export interface EffectModuleState {
  id: EffectModuleId;
  bypass: boolean;
  mix: number; // 0..1 dry/wet
}

export interface AudioEngine {
  loadTrack(track: AudioTrack): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  setPlaybackRate(rate: number): void;
  setPitch(pitch: number): void;
  // Step 3: decoupled controls
  setTempo(tempo: number): void;
  setPitchSemitones(semitones: number): void;
  setEQ(band: 'low' | 'mid' | 'high', value: number): void;
  applyEffect(effect: AudioEffect): void;
  removeEffect(effectId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
  // Effect bus controls
  setEffectBypass(id: EffectModuleId, bypass: boolean): void;
  setEffectMix(id: EffectModuleId, mix: number): void;
  // Lo-fi controls
  setLofiTone(cutoffHz: number): void;
  setLofiNoiseLevel(level01: number): void;
  setLofiWowFlutter(depthMs: number, rateHz: number): void;
  setLofiCrackle(amountPerSec: number): void;
  // 7-band EQ controls
  setEQBand(band: number, gainDb: number): void;
  setEQMix(mix: number): void;
  setEQBypass(bypass: boolean): void;
}
