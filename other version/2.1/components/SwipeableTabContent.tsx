import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMobileSwipeGestures } from './useMobileSwipeGestures';

interface SwipeableTabContentProps {
  activeTab: string;
  tabs: Array<{
    id: string;
    content: ReactNode;
  }>;
  onTabChange: (tabId: string) => void;
  children?: ReactNode;
  className?: string;
  swipeEnabled?: boolean;
  swipeThreshold?: number;
}

export default function SwipeableTabContent({
  activeTab,
  tabs,
  onTabChange,
  children,
  className = "",
  swipeEnabled = true,
  swipeThreshold = 80
}: SwipeableTabContentProps) {
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
  const currentTab = tabs[currentIndex];

  const { swipeProgress } = useMobileSwipeGestures(
    {
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
    },
    {
      threshold: swipeThreshold,
      enabled: swipeEnabled,
      preventScroll: true
    }
  );

  // Calculate transform based on swipe progress
  const getTransform = () => {
    if (!swipeProgress.isActive || swipeProgress.direction === 'none') {
      return 'translateX(0%)';
    }

    const progress = Math.max(-100, Math.min(100, (swipeProgress.deltaX / window.innerWidth) * 100));
    return `translateX(${progress}%)`;
  };

  // Calculate opacity for smooth transitions
  const getOpacity = () => {
    if (!swipeProgress.isActive) return 1;
    
    const progress = Math.abs(swipeProgress.deltaX) / swipeThreshold;
    return Math.max(0.7, 1 - progress * 0.3);
  };

  // Get next/previous tab content for preview during swipe
  const getPreviewContent = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      return tabs[currentIndex + 1];
    } else if (direction === 'right' && currentIndex > 0) {
      return tabs[currentIndex - 1];
    }
    return null;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main content */}
      <motion.div
        className="relative w-full"
        style={{
          transform: getTransform(),
          opacity: getOpacity()
        }}
        transition={{
          type: swipeProgress.isActive ? 'tween' : 'spring',
          duration: swipeProgress.isActive ? 0 : 0.3,
          stiffness: 300,
          damping: 30
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab?.content}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Preview content during swipe */}
      {swipeProgress.isActive && swipeProgress.direction !== 'none' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        >
          {(() => {
            const previewTab = getPreviewContent(swipeProgress.direction);
            if (!previewTab) return null;

            const isLeft = swipeProgress.direction === 'left';
            const translateX = isLeft ? '100%' : '-100%';
            const swipeTranslateX = isLeft 
              ? `${100 - (Math.abs(swipeProgress.deltaX) / window.innerWidth) * 100}%`
              : `${-100 + (Math.abs(swipeProgress.deltaX) / window.innerWidth) * 100}%`;

            return (
              <motion.div
                className="absolute inset-0 bg-[#161b22]"
                style={{
                  transform: `translateX(${swipeTranslateX})`
                }}
              >
                <div className="p-4 opacity-60">
                  {previewTab.content}
                </div>
              </motion.div>
            );
          })()}
        </motion.div>
      )}

      {/* Swipe indicators */}
      {swipeProgress.isActive && swipeProgress.direction !== 'none' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div
            className="bg-[#ff22fb]/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {swipeProgress.direction === 'left' && currentIndex < tabs.length - 1 && 'Next →'}
            {swipeProgress.direction === 'right' && currentIndex > 0 && '← Previous'}
          </motion.div>
        </div>
      )}

      {/* Optional children (e.g., additional UI elements) */}
      {children}
    </div>
  );
}

// Higher-order component to add swipe functionality to any tab content
export const withSwipeableContent = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  swipeConfig?: Partial<SwipeableTabContentProps>
) => {
  return (props: P & SwipeableTabContentProps) => {
    return (
      <SwipeableTabContent {...swipeConfig} {...props}>
        <WrappedComponent {...props} />
      </SwipeableTabContent>
    );
  };
};