import { Button } from '@/components/ui/button';
import { MoreHorizontal, SkipBack } from 'lucide-react';
import React from 'react';
import type { Track } from '../api/client';
import EnhancedAudioPlayer from '../components/player/EnhancedAudioPlayer';
import type { AudioTrack } from '../types/audio';

interface TrackPageProps {
  track: Track;
  onBack: () => void;
}

const TrackPage: React.FC<TrackPageProps> = ({ track, onBack }) => {
  // Convert API Track to AudioTrack
  const audioTrack: AudioTrack = {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    // Use the audioUrl from the API Track as the source
    source: track.audioUrl,
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

      {/* Audio Player */}
      <div className="flex-1 flex items-center justify-center p-4">
        <EnhancedAudioPlayer track={audioTrack} />
      </div>
    </div>
  );
};

export default TrackPage;