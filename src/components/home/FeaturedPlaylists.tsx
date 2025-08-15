import React from 'react';
import { Play } from 'lucide-react';
import { Playlist } from '../HomeScreen';

type FeaturedPlaylistsProps = {
  playlists: Playlist[];
};

const FeaturedPlaylists: React.FC<FeaturedPlaylistsProps> = ({ playlists }) => {
  if (!playlists?.length) return null;

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Featured Playlists</h2>
        <button className="text-sm font-medium text-primary">See All</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="relative group">
            <div className="rounded-xl overflow-hidden aspect-square bg-muted">
              <img 
                src={playlist.cover} 
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
                  aria-label={`Play ${playlist.title}`}
                >
                  <Play size={18} className="ml-0.5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-semibold text-sm text-white truncate">{playlist.title}</h3>
                <p className="text-xs text-white/80 truncate">{playlist.tracksCount} tracks • {playlist.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPlaylists;
