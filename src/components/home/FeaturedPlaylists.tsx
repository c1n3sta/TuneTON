import React from 'react';
import { Play } from 'lucide-react';
import { Playlist } from '../HomeScreen';

interface FeaturedPlaylistsProps {
  playlists: Playlist[];
  onPlaylistSelect: (id: string | number) => void;
}

const FeaturedPlaylists: React.FC<FeaturedPlaylistsProps> = ({
  playlists,
  onPlaylistSelect,
}) => {
  if (!playlists?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map((playlist) => (
        <div 
          key={playlist.id}
          className="group relative bg-[#161B22] rounded-xl overflow-hidden transition-transform hover:scale-105"
          onClick={() => onPlaylistSelect(playlist.id)}
        >
          <div className="relative">
            <img
              src={playlist.cover}
              alt={playlist.title}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-[#58A6FF] bg-opacity-90 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white pl-0.5" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold text-[#E6EDF3] truncate">
              {playlist.title}
            </h3>
            <p className="text-xs text-[#8B949E] mt-1">
              {playlist.tracks} tracks • {playlist.duration}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPlaylists;
