import { Home, Music, Trophy, Library } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavigationProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onNavigate }: BottomNavigationProps) {
  const tabs = [
    { name: "Home", icon: Home, emoji: "🏠" },
    { name: "Library", icon: Library, emoji: "📚" },
    { name: "Player", icon: Music, emoji: "🎵" },
    { name: "Contests", icon: Trophy, emoji: "🏆" }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Main navigation container with enhanced styling */}
      <motion.div 
        className="bg-gradient-to-r from-[#0d1117]/95 via-[#161b22]/95 to-[#0d1117]/95 backdrop-blur-xl border border-[#30363d]/50 rounded-2xl px-4 py-3 shadow-2xl shadow-[#ff22fb]/10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff22fb]/5 via-[#ff4400]/5 to-[#ff22fb]/5 rounded-2xl blur-xl" />
        
        {/* Tab buttons container */}
        <div className="relative flex items-center gap-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            
            return (
              <motion.button
                key={tab.name}
                onClick={() => onNavigate(tab.name)}
                className="relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
              >
                {/* Active background with gradient */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
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
                  {/* Animated icon */}
                  <motion.div
                    className={`transition-all duration-300 ${
                      isActive 
                        ? "text-white" 
                        : "text-[#8b949e]"
                    }`}
                    animate={isActive ? { rotateY: 360 } : { rotateY: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  
                  {/* Tab label */}
                  <motion.span 
                    className={`text-xs font-semibold transition-all duration-300 leading-none ${
                      isActive 
                        ? "text-white" 
                        : "text-[#8b949e]"
                    }`}
                    animate={isActive ? { y: 0, opacity: 1 } : { y: 1, opacity: 0.8 }}
                  >
                    {tab.name}
                  </motion.span>
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
    </div>
  );
}