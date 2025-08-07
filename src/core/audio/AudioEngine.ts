import { AudioTrack, AudioEngine, AudioEffect } from '../../types/audio';
import { metadataExtractor } from '../metadata/MetadataService';

type AudioEvent = 'play' | 'pause' | 'stop' | 'end' | 'error' | 'timeupdate' | 'loadedmetadata' | 'seeked';
type EventCallback = (data?: any) => void;

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
  private playbackRate = 1.0;  // Controls tempo (time-stretching)
  private pitch = 1.0;         // Controls pitch (pitch-shifting)
  private volume = 1.0;
  private eqSettings = {
    low: 0,
    mid: 0,
    high: 0
  };
  private pitchShifterNode: any = null; // Will hold the pitch shifter instance
  private eventListeners: Map<AudioEvent, Set<EventCallback>> = new Map();

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

  async loadTrack(track: AudioTrack & { album?: string }): Promise<void> {
    this.stop();
    
    let arrayBuffer: ArrayBuffer;
    let file: File | null = null;
    
    // Handle different track source types
    if (track.source instanceof ArrayBuffer) {
      arrayBuffer = track.source;
    } else if (typeof track.source === 'string') {
      const response = await fetch(track.source);
      arrayBuffer = await response.arrayBuffer();
      file = new File([arrayBuffer], track.title || 'track.mp3', { type: 'audio/mp3' });
    } else if (track.source && 'arrayBuffer' in track.source) {
      file = track.source as File;
      arrayBuffer = await this.loadTrackFromFile(file);
    } else {
      throw new Error('Invalid track source');
    }
    
    // Create a copy of the track to avoid mutating the original
    const trackCopy = { 
      ...track,
      album: track.album || 'Unknown Album'
    };
    
    // Extract metadata if we have a file
    if (file) {
      try {
        const metadata = await metadataExtractor.extract(file);
        Object.assign(trackCopy, {
          title: metadata.title || trackCopy.title,
          artist: metadata.artist || trackCopy.artist,
          album: metadata.album || trackCopy.album,
          coverArt: metadata.coverArt || trackCopy.coverArt,
          duration: metadata.duration || trackCopy.duration
        });
      } catch (error) {
        console.warn('Error extracting metadata:', error);
        // Fallback to basic file info if metadata extraction fails
        if (!trackCopy.title && file) {
          trackCopy.title = file.name.replace(/\.[^/.]+$/, '');
        }
      }
    }
    
    this.currentTrack = trackCopy;
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
    this.pauseTime = 0;
  }

  private async loadTrackFromFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        resolve(arrayBuffer);
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  private createAudioSource(buffer: AudioBuffer): boolean {
    try {
      // Stop any existing source
      if (this.audioBufferSource) {
        try {
          this.audioBufferSource.stop();
          this.audioBufferSource.disconnect();
        } catch (e) {
          console.warn('Error stopping previous audio source:', e);
        }
      }

      // Create new source
      this.audioBufferSource = this.audioContext.createBufferSource();
      if (!this.audioBufferSource) {
        throw new Error('Failed to create audio buffer source');
      }

      this.audioBufferSource.buffer = buffer;
      
      // Create a pitch shifter if needed
      if (this.pitch !== 1.0) {
        // In a real implementation, you would use a pitch-shifting library here
        this.pitchShifterNode = this.audioContext.createGain();
        if (!this.pitchShifterNode) {
          throw new Error('Failed to create pitch shifter node');
        }
        this.pitchShifterNode.gain.value = 1.0;
        
        // Connect the audio graph with pitch shifter
        this.audioBufferSource
          .connect(this.pitchShifterNode)
          .connect(this.eqNodes.low)
          .connect(this.eqNodes.mid)
          .connect(this.eqNodes.high)
          .connect(this.gainNode)
          .connect(this.analyser)
          .connect(this.audioContext.destination);
      } else {
        // Connect the audio graph without pitch shifter
        this.audioBufferSource
          .connect(this.eqNodes.low)
          .connect(this.eqNodes.mid)
          .connect(this.eqNodes.high)
          .connect(this.gainNode)
          .connect(this.analyser)
          .connect(this.audioContext.destination);
      }

      // Set initial values
      this.audioBufferSource.playbackRate.value = this.playbackRate;
      return true;
    } catch (error) {
      console.error('Error creating audio source:', error);
      this.emit('error', { type: 'source-creation', error });
      return false;
    }
  }

  async play(): Promise<void> {
    if (!this.audioBuffer) {
      const error = new Error('No audio buffer available');
      this.emit('error', { type: 'no-audio-buffer', error });
      throw error;
    }
    
    if (this.isPlayingFlag) {
      this.pause();
      return;
    }

    const sourceCreated = this.createAudioSource(this.audioBuffer);
    if (!sourceCreated || !this.audioBufferSource) {
      const error = new Error('Failed to create audio source');
      this.emit('error', { type: 'source-creation-failed', error });
      throw error;
    }

    try {
      this.audioBufferSource.onended = () => {
        this.isPlayingFlag = false;
        this.pauseTime = 0;
        this.emit('end');
      };

      this.startTime = this.audioContext.currentTime - this.pauseTime;
      this.audioBufferSource.start(0, this.pauseTime);
      this.isPlayingFlag = true;
      
      // Resume audio context if it was suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.emit('play');
      this.emit('timeupdate', { currentTime: this.pauseTime, duration: this.audioBuffer.duration });
    } catch (error) {
      console.error('Error during playback:', error);
      this.isPlayingFlag = false;
      this.emit('error', { type: 'playback-error', error });
      throw error;
    }
  }

  pause(): void {
    if (!this.audioBufferSource) return;
    
    try {
      this.pauseTime = this.getCurrentTime();
      this.audioBufferSource.stop();
      this.audioBufferSource.disconnect();
      this.audioBufferSource = null;
      this.isPlayingFlag = false;
      this.emit('pause');
      this.emit('timeupdate', { currentTime: this.pauseTime, duration: this.audioBuffer?.duration || 0 });
    } catch (error) {
      console.error('Error pausing playback:', error);
      this.emit('error', { type: 'pause-error', error });
    }
  }

  stop(): void {
    if (this.audioBufferSource) {
      try {
        this.audioBufferSource.stop();
        this.audioBufferSource.disconnect();
        this.emit('stop');
      } catch (error) {
        console.error('Error stopping playback:', error);
        this.emit('error', { type: 'stop-error', error });
      } finally {
        this.audioBufferSource = null;
      }
    }
    this.pauseTime = 0;
    this.isPlayingFlag = false;
    this.emit('timeupdate', { currentTime: 0, duration: this.audioBuffer?.duration || 0 });
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
    this.playbackRate = rate;
    if (this.audioBufferSource) {
      // Only update the playback rate, which affects tempo without changing pitch
      this.audioBufferSource.playbackRate.value = rate;
      
      // If we have a pitch shifter, update its playback rate while maintaining pitch
      if (this.pitchShifterNode) {
        // The pitch shifter will handle maintaining the pitch while changing tempo
        this.pitchShifterNode.playbackRate = rate;
      }
    }
  }

  setPitch(pitch: number): void {
    this.pitch = pitch;
    
    // If we have a pitch shifter, update its pitch setting
    if (this.pitchShifterNode) {
      this.pitchShifterNode.pitch = pitch;
    }
    
    // If we're playing, we need to recreate the audio source with new pitch settings
    if (this.isPlayingFlag && this.audioBuffer) {
      const wasPlaying = this.isPlayingFlag;
      const currentTime = this.getCurrentTime();
      this.stop();
      
      // Recreate the audio source with the new pitch setting
      this.createAudioSource(this.audioBuffer);
      this.seek(currentTime);
      
      if (wasPlaying) {
        this.play();
      }
    }
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

  // Event handling
  on(event: AudioEvent, callback: EventCallback): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    const listeners = this.eventListeners.get(event)!;
    listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
    };
  }

  private emit(event: AudioEvent, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event handler:`, error);
        }
      });
    }
  }

  destroy(): void {
    // Stop any active playback
    this.stop();
    
    // Disconnect all nodes
    if (this.audioBufferSource) {
      this.audioBufferSource.disconnect();
      this.audioBufferSource = null;
    }
    
    this.gainNode.disconnect();
    this.analyser.disconnect();
    
    // Close the audio context
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
    }
    
    // Clear event listeners
    this.eventListeners.clear();
  }
  
  /**
   * Get the current track with its metadata
   */
  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack ? { ...this.currentTrack } : null;
  }
}
