import React, { useState, useEffect } from 'react';
import { Track } from './api/client';
import Search from './pages/Search';
import TrackPage from './pages/Track';
import './App.css';

function App() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    // Initialize Telegram WebApp if available
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      setIsTelegramWebApp(true);
    }
  }, []);

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
  };

  const handleBackToSearch = () => {
    setSelectedTrack(null);
  };

  return (
    <div className="App">
      {selectedTrack ? (
        <TrackPage 
          track={selectedTrack} 
          onBack={handleBackToSearch} 
        />
      ) : (
        <Search onTrackSelect={handleTrackSelect} />
      )}
    </div>
  );
}

export default App;
