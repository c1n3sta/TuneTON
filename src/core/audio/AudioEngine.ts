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
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          latencyHint: 'interactive'
        } as any);
        
        // Initialize all audio nodes
        await this.initializeAudioNodes();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        throw new Error('Failed to initialize audio system');
      }
    }
    
    // Resume context if suspended (needed for autoplay policy)
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        // Continue anyway as some operations might still work
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
    const eqQValues = [1.0, 1.1, 1.2, 1.3, 1.4, 1.3, 1.2]; // Q values around 1.0-1.4

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
        const media = new Audio();
        media.crossOrigin = 'anonymous';
        media.src = track.source;
        media.preload = 'auto';
        this.mediaElement = media;

        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => { cleanup(); resolve(); };
          const onError = () => { cleanup(); reject(new Error('Failed to load media')); };
          const cleanup = () => {
            media.removeEventListener('loadedmetadata', onLoaded);
            media.removeEventListener('error', onError);
          };
          media.addEventListener('loadedmetadata', onLoaded);
          media.addEventListener('error', onError);
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
        throw new Error('Invalid track source');
      }
      try {
        if (this.audioContext) {
          this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        }
      } catch (error) {
        this.audioBuffer = null;
        throw error;
      }
      this.pauseTime = 0;
    } catch (error) {
      console.error('Error in loadTrack:', error);
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      // Ensure audio context is initialized
      const audioContext = await this.getAudioContext();
      
      if (this.mediaElement) {
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

        await this.mediaElement.play();
        this.isPlayingFlag = true;
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        return;
      }
      if (!this.audioBuffer) return;
      
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
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audioContext && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    }
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = Math.max(0.5, Math.min(2, rate));
    if (this.mediaElement) {
      // Treat as separate from decoupled tempo/pitch controls; prefer decoupled path
      this.mediaElement.playbackRate = this.playbackRate;
      return;
    }
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitchRatio;
    }
  }

  setPitch(pitch: number): void {
    this.pitchRatio = Math.max(0.5, Math.min(2, pitch));
    if (this.mediaElement) {
      // No-op on media element path; pitch handled by Tone.PitchShift
      return;
    }
    // Update playback rate to include pitch adjustment
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitchRatio;
    }
    // TODO: Implement pitch shifting
  }

  setTempo(e: number): void {
    const clamped = Math.max(0.5, Math.min(1.5, e));
    if (this.mediaElement) {
      try {
        (this.mediaElement as any).preservesPitch = true;
        (this.mediaElement as any).mozPreservesPitch = true;
        (this.mediaElement as any).webkitPreservesPitch = true;
      } catch {}
      this.mediaElement.playbackRate = Math.max(0.25, Math.min(4, clamped));
      return;
    }
    this.setPlaybackRate(clamped);
  }

  setPitchSemitones(semitones: number): void {
    const clamped = Math.max(-12, Math.min(12, semitones));
    const ratio = Math.pow(2, clamped / 12);
    // Use Tone.PitchShift in wet path for independent pitch
    if (this.workletPitchNode) {
      // Temporarily disable experimental worklet until tuned
      // Fall through to Tone shifter
    }
    if (this.tonePitchShift) {
      try {
        if ('pitch' in this.tonePitchShift) {
          (this.tonePitchShift as any).pitch = clamped; // semitones
          // Adjust quality parameters for stability when shifting further
          if ('windowSize' in this.tonePitchShift) {
            (this.tonePitchShift as any).windowSize = Math.max(0.1, Math.min(0.24, 0.12 + Math.abs(clamped) * 0.006));
          }
          if ('delayTime' in this.tonePitchShift) {
            (this.tonePitchShift as any).delayTime = 0.035;
          }
          if (this.pitchPostLPF) {
            this.pitchPostLPF.frequency.value = Math.max(6000, 18000 - Math.abs(clamped) * 700);
          }
          if (this.pitchPostLPF2) {
            this.pitchPostLPF2.frequency.value = Math.max(9000, 19500 - Math.abs(clamped) * 500);
          }
          // Removed highshelf; LPF stages only for minimal coloring
        } else if ('pitch' in (this.tonePitchShift as any).parameters || (this.tonePitchShift as any).set) {
          // Handle alternate API shapes
          (this.tonePitchShift as any).set?.({ pitch: clamped });
        }
        this.pitchRatio = ratio;
        return;
      } catch {}
    }
    this.setPitch(ratio);
  }

  setEQ(band: 'low' | 'mid' | 'high', value: number): void {
    this.eqSettings[band] = value;
    const now = this.audioContext?.currentTime || 0;
    
    switch (band) {
      case 'low':
        this.eqNodes.low.gain.setValueAtTime(value, now);
        break;
      case 'mid':
        this.eqNodes.mid.gain.setValueAtTime(value, now);
        break;
      case 'high':
        this.eqNodes.high.gain.setValueAtTime(value, now);
        break;
    }
  }

  applyEffect(effect: AudioEffect): void {
    // TODO: Implement effect application
    console.log('Applying effect:', effect);
  }

  removeEffect(effectId: string): void {
    // TODO: Implement effect removal
    console.log('Removing effect:', effectId);
  }

  getCurrentTime(): number {
    if (this.mediaElement) {
      return this.mediaElement.currentTime || 0;
    }
    if (!this.audioBuffer) return 0;
    
    if (this.isPlayingFlag && this.audioBufferSource && this.audioContext) {
      return this.audioContext.currentTime - this.startTime;
    }
    return this.pauseTime;
  }

  getDuration(): number {
    if (this.mediaElement) {
      return this.mediaElement.duration || 0;
    }
    return this.audioBuffer?.duration || 0;
  }

  getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  // --- Lo-fi controls ---
  setLofiTone(cutoffHz: number): void {
    if (!this.audioContext) return;
    
    this.lofiLPF.frequency.setValueAtTime(Math.max(200, Math.min(20000, cutoffHz)), this.audioContext.currentTime);
  }

  setLofiNoiseLevel(level01: number): void {
    if (!this.audioContext) return;
    
    const level = Math.max(0, Math.min(1, level01));
    this.lofiNoiseGain.gain.setValueAtTime(level * 0.02, this.audioContext.currentTime);
    if (level > 0 && !this.lofiNoiseSource) {
      // Create looping noise buffer
      const duration = 2.0;
      const length = Math.floor(this.audioContext.sampleRate * duration);
      const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5; // white-ish noise
      }
      this.lofiNoiseSource = this.audioContext.createBufferSource();
      this.lofiNoiseSource.buffer = buffer;
      this.lofiNoiseSource.loop = true;
      this.lofiNoiseSource.connect(this.lofiNoiseGain);
      try { this.lofiNoiseSource.start(); } catch {}
    }
    if (level === 0 && this.lofiNoiseSource) {
      try { this.lofiNoiseSource.stop(); } catch {}
      try { this.lofiNoiseSource.disconnect(); } catch {}
      this.lofiNoiseSource = null;
    }
  }

  setLofiWowFlutter(depthMs: number, rateHz: number): void {
    if (!this.audioContext) return;
    
    const depthHz = Math.max(0, depthMs) / 1000;
    this.lofiWowDepth.gain.setValueAtTime(depthHz * 50, this.audioContext.currentTime);
    this.lofiWowLFO.frequency.setValueAtTime(Math.max(0.05, Math.min(5, rateHz)), this.audioContext.currentTime);
  }

  setLofiCrackle(_amountPerSec: number): void {
    // Placeholder: could schedule impulses into a convolver or gain pops
    // For now, no-op to avoid artifacts
  }

  // 7-band EQ controls
  setEQBand(band: number, gainDb: number): void {
    if (!this.audioContext) return;
    
    if (band >= 0 && band < 7 && this.eqBands[band]) {
      const clamped = Math.max(-12, Math.min(12, gainDb));
      this.eqBands[band].gain.setValueAtTime(clamped, this.audioContext.currentTime);
    }
  }

  setEQMix(mix: number): void {
    if (!this.audioContext) return;
    
    const clamped = Math.max(0, Math.min(1, mix));
    this.eqWet.gain.setValueAtTime(clamped, this.audioContext.currentTime);
    this.eqDry.gain.setValueAtTime(1 - clamped, this.audioContext.currentTime);
  }

  setEQBypass(bypass: boolean): void {
    this.setEffectBypass('eq', bypass);
  }

  // Reverb controls
  setReverbMix(mix: number): void {
    if (!this.audioContext) return;
    
    const clamped = Math.max(0, Math.min(1, mix));
    this.reverbWet.gain.setValueAtTime(clamped, this.audioContext.currentTime);
    this.reverbDry.gain.setValueAtTime(1 - clamped, this.audioContext.currentTime);
  }

  setReverbPreDelay(delayMs: number): void {
    if (!this.audioContext) return;
    
    const clamped = Math.max(0, Math.min(100, delayMs)) / 1000; // Convert to seconds
    this.reverbPreDelay.delayTime.setValueAtTime(clamped, this.audioContext.currentTime);
  }

  setReverbDamping(cutoffHz: number): void {
    if (!this.audioContext) return;
    
    const clamped = Math.max(100, Math.min(20000, cutoffHz));
    this.reverbDamping.frequency.setValueAtTime(clamped, this.audioContext.currentTime);
  }

  setReverbPreset(preset: 'small' | 'medium' | 'large'): void {
    (this as any).reverbPreset = preset;
    this.loadReverbImpulse(preset);
  }

  setReverbBypass(bypass: boolean): void {
    this.setEffectBypass('reverb', bypass);
  }

  private loadReverbImpulse(preset: 'small' | 'medium' | 'large'): void {
    // Generate simple impulse responses for different room sizes
    const sampleRate = this.audioContext.sampleRate;
    let length: number;
    let decay: number;
    
    switch (preset) {
      case 'small':
        length = Math.floor(sampleRate * 0.5); // 0.5s
        decay = 0.3;
        break;
      case 'medium':
        length = Math.floor(sampleRate * 1.0); // 1.0s
        decay = 0.5;
        break;
      case 'large':
        length = Math.floor(sampleRate * 2.0); // 2.0s
        decay = 0.7;
        break;
    }

    const impulseBuffer = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulseBuffer.getChannelData(channel);
      
      // Create a simple exponential decay impulse response
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const decayFactor = Math.exp(-t / decay);
        const noise = (Math.random() * 2 - 1) * 0.5;
        channelData[i] = noise * decayFactor;
      }
    }

    // Create and connect convolver
    if (this.reverbConvolver) {
      this.reverbConvolver.disconnect();
    }
    this.reverbConvolver = this.audioContext.createConvolver();
    this.reverbConvolver.buffer = impulseBuffer;
    this.reverbConvolver.normalize = true;

    // Wire: preDelay → convolver → damping → reverbWet
    this.reverbPreDelay.disconnect();
    this.reverbPreDelay.connect(this.reverbConvolver);
    this.reverbConvolver.connect(this.reverbDamping);
    this.reverbDamping.connect(this.reverbWet);
  }

  // Low-pass tone controls
  setLowPassTone(cutoffHz: number): void {
    if (!this.audioContext) return;
    
    const clamped = Math.max(20, Math.min(20000, cutoffHz));
    this.lowPassTone.frequency.setValueAtTime(clamped, this.audioContext.currentTime);
  }

  setLowPassResonance(resonance: number): void {
    if (!this.audioContext) return;
    
    const clamped = Math.max(0.1, Math.min(10, resonance));
    this.lowPassTone.Q.setValueAtTime(clamped, this.audioContext.currentTime);
  }

  setEffectBypass(id: EffectModuleId, bypass: boolean): void {
    this.effectBypass[id] = !!bypass;
    this.applyBypass(id, this.effectBypass[id]);
  }

  setEffectMix(id: EffectModuleId, mix: number): void {
    this.effectMix[id] = Math.max(0, Math.min(1, mix));
    this.applyMix(id, this.effectMix[id]);
  }

  destroy(): void {
    this.stop();
    this.audioBuffer = null;
    // this.currentTrack = null;
    if (this.mediaSourceNode) {
      try { this.mediaSourceNode.disconnect(); } catch {}
      this.mediaSourceNode = null;
    }
    if (this.mediaElement) {
      try { this.mediaElement.src = ''; this.mediaElement.load(); } catch {}
      this.mediaElement = null;
    }
    // TODO: Clean up all audio nodes
  }
}