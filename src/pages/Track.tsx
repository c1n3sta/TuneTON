import React from 'react';
import { Track } from '../api/client';
import { AudioTrack } from '../types/audio';
import AudioPlayer from '../components/player/AudioPlayer';
import styles from './Track.module.css';

interface TrackPageProps {
  track: Track;
  onBack: () => void;
}

const TrackPage: React.FC<TrackPageProps> = ({ track, onBack }) => {
  // Convert API Track to AudioTrack format
  const audioTrack: AudioTrack = {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    source: track.audioUrl, // Use the URL from the backend
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back to Search
        </button>
        
        <div className={styles.trackInfo}>
          <h1 className={styles.trackTitle}>{track.title}</h1>
          <p className={styles.trackArtist}>{track.artist}</p>
          <div className={styles.trackMeta}>
            <span className={styles.duration}>{formatDuration(track.duration)}</span>
            <span className={styles.playCount}>{track.playCount} plays</span>
          </div>
        </div>
      </div>

      <div className={styles.playerContainer}>
        <AudioPlayer track={audioTrack} />
      </div>

      <div className={styles.description}>
        <h2>Remix Controls</h2>
        <p>
          Use the controls below to remix your track:
        </p>
        <ul>
          <li><strong>Tempo/Pitch:</strong> Adjust speed and pitch independently</li>
          <li><strong>EQ:</strong> Fine-tune the frequency response</li>
          <li><strong>Lo-fi:</strong> Add vinyl/cassette character</li>
          <li><strong>Reverb:</strong> Add room ambience</li>
          <li><strong>Low-Pass:</strong> Control high-frequency content</li>
          <li><strong>Spectrum:</strong> Visualize the audio in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackPage;
