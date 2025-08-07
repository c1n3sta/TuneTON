import { AudioTrack, AudioEngine, AudioEffect } from '../../types/audio';

export class WebAudioEngine implements AudioEngine {
  private audioContext: AudioContext;
  private audioBufferSource: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private gainNode: GainNode;
  private analyser: AnalyserNode;
  private eqNodes: {
    low: BiquadFilterNode;
    mid: BiquadFilterNode;
    high: BiquadFilterNode;
  };
  private pitchShifter: any; // Will be implemented later
  private currentTrack: AudioTrack | null = null;
  private startTime = 0;
  private pauseTime = 0;
  private isPlayingFlag = false;
  private playbackRate = 1.0;
  private pitch = 1.0;
  private volume = 1.0;
  private eqSettings = {
    low: 0,
    mid: 0,
    high: 0
  };

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();
    
    // Setup EQ nodes
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

    // Connect nodes: source -> effects -> analyser -> gain -> destination
    this.eqNodes.low.connect(this.eqNodes.mid);
    this.eqNodes.mid.connect(this.eqNodes.high);
    this.eqNodes.high.connect(this.analyser);
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  async loadTrack(track: AudioTrack): Promise<void> {
    this.stop();
    this.currentTrack = track;
    
    let arrayBuffer: ArrayBuffer;
    
    if (track.source instanceof ArrayBuffer) {
      arrayBuffer = track.source;
    } else if (typeof track.source === 'string') {
      const response = await fetch(track.source);
      arrayBuffer = await response.arrayBuffer();
    } else {
      throw new Error('Invalid track source');
    }
    
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.pauseTime = 0;
  }

  async play(): Promise<void> {
    if (!this.audioBuffer) return;
    
    if (this.isPlayingFlag) {
      this.pause();
      return;
    }

    this.audioBufferSource = this.audioContext.createBufferSource();
    this.audioBufferSource.buffer = this.audioBuffer;
    // Apply both playback rate and pitch
    this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitch;
    
    // Connect source to effect chain
    this.audioBufferSource.connect(this.eqNodes.low);
    
    this.audioBufferSource.onended = () => {
      this.isPlayingFlag = false;
      this.pauseTime = 0;
      // TODO: Emit track end event
    };

    this.startTime = this.audioContext.currentTime - this.pauseTime;
    this.audioBufferSource.start(0, this.pauseTime);
    this.isPlayingFlag = true;
    
    // Resume audio context if it was suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  pause(): void {
    if (!this.audioBufferSource) return;
    
    this.pauseTime = this.getCurrentTime();
    this.audioBufferSource.stop();
    this.audioBufferSource.disconnect();
    this.audioBufferSource = null;
    this.isPlayingFlag = false;
  }

  stop(): void {
    if (this.audioBufferSource) {
      this.audioBufferSource.stop();
      this.audioBufferSource.disconnect();
      this.audioBufferSource = null;
    }
    this.pauseTime = 0;
    this.isPlayingFlag = false;
  }

  seek(time: number): void {
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
    this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = Math.max(0.5, Math.min(2, rate));
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitch;
    }
  }

  setPitch(pitch: number): void {
    this.pitch = Math.max(0.5, Math.min(2, pitch));
    
    // Update playback rate to include pitch adjustment
    if (this.audioBufferSource) {
      this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitch;
    }
    // TODO: Implement pitch shifting
  }

  setEQ(band: 'low' | 'mid' | 'high', value: number): void {
    this.eqSettings[band] = value;
    const now = this.audioContext.currentTime;
    
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
    if (!this.audioBuffer) return 0;
    
    if (this.isPlayingFlag && this.audioBufferSource) {
      return this.audioContext.currentTime - this.startTime;
    }
    return this.pauseTime;
  }

  getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  destroy(): void {
    this.stop();
    this.audioBuffer = null;
    this.currentTrack = null;
    // TODO: Clean up all audio nodes
  }
}
