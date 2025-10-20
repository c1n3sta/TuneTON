import { useEffect, useState } from 'react';
import type { Track } from './api/client';
import './App.css';
import HomeScreen from './components/HomeScreen';
import OnboardingArtists from './components/OnboardingArtistsEnhanced';
import OnboardingGenres from './components/OnboardingGenres';
import OnboardingWelcome from './components/OnboardingWelcome';
import OnboardingWelcomeSlide2 from './components/OnboardingWelcomeSlide2';
import OnboardingWelcomeSlide3 from './components/OnboardingWelcomeSlide3';
import OnboardingWelcomeSlide4 from './components/OnboardingWelcomeSlide4';
import { SwipeNavigationManager } from './components/SwipeNavigationManager';
import { SwipeNavigationProvider } from './components/SwipeNavigationProvider';
import TelegramAuthProvider, { useTelegramAuth } from './components/TelegramAuthProvider';
import { TelegramLoginButton } from './components/TelegramLoginButton';
import TrackPage from './pages/Track';

function App() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(1);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const { isAuthenticated, isLoading: loading, error } = useTelegramAuth();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('tunton_onboarding_completed');
    if (hasCompletedOnboarding === 'true') {
      setShowOnboarding(false);
    }
    setHasCheckedOnboarding(true);
  }, []);

  const handleBackToSearch = () => {
    setSelectedTrack(null);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('tunton_onboarding_completed', 'true');
  };

  // Show loading state while checking authentication
  if (loading || !hasCheckedOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an authentication error, show it
  if (error && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">Authentication Error</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated and not showing onboarding, show login
  if (!isAuthenticated && !showOnboarding) {
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
    <TelegramAuthProvider>
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
    </TelegramAuthProvider>
  );
}

export default App;