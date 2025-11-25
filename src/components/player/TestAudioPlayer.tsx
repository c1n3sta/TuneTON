import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

// Check if audio URL is valid
function isValidAudioUrl(url: string): boolean {
  if (!url) return false;

  // For Jamendo URLs, validate against the expected format
  if (url.includes('jamendo.com')) {
    // Expected format: https://api.jamendo.com/v3.0/tracks/filestream/?track_id={id}&client_id={key}
    // Also allow other Jamendo API endpoints
    const jamendoPattern = /^https:\/\/api\.jamendo\.com\/v3\.0\/tracks\/(filestream|file)\?track_id=\d+(&client_id=[a-zA-Z0-9]+)?/;
    return jamendoPattern.test(url) || url.startsWith('http');
  }

  // For other URLs, check for common audio extensions or streaming endpoints
  return url.startsWith('http') && (
    url.includes('.mp3') ||
    url.includes('.wav') ||
    url.includes('.ogg') ||
    url.includes('.m4a') ||
    url.includes('.flac') ||
    url.includes('/stream') ||
    url.includes('/audio')
  );
}

const TestAudioPlayer: React.FC = () => {
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
    setPlaybackRate,
    setTempo,
    setPitchSemitones,
    setEffectBypass,
    setEffectMix,
    handleEQBandChange,
    handleEQMixChange,
    handleEQBypassChange,
    handleReverbMixChange,
    handleReverbPreDelayChange,
    handleReverbDampingChange,
    handleReverbPresetChange,
    handleReverbBypassChange,
    handleLofiToneChange,
    handleLofiNoiseChange,
    handleLofiWowChange,
    handleLowPassToneChange,
    handleLowPassResonanceChange,
    getAnalyser
  } = useAudioPlayer();

  // Test track data
  const testTrack = {
    id: 'test-track-1',
    title: 'Test Track',
    artist: 'Test Artist',
    duration: 180, // 3 minutes
    source: 'https://example.com/test-track.mp3',
    audioUrl: 'https://example.com/test-track.mp3',
    coverArt: 'https://example.com/cover.jpg'
  };

  const handleLoadTrack = () => {
    loadTrack(testTrack);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Audio Player Test</h2>

      <div className="mb-4">
        <button
          onClick={handleLoadTrack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Load Track
        </button>
        <button
          onClick={togglePlayPause}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <span className="mr-2">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="ml-2">{Math.round(volume * 100)}%</span>
          <button
            onClick={toggleMute}
            className="ml-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <span className="mr-2">Progress:</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-64"
          />
          <span className="ml-2">{Math.round(currentTime)}s / {Math.round(duration)}s</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Effects</h3>
          <div className="mb-2">
            <button
              onClick={() => setEffectBypass('eq', true)}
              className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded mr-1"
            >
              Bypass EQ
            </button>
            <button
              onClick={() => setEffectBypass('eq', false)}
              className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
            >
              Enable EQ
            </button>
          </div>
          <div className="mb-2">
            <button
              onClick={() => setEffectMix('eq', 0)}
              className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded mr-1"
            >
              EQ Dry
            </button>
            <button
              onClick={() => setEffectMix('eq', 1)}
              className="bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
            >
              EQ Wet
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">EQ Controls</h3>
          <div className="mb-2">
            <button
              onClick={() => handleEQBandChange(0, 6)}
              className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded mr-1"
            >
              Boost Low
            </button>
            <button
              onClick={() => handleEQBandChange(0, -6)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded"
            >
              Cut Low
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAudioPlayer;