import { motion } from "motion/react";
import { ReactNode } from "react";
import { useTabSwipeGestures } from "./useMobileSwipeGestures";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface StylishTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'minimal' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  enableSwipe?: boolean;
}

export default function StylishTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = '',
  enableSwipe = true
}: StylishTabsProps) {
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTabSwipeGestures({
    tabs,
    activeTab,
    onTabChange,
    enabled: enableSwipe
  });

  const baseClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const renderDefaultTabs = () => (
    <div className={`flex bg-white/5 backdrop-blur-sm rounded-lg p-1 ${className}`}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            className={`relative flex-1 ${baseClasses[size]} rounded-md transition-all duration-300 ${
              isActive
                ? 'text-white shadow-lg'
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md"
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {tab.icon && (
                <span className={iconSizes[size]}>
                  {tab.icon}
                </span>
              )}
              <span className="font-medium">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  const renderPillTabs = () => (
    <div className={`flex gap-2 ${className}`}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            className={`relative ${baseClasses[size]} rounded-full transition-all duration-300 border-2 ${
              isActive
                ? 'border-[#ff22fb] bg-gradient-to-r from-[#ff22fb] to-[#8b22ff] text-white shadow-lg shadow-[#ff22fb]/25'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10'
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 h-full">
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
                  className={`ml-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isActive 
                      ? "bg-white text-[#ff22fb]" 
                      : "bg-[#ff22fb] text-white"
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
  );

  const renderUnderlineTabs = () => (
    <div className={`flex relative ${className}`}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            className={`relative flex-1 ${baseClasses[size]} transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && (
                <span className={iconSizes[size]}>
                  {tab.icon}
                </span>
              )}
              <span className="font-medium">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
        initial={false}
        animate={{
          left: `${(activeTabIndex / tabs.length) * 100}%`,
          width: `${100 / tabs.length}%`
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    </div>
  );

  const renderMinimalTabs = () => (
    <div className={`flex gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            className={`relative transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              {tab.icon && (
                <span className={iconSizes[size]}>
                  {tab.icon}
                </span>
              )}
              <span className="font-medium">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
            {isActive && (
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                layoutId="activeIndicator"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );

  const renderGlassTabs = () => (
    <div className={`flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            className={`relative flex-1 ${baseClasses[size]} rounded-lg transition-all duration-300 ${
              isActive
                ? 'text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
                layoutId="glassActiveTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {tab.icon && (
                <span className={iconSizes[size]}>
                  {tab.icon}
                </span>
              )}
              <span className="font-medium">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  const renderNeonTabs = () => (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <motion.button
            key={tab.id}
            className={`relative ${baseClasses[size]} rounded-lg transition-all duration-300 border ${
              isActive
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-lg shadow-cyan-400/25'
                : 'border-white/20 bg-white/5 text-white/60 hover:border-cyan-400/50 hover:text-cyan-400/80'
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05, boxShadow: isActive ? "0 0 25px rgba(34, 211, 238, 0.4)" : "0 0 15px rgba(34, 211, 238, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {tab.icon && (
                <span className={iconSizes[size]}>
                  {tab.icon}
                </span>
              )}
              <span className="font-medium">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-cyan-400 text-black rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  switch (variant) {
    case 'pills':
      return renderPillTabs();
    case 'underline':
      return renderUnderlineTabs();
    case 'minimal':
      return renderMinimalTabs();
    case 'glass':
      return renderGlassTabs();
    case 'neon':
      return renderNeonTabs();
    default:
      return renderDefaultTabs();
  }
}