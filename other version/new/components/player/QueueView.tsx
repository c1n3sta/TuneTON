import { ChevronDown, MoreHorizontal, WifiOff } from "lucide-react";
import { Badge } from "../ui/badge";
import BottomNavigation from "../BottomNavigation";
import { Track, formatTime } from "./utils";
import { JamendoTrack } from "../../utils/jamendo-api";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";

interface QueueViewProps {
  track: Track;
  queueTracks: JamendoTrack[];
  usingMockData: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export default function QueueView({ 
  track, 
  queueTracks, 
  usingMockData, 
  onClose, 
  onNavigate 
}: QueueViewProps) {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
          {/* Queue Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <h2 className="font-medium">Playing Queue</h2>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-32">
            {/* Currently Playing */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Now Playing</h3>
                {usingMockData && (
                  <Badge variant="outline" className="text-xs">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Demo Mode
                  </Badge>
                )}
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl bg-cover bg-center border border-border"
                    style={{ backgroundImage: `url('${track.cover}')` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{track.title}</h3>
                    <p className="text-muted-foreground truncate">{track.artist}</p>
                    <p className="text-muted-foreground text-sm truncate">{track.album}</p>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {track.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Up Next */}
            <div>
              <h3 className="mb-4">Up Next ({queueTracks.length})</h3>
              <div className="space-y-3">
                {queueTracks.slice(0, 10).map((queueTrack, index) => (
                  <div key={queueTrack.id} className="bg-card rounded-xl p-3 hover:bg-accent transition-colors cursor-pointer border border-border">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground w-6 flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div 
                        className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                        style={{ backgroundImage: `url('${queueTrack.image || queueTrack.album_image || imgAlbumArt}')` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{queueTrack.name}</h4>
                        <p className="text-muted-foreground text-sm truncate">{queueTrack.artist_name}</p>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {formatTime(queueTrack.duration)}
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab="Player" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}