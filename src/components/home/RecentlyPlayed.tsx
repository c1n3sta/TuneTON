import React from 'react';
// Define Track interface locally
interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isPlaying?: boolean;
}
import './RecentlyPlayed.css';

// Audio visualization component
const AudioVisualization = () => {
  return (
    <div className="audio-visualization">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i}
          className="visualization-bar"
          style={{
            height: `${Math.random() * 12 + 4}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

type RecentlyPlayedProps = {
  tracks: Track[];
  isPlaying: boolean;
  onPlayPause: () => void;
};

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ tracks, isPlaying, onPlayPause }) => {
  if (!tracks?.length) return null;
  
  const [featuredTrack, ...recentTracks] = tracks;

  return (
    <section className="recently-played">
      <div className="section-header">
        <h2>Recently Played</h2>
        <button className="see-all">See All</button>
      </div>
      
      {/* Featured Track Card */}
      <div className="featured-track">
        <div className="track-content">
          <div className="track-cover">
            <img 
              src={featuredTrack.cover} 
              alt={featuredTrack.title}
              loading="lazy"
            />
          </div>
          <div className="track-details">
            <h3>{featuredTrack.title}</h3>
            <p>{featuredTrack.artist}</p>
          </div>
          <div className="track-controls">
            <AudioVisualization />
            <button 
              className={`play-button ${isPlaying ? 'playing' : ''}`}
              onClick={onPlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Recently Played Tracks List */}
      <div className="track-list">
        {recentTracks.map((track) => (
          <div key={track.id} className="track-item">
            <div className="track-cover">
              <img 
                src={track.cover} 
                alt={track.title}
                loading="lazy"
              />
            </div>
            <div className="track-details">
              <h3>{track.title}</h3>
              <p>{track.artist}</p>
            </div>
            <span className="track-duration">{track.duration}</span>
          </div>
        ))}
      </div>
      
      {/* Animation styles */}
      <style>
        {`
          @keyframes visualize {
            0%, 100% {
              height: 4px;
            }
            50% {
              height: 16px;
            }
          }
        `}
      </style>
    </section>
  );
};

export default RecentlyPlayed;
