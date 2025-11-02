import { motion } from "motion/react";
import { ReactNode } from "react";
import { useTabSwipeGestures } from "./useMobileSwipeGestures";

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface StylishTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  enableSwipe?: boolean;
  swipeThreshold?: number;
}

export default function StylishTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = "default",
  size = "md",
  className = "",
  enableSwipe = true,
  swipeThreshold = 80
}: StylishTabsProps) {
  const buttonSizes = {
    sm: "w-16 h-12",
    md: "w-18 h-14", 
    lg: "w-20 h-16"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm"
  };

  // Enable swipe gestures for mobile tab navigation
  const { swipeProgress } = useTabSwipeGestures(
    tabs,
    activeTab,
    onTabChange,
    {
      enabled: enableSwipe,
      threshold: swipeThreshold,
      preventScroll: true
    }
  );

  // Get transform and visual feedback for swipe gestures
  const getSwipeTransform = () => {
    if (!swipeProgress.isActive || swipeProgress.direction === 'none') {
      return 'translateX(0px)';
    }
    // Subtle visual feedback during swipe
    const dampedDelta = swipeProgress.deltaX * 0.3;
    return `translateX(${Math.max(-20, Math.min(20, dampedDelta))}px)`;
  };

  const getSwipeOpacity = () => {
    if (!swipeProgress.isActive) return 1;
    const progress = Math.abs(swipeProgress.deltaX) / swipeThreshold;
    return Math.max(0.8, 1 - progress * 0.2);
  };

  const renderDefaultTabs = () => (
    <motion.div 
      className={`relative bg-gradient-to-r from-[#0d1117]/95 via-[#161b22]/95 to-[#0d1117]/95 backdrop-blur-xl border border-[#30363d]/50 rounded-2xl px-4 py-3 shadow-2xl shadow-[#ff22fb]/10 ${className}`}
      style={{
        transform: getSwipeTransform(),
        opacity: getSwipeOpacity()
      }}
      transition={{
        type: swipeProgress.isActive ? 'tween' : 'spring',
        duration: swipeProgress.isActive ? 0 : 0.3
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff22fb]/5 via-[#ff4400]/5 to-[#ff22fb]/5 rounded-2xl blur-xl" />
      
      {/* Swipe indicator */}
      {swipeProgress.isActive && swipeProgress.direction !== 'none' && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="bg-[#ff22fb]/90 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
            {swipeProgress.direction === 'left' ? '→' : '←'}
          </div>
        </motion.div>
      )}
      
      {/* Tab buttons container */}
      <div className="relative flex items-center gap-2">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 ${buttonSizes[size]} rounded-xl transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isActive ? { scale: 1.05 } : { scale: 1 }}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-gradient-to-br from-[#ff22fb] via-[#ff4400] to-[#ff22fb] rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Hover background */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#ff22fb]/20 via-[#ff4400]/20 to-[#ff22fb]/20 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Icon and label container */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1 h-full">
                {tab.icon && (
                  <motion.div
                    className={`transition-all duration-300 ${
                      isActive ? "text-white" : "text-[#8b949e]"
                    }`}
                    animate={isActive ? { rotateY: 360 } : { rotateY: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className={iconSizes[size]}>
                      {tab.icon}
                    </div>
                  </motion.div>
                )}
                
                <motion.span 
                  className={`${textSizes[size]} font-semibold transition-all duration-300 leading-none ${
                    isActive ? "text-white" : "text-[#8b949e]"
                  }`}
                  animate={isActive ? { y: 0, opacity: 1 } : { y: 1, opacity: 0.8 }}
                >
                  {tab.label}
                </motion.span>
                
                {tab.badge && (
                  <motion.span
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive 
                        ? "bg-white text-[#ff22fb]" 
                        : "bg-[#ff22fb] text-white"
                    }`}
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </div>
              
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 right-1 w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                />
              )}
              
              {/* Pulse effect for active tab */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#ff22fb]/30 via-[#ff4400]/30 to-[#ff22fb]/30 rounded-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Bottom glow line */}
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#ff22fb] to-transparent rounded-full"
        animate={{ 
          scaleX: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );

  const renderPillTabs = () => (
    <motion.div 
      className={`flex gap-3 overflow-x-auto scrollbar-hide ${className}`}
      style={{
        transform: enableSwipe ? getSwipeTransform() : 'translateX(0px)',
        opacity: enableSwipe ? getSwipeOpacity() : 1
      }}
      transition={{
        type: swipeProgress.isActive ? 'tween' : 'spring',
        duration: swipeProgress.isActive ? 0 : 0.3
      }}
    >
      {/* Swipe indicator for pills */}
      {enableSwipe && swipeProgress.isActive && swipeProgress.direction !== 'none' && (
        <motion.div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="bg-[#ff22fb]/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {swipeProgress.direction === 'left' ? '→' : '←'}
          </div>
        </motion.div>
      )}

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center gap-1 ${buttonSizes[size]} rounded-xl transition-all duration-300 border border-[#30363d]/50 backdrop-blur-xl`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isActive 
                ? "linear-gradient(135deg, #ff22fb 0%, #ff4400 100%)" 
                : "linear-gradient(135deg, #0d1117/95 0%, #161b22/95 100%)"
            }}
          >
            {/* Hover background */}
            {!isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#ff22fb]/20 via-[#ff4400]/20 to-[#ff22fb]/20 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Icon and label container */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1 h-full">
              {tab.icon && (
                <motion.div
                  className={`transition-colors duration-300 ${
                    isActive ? "text-white" : "text-[#8b949e]"
                  }`}
                  animate={isActive ? { rotateY: 360 } : { rotateY: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className={iconSizes[size]}>
                    {tab.icon}
                  </div>
                </motion.div>
              )}
              
              <motion.span 
                className={`${textSizes[size]} font-semibold transition-colors duration-300 leading-none ${
                  isActive ? "text-white" : "text-[#8b949e]"
                }`}
              >
                {tab.label}
              </motion.span>
              
              {tab.badge && (
                <motion.span
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isActive 
                      ? "bg-white text-[#ff22fb]" 
                      : "bg-[#ff22fb] text-white"
                  }`}
                >
                  {tab.badge}
                </motion.span>
              )}
            </div>
            
            {/* Glow effect for active pill */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#ff22fb]/30 via-[#ff4400]/30 to-[#ff22fb]/30 rounded-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );

  const renderUnderlineTabs = () => (
    <motion.div 
      className={`relative bg-gradient-to-r from-[#0d1117]/95 via-[#161b22]/95 to-[#0d1117]/95 backdrop-blur-xl border border-[#30363d]/50 rounded-t-2xl px-4 py-3 shadow-2xl shadow-[#ff22fb]/10 ${className}`}
      style={{
        transform: enableSwipe ? getSwipeTransform() : 'translateX(0px)',
        opacity: enableSwipe ? getSwipeOpacity() : 1
      }}
      transition={{
        type: swipeProgress.isActive ? 'tween' : 'spring',
        duration: swipeProgress.isActive ? 0 : 0.3
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff22fb]/5 via-[#ff4400]/5 to-[#ff22fb]/5 rounded-t-2xl" />
      
      {/* Swipe indicator for underline */}
      {enableSwipe && swipeProgress.isActive && swipeProgress.direction !== 'none' && (
        <motion.div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="bg-[#ff22fb]/90 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
            {swipeProgress.direction === 'left' ? '→' : '←'}
          </div>
        </motion.div>
      )}

      <div className="relative flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 ${buttonSizes[size]} rounded-t-xl transition-all duration-300 border-b-2 border-transparent`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Hover background */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#ff22fb]/20 via-[#ff4400]/20 to-[#ff22fb]/20 rounded-t-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Active underline */}
              {isActive && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff22fb] to-[#ff4400] rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon and label container */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1 h-full">
                {tab.icon && (
                  <motion.div
                    className={`transition-colors duration-300 ${
                      isActive ? "text-[#ff22fb]" : "text-[#8b949e]"
                    }`}
                    animate={isActive ? { scale: 1.1, rotateY: 360 } : { scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className={iconSizes[size]}>
                      {tab.icon}
                    </div>
                  </motion.div>
                )}
                
                <motion.span 
                  className={`${textSizes[size]} font-semibold transition-colors duration-300 leading-none ${
                    isActive ? "text-[#ff22fb]" : "text-[#8b949e]"
                  }`}
                >
                  {tab.label}
                </motion.span>
                
                {tab.badge && (
                  <motion.span
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive 
                        ? "bg-[#ff22fb] text-white" 
                        : "bg-[#30363d] text-[#8b949e]"
                    }`}
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  switch (variant) {
    case "pills":
      return renderPillTabs();
    case "underline":
      return renderUnderlineTabs();
    default:
      return renderDefaultTabs();
  }
}