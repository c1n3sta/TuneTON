import type { AudioEffect, AudioEngine, AudioTrack, EffectModuleId } from '../../types/audio';

export class WebAudioEngine implements AudioEngine {
  private audioContext: AudioContext | null = null;
  private audioBufferSource: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private mediaElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;

  // Master gain at the end of the chain
  private masterGain: GainNode;

  // Effect bus: three module stages with dry/wet and bypass
  private tempoPitchIn: GainNode;
  private tempoPitchWet: GainNode;
  private tempoPitchDry: GainNode;
  private tempoPitchOut: GainNode;

  private lofiIn: GainNode;
  private lofiWet: GainNode;
  private lofiDry: GainNode;
  private lofiOut: GainNode;
  private lofiLPF: BiquadFilterNode;
  private lofiNoiseGain: GainNode;
  private lofiNoiseSource: AudioBufferSourceNode | null = null;
  private lofiWowLFO: OscillatorNode;
  private lofiWowDepth: GainNode;
  // 7-band EQ nodes
  private eqBands: BiquadFilterNode[] = [];
  private eqMix: GainNode;
  private eqBypass: GainNode;
  private eqWet: GainNode;
  private eqDry: GainNode;
  private eqIn: GainNode;
  private eqOut: GainNode;
  // Reverb nodes
  private reverbIn: GainNode;
  private reverbOut: GainNode;
  private reverbMix: GainNode;
  private reverbBypass: GainNode;
  private reverbWet: GainNode;
  private reverbDry: GainNode;
  private reverbConvolver: ConvolverNode | null = null;
  private reverbPreDelay: DelayNode;
  private reverbDamping: BiquadFilterNode;
  // private reverbPreset: 'small' | 'medium' | 'large' = 'medium';
  // Low-pass tone control
  private lowPassTone: BiquadFilterNode;

  private analyser: AnalyserNode;
  private eqNodes: {
    low: BiquadFilterNode;
    mid: BiquadFilterNode;
    high: BiquadFilterNode;
  };
  private tonePitchShift: any | null = null;
  private pitchPostLPF: BiquadFilterNode | null = null;
  private pitchPostLPF2: BiquadFilterNode | null = null;
  private workletPitchNode: AudioWorkletNode | null = null;
  private readonly enableExperimentalWorklet: boolean = false;
  // private pitchShifter: any; // Will be implemented later

  private startTime = 0;
  private pauseTime = 0;
  private isPlayingFlag = false;
  private playbackRate = 1.0; // legacy UI rate selector
  private pitchRatio = 1.0; // from semitones
  private volume = 1.0;
  private eqSettings = {
    low: 0,
    mid: 0,
    high: 0
  };

  // Simple bypass/mix states for future modules
  private effectBypass: Record<EffectModuleId, boolean> = {
    tempoPitch: false,
    lofi: true,
    eq: false,
    reverb: false,
  };
  private effectMix: Record<EffectModuleId, number> = {
    tempoPitch: 1,
    lofi: 0,
    eq: 1,
    reverb: 1,
  };

  private moduleGains: Record<EffectModuleId, { dry: GainNode; wet: GainNode }>; 

  constructor() {
    // Don't initialize the AudioContext immediately to comply with autoplay policy
    // AudioContext will be initialized on first user interaction
  }

  // Initialize AudioContext on first user interaction
  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      try {
        // For Telegram Web Apps, we need to handle autoplay policy differently
        const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextConstructor({
          latencyHint: 'interactive',
          sampleRate: 44100 // Standard sample rate for better compatibility
        } as any);
        
        // Initialize all audio nodes
        await this.initializeAudioNodes();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        throw new Error('Failed to initialize audio system. This may be due to browser restrictions or missing audio capabilities.');
      }
    }
    
    // Resume context if suspended (needed for autoplay policy)
    if (this.audioContext.state === 'suspended') {
      console.log('Audio context is suspended, attempting to resume...');
      try {
        // For Telegram Web Apps, we need to ensure proper user interaction handling
        await this.audioContext.resume();
        console.log('Audio context resumed successfully');
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        // Provide more specific error messages based on the error type
        if (error instanceof DOMException) {
          switch (error.name) {
            case 'NotAllowedError':
              throw new Error('Audio playback blocked by browser autoplay policy. Please interact with the page (click, tap, or press a key) and then click the play button again to start playback.');
            case 'AbortError':
              throw new Error('Audio activation was interrupted. Please interact with the page and click the play button again to retry.');
            default:
              throw new Error(`Failed to activate audio system: ${error.message || 'Unknown error'}. Please interact with the page and click the play button again.`);
          }
        }
        throw new Error('Failed to activate audio system. Please interact with the page (click, tap, or press a key) and then click the play button again.');
      }
    }
    
    return this.audioContext;
  }

  // Initialize all audio nodes
  private async initializeAudioNodes(): Promise<void> {
    if (!this.audioContext) return;
    
    // Core nodes
    this.masterGain = this.audioContext.createGain();
    // Tempo/Pitch module nodes (processing to be added in Step 3)
    this.tempoPitchIn = this.audioContext.createGain();
    this.tempoPitchWet = this.audioContext.createGain();
    this.tempoPitchDry = this.audioContext.createGain();
    this.tempoPitchOut = this.audioContext.createGain();
    // Lo-fi module nodes (processing to be added in Step 4)
    this.lofiIn = this.audioContext.createGain();
    this.lofiWet = this.audioContext.createGain();
    this.lofiDry = this.audioContext.createGain();
    this.lofiOut = this.audioContext.createGain();
    this.lofiLPF = this.audioContext.createBiquadFilter();
    this.lofiLPF.type = 'lowpass';
    this.lofiLPF.frequency.value = 20000;
    this.lofiLPF.Q.value = 0.0001;
    this.lofiNoiseGain = this.audioContext.createGain();
    this.lofiNoiseGain.gain.value = 0;
    this.lofiWowLFO = this.audioContext.createOscillator();
    this.lofiWowLFO.type = 'sine';
    this.lofiWowLFO.frequency.value = 0.3;
    this.lofiWowDepth = this.audioContext.createGain();
    this.lofiWowDepth.gain.value = 0;
    // EQ module nodes (processing exists as eqNodes chain)
    this.eqIn = this.audioContext.createGain();
    this.eqWet = this.audioContext.createGain();
    this.eqDry = this.audioContext.createGain();
    this.eqOut = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();
    
    // Setup EQ nodes (kept as part of the effect chain scaffold)
    this.eqNodes = {
      low: this.audioContext.createBiquadFilter(),
      mid: this.audioContext.createBiquadFilter(),
      high: this.audioContext.createBiquadFilter()
    };

    // Configure EQ nodes
    this.eqNodes.low.type = 'lowshelf';
    this.eqNodes.low.frequency.setValueAtTime(320, this.audioContext.currentTime);
    
    this.eqNodes.mid.type = 'peaking';
    this.eqNodes.mid.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    this.eqNodes.mid.Q.setValueAtTime(0.5, this.audioContext.currentTime);
    
    this.eqNodes.high.type = 'highshelf';
    this.eqNodes.high.frequency.setValueAtTime(3200, this.audioContext.currentTime);

    // Graph scaffold:
    // Source → TempoPitch (dry/wet) → LoFi (dry/wet) → EQ (dry/wet) → analyser → masterGain → Destination

    // Tempo/Pitch module wiring: input splits to dry; wet is fed via processor (Tone) or passthrough fallback
    this.tempoPitchIn.connect(this.tempoPitchDry);
    // mix into module out
    this.tempoPitchDry.connect(this.tempoPitchOut);
    this.tempoPitchWet.connect(this.tempoPitchOut);

    // Lo-fi module wiring (wet path passthrough placeholder)
    this.lofiIn.connect(this.lofiDry);
    this.lofiIn.connect(this.lofiLPF);
    this.lofiLPF.connect(this.lofiWet);
    this.lofiDry.connect(this.lofiOut);
    this.lofiWet.connect(this.lofiOut);
    // Noise bed mixed into wet
    this.lofiNoiseGain.connect(this.lofiWet);
    // Wow/flutter modulates LPF frequency slightly (gentle tone wobble)
    this.lofiWowLFO.connect(this.lofiWowDepth);
    this.lofiWowDepth.connect(this.lofiLPF.frequency);
    this.lofiWowLFO.start();

    // EQ module wiring: eqIn splits to dry and wet; wet passes through EQ chain then into eqWet
    this.eqIn.connect(this.eqDry);
    this.eqIn.connect(this.eqNodes.low);
    this.eqNodes.low.connect(this.eqNodes.mid);
    this.eqNodes.mid.connect(this.eqNodes.high);
    this.eqNodes.high.connect(this.eqWet);
    // Mix dry and wet into eqOut
    this.eqDry.connect(this.eqOut);
    this.eqWet.connect(this.eqOut);

    // Insert Pitch Shifter in the tempo/pitch WET path (prefer Worklet; fallback to Tone)
    try {
      const setupToneFallback = async () => {
        try {
          // Dynamically import Tone.js only when needed
          const Tone = await import('tone');
          (Tone as any).setContext?.(this.audioContext);
          const PitchShiftCtor = (Tone as any).PitchShift;
          if (PitchShiftCtor) {
            // Conservative settings to reduce jitter/metallic artifacts
            this.tonePitchShift = new PitchShiftCtor({ pitch: 0, windowSize: 0.18, delayTime: 0.03, wet: 1 });
            const toneConnect = (Tone as any).connect ?? ((src: any, dest: any) => src.connect(dest));
            toneConnect(this.tempoPitchIn, (this.tonePitchShift as any).input ?? this.tonePitchShift);

            // Post low-pass filtering to tame high-frequency grain artifacts
            this.pitchPostLPF = this.audioContext.createBiquadFilter();
            this.pitchPostLPF.type = 'lowpass';
            this.pitchPostLPF.frequency.value = 18000;
            this.pitchPostLPF.Q.value = 0.707;
            this.pitchPostLPF2 = this.audioContext.createBiquadFilter();
            this.pitchPostLPF2.type = 'lowpass';
            this.pitchPostLPF2.frequency.value = 20000;
            this.pitchPostLPF2.Q.value = 0.707;

            // Tone node → LPF1 → LPF2 → wet
            (this.tonePitchShift as any).connect(this.pitchPostLPF);
            this.pitchPostLPF.connect(this.pitchPostLPF2);
            this.pitchPostLPF2.connect(this.tempoPitchWet);
          } else {
            this.tempoPitchIn.connect(this.tempoPitchWet);
          }
        } catch (error) {
          console.warn('Failed to setup Tone.js pitch shifter, using passthrough:', error);
          this.tempoPitchIn.connect(this.tempoPitchWet);
        }
      };

      // @ts-ignore
      if (
        this.enableExperimentalWorklet &&
        this.audioContext.audioWorklet &&
        typeof this.audioContext.audioWorklet.addModule === 'function'
      ) {
        const workletUrl = new URL('./worklets/wsolaPitchShifter.worklet.js', import.meta.url);
        this.audioContext.audioWorklet
          .addModule(workletUrl.toString())
          .then(() => {
            try {
              this.workletPitchNode = new AudioWorkletNode(this.audioContext, 'wsola-pitch', {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                outputChannelCount: [2],
                parameterData: { semitones: 0, windowSize: 0.16, crossfade: 0.5 },
              });
              this.tempoPitchIn.connect(this.workletPitchNode);
              this.workletPitchNode.connect(this.tempoPitchWet);
            } catch (error) {
              console.warn('Failed to setup AudioWorklet pitch shifter, using Tone.js fallback:', error);
              setupToneFallback();
            }
          })
          .catch((error) => {
            console.warn('Failed to load AudioWorklet module, using Tone.js fallback:', error);
            setupToneFallback();
          });
      } else {
        setupToneFallback();
      }
    } catch (error) {
      console.warn('Failed to setup pitch shifter, using passthrough:', error);
      this.tempoPitchIn.connect(this.tempoPitchWet);
    }

    // Initialize reverb
    this.reverbIn = this.audioContext.createGain();
    this.reverbOut = this.audioContext.createGain();
    this.reverbMix = this.audioContext.createGain();
    this.reverbBypass = this.audioContext.createGain();
    this.reverbWet = this.audioContext.createGain();
    this.reverbDry = this.audioContext.createGain();
    this.reverbPreDelay = this.audioContext.createDelay();
    this.reverbDamping = this.audioContext.createBiquadFilter();
    
    // Configure reverb nodes
    this.reverbPreDelay.delayTime.value = 0.02; // 20ms default
    this.reverbDamping.type = 'lowpass';
    this.reverbDamping.frequency.value = 8000; // 8kHz default
    this.reverbDamping.Q.value = 0.707;

    // Wire reverb chain: reverbIn → preDelay → convolver → damping → reverbWet
    this.reverbIn.connect(this.reverbPreDelay);
    this.reverbPreDelay.connect(this.reverbWet);
    this.reverbWet.connect(this.reverbOut);

    // Wire reverb dry path
    this.reverbIn.connect(this.reverbDry);
    this.reverbDry.connect(this.reverbOut);

    // Set initial reverb mix and bypass
    this.reverbMix.gain.value = 1;
    this.reverbBypass.gain.value = 1;
    this.reverbWet.gain.value = 0.3; // Default 30% wet
    this.reverbDry.gain.value = 0.7; // Default 70% dry

    // Load default reverb impulse
    this.loadReverbImpulse('medium');

    // Initialize low-pass tone control
    this.lowPassTone = this.audioContext.createBiquadFilter();
    this.lowPassTone.type = 'lowpass';
    this.lowPassTone.frequency.value = 20000; // Start at full range
    this.lowPassTone.Q.value = 0.707; // Default resonance

    // Chain modules: source → tempoPitchIn (dry+wet) → tempoPitchOut → lofiIn → lofiOut → eqIn → eqOut → reverbIn → reverbOut → lowPassTone
    this.tempoPitchOut.connect(this.lofiIn);
    this.lofiOut.connect(this.eqIn);
    this.eqOut.connect(this.reverbIn);
    this.reverbOut.connect(this.lowPassTone);
    this.lowPassTone.connect(this.analyser);
    this.analyser.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);

    // Initialize master gain
    this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

    // Initialize module gain maps and mix/bypass states
    this.moduleGains = {
      tempoPitch: { dry: this.tempoPitchDry.gain, wet: this.tempoPitchWet.gain } as unknown as { dry: GainNode; wet: GainNode },
      lofi: { dry: this.lofiDry.gain, wet: this.lofiWet.gain } as unknown as { dry: GainNode; wet: GainNode },
      eq: { dry: this.eqDry.gain, wet: this.eqWet.gain } as unknown as { dry: GainNode; wet: GainNode },
      reverb: { dry: this.reverbDry.gain, wet: this.reverbWet.gain } as unknown as { dry: GainNode; wet: GainNode },
    } as unknown as Record<EffectModuleId, { dry: GainNode; wet: GainNode }>;

    // Set initial mix for each module
    this.applyMix('tempoPitch', this.effectMix.tempoPitch, true);
    this.applyMix('lofi', this.effectMix.lofi, true);
    this.applyMix('eq', this.effectMix.eq, true);
    this.applyMix('reverb', this.effectMix.reverb, true);
    // Apply bypass states
    this.applyBypass('tempoPitch', this.effectBypass.tempoPitch, true);
    this.applyBypass('lofi', this.effectBypass.lofi, true);
    this.applyBypass('eq', this.effectBypass.eq, true);
    this.applyBypass('reverb', this.effectBypass.reverb, true);

    // Initialize 7-band EQ
    this.eqIn = this.audioContext.createGain();
    this.eqOut = this.audioContext.createGain();
    this.eqMix = this.audioContext.createGain();
    this.eqBypass = this.audioContext.createGain();
    this.eqWet = this.audioContext.createGain();
    this.eqDry = this.audioContext.createGain();

    // Create 7 EQ bands with frequencies: 60, 170, 310, 600, 1000, 3000, 6000 Hz
    const eqFrequencies = [60, 170, 310, 600, 1000, 3000, 6000];
    const eqQValues = [1.0, 1.1, 1.2, 1.3, 1.4, 1.3, 1.2];

    for (let i = 0; i < 7; i++) {
      const band = this.audioContext.createBiquadFilter();
      band.type = 'peaking';
      band.frequency.value = eqFrequencies[i]!;
      band.Q.value = eqQValues[i]!;
      band.gain.value = 0; // Start at unity (0 dB)
      this.eqBands.push(band);
    }

    // Wire EQ chain: eqIn → band0 → band1 → ... → band6 → eqWet
    if (this.eqBands[0]) {
      this.eqIn.connect(this.eqBands[0]);
    }
    for (let i = 0; i < 6; i++) {
      if (this.eqBands[i] && this.eqBands[i + 1]) {
        this.eqBands[i]!.connect(this.eqBands[i + 1]!);
      }
    }
    if (this.eqBands[6]) {
      this.eqBands[6]!.connect(this.eqWet);
    }

    // Set initial mix and bypass
    this.eqMix.gain.value = 1;
    this.eqBypass.gain.value = 1;
    this.eqWet.gain.value = 1;
    this.eqDry.gain.value = 1;
  }

  // Helper to apply bypass by forcing dry=1 wet=0 when bypassed
  private applyBypass(id: EffectModuleId, bypass: boolean, immediate = false): void {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const { dry, wet } = this.moduleGains[id];
    const dryParam = (dry as unknown as GainNode).gain ?? (dry as unknown as any);
    const wetParam = (wet as unknown as GainNode).gain ?? (wet as unknown as any);
    const set = (param: AudioParam, value: number) => {
      param.cancelScheduledValues(now);
      if (immediate) param.setValueAtTime(value, now);
      else param.linearRampToValueAtTime(value, now + 0.01);
    };
    if (bypass) {
      set(dryParam, 1);
      set(wetParam, 0);
    } else {
      // Restore per-module mix
      const mix = this.effectMix[id];
      set(dryParam, 1 - mix);
      set(wetParam, mix);
    }
  }

  // Helper to apply dry/wet mix
  private applyMix(id: EffectModuleId, mix: number, immediate = false): void {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const { dry, wet } = this.moduleGains[id];
    const dryParam = (dry as unknown as GainNode).gain ?? (dry as unknown as any);
    const wetParam = (wet as unknown as GainNode).gain ?? (wet as unknown as any);
    const set = (param: AudioParam, value: number) => {
      param.cancelScheduledValues(now);
      if (immediate) param.setValueAtTime(value, now);
      else param.linearRampToValueAtTime(value, now + 0.01);
    };
    if (this.effectBypass[id]) {
      set(dryParam, 1);
      set(wetParam, 0);
      return;
    }
    set(dryParam, 1 - mix);
    set(wetParam, mix);
  }

  async loadTrack(track: AudioTrack): Promise<void> {
    try {
      // Ensure audio context is initialized
      await this.getAudioContext();
      
      this.stop();
      // this.currentTrack = track;
      
      // Prefer using HTMLMediaElement for tempo without pitch change
      if (typeof track.source === 'string') {
        // Clean previous media node
        if (this.mediaSourceNode) {
          try { this.mediaSourceNode.disconnect(); } catch {}
          this.mediaSourceNode = null;
        }
        
        // Create media element with proper attributes for Telegram Web Apps
        const media = new Audio();
        media.crossOrigin = 'anonymous';
        media.src = track.source as string;
        media.preload = 'auto';
        
        // Add mobile-specific attributes for better compatibility
        media.setAttribute('playsinline', 'true');
        media.setAttribute('webkit-playsinline', 'true');
        media.setAttribute('x5-playsinline', 'true');
        
        // Add additional attributes for Telegram Web Apps
        media.setAttribute('muted', 'false');
        media.setAttribute('autoplay', 'false');
        
        this.mediaElement = media;

        // Add comprehensive error handling for media loading
        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => { 
            cleanup(); 
            console.log('Media loaded successfully');
            resolve(); 
          };
          
          const onError = (e: ErrorEvent) => { 
            cleanup(); 
            console.error('Failed to load media:', e);
            // Check if this is a CORS error
            if (e.message && e.message.includes('CORS')) {
              reject(new Error(`CORS error loading audio. The server hosting the audio file doesn't allow requests from this domain.`));
            } else {
              // Try to get more specific error information from the media element
              let errorMsg = 'Unknown error';
              if (this.mediaElement) {
                switch (this.mediaElement.error?.code) {
                  case MediaError.MEDIA_ERR_ABORTED:
                    errorMsg = 'Media loading was aborted. The track URL may have expired or be invalid.';
                    break;
                  case MediaError.MEDIA_ERR_NETWORK:
                    errorMsg = 'Network error occurred while loading audio. The track URL may have expired or be inaccessible.';
                    break;
                  case MediaError.MEDIA_ERR_DECODE:
                    errorMsg = 'Audio decoding error. The track format may not be supported.';
                    break;
                  case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMsg = 'Audio source not supported. The track URL format may be invalid.';
                    break;
                  default:
                    errorMsg = e.message || 'Unknown error';
                }
              }
              reject(new Error(`Failed to load media: ${errorMsg}. The track URL may have expired or be inaccessible.`)); 
            }
          };
          
          const onStalled = () => {
            console.warn('Media loading stalled');
          };
          
          const onAbort = () => {
            console.warn('Media loading aborted');
          };
          
          const cleanup = () => {
            media.removeEventListener('loadedmetadata', onLoaded);
            media.removeEventListener('error', onError);
            media.removeEventListener('stalled', onStalled);
            media.removeEventListener('abort', onAbort);
          };
          
          media.addEventListener('loadedmetadata', onLoaded);
          media.addEventListener('error', onError);
          media.addEventListener('stalled', onStalled);
            media.addEventListener('abort', onAbort);
          
          // Add timeout to prevent hanging
          setTimeout(() => {
            if (media.readyState < 1) {
              cleanup();
              // Check if there's a more specific error
              let timeoutError = 'Timeout while loading media. This may be due to network issues, server problems, or an expired track URL.';
              if (this.mediaElement?.error) {
                switch (this.mediaElement.error.code) {
                  case MediaError.MEDIA_ERR_ABORTED:
                    timeoutError = 'Media loading was aborted. The track URL may have expired or be invalid.';
                    break;
                  case MediaError.MEDIA_ERR_NETWORK:
                    timeoutError = 'Network error occurred while loading audio. The track URL may have expired or be inaccessible.';
                    break;
                  case MediaError.MEDIA_ERR_DECODE:
                    timeoutError = 'Audio decoding error. The track format may not be supported.';
                    break;
                  case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    timeoutError = 'Audio source not supported. The track URL format may be invalid.';
                    break;
                }
              }
              reject(new Error(timeoutError));
            }
          }, 15000); // 15 second timeout
        });

        // Preserve pitch on tempo changes if supported
        try {
          (media as any).preservesPitch = true;
          (media as any).mozPreservesPitch = true;
          (media as any).webkitPreservesPitch = true;
        } catch {}

        // Wire into graph once
        if (this.audioContext) {
          this.mediaSourceNode = this.audioContext.createMediaElementSource(media);
          this.mediaSourceNode.connect(this.tempoPitchIn);
        }
        this.pauseTime = 0;
        this.audioBuffer = null;
        return;
      }

      // Fallback: decode into AudioBuffer
      let arrayBuffer: ArrayBuffer;
      if (track.source instanceof ArrayBuffer) {
        arrayBuffer = track.source;
      } else {
        throw new Error('Invalid track source: Expected string URL or ArrayBuffer');
      }
      try {
        if (this.audioContext) {
          this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        }
      } catch (error) {
        this.audioBuffer = null;
        throw new Error(`Failed to decode audio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      this.pauseTime = 0;
    } catch (error) {
      console.error('Error in loadTrack:', error);
      // If this is a Jamendo track with a fallback URL, try the fallback
      if (error instanceof Error && error.message.includes('Failed to load media') && (track as any).fallbackUrl) {
        console.log('Trying fallback URL:', (track as any).fallbackUrl);
        const fallbackTrack = {
          ...track,
          source: (track as any).fallbackUrl,
          audioUrl: (track as any).fallbackUrl
        };
        // Remove the fallbackUrl to prevent infinite recursion
        delete (fallbackTrack as any).fallbackUrl;
        return await this.loadTrack(fallbackTrack);
      }
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      // Ensure audio context is initialized
      const audioContext = await this.getAudioContext();
      
      if (this.mediaElement) {
        // Ensure audio context is properly resumed before playing
        if (audioContext.state === 'suspended') {
          console.log('Audio context is suspended, attempting to resume...');
          try {
            await audioContext.resume();
            console.log('Audio context resumed successfully');
          } catch (resumeError) {
            console.error('Failed to resume audio context:', resumeError);
            // Provide more specific error messages based on the error type
            if (resumeError instanceof DOMException) {
              switch (resumeError.name) {
                case 'NotAllowedError':
                  throw new Error('Audio playback blocked by browser autoplay policy. Please click the play button again to start playback.');
                case 'AbortError':
                  throw new Error('Audio activation was interrupted. Please click the play button again to retry.');
                default:
                  throw new Error(`Failed to activate audio system: ${resumeError.message || 'Unknown error'}. This may be due to browser restrictions. Please click the play button again.`);
              }
            }
            throw new Error('Failed to activate audio system. This may be due to browser restrictions. Please click the play button again.');
          }
        }
        
        // For Telegram Web Apps, we need to ensure the media element is properly configured
        if (this.mediaElement.paused) {
          // Reset media element state
          this.mediaElement.load();
          
          // Gentle fade-in
          const now = audioContext.currentTime;
          const gainParam = this.masterGain?.gain;
          if (gainParam) {
            gainParam.cancelScheduledValues(now);
            const targetVol = this.volume;
            const startValue = Math.max(0, Math.min(1, gainParam.value));
            gainParam.setValueAtTime(startValue, now);
            gainParam.linearRampToValueAtTime(targetVol, now + 0.01);
          }

          // Add error handling for play
          try {
            console.log('Attempting to play media element...');
            console.log('Media element state:', {
              src: this.mediaElement.src,
              readyState: this.mediaElement.readyState,
              networkState: this.mediaElement.networkState,
              error: this.mediaElement.error
            });
            
            await this.mediaElement.play();
            this.isPlayingFlag = true;
            console.log('Media element playing successfully');
            return;
          } catch (error) {
            console.error('Error playing media:', error);
            console.error('Media element error details:', {
              src: this.mediaElement.src,
              readyState: this.mediaElement.readyState,
              networkState: this.mediaElement.networkState,
              error: this.mediaElement.error
            });
            
            // Provide more detailed error messages based on the error type
            if (error instanceof DOMException) {
              switch (error.name) {
                case 'NotAllowedError':
                  throw new Error('Audio playback blocked by browser autoplay policy. Click the play button again to start playback.');
                case 'AbortError':
                  throw new Error('Audio playback was interrupted. This may be due to browser autoplay restrictions or network issues. Click the play button again to retry.');
                case 'NotSupportedError':
                  throw new Error('Audio format not supported by this browser. Try a different track.');
                default:
                  throw new Error(`Audio playback failed: ${error.message || 'Unknown error'}. Click the play button again to retry.`);
              }
            }
            // Check if this is a MediaError from the media element
            else if (this.mediaElement?.error) {
              switch (this.mediaElement.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                  throw new Error('Media playback was aborted. The track URL may have expired or be invalid.');
                case MediaError.MEDIA_ERR_NETWORK:
                  throw new Error('Network error occurred while playing audio. The track URL may have expired or be inaccessible.');
                case MediaError.MEDIA_ERR_DECODE:
                  throw new Error('Audio decoding error. The track format may not be supported.');
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  throw new Error('Audio source not supported. The track URL format may be invalid.');
                default:
                  throw new Error(`Audio playback failed: ${error instanceof Error ? error.message : 'Unknown error'}. The track URL may have expired or be inaccessible.`);
              }
            }
            throw new Error(`Failed to play audio: ${error instanceof Error ? error.message : 'Playback failed'}. Click the play button again to retry.`);
          }
        } else {
          // Media is already playing
          this.isPlayingFlag = true;
          return;
        }
      }
      
      if (!this.audioBuffer) {
        throw new Error('No audio data loaded. Please select a different track or check your network connection.');
      }
      
      if (this.isPlayingFlag) {
        this.pause();
        return;
      }

      // Create new source and wire to effect bus input
      if (this.audioContext) {
        this.audioBufferSource = this.audioContext.createBufferSource();
        this.audioBufferSource.buffer = this.audioBuffer;
        // Apply both playback rate and pitch (temporary coupling on buffer path)
        this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitchRatio;
        
        // Connect source to the first module input
        this.audioBufferSource.connect(this.tempoPitchIn);
        
        this.audioBufferSource.onended = () => {
          this.isPlayingFlag = false;
          this.pauseTime = 0;
          // TODO: Emit track end event
        };

        // Gentle fade-in to avoid clicks
        const now = this.audioContext.currentTime;
        const gainParam = this.masterGain?.gain;
        if (gainParam) {
          gainParam.cancelScheduledValues(now);
          const targetVol = this.volume;
          // Start from current value (or 0 if starting from silence)
          const startValue = Math.max(0, Math.min(1, gainParam.value));
          gainParam.setValueAtTime(startValue, now);
          gainParam.linearRampToValueAtTime(targetVol, now + 0.01);
        }

        this.startTime = now - this.pauseTime;
        this.audioBufferSource.start(0, this.pauseTime);
        this.isPlayingFlag = true;
        
        // Resume audio context if it was suspended
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      }
    } catch (error) {
      console.error('Error in play:', error);
      throw error;
    }
  }

  pause(): void {
    if (!this.audioContext) return;
    
    if (this.mediaElement) {
      const now = this.audioContext.currentTime;
      const gainParam = this.masterGain?.gain;
      const current = gainParam?.value || 0;
      if (gainParam) {
        gainParam.cancelScheduledValues(now);
        gainParam.setValueAtTime(current, now);
        gainParam.linearRampToValueAtTime(0, now + 0.01);
      }
      this.mediaElement.pause();
      this.isPlayingFlag = false;
      if (this.masterGain) {
        const gainParam = this.masterGain.gain;
        gainParam.setValueAtTime(this.volume, now + 0.02);
      }
      return;
    }
    if (!this.audioBufferSource) return;

    // Gentle fade-out to avoid clicks
    const now = this.audioContext.currentTime;
    const gainParam = this.masterGain?.gain;
    const current = gainParam?.value || 0;
    if (gainParam) {
      gainParam.cancelScheduledValues(now);
      gainParam.setValueAtTime(current, now);
      gainParam.linearRampToValueAtTime(0, now + 0.01);
    }
    
    this.pauseTime = this.getCurrentTime();
    if (this.audioBufferSource) {
      this.audioBufferSource.stop();
      this.audioBufferSource.disconnect();
    }
    this.audioBufferSource = null;
    this.isPlayingFlag = false;

    // Restore gain back to target volume after fade-out completes
    if (this.masterGain) {
      const gainParam = this.masterGain.gain;
      gainParam.setValueAtTime(this.volume, now + 0.02);
    }
  }

  stop(): void {
    if (!this.audioContext) return;
    
    if (this.mediaElement) {
      const now = this.audioContext.currentTime;
      const gainParam = this.masterGain?.gain;
      const current = gainParam?.value || 0;
      if (gainParam) {
        gainParam.cancelScheduledValues(now);
        gainParam.setValueAtTime(current, now);
        gainParam.linearRampToValueAtTime(0, now + 0.01);
      }
      this.mediaElement.pause();
      this.mediaElement.currentTime = 0;
      this.isPlayingFlag = false;
      if (this.masterGain) {
        const gainParam = this.masterGain.gain;
        gainParam.setValueAtTime(this.volume, now + 0.02);
      }
      return;
    }
    if (this.audioBufferSource) {
      // Gentle fade-out
      const now = this.audioContext.currentTime;
      const gainParam = this.masterGain?.gain;
      const current = gainParam?.value || 0;
      if (gainParam) {
        gainParam.cancelScheduledValues(now);
        gainParam.setValueAtTime(current, now);
        gainParam.linearRampToValueAtTime(0, now + 0.01);
      }

      this.audioBufferSource.stop();
      if (this.audioBufferSource) {
        this.audioBufferSource.disconnect();
      }
      this.audioBufferSource = null;

      // Restore volume shortly after stopping
      if (this.masterGain) {
        const gainParam = this.masterGain.gain;
        gainParam.setValueAtTime(this.volume, now + 0.02);
      }
    }
    this.pauseTime = 0;
    this.isPlayingFlag = false;
  }

  seek(time: number): void {
    if (!this.audioContext) return;
    
    if (this.mediaElement) {
      const duration = this.mediaElement.duration || 0;
      this.mediaElement.currentTime = Math.min(Math.max(0, time), duration);
      return;
    }
    if (!this.audioBuffer) return;
    
    const wasPlaying = this.isPlayingFlag;
    this.pause();
    this.pauseTime = Math.min(Math.max(0, time), this.audioBuffer.duration);
    
    if (wasPlaying) {
      this.play();
    }
  }

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.masterGain) {
      const gainParam = this.masterGain.gain;
      const now = this.audioContext?.currentTime || 0;
      gainParam.cancelScheduledValues(now);
      gainParam.setValueAtTime(volume, now);
    }
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    if (this.mediaElement) {
      this.mediaElement.playbackRate = rate;
    }
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = rate * this.pitchRatio;
    }
  }

  setPitch(pitch: number): void {
    // Legacy method, now handled by setPitchSemitones
    this.setPitchSemitones(pitch);
  }

  setTempo(tempo: number): void {
    // For buffer playback, tempo affects playback rate
    this.setPlaybackRate(tempo);
  }

  setPitchSemitones(semitones: number): void {
    this.pitchRatio = Math.pow(2, semitones / 12);
    if (this.mediaElement) {
      // For media element, we need to preserve pitch when changing rate
      try {
        (this.mediaElement as any).preservesPitch = true;
        (this.mediaElement as any).mozPreservesPitch = true;
        (this.mediaElement as any).webkitPreservesPitch = true;
      } catch {}
      this.mediaElement.playbackRate = this.playbackRate * this.pitchRatio;
    }
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitchRatio;
    }
  }

  setEQ(band: 'low' | 'mid' | 'high', value: number): void {
    switch (band) {
      case 'low':
        this.eqSettings.low = value;
        if (this.eqNodes.low) {
          this.eqNodes.low.gain.setValueAtTime(value, this.audioContext?.currentTime || 0);
        }
        break;
      case 'mid':
        this.eqSettings.mid = value;
        if (this.eqNodes.mid) {
          this.eqNodes.mid.gain.setValueAtTime(value, this.audioContext?.currentTime || 0);
        }
        break;
      case 'high':
        this.eqSettings.high = value;
        if (this.eqNodes.high) {
          this.eqNodes.high.gain.setValueAtTime(value, this.audioContext?.currentTime || 0);
        }
        break;
    }
  }

  applyEffect(effect: AudioEffect): void {
    // Placeholder for effect application
    console.warn('applyEffect not fully implemented');
  }

  removeEffect(effectId: string): void {
    // Placeholder for effect removal
    console.warn('removeEffect not fully implemented');
  }

  getCurrentTime(): number {
    if (this.mediaElement) {
      return this.mediaElement.currentTime;
    }
    if (this.audioBufferSource && this.audioContext) {
      return (this.audioContext.currentTime - this.startTime) * this.playbackRate * this.pitchRatio + this.pauseTime;
    }
    return this.pauseTime;
  }

  getDuration(): number {
    if (this.mediaElement) {
      return this.mediaElement.duration || 0;
    }
    if (this.audioBuffer) {
      return this.audioBuffer.duration;
    }
    return 0;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  setLofiTone(cutoffHz: number): void {
    if (this.lofiLPF) {
      this.lofiLPF.frequency.setValueAtTime(cutoffHz, this.audioContext?.currentTime || 0);
    }
  }

  setLofiNoiseLevel(level01: number): void {
    if (this.lofiNoiseGain) {
      this.lofiNoiseGain.gain.setValueAtTime(level01, this.audioContext?.currentTime || 0);
    }
  }

  setLofiWowFlutter(depthMs: number, rateHz: number): void {
    if (this.lofiWowLFO && this.lofiWowDepth) {
      this.lofiWowLFO.frequency.setValueAtTime(rateHz, this.audioContext?.currentTime || 0);
      this.lofiWowDepth.gain.setValueAtTime(depthMs, this.audioContext?.currentTime || 0);
    }
  }

  setLofiCrackle(amountPerSec: number): void {
    // Placeholder for crackle effect
    console.warn('setLofiCrackle not implemented');
  }

  setEQBand(band: number, gainDb: number): void {
    if (this.eqBands[band]) {
      this.eqBands[band]!.gain.setValueAtTime(gainDb, this.audioContext?.currentTime || 0);
    }
  }

  setEQMix(mix: number): void {
    if (this.eqMix) {
      this.eqMix.gain.setValueAtTime(mix, this.audioContext?.currentTime || 0);
    }
  }

  setEQBypass(bypass: boolean): void {
    if (this.eqBypass) {
      this.eqBypass.gain.setValueAtTime(bypass ? 0 : 1, this.audioContext?.currentTime || 0);
    }
  }

  setReverbMix(mix: number): void {
    if (this.reverbMix) {
      this.reverbMix.gain.setValueAtTime(mix, this.audioContext?.currentTime || 0);
    }
  }

  setReverbPreDelay(delayMs: number): void {
    if (this.reverbPreDelay) {
      this.reverbPreDelay.delayTime.setValueAtTime(delayMs / 1000, this.audioContext?.currentTime || 0);
    }
  }

  setReverbDamping(cutoffHz: number): void {
    if (this.reverbDamping) {
      this.reverbDamping.frequency.setValueAtTime(cutoffHz, this.audioContext?.currentTime || 0);
    }
  }

  setReverbPreset(preset: 'small' | 'medium' | 'large'): void {
    // Placeholder for preset loading
    console.warn('setReverbPreset not fully implemented');
  }

  setReverbBypass(bypass: boolean): void {
    if (this.reverbBypass) {
      this.reverbBypass.gain.setValueAtTime(bypass ? 0 : 1, this.audioContext?.currentTime || 0);
    }
  }

  setLowPassTone(cutoffHz: number): void {
    if (this.lowPassTone) {
      this.lowPassTone.frequency.setValueAtTime(cutoffHz, this.audioContext?.currentTime || 0);
    }
  }

  setLowPassResonance(resonance: number): void {
    if (this.lowPassTone) {
      this.lowPassTone.Q.setValueAtTime(resonance, this.audioContext?.currentTime || 0);
    }
  }

  setEffectBypass(id: EffectModuleId, bypass: boolean): void {
    this.effectBypass[id] = bypass;
    this.applyBypass(id, bypass);
  }

  setEffectMix(id: EffectModuleId, mix: number): void {
    this.effectMix[id] = mix;
    this.applyMix(id, mix);
  }

  loadReverbImpulse(preset: 'small' | 'medium' | 'large'): void {
    // Placeholder for loading reverb impulse responses
    console.warn('loadReverbImpulse not implemented');
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  // NEW: Helper method to refresh Jamendo track URLs
  private async refreshJamendoTrack(track: AudioTrack): Promise<AudioTrack | null> {
    try {
      // Import the Jamendo API utilities
      const { jamendoAPI } = await import('../../utils/jamendo-api');
      
      // Get the track ID from the track object
      const trackId = track.id;
      if (!trackId) {
        console.error('Cannot refresh Jamendo track: missing track ID');
        return null;
      }
      
      console.log('Refreshing Jamendo track with ID:', trackId);
      
      // Fetch fresh track data from Jamendo API
      const response = await jamendoAPI.searchTracks({ 
        limit: 1, 
        include: ['musicinfo'],
        // Search by track ID
        search: `id:${trackId}`
      });
      
      if (response.results && response.results.length > 0) {
        const freshTrackData = response.results[0];
        console.log('Fresh track data received:', freshTrackData);
        
        // Convert to AudioTrack format
        const { convertJamendoToTrack } = await import('../../components/player/utils');
        const freshAudioTrack = convertJamendoToTrack(freshTrackData);
        
        if (freshAudioTrack) {
          console.log('Successfully converted fresh track data to AudioTrack');
          return freshAudioTrack;
        } else {
          console.error('Failed to convert fresh Jamendo track data');
          return null;
        }
      } else {
        console.error('No track found when refreshing Jamendo track');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing Jamendo track:', error);
      return null;
    }
  }
}