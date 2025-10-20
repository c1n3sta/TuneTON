import { createAudioProcessor } from '../wasm/src/js/audio-processor-manager.js';

// Type definitions
export interface AudioEffectSettings {
  pitchShift?: number;
  bassBoost?: number;
  loFi?: {
    bitDepth: number;
    downsampleFactor: number;
  };
  eq?: {
    [frequency: number]: number; // frequency in Hz -> gain in dB
  };
}

export interface AudioEffectPresets {
  [key: string]: AudioEffectSettings;
}

// Default presets
export const DEFAULT_PRESETS: AudioEffectPresets = {
  flat: {
    eq: { 100: 0, 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 }
  },
  rock: {
    bassBoost: 3,
    eq: { 100: 4, 250: 2, 500: -1, 1000: -2, 2000: 1, 4000: 3, 8000: 5 }
  },
  pop: {
    eq: { 100: 2, 250: 3, 500: 1, 1000: 0, 2000: 2, 4000: 3, 8000: 3 }
  },
  jazz: {
    eq: { 100: 3, 250: 1, 500: 0, 1000: 1, 2000: 2, 4000: 1, 8000: 2 }
  },
  classical: {
    eq: { 100: 2, 250: 0, 500: 0, 1000: 0, 2000: 1, 4000: 2, 8000: 3 }
  },
  electronic: {
    bassBoost: 2,
    eq: { 100: 5, 250: 2, 500: -1, 1000: 0, 2000: 2, 4000: 4, 8000: 6 }
  },
  lofi: {
    loFi: { bitDepth: 8, downsampleFactor: 4 },
    eq: { 100: 2, 250: 1, 500: 0, 1000: -1, 2000: -2, 4000: -1, 8000: 0 }
  },
  vinyl: {
    loFi: { bitDepth: 12, downsampleFactor: 2 },
    eq: { 100: 3, 250: 2, 500: 1, 1000: 0, 2000: -1, 4000: -2, 8000: -3 }
  }
};

export class AudioEffectsManager {
  private audioContext: AudioContext | null = null;
  private audioProcessor: any = null;
  private isInitialized = false;

  /**
   * Initialize the audio effects processor
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      // Don't create audio context immediately to comply with autoplay policy
      // AudioContext will be initialized on first user interaction
      console.log('Audio effects manager ready for initialization on user interaction');
      return true;
    } catch (error) {
      console.error('Failed to prepare audio effects manager:', error);
      return false;
    }
  }

  /**
   * Initialize AudioContext on first user interaction
   */
  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create audio processor
      this.audioProcessor = await createAudioProcessor(this.audioContext, {
        wasmPath: '/wasm/audio_effects.wasm',
        workletPath: '/wasm/audio-worklet-processor.js'
      });
      
      this.isInitialized = true;
      console.log('Audio effects manager initialized successfully');
    }
    
    // Resume context if suspended (needed for autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  /**
   * Connect an audio source to the effects processor
   */
  async connectSource(source: AudioNode): Promise<void> {
    // Ensure audio context is initialized
    await this.getAudioContext();
    
    if (!this.isInitialized || !this.audioProcessor) {
      throw new Error('Audio effects manager not initialized');
    }
    
    source.connect(this.audioProcessor);
  }

  /**
   * Connect the effects processor to an output destination
   */
  async connectOutput(destination: AudioNode): Promise<void> {
    // Ensure audio context is initialized
    await this.getAudioContext();
    
    if (!this.isInitialized || !this.audioProcessor) {
      throw new Error('Audio effects manager not initialized');
    }
    
    this.audioProcessor.connect(destination);
  }

  /**
   * Apply audio effect settings
   */
  async applyEffects(settings: AudioEffectSettings): Promise<void> {
    // Ensure audio context is initialized
    await this.getAudioContext();
    
    if (!this.isInitialized || !this.audioProcessor) {
      throw new Error('Audio effects manager not initialized');
    }

    // Apply pitch shift
    if (settings.pitchShift !== undefined) {
      this.audioProcessor.setPitchShift(settings.pitchShift);
    }

    // Apply bass boost
    if (settings.bassBoost !== undefined) {
      this.audioProcessor.setBassBoost(settings.bassBoost);
    }

    // Apply Lo-Fi settings
    if (settings.loFi) {
      this.audioProcessor.setLoFiSettings(
        settings.loFi.bitDepth,
        settings.loFi.downsampleFactor
      );
    }

    // Apply EQ settings
    if (settings.eq) {
      Object.entries(settings.eq).forEach(([freq, gain]) => {
        this.audioProcessor.setEqBand(parseInt(freq), gain);
      });
    }
  }

  /**
   * Apply a preset
   */
  async applyPreset(presetName: string): Promise<void> {
    const preset = DEFAULT_PRESETS[presetName];
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }
    
    await this.applyEffects(preset);
  }

  /**
   * Reset all effects to default
   */
  async resetEffects(): Promise<void> {
    // Ensure audio context is initialized
    await this.getAudioContext();
    
    if (!this.isInitialized || !this.audioProcessor) {
      throw new Error('Audio effects manager not initialized');
    }
    
    this.audioProcessor.resetAllEffects();
  }

  /**
   * Get the current audio context
   */
  getAudioContextSync(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Check if the manager is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.audioProcessor) {
      this.audioProcessor.destroy();
      this.audioProcessor = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioEffectsManager = new AudioEffectsManager();

// Utility function to create an effect chain
export function createEffectChain(settings: AudioEffectSettings): (audioNode: AudioNode) => AudioNode {
  return (input: AudioNode) => {
    // In a real implementation, this would create a chain of audio nodes
    // For now, we'll just return the input node
    return input;
  };
}