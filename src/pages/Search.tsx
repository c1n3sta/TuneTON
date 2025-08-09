import React, { useState, useEffect } from 'react';
import { Track, apiClient } from '../api/client';
import styles from './Search.module.css';

interface SearchProps {
  onTrackSelect: (track: Track) => void;
}

const Search: React.FC<SearchProps> = ({ onTrackSelect }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTracks();
  }, []);

  useEffect(() => {
    // Client-side filtering
    const filtered = tracks.filter(track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTracks(filtered);
  }, [tracks, searchTerm]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const tracksData = await apiClient.getTracks();
      setTracks(tracksData);
      setFilteredTracks(tracksData);
    } catch (err) {
      setError('Failed to load tracks');
      console.error('Error loading tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading tracks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={loadTracks} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>TuneTON</h1>
        <p>Discover and remix your favorite tracks</p>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tracksContainer}>
        {filteredTracks.length === 0 ? (
          <div className={styles.noResults}>
            {searchTerm ? 'No tracks found matching your search.' : 'No tracks available.'}
          </div>
        ) : (
          filteredTracks.map(track => (
            <div
              key={track.id}
              className={styles.trackCard}
              onClick={() => onTrackSelect(track)}
            >
              <div className={styles.trackInfo}>
                <h3 className={styles.trackTitle}>{track.title}</h3>
                <p className={styles.trackArtist}>{track.artist}</p>
                <div className={styles.trackMeta}>
                  <span className={styles.duration}>{formatDuration(track.duration)}</span>
                  <span className={styles.playCount}>{track.playCount} plays</span>
                </div>
              </div>
              <div className={styles.playButton}>▶️</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
