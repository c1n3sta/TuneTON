import React, { useState, useEffect } from 'react';
import '../styles/theme.css';
import './HomeScreen.css';

// Components
import TopNavigation from './home/TopNavigation';
import BottomNavigation from './home/BottomNavigation';
import NowPlayingBar from './home/NowPlayingBar';

// Helper function to get time of day greeting
const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

// Types
interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isPlaying?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  tracks: number;
  duration: string;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  cover: string;
  prize: string;
  deadline: string;
  participants: number;
  remixer: {
    name: string;
    avatar: string;
  };
}

const HomeScreen: React.FC = () => {
  // UI State
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio Player State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sample Tracks Data
  const [sampleTracks, setSampleTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'DJ MixMaster',
      cover: 'https://example.com/cover1.jpg',
      duration: '3:45',
      isPlaying: false,
    },
    {
      id: '2',
      title: 'Chill Beats',
      artist: 'Ambient Dreams',
      cover: 'https://example.com/cover2.jpg',
      duration: '4:20',
      isPlaying: false,
    },
    {
      id: '3',
      title: 'Night Drive',
      artist: 'Midnight Cruisers',
      cover: 'https://example.com/cover3.jpg',
      duration: '5:15',
      isPlaying: false,
    },
    {
      id: '4',
      title: 'Morning Coffee',
      artist: 'Acoustic Mornings',
      cover: 'https://example.com/cover4.jpg',
      duration: '3:30',
      isPlaying: false,
    },
    {
      id: '5',
      title: 'Deep Focus',
      artist: 'Concentration Flow',
      cover: 'https://example.com/cover5.jpg',
      duration: '6:45',
      isPlaying: false,
    },
  ]);

  // Sample Playlists Data
  const samplePlaylists: Playlist[] = [
    { 
      id: '1', 
      title: "Chill Vibes", 
      description: "Relaxing beats for your day",
      cover: "http://localhost:3845/assets/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png",
      tracks: 15, 
      duration: "45:30" 
    },
    { 
      id: '2', 
      title: "Workout Mix", 
      description: "High energy tracks",
      cover: "http://localhost:3845/assets/059d630bf1b73c65663230f6fe3660d07bc060b8.png",
      tracks: 22, 
      duration: "1:15:45" 
    },
    { 
      id: '3', 
      title: "Focus Beats", 
      description: "Concentration music",
      cover: "http://localhost:3845/assets/20bb8fe31b212ec3236e8224dd3efe441043be2f.png",
      tracks: 10, 
      duration: "35:20" 
    },
  ];

  // Sample Contests Data
  const sampleContests: Contest[] = [
    {
      id: '1',
      title: "Remix Rumble",
      description: "Create your best remix and win amazing prizes!",
      cover: "http://localhost:3845/assets/92af5e42f7a6be5cc4a3570d7557d9b846376457.png",
      prize: "$5,000 + Studio Time",
      deadline: "2023-12-31",
      participants: 124,
      remixer: {
        name: "DJ MixMaster",
        avatar: "http://localhost:3845/assets/02641910bdc93d1d98cf6da313c9fe42f75a5679.png"
      }
    },
    {
      id: 2,
      title: "Tempo Master",
      description: "New challenge! Show us your tempo control skills.",
      cover: "http://localhost:3845/assets/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png",
      prize: "$3,000 + Equipment",
      deadline: "2024-01-15",
      participants: 87,
      remixer: {
        name: "Beat Smith",
        avatar: "http://localhost:3845/assets/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png"
      }
    },
  ];

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
  };

  // Toggle play/pause for the current track
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="home-screen">
      {/* Top Navigation */}
      <TopNavigation 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userName="DJ MixMaster"
      />
      
      {/* Main Content Area */}
      <main className="main-content">
        {/* Welcome Banner */}
        <section className="welcome-banner">
          <h1>Good {getTimeOfDay()}, DJ MixMaster</h1>
          <p>Discover new music and join the community</p>
        </section>

        {/* Recently Played Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recently Played</h2>
            <button className="btn-text" onClick={() => {}}>
              See all
            </button>
          </div>
          <div className="recently-played-card">
            <div className="recently-played-content">
              <div className="album-art" style={{ backgroundImage: `url(${sampleTracks[0].cover})` }} />
              <div className="track-info">
                <h3 className="track-title">{sampleTracks[0].title}</h3>
                <p className="track-artist">{sampleTracks[0].artist}</p>
              </div>
              <div className="play-button" onClick={togglePlayPause}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 19C9.1 19 10 18.1 10 17V7C10 5.9 9.1 5 8 5C6.9 5 6 5.9 6 7V17C6 18.1 6.9 19 8 19ZM16 7V17C16 18.1 16.9 19 18 19C19.1 19 20 18.1 20 17V7C20 5.9 19.1 5 18 5C16.9 5 16 5.9 16 7Z" fill="#8B949E"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="#58A6FF"/>
                  </svg>
                )}
              </div>
            </div>
            <div className="visualizer">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="bar" style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${index * 0.1}s`
                }} />
              ))}
            </div>
          </div>
        </section>

        {/* Playlists Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">My Playlists</h2>
            <button className="btn-text">View All</button>
          </div>
          <div className="playlists-grid">
            {samplePlaylists.map(playlist => (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-cover" style={{ backgroundImage: `url(${playlist.cover})` }} />
                <div className="playlist-info">
                  <h3 className="playlist-title">{playlist.title}</h3>
                  <p className="playlist-tracks">{playlist.tracksCount} tracks • {playlist.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contests Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Active Contests</h2>
            <button className="btn-text">View All</button>
          </div>
          <div className="contests-list">
            {sampleContests.map(contest => (
              <div key={contest.id} className="contest-card">
                <div className="contest-cover" style={{ backgroundImage: `url(${contest.cover})` }} />
                <div className="contest-details">
                  <h3 className="contest-title">{contest.title}</h3>
                  <p className="contest-prize">Prize: {contest.prize}</p>
                  <div className="contest-meta">
                    <span className="contest-participants">{contest.participants} participants</span>
                    <span className="contest-deadline">Ends {contest.deadline}</span>
                  </div>
                  <button className="btn-primary btn-sm">Enter Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default HomeScreen;
