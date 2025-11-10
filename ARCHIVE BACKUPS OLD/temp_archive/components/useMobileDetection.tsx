import { useState, useEffect } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
}

export const useMobileDetection = (): MobileDetectionResult => {
  const [detection, setDetection] = useState<MobileDetectionResult>({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    userAgent: '',
    screenSize: { width: 0, height: 0 }
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mobile detection based on user agent
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Touch detection
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Screen size based detection
      const isMobileScreen = width <= 768;
      const isTabletScreen = width > 768 && width <= 1024;
      
      // Combine detection methods
      const isMobile = isMobileUA || (isMobileScreen && isTouch);
      const isTablet = /ipad/i.test(userAgent) || (isTabletScreen && isTouch);

      setDetection({
        isMobile,
        isTablet,
        isTouch,
        userAgent,
        screenSize: { width, height }
      });
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return detection;
};

// Hook specifically for swipe gesture configuration
export const useSwipeConfig = () => {
  const { isMobile, isTouch, screenSize } = useMobileDetection();

  const getSwipeConfig = () => {
    if (!isTouch) {
      return {
        enabled: false,
        threshold: 0,
        velocity: 0
      };
    }

    // Mobile-specific configurations
    if (isMobile) {
      return {
        enabled: true,
        threshold: Math.min(screenSize.width * 0.15, 80), // 15% of screen width, max 80px
        velocity: 0.3,
        maxTime: 400,
        preventScroll: true
      };
    }

    // Tablet configurations
    return {
      enabled: true,
      threshold: Math.min(screenSize.width * 0.1, 100), // 10% of screen width, max 100px
      velocity: 0.25,
      maxTime: 500,
      preventScroll: true
    };
  };

  return {
    ...useMobileDetection(),
    swipeConfig: getSwipeConfig()
  };
};

// Helper function to get optimal swipe settings
export const getOptimalSwipeSettings = (screenWidth: number, isTouch: boolean) => {
  if (!isTouch) {
    return { enabled: false };
  }

  return {
    enabled: true,
    threshold: Math.max(40, Math.min(screenWidth * 0.12, 90)),
    velocity: screenWidth < 400 ? 0.35 : 0.3,
    maxTime: screenWidth < 400 ? 350 : 400
  };
};