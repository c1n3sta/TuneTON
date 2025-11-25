import React from 'react';
import { Play, Pause } from 'lucide-react';
// Import Track interface from home types
import type { Track } from '../../types/home';

interface RecentlyPlayedProps {
  tracks: Track[];
  onTrackSelect: (id: string | number) => void;
  isPlaying: boolean;
  currentTrackId?: string | number;
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({
  tracks,
  onTrackSelect,
  isPlaying,
  currentTrackId,
}) => {
  return (
    <div className="space-y-3">
      {tracks.map((track) => {
        const isCurrentTrack = track.id === currentTrackId;
        const isTrackPlaying = isCurrentTrack && isPlaying;

        return (
          <div
            key={track.id}
            className="bg-[#161B22] rounded-xl p-3 flex items-center justify-between hover:bg-[#1F2937] transition-colors cursor-pointer"
            onClick={() => onTrackSelect(track.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  {isTrackPlaying ? (
                    <Pause className="text-white w-5 h-5" />
                  ) : (
                    <Play className="text-white w-5 h-5 pl-0.5" />
                  )}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-medium ${isCurrentTrack ? 'text-[#58A6FF]' : 'text-[#E6EDF3]'}`}>
                  {track.title}
                </h3>
                <p className="text-xs text-[#8B949E]">{track.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-[#8B949E]">{track.duration}</span>
              <button 
                className="text-[#8B949E] hover:text-[#58A6FF] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect(track.id);
                }}
              >
                {isTrackPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 pl-0.5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentlyPlayed;