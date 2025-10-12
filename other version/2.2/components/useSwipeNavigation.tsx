import { useEffect, useRef, useState } from 'react';

interface SwipeNavigationProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false
}: SwipeNavigationProps) => {
  const touchStartRef = useRef<TouchPosition | null>(null);
  const touchEndRef = useRef<TouchPosition | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    touchEndRef.current = null;
    setIsSwiping(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    // Calculate distance to determine if we're swiping
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (deltaX > threshold || deltaY > threshold) {
      setIsSwiping(true);
      
      // Prevent scroll if horizontal swipe is dominant and preventScroll is true
      if (preventScroll && deltaX > deltaY) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.timestamp - touchStartRef.current.timestamp;
    
    // Only trigger swipe if it was fast enough and far enough
    const isSwipeFast = deltaTime < 300;
    const isSwipeFar = Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold;
    
    if (isSwipeFast && isSwipeFar) {
      // Determine swipe direction based on dominant axis
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > threshold) {
          onSwipeRight?.();
        } else if (deltaX < -threshold) {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > threshold) {
          onSwipeDown?.();
        } else if (deltaY < -threshold) {
          onSwipeUp?.();
        }
      }
    }
    
    // Reset state
    touchStartRef.current = null;
    touchEndRef.current = null;
    setIsSwiping(false);
  };

  useEffect(() => {
    const element = document;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventScroll]);

  return { isSwiping };
};

// Higher-order component for adding swipe navigation to any component
export const withSwipeNavigation = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  swipeConfig: SwipeNavigationProps
) => {
  return (props: P) => {
    useSwipeNavigation(swipeConfig);
    return <WrappedComponent {...props} />;
  };
};