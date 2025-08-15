import React from 'react';
import './TopNavigation.css';

// SVG Icons
const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#8B949E"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2939 12.5786H13.3905L13.0703 12.2699C14.191 10.9663 14.8656 9.27393 14.8656 7.43282C14.8656 3.32762 11.5426 0 7.43282 0C3.32762 0 0 3.32293 0 7.43282C0 11.5426 3.32762 14.8656 7.43752 14.8656C9.27864 14.8656 10.9663 14.191 12.2749 13.0703L12.5786 13.3905V14.2939L18.2966 20L20 18.2966L14.2939 12.5786ZM7.43752 12.5786C4.58574 12.5786 2.28702 10.285 2.28702 7.43282C2.28702 4.58094 4.58574 2.28702 7.43752 2.28702C10.2894 2.28702 12.5881 4.58094 12.5881 7.43282C12.5881 10.285 10.2894 12.5786 7.43752 12.5786Z" fill="#8B949E"/>
  </svg>
);

const UserAvatar = () => (
  <div className="user-avatar">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#58A6FF"/>
      <path d="M16 8C13.8 8 12 9.8 12 12C12 14.2 13.8 16 16 16C18.2 16 20 14.2 20 12C20 9.8 18.2 8 16 8ZM16 24C12.7 24 8 25.3 8 28V32H24V28C24 25.3 19.3 24 16 24Z" fill="white"/>
    </svg>
  </div>
);

type TopNavigationProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userName?: string;
};

const TopNavigation: React.FC<TopNavigationProps> = ({ 
  searchQuery, 
  onSearchChange,
  userName = 'Username'
}) => {
  const [currentTime, setCurrentTime] = React.useState('');
  
  // Update time
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="top-navigation">
      <div className="top-bar">
        <div className="user-greeting">
          <h1>{getGreeting()}</h1>
          <p className="username">{userName}</p>
        </div>
        <div className="top-bar-right">
          <div className="current-time">{currentTime}</div>
          <div className="user-actions">
            <button className="icon-button" aria-label="Notifications">
              <BellIcon />
              <span className="notification-badge">3</span>
            </button>
            <UserAvatar />
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search tracks, artists..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default TopNavigation;
