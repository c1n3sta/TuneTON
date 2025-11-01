import { useCallback, useEffect, useRef, useState } from 'react';

interface SwipeGestureConfig {
  threshold?: number;
  velocity?: number;
  maxTime?: number;
  preventScroll?: boolean;
  enabled?: boolean;
}

interface SwipeGestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeStart?: (direction: 'left' | 'right' | 'none') => void;
  onSwipeMove?: (deltaX: number, deltaY: number) => void;
  onSwipeEnd?: () => void;
}

interface TouchData {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  isActive: boolean;
  direction: 'left' | 'right' | 'none';
}

export const useMobileSwipeGestures = (
  callbacks: SwipeGestureCallbacks,
  config: SwipeGestureConfig = {}
) => {
  const {
    threshold = 80,
    velocity = 0.3,
    maxTime = 500,
    preventScroll = true,
    enabled = true
  } = config;

  const touchDataRef = useRef<TouchData>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    isActive: false,
    direction: 'none'
  });

  const [swipeProgress, setSwipeProgress] = useState<{
    deltaX: number;
    deltaY: number;
    direction: 'left' | 'right' | 'none';
    isActive: boolean;
  }>({
    deltaX: 0,
    deltaY: 0,
    direction: 'none',
    isActive: false
  });

  const getSwipeDirection = (deltaX: number, deltaY: number): 'left' | 'right' | 'none' => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Only consider horizontal swipes if they're more dominant than vertical
    if (absX > absY && absX > threshold / 2) {
      return deltaX > 0 ? 'right' : 'left';
    }
    
    return 'none';
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const touchData = touchDataRef.current;
    
    touchData.startX = touch.clientX;
    touchData.startY = touch.clientY;
    touchData.currentX = touch.clientX;
    touchData.currentY = touch.clientY;
    touchData.startTime = Date.now();
    touchData.isActive = true;
    touchData.direction = 'none';

    setSwipeProgress({
      deltaX: 0,
      deltaY: 0,
      direction: 'none',
      isActive: true
    });

    callbacks.onSwipeStart?.('none');
  }, [enabled, callbacks]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const touchData = touchDataRef.current;

    if (!touchData.isActive) return;

    touchData.currentX = touch.clientX;
    touchData.currentY = touch.clientY;

    const deltaX = touchData.currentX - touchData.startX;
    const deltaY = touchData.currentY - touchData.startY;
    const direction = getSwipeDirection(deltaX, deltaY);

    touchData.direction = direction;

    setSwipeProgress({
      deltaX,
      deltaY,
      direction,
      isActive: true
    });

    callbacks.onSwipeMove?.(deltaX, deltaY);

    // Prevent scroll only for horizontal swipes
    if (preventScroll && direction !== 'none') {
      e.preventDefault();
    }
  }, [enabled, callbacks, preventScroll, threshold]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    const touchData = touchDataRef.current;
    
    if (!touchData.isActive) return;

    const deltaX = touchData.currentX - touchData.startX;
    const deltaY = touchData.currentY - touchData.startY;
    const deltaTime = Date.now() - touchData.startTime;
    const swipeVelocity = Math.abs(deltaX) / deltaTime;

    const direction = getSwipeDirection(deltaX, deltaY);
    const isValidSwipe = direction !== 'none' && 
                        (Math.abs(deltaX) > threshold || swipeVelocity > velocity) &&
                        deltaTime < maxTime;

    if (isValidSwipe) {
      if (direction === 'left') {
        callbacks.onSwipeLeft?.();
      } else if (direction === 'right') {
        callbacks.onSwipeRight?.();
      }
    }

    // Reset state
    touchData.isActive = false;
    touchData.direction = 'none';
    
    setSwipeProgress({
      deltaX: 0,
      deltaY: 0,
      direction: 'none',
      isActive: false
    });

    callbacks.onSwipeEnd?.();
  }, [enabled, callbacks, threshold, velocity, maxTime]);

  useEffect(() => {
    if (!enabled) return () => {}; // Return empty cleanup function

    const options = { passive: false };
    
    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  return {
    swipeProgress,
    isEnabled: enabled,
    reset: () => {
      touchDataRef.current.isActive = false;
      setSwipeProgress({
        deltaX: 0,
        deltaY: 0,
        direction: 'none',
        isActive: false
      });
    }
  };
};

// Interface for the tab swipe gesture hook
interface TabSwipeGestureParams {
  tabs: Array<{ id: string }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  enabled?: boolean;
}

// Hook specifically for tab navigation
export const useTabSwipeGestures = ({
  tabs,
  activeTab,
  onTabChange,
  enabled = true
}: TabSwipeGestureParams) => {
  // Check if tabs is an array and has length before using findIndex
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return {
      handleTouchStart: () => { return; },
      handleTouchMove: () => { return; },
      handleTouchEnd: () => { return; },
      swipeProgress: { deltaX: 0, deltaY: 0, direction: 'none' as const, isActive: false },
      isEnabled: false,
      reset: () => { return; }
    };
  }

  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const swipeCallbacks = {
    onSwipeLeft: () => {
      // Swipe left = next tab
      const nextIndex = Math.min(currentIndex + 1, tabs.length - 1);
      if (nextIndex !== currentIndex) {
        onTabChange(tabs[nextIndex].id);
      }
    },
    onSwipeRight: () => {
      // Swipe right = previous tab
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex) {
        onTabChange(tabs[prevIndex].id);
      }
    }
  };

  const { swipeProgress, isEnabled, reset } = useMobileSwipeGestures(swipeCallbacks, { enabled });

  return {
    handleTouchStart: (e: React.TouchEvent) => {},
    handleTouchMove: (e: React.TouchEvent) => {},
    handleTouchEnd: (e: React.TouchEvent) => {},
    swipeProgress,
    isEnabled,
    reset
  };
};