import React, { createContext, useContext, useRef } from 'react';
import { useSwipeNavigation } from './useSwipeNavigation';

interface SwipeNavigationContextType {
  enableSwipe: (config: SwipeConfig) => void;
  disableSwipe: () => void;
  currentConfig?: SwipeConfig;
}

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

const SwipeNavigationContext = createContext<SwipeNavigationContextType>({
  enableSwipe: () => {},
  disableSwipe: () => {},
});

export const useSwipeNavigationContext = () => useContext(SwipeNavigationContext);

interface SwipeNavigationProviderProps {
  children: React.ReactNode;
}

export const SwipeNavigationProvider: React.FC<SwipeNavigationProviderProps> = ({ children }) => {
  const configRef = useRef<SwipeConfig | undefined>(undefined);

  const enableSwipe = (config: SwipeConfig) => {
    configRef.current = config;
  };

  const disableSwipe = () => {
    configRef.current = undefined;
  };

  // Use the swipe hook with current config
  useSwipeNavigation({
    onSwipeLeft: configRef.current?.onSwipeLeft,
    onSwipeRight: configRef.current?.onSwipeRight,
    onSwipeUp: configRef.current?.onSwipeUp,
    onSwipeDown: configRef.current?.onSwipeDown,
    threshold: configRef.current?.threshold || 50,
    preventScroll: configRef.current?.preventScroll || false,
  });

  return (
    <SwipeNavigationContext.Provider
      value={{
        enableSwipe,
        disableSwipe,
        currentConfig: configRef.current,
      }}
    >
      {children}
    </SwipeNavigationContext.Provider>
  );
};