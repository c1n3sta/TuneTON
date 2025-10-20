import type { AudioEffect, AudioEngine, AudioTrack, EffectModuleId } from '../../types/audio';
import { WebAudioEngine } from './AudioEngine';

export class AudioEngineWrapper implements AudioEngine {
  private audioEngine: WebAudioEngine | null = null;
  private hasUserInteracted = false;

  // Initialize audio engine on first user interaction
  private async initializeOnUserInteraction(): Promise<WebAudioEngine> {
    if (!this.hasUserInteracted) {
      this.hasUserInteracted = true;
      if (!this.audioEngine) {
        this.audioEngine = new WebAudioEngine();
      }
    }
    
    if (!this.audioEngine) {
      this.audioEngine = new WebAudioEngine();
    }
    
    return this.audioEngine;
  }

  async loadTrack(track: AudioTrack): Promise<void> {
    const engine = await this.initializeOnUserInteraction();
    return engine.loadTrack(track);
  }

  async play(): Promise<void> {
    const engine = await this.initializeOnUserInteraction();
    return engine.play();
  }

  pause(): void {
    if (this.audioEngine) {
      this.audioEngine.pause();
    }
  }

  stop(): void {
    if (this.audioEngine) {
      this.audioEngine.stop();
    }
  }

  seek(time: number): void {
    if (this.audioEngine) {
      this.audioEngine.seek(time);
    }
  }

  setVolume(volume: number): void {
    if (this.audioEngine) {
      this.audioEngine.setVolume(volume);
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.audioEngine) {
      this.audioEngine.setPlaybackRate(rate);
    }
  }

  setPitch(pitch: number): void {
    if (this.audioEngine) {
      this.audioEngine.setPitch(pitch);
    }
  }

  setTempo(tempo: number): void {
    if (this.audioEngine) {
      this.audioEngine.setTempo(tempo);
    }
  }

  setPitchSemitones(semitones: number): void {
    if (this.audioEngine) {
      this.audioEngine.setPitchSemitones(semitones);
    }
  }

  setEQ(band: 'low' | 'mid' | 'high', value: number): void {
    if (this.audioEngine) {
      this.audioEngine.setEQ(band, value);
    }
  }

  applyEffect(effect: AudioEffect): void {
    if (this.audioEngine) {
      this.audioEngine.applyEffect(effect);
    }
  }

  removeEffect(effectId: string): void {
    if (this.audioEngine) {
      this.audioEngine.removeEffect(effectId);
    }
  }

  getCurrentTime(): number {
    if (this.audioEngine) {
      return this.audioEngine.getCurrentTime();
    }
    return 0;
  }

  getDuration(): number {
    if (this.audioEngine) {
      return this.audioEngine.getDuration();
    }
    return 0;
  }

  getAnalyser(): AnalyserNode | null {
    if (this.audioEngine) {
      return this.audioEngine.getAnalyser();
    }
    return null;
  }

  setLofiTone(cutoffHz: number): void {
    if (this.audioEngine) {
      this.audioEngine.setLofiTone(cutoffHz);
    }
  }

  setLofiNoiseLevel(level01: number): void {
    if (this.audioEngine) {
      this.audioEngine.setLofiNoiseLevel(level01);
    }
  }

  setLofiWowFlutter(depthMs: number, rateHz: number): void {
    if (this.audioEngine) {
      this.audioEngine.setLofiWowFlutter(depthMs, rateHz);
    }
  }

  setLofiCrackle(amountPerSec: number): void {
    if (this.audioEngine) {
      this.audioEngine.setLofiCrackle(amountPerSec);
    }
  }

  setEQBand(band: number, gainDb: number): void {
    if (this.audioEngine) {
      this.audioEngine.setEQBand(band, gainDb);
    }
  }

  setEQMix(mix: number): void {
    if (this.audioEngine) {
      this.audioEngine.setEQMix(mix);
    }
  }

  setEQBypass(bypass: boolean): void {
    if (this.audioEngine) {
      this.audioEngine.setEQBypass(bypass);
    }
  }

  setReverbMix(mix: number): void {
    if (this.audioEngine) {
      this.audioEngine.setReverbMix(mix);
    }
  }

  setReverbPreDelay(delayMs: number): void {
    if (this.audioEngine) {
      this.audioEngine.setReverbPreDelay(delayMs);
    }
  }

  setReverbDamping(cutoffHz: number): void {
    if (this.audioEngine) {
      this.audioEngine.setReverbDamping(cutoffHz);
    }
  }

  setReverbPreset(preset: 'small' | 'medium' | 'large'): void {
    if (this.audioEngine) {
      this.audioEngine.setReverbPreset(preset);
    }
  }

  setReverbBypass(bypass: boolean): void {
    if (this.audioEngine) {
      this.audioEngine.setReverbBypass(bypass);
    }
  }

  setLowPassTone(cutoffHz: number): void {
    if (this.audioEngine) {
      this.audioEngine.setLowPassTone(cutoffHz);
    }
  }

  setLowPassResonance(resonance: number): void {
    if (this.audioEngine) {
      this.audioEngine.setLowPassResonance(resonance);
    }
  }

  setEffectBypass(id: EffectModuleId, bypass: boolean): void {
    if (this.audioEngine) {
      this.audioEngine.setEffectBypass(id, bypass);
    }
  }

  setEffectMix(id: EffectModuleId, mix: number): void {
    if (this.audioEngine) {
      this.audioEngine.setEffectMix(id, mix);
    }
  }

  destroy(): void {
    if (this.audioEngine) {
      this.audioEngine.destroy();
    }
  }
}