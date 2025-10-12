import React, { useState } from 'react';
import type { Track } from '../api/client';
// import type { AudioTrack } from '../types/audio';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Heart, MoreHorizontal, Play, SkipBack, SkipForward } from 'lucide-react';

interface TrackPageProps {
  track: Track;
  onBack: () => void;
}

const TrackPage: React.FC<TrackPageProps> = ({ track, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0] || 0);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] || 0);
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <SkipBack className="w-5 h-5" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="font-semibold truncate">{track.title}</h1>
          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          <div className="w-64 h-64 rounded-xl bg-gray-200 flex items-center justify-center shadow-2xl">
            <span className="text-gray-500">No Image</span>
          </div>
          <Button 
            size="icon" 
            className="absolute bottom-4 right-4 rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            ) : (
              <Play className="w-5 h-5 text-white fill-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{formatTime(progress * track.duration / 100)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
        <Slider 
          value={[progress]} 
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 p-6">
        <Button variant="ghost" size="icon">
          <SkipBack className="w-6 h-6" />
        </Button>
        <Button 
          size="icon" 
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          ) : (
            <Play className="w-5 h-5 text-white fill-white" />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-6 pb-6">
        <Button variant="ghost" size="icon">
          <Heart className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">0%</span>
          <Slider 
            value={[volume]} 
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;