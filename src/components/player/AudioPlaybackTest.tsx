import React, { useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

const AudioPlaybackTest: React.FC = () => {
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

  const [testTrackUrl, setTestTrackUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadAndPlay = async () => {
    if (!testTrackUrl) {
      setError('Please enter a valid audio URL');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a test track object
      const testTrack = {
        id: 'test-track-1',
        title: 'Test Track',
        artist: 'Test Artist',
        duration: 180, // 3 minutes
        source: testTrackUrl,
        audioUrl: testTrackUrl,
        coverArt: ''
      };

      // Load the track
      await loadTrack(testTrack);

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
      <h2 className="text-2xl font-bold mb-4 text-center">Audio Playback Test</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Audio URL:
        </label>
        <input
          type="text"
          value={testTrackUrl}
          onChange={(e) => setTestTrackUrl(e.target.value)}
          placeholder="Enter audio URL (mp3, wav, etc.)"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleLoadAndPlay}
          disabled={loading || !testTrackUrl}
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
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
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
        <h3 className="font-medium mb-2">Test URLs:</h3>
        <ul className="text-xs space-y-1 text-gray-300">
          <li>• https://example.com/test.mp3</li>
          <li>• https://api.jamendo.com/v3.0/tracks/filestream/?track_id=123&client_id=your_key</li>
          <li>• https://samplelib.com/samples/mp3/sample-3s.mp3</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioPlaybackTest;