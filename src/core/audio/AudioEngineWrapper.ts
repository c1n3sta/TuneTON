import type { AudioEffect, AudioEngine, AudioTrack, EffectModuleId } from '../../types/audio';
import { WebAudioEngine } from './AudioEngine';

export class AudioEngineWrapper implements AudioEngine {
  private audioEngine: WebAudioEngine | null = null;
  private hasUserInteracted = false;
  private isInitialized = false;

  // Method to notify the wrapper that user interaction has occurred
  setUserInteracted(): void {
    this.hasUserInteracted = true;
  }

  // Initialize audio engine on first user interaction
  private async initializeOnUserInteraction(): Promise<WebAudioEngine> {
    // Ensure we have proper user interaction before proceeding
    if (!this.hasUserInteracted) {
      // Wait for user interaction or throw a specific error
      throw new Error('Audio playback requires user interaction. Please click or tap on the page before playing audio.');
    }
    
    // Always set hasUserInteracted to true when this method is called
    // This ensures that subsequent calls don't block on user interaction
    this.hasUserInteracted = true;
    
    if (!this.audioEngine) {
      try {
        this.audioEngine = new WebAudioEngine();
        // No need to call initialize since it's done through getAudioContext
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize WebAudioEngine:', error);
        throw new Error(`Failed to initialize audio engine: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return this.audioEngine;
  }

  async loadTrack(track: AudioTrack): Promise<void> {
    try {
      const engine = await this.initializeOnUserInteraction();
      return await engine.loadTrack(track);
    } catch (error) {
      console.error('AudioEngineWrapper failed to load track:', error);
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('autoplay') || error.message.includes('activate')) {
          throw new Error('Audio playback blocked by browser. Please click the play button again to start playback.');
        } else if (error.message.includes('user interaction')) {
          throw new Error('Audio playback requires user interaction. Please click or tap anywhere on the page, then click the play button again to start playback.');
        }
      }
      throw new Error(`Audio engine error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async play(): Promise<void> {
    try {
      const engine = await this.initializeOnUserInteraction();
      return await engine.play();
    } catch (error) {
      console.error('AudioEngineWrapper failed to play:', error);
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('autoplay') || error.message.includes('activate')) {
          throw new Error('Audio playback blocked by browser. Please click the play button again to start playback.');
        } else if (error.message.includes('user interaction')) {
          throw new Error('Audio playback requires user interaction. Please click or tap anywhere on the page, then click the play button again to start playback.');
        }
      }
      throw new Error(`Audio engine error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

  // Additional methods needed by useAudioPlayer
  setEffectBypassById(effectId: string, bypass: boolean): void {
    if (this.audioEngine) {
      // Map effectId to EffectModuleId
      switch (effectId) {
        case 'eq':
          this.audioEngine.setEffectBypass('eq', bypass);
          break;
        case 'reverb':
          this.audioEngine.setEffectBypass('reverb', bypass);
          break;
        case 'tempoPitch':
          // Handle tempo/pitch bypass if needed
          break;
        case 'lofi':
          // Handle lofi bypass if needed
          break;
        case 'lowPass':
          // Handle low-pass bypass if needed
          break;
        default:
          console.warn(`Unknown effect ID: ${effectId}`);
      }
    }
  }

  setEffectMixById(effectId: string, mix: number): void {
    if (this.audioEngine) {
      // Map effectId to EffectModuleId
      switch (effectId) {
        case 'eq':
          this.audioEngine.setEffectMix('eq', mix);
          break;
        case 'reverb':
          this.audioEngine.setEffectMix('reverb', mix);
          break;
        case 'tempoPitch':
          // Handle tempo/pitch mix if needed
          break;
        case 'lofi':
          // Handle lofi mix if needed
          break;
        case 'lowPass':
          // Handle low-pass mix if needed
          break;
        default:
          console.warn(`Unknown effect ID: ${effectId}`);
      }
    }
  }

  destroy(): void {
    if (this.audioEngine) {
      this.audioEngine.destroy();
    }
  }
}