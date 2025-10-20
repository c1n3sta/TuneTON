import { Pause, Play } from 'lucide-react';
import React from 'react';
import styles from './EnhancedAudioPlayer.module.css';

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  playbackRate,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onPlaybackRateChange
}) => {
  return (
    <div className={styles.controls}>
      <button 
        className={`${styles.controlButton} ${isMuted ? styles.active : ''}`}
        onClick={onToggleMute}
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
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className={styles.volumeSlider}
        />
      </div>

      <button 
        className={styles.playButton}
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      <div className={styles.playbackRate}>
        <select 
          value={playbackRate.toFixed(1)} 
          onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
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
  );
};

export default PlayerControls;