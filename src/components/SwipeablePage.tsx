import React, { useEffect, useState } from 'react';
import { useSwipeNavigation } from './useSwipeNavigation';
import { SwipeIndicator } from './SwipeIndicator';

interface SwipeablePageProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  showSwipeIndicator?: boolean;
  tabOrder?: string[];
  enableVerticalSwipe?: boolean;
  customSwipeHandlers?: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  };
}

export const SwipeablePage: React.FC<SwipeablePageProps> = ({
  children,
  activeTab,
  onNavigate,
  showSwipeIndicator = false,
  tabOrder = ['Home', 'Ranking', 'Contests', 'AI Studio', 'NFT', 'Profile'],
  enableVerticalSwipe = false,
  customSwipeHandlers
}) => {
  const [showIndicator, setShowIndicator] = useState(showSwipeIndicator);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentIndex = tabOrder.indexOf(activeTab);
  
  const getNextTab = () => {
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    return tabOrder[nextIndex];
  };

  const getPrevTab = () => {
    const prevIndex = currentIndex === 0 ? tabOrder.length - 1 : currentIndex - 1;
    return tabOrder[prevIndex];
  };

  const handleSwipeLeft = () => {
    if (customSwipeHandlers?.onSwipeLeft) {
      customSwipeHandlers.onSwipeLeft();
    } else {
      const nextTab = getNextTab();
      onNavigate(nextTab);
    }
    setHasInteracted(true);
    setShowIndicator(false);
  };

  const handleSwipeRight = () => {
    if (customSwipeHandlers?.onSwipeRight) {
      customSwipeHandlers.onSwipeRight();
    } else {
      const prevTab = getPrevTab();
      onNavigate(prevTab);
    }
    setHasInteracted(true);
    setShowIndicator(false);
  };

  const handleSwipeUp = () => {
    if (customSwipeHandlers?.onSwipeUp) {
      customSwipeHandlers.onSwipeUp();
    }
    setHasInteracted(true);
  };

  const handleSwipeDown = () => {
    if (customSwipeHandlers?.onSwipeDown) {
      customSwipeHandlers.onSwipeDown();
    }
    setHasInteracted(true);
  };

  useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: enableVerticalSwipe ? handleSwipeUp : undefined,
    onSwipeDown: enableVerticalSwipe ? handleSwipeDown : undefined,
    threshold: 80,
    preventScroll: true
  });

  // Show indicator for first-time users
  useEffect(() => {
    const hasSeenSwipeHint = localStorage.getItem('hasSeenSwipeHint');
    if (!hasSeenSwipeHint && !hasInteracted) {
      setShowIndicator(true);
      localStorage.setItem('hasSeenSwipeHint', 'true');
    }
  }, [hasInteracted]);

  return (
    <>
      {children}
      
      {showIndicator && (
        <SwipeIndicator
          show={showIndicator}
          direction="both"
          position="bottom"
          onDismiss={() => setShowIndicator(false)}
          autoHide={4000}
        />
      )}
    </>
  );
};