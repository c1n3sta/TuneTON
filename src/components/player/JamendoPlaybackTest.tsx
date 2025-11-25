import React, { useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { convertJamendoToTrack } from './utils';

const JamendoPlaybackTest: React.FC = () => {
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
    toggleMute
  } = useAudioPlayer();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testTrack, setTestTrack] = useState<any>(null);

  // Test the specific problematic track from debug logs
  const mockJamendoTrack = {
    id: '1214935',
    name: 'Wish You Were Here',
    duration: 270,
    artist_id: '441585',
    artist_name: 'The.madpix.project',
    album_name: 'Wish You Were Here',
    album_id: '145774',
    audio: 'https://prod-1.storage.jamendo.com/?trackid=1214935&format=mp31&from=NZdL4%2BluU9c2cxgsCQ4iUQ%3D%3D%7CD0LmyHszHdv90eFD%2BWHoWQ%3D%3D',
    audiodownload: 'https://prod-1.storage.jamendo.com/download/track/1214935/mp32/',
    image: 'https://usercontent.jamendo.com?type=album&id=145774&width=300&trackid=1214935'
  };

  const handleLoadAndPlay = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert Jamendo track to AudioTrack format
      const audioTrack = convertJamendoToTrack(mockJamendoTrack);
      
      if (!audioTrack) {
        throw new Error('Failed to convert Jamendo track to AudioTrack');
      }
      
      console.log('Loading track:', audioTrack);
      
      // Load the track
      await loadTrack(audioTrack);
      
      // Start playing
      await togglePlayPause();
    } catch (err) {
      console.error('Error loading/playing track:', err);
      setError(err instanceof Error ? err.message : 'Failed to load or play track');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    togglePlayPause().catch(console.error);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Jamendo Playback Test</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Test Track: Wish You Were Here</h3>
        <p className="text-sm text-gray-300">Artist: The.madpix.project</p>
        <p className="text-sm text-gray-300">Duration: {Math.floor(270 / 60)}:{String(270 % 60).padStart(2, '0')}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleLoadAndPlay}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Loading...' : 'Load & Play'}
        </button>

        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Stop
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Playing:</span>
          <span className={isPlaying ? 'text-green-400' : 'text-gray-400'}>
            {isPlaying ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Time:</span>
          <span>
            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Volume:</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Muted:</span>
          <span className={isMuted ? 'text-yellow-400' : 'text-gray-400'}>
            {isMuted ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <h3 className="font-medium mb-2">Debug Information:</h3>
        <div className="text-xs space-y-1 text-gray-300">
          <p>Primary URL: {mockJamendoTrack.audio}</p>
          <p>Fallback URL: {mockJamendoTrack.audiodownload}</p>
        </div>
      </div>
    </div>
  );
};

export default JamendoPlaybackTest;