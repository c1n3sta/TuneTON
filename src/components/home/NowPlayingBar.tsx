import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Share2, MoreHorizontal } from 'lucide-react';
import type { Track } from '../HomeScreen';
import './NowPlayingBar.css';

interface NowPlayingBarProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  if (!track) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-[#161B22] border-t border-[#30363D] z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={track.cover}
              alt={track.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[#E6EDF3] truncate">{track.title}</h3>
              <p className="text-xs text-[#8B949E] truncate">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button 
              className="text-[#8B949E] hover:text-[#58A6FF] transition-colors"
              onClick={onPrevious}
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              className="bg-[#58A6FF] text-white p-2 rounded-full hover:bg-[#4A8AD4] transition-colors"
              onClick={onPlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 pl-0.5" />
              )}
            </button>
            
            <button 
              className="text-[#8B949E] hover:text-[#58A6FF] transition-colors"
              onClick={onNext}
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <button className="text-[#8B949E] hover:text-[#58A6FF] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-[#8B949E] hover:text-[#58A6FF] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="text-[#8B949E] hover:text-[#58A6FF] transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="h-1 bg-[#30363D] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#58A6FF] rounded-full" 
              style={{ width: '30%' }} // This should be dynamic based on actual progress
            />
          </div>
          <div className="flex justify-between text-xs text-[#8B949E] mt-1">
            <span>1:23</span>
            <span>-2:45</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBar;