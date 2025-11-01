import { useEffect } from 'react';
import { useSwipeNavigationContext } from './SwipeNavigationProvider';

interface SwipeNavigationManagerProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  tabOrder?: string[];
  enableVerticalSwipe?: boolean;
}

export const SwipeNavigationManager: React.FC<SwipeNavigationManagerProps> = ({
  activeTab,
  onNavigate,
  tabOrder = ['Home', 'Ranking', 'Contests', 'AI Studio', 'NFT', 'Profile'],
  enableVerticalSwipe = false
}) => {
  const { enableSwipe } = useSwipeNavigationContext();

  useEffect(() => {
    const currentIndex = tabOrder.indexOf(activeTab);
    
    const handleSwipeLeft = () => {
      // Swipe left goes to next tab
      const nextIndex = (currentIndex + 1) % tabOrder.length;
      onNavigate(tabOrder[nextIndex]);
    };

    const handleSwipeRight = () => {
      // Swipe right goes to previous tab
      const prevIndex = currentIndex === 0 ? tabOrder.length - 1 : currentIndex - 1;
      onNavigate(tabOrder[prevIndex]);
    };

    const handleSwipeUp = enableVerticalSwipe ? () => {
      // Optional: Could implement additional functionality like opening search or quick actions
      console.log('Swipe up detected');
    } : undefined;

    const handleSwipeDown = enableVerticalSwipe ? () => {
      // Optional: Could implement functionality like refreshing content
      console.log('Swipe down detected');
    } : undefined;

    enableSwipe({
      onSwipeLeft: handleSwipeLeft,
      onSwipeRight: handleSwipeRight,
      onSwipeUp: handleSwipeUp,
      onSwipeDown: handleSwipeDown,
      threshold: 80,
      preventScroll: true
    });

    // Cleanup when component unmounts or activeTab changes
    return () => {
      // The context will handle cleanup
    };
  }, [activeTab, onNavigate, tabOrder, enableVerticalSwipe, enableSwipe]);

  return null; // This is a logic-only component
};