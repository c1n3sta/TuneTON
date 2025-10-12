import { useState, useEffect } from 'react';
import type { Track } from './api/client';
import TrackPage from './pages/Track';
import OnboardingWelcome from './components/OnboardingWelcome';
import OnboardingWelcomeSlide2 from './components/OnboardingWelcomeSlide2';
import OnboardingWelcomeSlide3 from './components/OnboardingWelcomeSlide3';
import OnboardingWelcomeSlide4 from './components/OnboardingWelcomeSlide4';
import OnboardingGenres from './components/OnboardingGenres';
import OnboardingArtists from './components/OnboardingArtistsEnhanced';
import HomeScreen from './components/HomeScreen';
import { useTelegramAuth } from './hooks/useTelegramAuth';
import { TelegramLoginButton } from './components/TelegramLoginButton';
import { SwipeNavigationProvider } from './components/SwipeNavigationProvider';
import { SwipeNavigationManager } from './components/SwipeNavigationManager';
import './App.css';

// Type guard for Telegram WebApp
const isTelegramWebAppAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         (window as any).Telegram && 
         (window as any).Telegram.WebApp;
};

function App() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(1);
  const { isAuthenticated, loading } = useTelegramAuth();

  useEffect(() => {
    // Initialize Telegram WebApp if available
    if (isTelegramWebAppAvailable()) {
      try {
        (window as any).Telegram.WebApp.ready();
        (window as any).Telegram.WebApp.expand();
        setIsTelegramWebApp(true);
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      }
    }
    
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('tunton_onboarding_completed');
    if (hasCompletedOnboarding === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleBackToSearch = () => {
    setSelectedTrack(null);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('tunton_onboarding_completed', 'true');
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If in Telegram WebApp but not authenticated, show login
  if (isTelegramWebApp && !isAuthenticated && !showOnboarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-2xl font-bold">Welcome to TuneTON</h1>
          <p className="text-muted-foreground">
            Sign in with Telegram to access the full music experience
          </p>
          <TelegramLoginButton />
        </div>
      </div>
    );
  }

  // Ensure only one screen is rendered at a time
  return (
    <SwipeNavigationProvider>
      <div className="App min-h-screen">
        <SwipeNavigationManager 
          activeTab="home" 
          onNavigate={(tab) => {
            // In a more complex app, we would handle tab navigation here
            console.log('Swipe navigation to tab:', tab);
          }}
        />
        {showOnboarding ? (
          <div className="min-h-screen">
            {onboardStep === 1 && <OnboardingWelcome onNext={() => setOnboardStep(2)} />}
            {onboardStep === 2 && <OnboardingWelcomeSlide2 onNext={() => setOnboardStep(3)} />}
            {onboardStep === 3 && <OnboardingWelcomeSlide3 onNext={() => setOnboardStep(4)} />}
            {onboardStep === 4 && <OnboardingWelcomeSlide4 onNext={() => setOnboardStep(5)} onSkip={handleOnboardingComplete} />}
            {onboardStep === 5 && <OnboardingGenres onNext={(_) => { setOnboardStep(6); }} />}
            {onboardStep === 6 && <OnboardingArtists onNext={handleOnboardingComplete} onSkip={handleOnboardingComplete} />}
          </div>
        ) : selectedTrack ? (
          <div className="min-h-screen">
            <TrackPage 
              track={selectedTrack} 
              onBack={handleBackToSearch} 
            />
          </div>
        ) : (
          <div className="min-h-screen">
            <HomeScreen />
          </div>
        )}
        {/* Development toolbar removed for production build */}
      </div>
    </SwipeNavigationProvider>
  );
}

export default App;