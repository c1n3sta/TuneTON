import { useState } from "react";
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Play, 
  Heart, 
  Share, 
  Download,
  Shuffle,
  Repeat,
  PlusCircle,
  Search,
  Filter
} from "lucide-react";
import svgPaths from "../imports/svg-68u3b9ml9g";
import BottomNavigation from "./BottomNavigation";

// Import playlist and track images
import imgPlaylistCover from "figma:asset/51373d9f469252b86a1881c263fe7c0b4c4b29dd.png";
import imgTrackCover from "figma:asset/a20d7e73b1a48ae7542ebb6527d29778a9c9c43c.png";
import imgTrackCover1 from "figma:asset/ba59d117cf439a0f337c59b93c7ca4f92a996ce3.png";
import imgTrackCover2 from "figma:asset/6b63081e5506006582a1534e10dee0d686d4580d.png";
import imgTrackCover3 from "figma:asset/14ec33fc1576a866a71df617f063a310c06f9706.png";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

interface PlaylistDetailProps {
  onBack?: () => void;
  onPlayTrack?: (trackName: string) => void;
  onNavigate?: (tab: string) => void;
  activeTab?: string;
}

export default function PlaylistDetail({ onBack, onPlayTrack, onNavigate, activeTab = "Playlist" }: PlaylistDetailProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const playlist = {
    id: "chill-vibes",
    name: "Chill Vibes",
    author: "Alex Johnson",
    trackCount: 15,
    duration: "1 hr 20 min",
    cover: imgPlaylistCover
  };

  const tracks: Track[] = [
    {
      id: "1",
      title: "Sunset Breeze",
      artist: "Dreamy Sounds",
      duration: "3:45",
      cover: imgTrackCover
    },
    {
      id: "2", 
      title: "Mellow Morning",
      artist: "Acoustic Flow",
      duration: "4:10",
      cover: imgTrackCover1
    },
    {
      id: "3",
      title: "Quiet Reflection", 
      artist: "Ambient Echoes",
      duration: "5:02",
      cover: imgTrackCover2
    },
    {
      id: "4",
      title: "Gentle Rain",
      artist: "Nature's Harmony", 
      duration: "3:18",
      cover: imgTrackCover3
    },
    {
      id: "5",
      title: "Cloud Nine",
      artist: "Skyline Beats",
      duration: "4:30",
      cover: "" // This one doesn't have a cover in the design
    }
  ];

  const handlePlayTrack = (track: Track) => {
    setCurrentlyPlaying(track.id);
    onPlayTrack?.(track.title);
  };

  const handlePlayPlaylist = () => {
    if (tracks.length > 0) {
      handlePlayTrack(tracks[0]);
    }
  };

  const handleShufflePlaylist = () => {
    if (tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      handlePlayTrack(randomTrack);
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white">
      <div className="flex justify-center">
        <div className="w-[400px] bg-[#161b22] rounded-2xl min-h-screen relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={onBack}
              className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">Playlist</h2>
            <button className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Playlist Cover and Info */}
          <div className="flex flex-col items-center gap-4 px-6 mb-8">
            <div 
              className="w-[180px] h-[180px] rounded-xl bg-cover bg-center bg-[#484f58]"
              style={{ backgroundImage: `url('${playlist.cover}')` }}
            />
            <div className="text-center">
              <h1 className="text-[20px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-1">
                {playlist.name}
              </h1>
              <p className="text-[14px] text-[#8b949e] font-['Montserrat']">
                By {playlist.author} • {playlist.trackCount} tracks • {playlist.duration}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 px-6 mb-8">
            <button
              onClick={handlePlayPlaylist}
              className="bg-[#ff22fb] flex items-center justify-center gap-2 px-6 py-3 rounded-[7px] flex-1 hover:bg-[#e91e63] transition-colors"
            >
              <Play className="w-5 h-5 text-white" fill="white" />
              <span className="text-[14px] font-semibold text-white font-['Montserrat']">Play</span>
            </button>
            <button
              onClick={handleShufflePlaylist}
              className="bg-[#ff4400] flex items-center justify-center gap-2 px-6 py-3 rounded-[7px] flex-1 hover:bg-[#e63900] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path
                  d={svgPaths.pf0d4b00}
                  stroke="#FF22FB"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.66667"
                />
                <path
                  d={svgPaths.p10e17d00}
                  stroke="#FF22FB"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.66667"
                />
              </svg>
              <span className="text-[14px] font-semibold text-[#dffcf8] font-['Montserrat']">Shuffle</span>
            </button>
          </div>

          {/* Track List */}
          <div className="px-6 space-y-3 pb-32">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className="bg-[#161b22] rounded-lg p-3 w-full hover:bg-[#21262d] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded bg-cover bg-center bg-[#484f58] flex-shrink-0"
                    style={{ 
                      backgroundImage: track.cover ? `url('${track.cover}')` : 'none'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] text-left truncate">
                      {track.title}
                    </h3>
                    <p className="text-[12px] text-[#8b949e] font-['Montserrat'] text-left truncate">
                      {track.artist}
                    </p>
                  </div>
                  <div className="text-[14px] text-[#8b949e] font-['Montserrat'] flex-shrink-0">
                    {track.duration}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab="Playlist" onNavigate={onNavigate || (() => {})} />
        </div>
      </div>
    </div>
  );
}