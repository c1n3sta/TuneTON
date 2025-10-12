import React, { useState } from 'react';
import { Search, Plus, Heart, Clock, Music, User, MoreHorizontal } from 'lucide-react';

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  tracks: number;
  duration: string;
  isLiked: boolean;
  lastPlayed?: string;
}

const PlaylistsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample playlists data
  const playlists: Playlist[] = [
    {
      id: '1',
      title: 'My Favorites',
      description: 'My most loved tracks',
      cover: 'http://localhost:3845/assets/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png',
      tracks: 24,
      duration: '1h 32m',
      isLiked: true,
      lastPlayed: '2 hours ago'
    },
    {
      id: '2',
      title: 'Workout Mix',
      description: 'High energy tracks for exercise',
      cover: 'http://localhost:3845/assets/059d630bf1b73c65663230f6fe3660d07bc060b8.png',
      tracks: 18,
      duration: '58m',
      isLiked: true
    },
    {
      id: '3',
      title: 'Chill Vibes',
      description: 'Relaxing beats for your day',
      cover: 'http://localhost:3845/assets/20bb8fe31b212ec3236e8224dd3efe441043be2f.png',
      tracks: 15,
      duration: '45m',
      isLiked: false
    },
    {
      id: '4',
      title: 'Focus Beats',
      description: 'Concentration music',
      cover: 'http://localhost:3845/assets/a1ad22f09bf6f15ef5bc637a1785d31b1ca3884a.png',
      tracks: 12,
      duration: '38m',
      isLiked: false,
      lastPlayed: '1 day ago'
    }
  ];

  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          playlist.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'favorites') {
      return matchesSearch && playlist.isLiked;
    }
    
    return matchesSearch;
  });

  const handleCreatePlaylist = () => {
    console.log('Create new playlist');
  };

  const toggleLike = (id: string) => {
    console.log('Toggle like for playlist:', id);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-[#30363D]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Playlists</h1>
          <button 
            onClick={handleCreatePlaylist}
            className="bg-[#1F6FEB] hover:bg-[#1959c0] rounded-full p-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#8B949E]" />
          </div>
          <input
            type="text"
            placeholder="Search playlists"
            className="w-full bg-[#161B22] rounded-lg py-2 pl-10 pr-4 text-sm text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#58A6FF] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'all' 
                ? 'bg-[#1F6FEB] text-white' 
                : 'bg-[#161B22] text-[#8B949E] hover:bg-[#21262D]'
            }`}
          >
            All Playlists
          </button>
          <button
            onClick={() => setActiveFilter('favorites')}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center ${
              activeFilter === 'favorites' 
                ? 'bg-[#1F6FEB] text-white' 
                : 'bg-[#161B22] text-[#8B949E] hover:bg-[#21262D]'
            }`}
          >
            <Heart className="w-4 h-4 mr-1" />
            Favorites
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center ${
              activeFilter === 'recent' 
                ? 'bg-[#1F6FEB] text-white' 
                : 'bg-[#161B22] text-[#8B949E] hover:bg-[#21262D]'
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            Recent
          </button>
        </div>
      </header>
      
      {/* Playlists Grid */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {filteredPlaylists.map((playlist) => (
            <div 
              key={playlist.id}
              className="bg-[#161B22] rounded-lg overflow-hidden hover:bg-[#21262D] transition-colors cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={playlist.cover} 
                  alt={playlist.title}
                  className="w-full aspect-square object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(playlist.id);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                >
                  <Heart 
                    className={`w-5 h-5 ${playlist.isLiked ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-white'}`} 
                  />
                </button>
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="font-semibold text-white truncate">{playlist.title}</h3>
                  <p className="text-xs text-[#8B949E] truncate">{playlist.tracks} tracks</p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-[#8B949E] line-clamp-2">{playlist.description}</p>
                {playlist.lastPlayed && (
                  <div className="flex items-center mt-2 text-xs text-[#8B949E]">
                    <Clock className="w-3 h-3 mr-1" />
                    {playlist.lastPlayed}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlaylistsPage;