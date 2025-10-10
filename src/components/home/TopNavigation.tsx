import React from 'react';
import { Search, Bell } from 'lucide-react';
import './TopNavigation.css';

interface TopNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userName: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  searchQuery,
  onSearchChange,
  userName,
}) => {
  return (
    <header className="bg-[#0D1117] border-b border-[#30363D] py-4 px-4 sticky top-0 z-30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#8B949E]" />
              </div>
              <input
                type="text"
                placeholder="Search for tracks, artists, or playlists"
                className="block w-full pl-10 pr-3 py-2 border border-[#30363D] rounded-lg bg-[#0D1117] text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 ml-4">
            <button 
              className="text-[#8B949E] hover:text-[#E6EDF3] relative p-1"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0D1117]"></span>
            </button>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[#58A6FF] flex items-center justify-center text-white font-medium text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
