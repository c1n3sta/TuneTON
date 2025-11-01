import { useState, useEffect, useCallback } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { AudioTrack } from "../types/audio";
import { soundcloudAPI } from "../utils/soundcloud-api";
import type { SoundCloudTrack } from "../utils/soundcloud-api";

interface SoundCloudPlayerProps {
  track: SoundCloudTrack;
  onTrackEnd?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export default function SoundCloudPlayer({ track, onTrackEnd, onPlay, onPause }: SoundCloudPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    loadTrack,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate
  } = useAudioPlayer();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRateValue, setPlaybackRateValue] = useState(1);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  // Convert SoundCloud track to AudioTrack
  const convertToAudioTrack = useCallback((scTrack: SoundCloudTrack, url: string): AudioTrack => {
    return {
      id: `soundcloud_${scTrack.id}`,
      title: scTrack.title,
      artist: scTrack.user.username,
      duration: scTrack.duration / 1000, // Convert from ms to seconds
      source: url,
      coverArt: scTrack.artwork_url ? scTrack.artwork_url.replace('-large', '-t500x500') : undefined,
      audioUrl: scTrack.permalink_url,
      album: scTrack.genre || undefined,
      cover: scTrack.artwork_url ? scTrack.artwork_url.replace('-large', '-t500x500') : undefined
    };
  }, []);

  // Load track with SoundCloud stream URL
  const loadSoundCloudTrack = useCallback(async () => {
    if (!track) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get stream URL from SoundCloud API
      const url = await soundcloudAPI.getStreamUrl(track.id);
      setStreamUrl(url);
      
      // Convert to AudioTrack format
      const audioTrack = convertToAudioTrack(track, url);
      
      // Load track in audio player
      loadTrack(audioTrack);
    } catch (err) {
      console.error('Failed to load SoundCloud track:', err);
      setError('Failed to load track. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [track, loadTrack, convertToAudioTrack]);

  // Load track on component mount or when track changes
  useEffect(() => {
    if (track) {
      loadSoundCloudTrack();
    }
  }, [track, loadSoundCloudTrack]);

  // Handle play/pause events
  useEffect(() => {
    if (isPlaying) {
      onPlay?.();
    } else {
      onPause?.();
    }
  }, [isPlaying, onPlay, onPause]);

  // Handle track end
  useEffect(() => {
    if (duration > 0 && currentTime >= duration) {
      onTrackEnd?.();
    }
  }, [currentTime, duration, onTrackEnd]);

  const handleSeek = (time: number) => {
    seek(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRateValue(rate);
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading track...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
        <p className="text-destructive text-center">{error}</p>
        <button 
          onClick={loadSoundCloudTrack}
          className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 text-sm mx-auto block"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No track selected
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Track Info with SoundCloud Attribution */}
      <div className="flex items-start gap-4 mb-4">
        {track.artwork_url ? (
          <img 
            src={track.artwork_url.replace('-large', '-t200x200')} 
            alt={track.title}
            className="w-16 h-16 rounded-md object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
          <p className="text-sm text-muted-foreground truncate">by {track.user.username}</p>
          
          {/* SoundCloud Attribution */}
          <div className="mt-2 flex items-center gap-2">
            <a 
              href={track.permalink_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 0h-17C1.3 0 0 1.3 0 3.5v17C0 22.7 1.3 24 3.5 24h17c2.2 0 3.5-1.3 3.5-3.5v-17C24 1.3 22.7 0 20.5 0zM8.1 20.4c-3.9.1-7.1-3.1-7.1-7.1 0-3.9 3.1-7.1 7.1-7.1 3.9 0 7.1 3.1 7.1 7.1-.1 3.9-3.2 7.1-7.1 7.1zm3.6-11.4c-.1-.1-.3-.1-.4-.1-.2 0-.4.1-.5.2l-5.7 5.7c-.1.1-.2.3-.2.5 0 .3.2.5.5.5.2 0 .4-.1.5-.2l5.7-5.7c.1-.1.2-.3.2-.5 0-.2-.1-.4-.3-.4zm4.7 0c-.1-.1-.3-.1-.4-.1-.2 0-.4.1-.5.2l-5.7 5.7c-.1.1-.2.3-.2.5 0 .3.2.5.5.5.2 0 .4-.1.5-.2l5.7-5.7c.1-.1.2-.3.2-.5 0-.2-.1-.4-.3-.4zm4.7 0c-.1-.1-.3-.1-.4-.1-.2 0-.4.1-.5.2l-5.7 5.7c-.1.1-.2.3-.2.5 0 .3.2.5.5.5.2 0 .4-.1.5-.2l5.7-5.7c.1-.1.2-.3.2-.5 0-.2-.1-.4-.3-.4z"/>
              </svg>
              <span>Listen on SoundCloud</span>
            </a>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="space-y-4">
        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button 
            onClick={togglePlayPause}
            disabled={isLoading}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Volume and Playback Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMute}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : volume > 0.5 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3l4.5 4.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 10l2 2m0 0l-2 2m2-2H15" />
              </svg>
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : Math.round(volume * 100)}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value) / 100)}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Speed:</span>
            <select
              value={playbackRateValue}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
              className="text-xs bg-muted border border-border rounded px-2 py-1"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2 text-xs">
          {track.genre && (
            <span className="px-2 py-1 bg-muted rounded-full">
              {track.genre}
            </span>
          )}
          <span className="px-2 py-1 bg-muted rounded-full">
            {Math.floor(track.duration / 1000 / 60)}:{String(Math.floor(track.duration / 1000) % 60).padStart(2, '0')}
          </span>
          {track.streamable && (
            <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full">
              Streamable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}