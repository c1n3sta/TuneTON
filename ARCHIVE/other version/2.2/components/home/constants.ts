// Import images
import imgPlaylistCover from "figma:asset/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png";
import imgPlaylistCover1 from "figma:asset/059d630bf1b73c65663230f6fe3660d07bc060b8.png";
import imgPlaylistCover2 from "figma:asset/20bb8fe31b212ec3236e8224dd3efe441043be2f.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import { Radio, Zap, Mic, Headphones } from "lucide-react";

// AI Generated Playlists
export const aiPlaylists = [
  {
    id: "ai-1",
    title: "Your Daily Mix",
    description: "AI curated from your listening",
    cover: imgPlaylistCover,
    trackCount: 30,
    isPersonalized: true,
    aiTag: "Smart Mix"
  },
  {
    id: "ai-2", 
    title: "Lo-Fi Focus",
    description: "Perfect for concentration",
    cover: imgPlaylistCover1,
    trackCount: 25,
    isPersonalized: true,
    aiTag: "AI Mood"
  },
  {
    id: "ai-3",
    title: "Tempo Boost",
    description: "High energy, speed enhanced",
    cover: imgPlaylistCover2,
    trackCount: 18,
    isPersonalized: true,
    aiTag: "AI Effects"
  }
];

// Recently Played with Effects
export const recentlyPlayed = [
  {
    id: "recent-1",
    title: "Starlight Serenade",
    artist: "MelodyMix Artist",
    cover: imgAlbumArt,
    duration: "3:23",
    lastEffect: "Lo-Fi + Rain",
    plays: 847
  },
  {
    id: "recent-2",
    title: "Sunset Drive",
    artist: "Chillwave Collective", 
    cover: imgTrackCover,
    duration: "4:12",
    lastEffect: "Tempo +10%",
    plays: 623
  }
];

// Live Contests
export const liveContests = [
  {
    id: "contest-1",
    title: "Best Lo-Fi Remix",
    description: "Transform any track into lo-fi gold",
    deadline: "2 days left",
    participants: 1247,
    prize: "500 TON",
    difficulty: "Medium",
    type: "remix"
  },
  {
    id: "contest-2",
    title: "Speed Challenge",
    description: "30-second remix creation",
    deadline: "6 hours left",
    participants: 89,
    prize: "100 TON",
    difficulty: "Hard",
    type: "speedrun"
  }
];

// Quick Effects for Preview
export const quickEffects = [
  { id: "lofi", name: "Lo-Fi", icon: Radio, color: "chart-4" },
  { id: "tempo", name: "Tempo+", icon: Zap, color: "chart-1" },
  { id: "vocal", name: "No Vocals", icon: Mic, color: "chart-2" },
  { id: "ambient", name: "Rain", icon: Headphones, color: "chart-3" }
];