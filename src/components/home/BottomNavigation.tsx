import React from 'react';
import { Home, ListMusic, Trophy, User } from 'lucide-react';
import './BottomNavigation.css';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0D1117] border-t border-[#30363D] z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Home Tab */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center w-full py-2 ${
              activeTab === 'home' ? 'text-[#58A6FF]' : 'text-[#8B949E]'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>

          {/* Playlists Tab */}
          <button
            onClick={() => onTabChange('playlists')}
            className={`flex flex-col items-center justify-center w-full py-2 ${
              activeTab === 'playlists' ? 'text-[#58A6FF]' : 'text-[#8B949E]'
            }`}
          >
            <ListMusic className="w-5 h-5 mb-1" />
            <span className="text-xs">Playlists</span>
          </button>

          {/* Contests Tab */}
          <button
            onClick={() => onTabChange('contests')}
            className={`flex flex-col items-center justify-center w-full py-2 ${
              activeTab === 'contests' ? 'text-[#58A6FF]' : 'text-[#8B949E]'
            }`}
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs">Contests</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center justify-center w-full py-2 ${
              activeTab === 'profile' ? 'text-[#58A6FF]' : 'text-[#8B949E]'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;