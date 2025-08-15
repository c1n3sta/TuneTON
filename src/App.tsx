import React, { useState, useEffect } from 'react';
import { Track } from './api/client';
import Search from './pages/Search';
import TrackPage from './pages/Track';
import OnboardingWelcome from './components/OnboardingWelcome';
import OnboardingWelcomeSlide2 from './components/OnboardingWelcomeSlide2';
import OnboardingWelcomeSlide3 from './components/OnboardingWelcomeSlide3';
import OnboardingWelcomeSlide4 from './components/OnboardingWelcomeSlide4';
import OnboardingGenres from './components/OnboardingGenres';
import OnboardingArtists from './components/OnboardingArtistsEnhanced';
import HomeScreen from './components/HomeScreen';
// 21st.dev Toolbar integration
import { use21stDevToolbar } from './hooks/use21stDevToolbar';
import './App.css';

function App() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const { TwentyFirstDevToolbar } = use21stDevToolbar();

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
      {showOnboarding ? (
        onboardStep === 1 ? (
          <OnboardingWelcome onNext={() => setOnboardStep(2)} />
        ) : onboardStep === 2 ? (
          <OnboardingWelcomeSlide2 onNext={() => setOnboardStep(3)} />
        ) : onboardStep === 3 ? (
          <OnboardingWelcomeSlide3 onNext={() => setOnboardStep(4)} />
        ) : onboardStep === 4 ? (
          <OnboardingWelcomeSlide4 onNext={() => setOnboardStep(5)} onSkip={() => setShowOnboarding(false)} />
        ) : onboardStep === 5 ? (
          <OnboardingGenres onNext={(sel) => { setSelectedGenres(sel); setOnboardStep(6); }} />
        ) : onboardStep === 6 ? (
          <OnboardingArtists 
            onNext={() => setOnboardStep(7)} 
            onSkip={() => setOnboardStep(7)} 
          />
        ) : onboardStep === 7 ? (
          <HomeScreen />
        ) : null
      ) : selectedTrack ? (
        <TrackPage 
          track={selectedTrack} 
          onBack={handleBackToSearch} 
        />
      ) : (
        <Search onTrackSelect={handleTrackSelect} />
      )}
      {import.meta.env.DEV && <TwentyFirstDevToolbar />}
    </div>
  );
}

export default App;
