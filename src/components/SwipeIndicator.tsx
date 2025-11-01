import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SwipeIndicatorProps {
  show?: boolean;
  direction?: 'left' | 'right' | 'both';
  position?: 'top' | 'bottom' | 'middle';
  onDismiss?: () => void;
  autoHide?: number; // Auto-hide after X milliseconds
}

export const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
  show = true,
  direction = 'both',
  position = 'bottom',
  onDismiss,
  autoHide = 3000
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show && autoHide > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoHide);

      return () => {
        clearTimeout(timer);
        return () => {};
      };
    }
    return () => {};
  }, [show, autoHide, onDismiss]);

  useEffect(() => {
    setIsVisible(show);
    return;
  }, [show]);

  if (!isVisible) return null;

  const positionClasses = {
    top: 'top-4',
    middle: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-4'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed left-1/2 -translate-x-1/2 ${positionClasses[position]} z-50 pointer-events-none`}
    >
      <div className="bg-[#21262d]/90 backdrop-blur-sm border border-[#30363d] rounded-xl px-4 py-3 flex items-center gap-3">
        {(direction === 'left' || direction === 'both') && (
          <motion.div
            animate={{ x: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 text-[#8b949e]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">Swipe</span>
          </motion.div>
        )}
        
        {direction === 'both' && (
          <div className="w-px h-4 bg-[#30363d]" />
        )}
        
        {(direction === 'right' || direction === 'both') && (
          <motion.div
            animate={{ x: [3, -3, 3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1 text-[#8b949e]"
          >
            <span className="text-xs">Swipe</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};