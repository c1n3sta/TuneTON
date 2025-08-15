import React from 'react';
import './NowPlayingBar.css';

interface NowPlayingBarProps {
  track: {
    title: string;
    artist: string;
    cover: string;
    duration: string;
  } | null;
  isPlaying: boolean;
  progress?: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
  track,
  isPlaying,
  progress = 0,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  if (!track) return null;

  // Format time helper function
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate current time based on progress
  const totalDuration = 210; // 3:30 in seconds for demo
  const currentTime = (progress / 100) * totalDuration;

  return (
    <div className="now-playing-bar">
      <div className="now-playing-content">
        <div className="now-playing-info">
          <div 
            className="now-playing-cover" 
            style={{ backgroundImage: track ? `url(${track.cover})` : 'none' }}
          />
          <div className="now-playing-details">
            <div className="now-playing-title">{track ? track.title : 'Not Playing'}</div>
            <div className="now-playing-artist">{track ? track.artist : 'Select a track'}</div>
          </div>
        </div>
        
        <div className="now-playing-controls">
          <button 
            className="control-button"
            onClick={onPrevious}
            aria-label="Previous track"
          >
            ⏮
          </button>
          <button 
            className="play-pause-button"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            className="control-button"
            onClick={onNext}
            aria-label="Next track"
          >
            ⏭
          </button>
        </div>
        
        <div className="now-playing-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{track ? track.duration : '0:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBar;
