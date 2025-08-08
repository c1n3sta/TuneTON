import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/player/AudioPlayer';
import { AudioTrack } from './types/audio';
import './App.css';

// Declare the Telegram WebApp type
declare global {
  interface Window {
    Telegram: TelegramWebApps.SDK;
  }
}

// Sample track using the local audio file
const SAMPLE_TRACK: AudioTrack = {
  id: 'local-track',
  title: 'TuneTON Track',
  artist: 'Your Artist',
  duration: 180, // Update this with the actual duration of your track
  source: '/audio/audio.mp3',
  coverArt: 'https://via.placeholder.com/300x300/3e88f7/ffffff?text=TuneTON'
};

const App: React.FC = () => {
  const [isWebAppReady, setIsWebAppReady] = useState(false);
  const [userData, setUserData] = useState<{
    id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  }>({});

  // Initialize Telegram WebApp
  useEffect(() => {
    try {
      // Check if we're running in a Telegram WebView
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        
        // Expand the Web App to the full available height
        webApp.expand();
        
        // Get user data
        const initData = webApp.initDataUnsafe;
        if (initData.user) {
          setUserData({
            id: initData.user.id,
            username: initData.user.username,
            first_name: initData.user.first_name,
            last_name: initData.user.last_name
          });
        }
        
        // Set the app theme
        document.documentElement.setAttribute('data-theme', webApp.colorScheme || 'dark');
        
        // Listen for theme changes
        webApp.onEvent('themeChanged', () => {
          document.documentElement.setAttribute('data-theme', webApp.colorScheme || 'dark');
        });
        
        // Mark as ready
        webApp.ready();
        setIsWebAppReady(true);
      } else {
        console.warn('Telegram WebApp not detected, running in standalone mode');
        setIsWebAppReady(true);
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
      setIsWebAppReady(true); // Continue in standalone mode
    }
  }, []);

  const handleTrackEnd = () => {
    console.log('Track ended');
    // Add any logic for when the track ends
  };

  if (!isWebAppReady) {
    return <div className="loading">Loading TuneTON...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TuneTON</h1>
        {userData.id && (
          <div className="user-info">
            <span>Welcome, {userData.first_name || userData.username || 'User'}</span>
          </div>
        )}
      </header>
      
      <main className="app-content">
        <AudioPlayer 
          track={SAMPLE_TRACK} 
          onTrackEnd={handleTrackEnd} 
        />
      </main>
      
      <footer className="app-footer">
        <p>TuneTON - Music Player Demo</p>
      </footer>
    </div>
  );
};

export default App;
