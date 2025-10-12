import { useState, useEffect, useRef } from 'react';
import { JamendoTrack } from '../utils/jamendo-api';

interface UseAudioPlayerProps {
  track: { audioUrl?: string };
  playerIsPlaying: boolean;
  volume: number;
  tempo: number;
  onNext: () => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onError: () => void;
  onCanPlay: () => void;
}

export const useAudioPlayer = ({
  track,
  playerIsPlaying,
  volume,
  tempo,
  onNext,
  onTimeUpdate,
  onDurationChange,
  onError,
  onCanPlay
}: UseAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio element event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;

    const handleLoadedMetadata = () => {
      onDurationChange(audio.duration);
      console.log('Audio loaded, duration:', audio.duration);
    };

    const handleTimeUpdate = () => {
      onTimeUpdate(audio.currentTime);
    };

    const handleEnded = () => {
      onNext();
    };

    const handleError = () => {
      console.error('Audio playback error');
      onError();
    };

    const handleCanPlay = () => {
      onCanPlay();
      console.log('Audio can play');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [track.audioUrl, onNext, onTimeUpdate, onDurationChange, onError, onCanPlay]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;

    if (playerIsPlaying) {
      audio.play().catch(error => {
        console.error('Play failed:', error);
        onError();
      });
    } else {
      audio.pause();
    }
  }, [playerIsPlaying, track.audioUrl, onError]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  // Handle tempo changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = tempo / 100;
    }
  }, [tempo]);

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
    }
  };

  return { audioRef, seekTo };
};