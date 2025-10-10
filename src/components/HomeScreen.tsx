import React, { useState, useCallback } from 'react';
import '../styles/theme.css';
import './HomeScreen.css';

// Icons
import { Search, Bell, ChevronRight } from 'lucide-react';

// Components
import TopNavigation from './home/TopNavigation';
import BottomNavigation from './home/BottomNavigation';
import NowPlayingBar from './home/NowPlayingBar';
import RecentlyPlayed from './home/RecentlyPlayed';
import FeaturedPlaylists from './home/FeaturedPlaylists';
import ActiveContests from './home/ActiveContests';

// Types
export interface Track {
  id: string | number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isPlaying?: boolean;
}

export interface Playlist {
  id: string | number;
  title: string;
  description: string;
  cover: string;
  tracks: number;
  tracksCount: number;
  duration: string;
}

export interface Contest {
  id: string | number;
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
  
  // Sample Data
  const [sampleTracks, setSampleTracks] = useState<Track[]>([
    {
      id: 1,
      title: 'Starlight Serenade',
      artist: 'MelodyMix Artist',
      cover: 'http://localhost:3845/assets/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png',
      duration: '3:45',
      isPlaying: false,
    },
    {
      id: 2,
      title: 'Midnight Groove',
      artist: 'Rhythm Masters',
      cover: 'http://localhost:3845/assets/5c0570c22db9da4233071e8dc020249fbd9aeece.png',
      duration: '4:20',
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
      tracksCount: 15, 
      duration: "45:30" 
    },
    { 
      id: '2', 
      title: "Workout Mix", 
      description: "High energy tracks",
      cover: "http://localhost:3845/assets/059d630bf1b73c65663230f6fe3660d07bc060b8.png",
      tracks: 22,
      tracksCount: 22, 
      duration: "1:15:45" 
    },
    { 
      id: '3', 
      title: "Focus Beats", 
      description: "Concentration music",
      cover: "http://localhost:3845/assets/20bb8fe31b212ec3236e8224dd3efe441043be2f.png",
      tracks: 10,
      tracksCount: 10, 
      duration: "35:20" 
    },
  ];

  // Sample Contests Data
  const [sampleContests, setSampleContests] = useState<Contest[]>([
    {
      id: 1,
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
  ]);

  // Handle search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
  }, []);

  // Toggle play/pause for the current track
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const newState = !prev;
      // Update the isPlaying state for the current track
      setSampleTracks(prevTracks => 
        prevTracks.map((track, idx) => 
          idx === currentTrackIndex ? { ...track, isPlaying: newState } : track
        )
      );
      return newState;
    });
  }, [currentTrackIndex]);

  // Handle tab changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Handle track selection
  const handleTrackSelect = useCallback((trackId: number | string) => {
    const trackIndex = sampleTracks.findIndex(track => track.id === trackId);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
      // Update isPlaying state for all tracks
      setSampleTracks(prevTracks => 
        prevTracks.map((track, idx) => ({
          ...track,
          isPlaying: idx === trackIndex
        }))
      );
    }
  }, [sampleTracks]);

  // Handle next track
  const handleNextTrack = useCallback(() => {
    setCurrentTrackIndex(prev => (prev + 1) % sampleTracks.length);
    setIsPlaying(true);
    setSampleTracks(prevTracks => 
      prevTracks.map((track, idx) => ({
        ...track,
        isPlaying: idx === (currentTrackIndex + 1) % sampleTracks.length
      }))
    );
  }, [currentTrackIndex, sampleTracks.length]);

  // Handle previous track
  const handlePreviousTrack = useCallback(() => {
    setCurrentTrackIndex(prev => (prev - 1 + sampleTracks.length) % sampleTracks.length);
    setIsPlaying(true);
    setSampleTracks(prevTracks => 
      prevTracks.map((track, idx) => ({
        ...track,
        isPlaying: idx === (currentTrackIndex - 1 + sampleTracks.length) % sampleTracks.length
      }))
    );
  }, [currentTrackIndex, sampleTracks.length]);

  // Get current track
  const currentTrack = sampleTracks[currentTrackIndex] || null;

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Good Evening</h1>
            <p className="text-[#8B949E] text-sm">Let's find something great to listen to</p>
          </header>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#8B949E]" />
            </div>
            <input
              type="text"
              placeholder="Search for tracks, artists, or playlists"
              className="w-full bg-[#161B22] rounded-lg py-2 pl-10 pr-4 text-sm text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Recently Played Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recently Played</h2>
              <button className="text-sm text-[#58A6FF] hover:underline">See All</button>
            </div>
            <RecentlyPlayed 
              tracks={sampleTracks} 
              onTrackSelect={handleTrackSelect}
              isPlaying={isPlaying}
              currentTrackId={currentTrack?.id}
            />
          </section>
          
          {/* Featured Playlists Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Featured Playlists</h2>
              <button className="text-sm text-[#58A6FF] hover:underline">See All</button>
            </div>
            <FeaturedPlaylists 
              playlists={samplePlaylists}
              onPlaylistSelect={(id) => console.log('Selected playlist:', id)}
            />
          </section>
          
          {/* Active Contests Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Active Contests</h2>
              <button className="text-sm text-[#58A6FF] hover:underline">See All</button>
            </div>
            <ActiveContests 
              contests={sampleContests}
              onContestSelect={(id) => console.log('Selected contest:', id)}
            />
          </section>
        </div>
      </main>
      
      {/* Now Playing Bar */}
      {currentTrack && (
        <NowPlayingBar 
          track={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={handleNextTrack}
          onPrevious={handlePreviousTrack}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default HomeScreen;
