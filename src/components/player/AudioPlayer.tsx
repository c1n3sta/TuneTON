import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { AudioTrack } from '../../types/audio';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  track: AudioTrack;
  onTrackEnd?: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, onTrackEnd }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    pitch,
    eqSettings,
    loadTrack,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setPitch,
    setEQ
  } = useAudioPlayer();
  
  const [showEQ, setShowEQ] = useState(false);
  const [showPitch, setShowPitch] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Load the track when it changes
  useEffect(() => {
    loadTrack(track);
  }, [track, loadTrack]);

  // Handle track end
  useEffect(() => {
    if (currentTime >= duration && duration > 0 && isPlaying) {
      onTrackEnd?.();
    }
  }, [currentTime, duration, isPlaying, onTrackEnd]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, duration * clickPosition));
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setPitch(value);
    }
  };

  const handleEQChange = (band: 'low' | 'mid' | 'high') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEQ(band, parseFloat(e.target.value));
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.trackInfo}>
        <h3 className={styles.trackTitle}>{track.title}</h3>
        <p className={styles.artistName}>{track.artist}</p>
      </div>

      <div className={styles.progressContainer} onClick={handleProgressBarClick} ref={progressBarRef}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className={styles.timeDisplay}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className={styles.controls}>
        <button 
          className={`${styles.controlButton} ${isMuted ? styles.active : ''}`}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
        </button>
        
        <div className={styles.volumeControl}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
          />
        </div>

        <button 
          className={styles.playButton}
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <div className={styles.playbackRate}>
          <select 
            value={playbackRate.toFixed(1)} 
            onChange={handlePlaybackRateChange}
            className={styles.rateSelect}
          >
            {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map(rate => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.effectsControls}>
        <button 
          className={`${styles.effectButton} ${showPitch ? styles.active : ''}`}
          onClick={() => setShowPitch(!showPitch)}
        >
          Pitch/Tempo
        </button>
        
        <button 
          className={`${styles.effectButton} ${showEQ ? styles.active : ''}`}
          onClick={() => setShowEQ(!showEQ)}
        >
          EQ
        </button>
      </div>

      {showPitch && (
        <div className={styles.pitchControl}>
          <label>Pitch: {pitch.toFixed(2)}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            value={pitch}
            onChange={handlePitchChange}
            className={styles.pitchSlider}
          />
        </div>
      )}

      {showEQ && (
        <div className={styles.eqControls}>
          <div className={styles.eqBand}>
            <label>Low</label>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eqSettings.low}
              onChange={handleEQChange('low')}
              className={styles.eqSlider}
            />
            <span>{eqSettings.low > 0 ? `+${eqSettings.low}` : eqSettings.low}dB</span>
          </div>
          
          <div className={styles.eqBand}>
            <label>Mid</label>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eqSettings.mid}
              onChange={handleEQChange('mid')}
              className={styles.eqSlider}
            />
            <span>{eqSettings.mid > 0 ? `+${eqSettings.mid}` : eqSettings.mid}dB</span>
          </div>
          
          <div className={styles.eqBand}>
            <label>High</label>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eqSettings.high}
              onChange={handleEQChange('high')}
              className={styles.eqSlider}
            />
            <span>{eqSettings.high > 0 ? `+${eqSettings.high}` : eqSettings.high}dB</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
