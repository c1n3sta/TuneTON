import { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Heart, 
  Plus, 
  Search, 
  Bell,
  User,
  Music,
  TrendingUp,
  Clock,
  Shuffle,
  Repeat,
  MoreHorizontal,
  ChevronRight,
  Star,
  Zap,
  Trophy,
  Coins,
  Headphones,
  Radio,
  Volume2,
  Layers,
  Share2,
  Gift,
  Crown,
  Flame,
  Sparkles,
  Users,
  Mic,
  AudioWaveform,
  Timer,
  Target,
  Award,
  Palette,
  Bot,
  MessageCircle,
  Send,
  UserPlus,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Forward,
  Eye,
  Calendar,
  MapPin,
  Coins as TONCoin,
  ShoppingBag,
  Library,
  Compass,
  Wand2,
  Waves,
  Gem,
  ArrowRight,
  Bolt,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { jamendoAPI, JamendoTrack, getTuneTONRecommendations } from "../utils/jamendo-api";

// Import images
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgPlaylistCover from "figma:asset/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png";
import imgPlaylistCover1 from "figma:asset/059d630bf1b73c65663230f6fe3660d07bc060b8.png";
import imgPlaylistCover2 from "figma:asset/20bb8fe31b212ec3236e8224dd3efe441043be2f.png";
import imgPlaylistCover3 from "figma:asset/a1ad22f09bf6f15ef5bc637a1785d31b1ca3884a.png";
import imgPlaylistCover4 from "figma:asset/08ea158ebabf976cca7bb1f8ec91d0c456a2f915.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";
import imgFeaturedRemixCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgRemixCover from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgRemixerAvatar from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgRemixCover1 from "figma:asset/2445cdb838670e8ea661ef232b16e90503fdec0b.png";
import imgRemixerAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgRemixCover2 from "figma:asset/f6899fe4451eb26d22ac13df75a794b76f152b36.png";
import imgRemixerAvatar2 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";

interface User {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface HomePageProps {
  onNavigate?: (tab: string, page?: string) => void;
  onTrackSelect?: (track: string) => void;
  currentTrack?: string;
  isPlaying?: boolean;
  user?: User | null;
}

export default function HomePage({ 
  onNavigate, 
  onTrackSelect, 
  currentTrack = "Starlight Serenade", 
  isPlaying = false,
  user 
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userStars, setUserStars] = useState(247);
  const [userLevel, setUserLevel] = useState(12);
  const [newPostText, setNewPostText] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  // Jamendo API integration
  const [jamendoTracks, setJamendoTracks] = useState<{
    popular: JamendoTrack[];
    trending: JamendoTrack[];
    lofi: JamendoTrack[];
    remixable: JamendoTrack[];
  }>({
    popular: [],
    trending: [],
    lofi: [],
    remixable: []
  });
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load Jamendo tracks on component mount
  useEffect(() => {
    const loadJamendoContent = async () => {
      try {
        setLoadingTracks(true);
        console.log('HomePage: Loading Jamendo content...');
        
        const recommendations = await getTuneTONRecommendations();
        setJamendoTracks(recommendations);
        
        // Check if we're using real API or mock data
        const isApiWorking = jamendoAPI.isApiAvailable();
        setUsingMockData(!isApiWorking);
        
        console.log('HomePage: Jamendo content loaded', {
          popular: recommendations.popular.length,
          trending: recommendations.trending.length,
          lofi: recommendations.lofi.length,
          remixable: recommendations.remixable.length,
          usingMockData: !isApiWorking
        });
      } catch (error) {
        console.error('HomePage: Failed to load Jamendo content:', error);
        setUsingMockData(true);
      } finally {
        setLoadingTracks(false);
      }
    };

    loadJamendoContent();
  }, []);

  // Featured Contest Data
  const featuredContest = {
    id: "featured-1",
    title: "Epic Lo-Fi Championship",
    subtitle: "Transform ANY track into chill perfection",
    description: "Show off your lo-fi skills and compete for the biggest prize of the month!",
    prize: "1000 TON",
    participants: 2847,
    deadline: "3 days, 14 hours left",
    difficulty: "All Levels",
    tags: ["Lo-Fi", "Chill", "Championship"],
    backgroundImage: imgFeaturedRemixCover,
    isHot: true,
    completionRate: 67
  };

  // AI Generated Playlists (now with Jamendo integration)
  const aiPlaylists = [
    {
      id: "ai-1",
      title: "Your Daily Mix",
      description: "AI curated from your listening",
      cover: imgPlaylistCover,
      trackCount: jamendoTracks.popular.length,
      isPersonalized: true,
      aiTag: "Smart Mix",
      tracks: jamendoTracks.popular.slice(0, 30)
    },
    {
      id: "ai-2", 
      title: "Lo-Fi Focus",
      description: "Perfect for concentration",
      cover: imgPlaylistCover1,
      trackCount: jamendoTracks.lofi.length,
      isPersonalized: true,
      aiTag: "AI Mood",
      tracks: jamendoTracks.lofi.slice(0, 25)
    },
    {
      id: "ai-3",
      title: "Remix Ready",
      description: "High energy tracks for remixing",
      cover: imgPlaylistCover2,
      trackCount: jamendoTracks.remixable.length,
      isPersonalized: true,
      aiTag: "AI Effects",
      tracks: jamendoTracks.remixable.slice(0, 18)
    }
  ];

  // Live Contests
  const liveContests = [
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

  // Community Remixes
  const communityRemixes = [
    {
      id: "remix-1",
      title: "Midnight Groove (Lo-Fi Edit)",
      artist: "BeatsCollective",
      remixer: "ChillVibes_99",
      remixerAvatar: imgRemixerAvatar,
      cover: imgRemixCover,
      likes: 1247,
      duration: "3:21",
      effects: ["Lo-Fi", "Vinyl", "Rain"],
      isHot: true
    },
    {
      id: "remix-2", 
      title: "Electric Dreams (Speed+)",
      artist: "SynthMaster",
      remixer: "FastTrackPro",
      remixerAvatar: imgRemixerAvatar1,
      cover: imgRemixCover1,
      likes: 892,
      duration: "2:45",
      effects: ["Tempo+", "Reverb"],
      isHot: false
    },
    {
      id: "remix-3",
      title: "Ocean Waves (Ambient Mix)",
      artist: "NatureSounds",
      remixer: "AmbientLover",
      remixerAvatar: imgRemixerAvatar2,
      cover: imgRemixCover2,
      likes: 634,
      duration: "4:12",
      effects: ["Ambient", "Nature", "Echo"],
      isHot: false
    }
  ];

  // Convert Jamendo tracks to trending format
  const trendingTracks = jamendoTracks.trending.slice(0, 3).map((track, index) => ({
    id: track.id,
    title: track.name,
    artist: track.artist_name,
    cover: track.image || track.album_image || imgFeaturedRemixCover,
    plays: Math.floor(Math.random() * 20000) + 5000, // Simulated play count
    rank: index + 1,
    change: index === 0 ? "+3" : index === 1 ? "-1" : "+2",
    jamendoTrack: track
  }));

  // Social Feed Posts
  const socialPosts = [
    {
      id: "post-1",
      user: "MixMaster_Alex",
      avatar: imgRemixerAvatar,
      type: "remix",
      content: "Just dropped a sick lo-fi version of 'Starlight Serenade'! 🎵✨",
      track: "Starlight Serenade (Lo-Fi Mix)",
      trackCover: imgAlbumArt,
      likes: 247,
      comments: 18,
      shares: 34,
      timestamp: "2h ago"
    },
    {
      id: "post-2",
      user: "ChillVibes_99",
      avatar: imgRemixerAvatar1,
      type: "achievement", 
      content: "Reached 1000 plays on my ambient remix! Thank you all! 🙏",
      likes: 156,
      comments: 23,
      shares: 12,
      timestamp: "5h ago"
    }
  ];

  const handlePlayTrack = (track: string | JamendoTrack) => {
    const trackName = typeof track === 'string' ? track : track.name;
    if (onTrackSelect) {
      onTrackSelect(trackName);
    }
    if (onNavigate) {
      onNavigate("Player", "player");
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const QuickAccessButton = ({ type, onClick }: { type: 'discover' | 'library' | 'nft' | 'ai-studio', onClick: () => void }) => {
    switch (type) {
      case 'discover':
        return (
          <div
            className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
            onClick={onClick}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
            
            {/* Animated waves background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
              <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
              <Waves className="absolute top-2 right-2 w-8 h-8 text-white/30 animate-pulse" />
            </div>
            
            <div className="relative z-10 p-5 text-left">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300">
                  <Compass className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">Hot</span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-white drop-shadow-lg">Discover</h3>
              <p className="text-sm text-white/90 drop-shadow-md">Trending music</p>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </div>
        );

      case 'library':
        return (
          <div
            className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            onClick={onClick}
          >
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            <div className="relative z-10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 backdrop-blur-sm text-purple-200 flex items-center justify-center border border-purple-400/40 shadow-lg group-hover:bg-purple-500/30 transition-all duration-300">
                  <Library className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-purple-400/60 rounded-full mt-1"></div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-white mb-1">Library</h3>
              <p className="text-sm text-purple-200/80">Your collection</p>
              
              {/* Mini collection preview */}
              <div className="flex -space-x-2 mt-3">
                <div className="w-5 h-5 bg-purple-400 rounded border-2 border-slate-900"></div>
                <div className="w-5 h-5 bg-pink-400 rounded border-2 border-slate-900"></div>
                <div className="w-5 h-5 bg-blue-400 rounded border-2 border-slate-900"></div>
                <div className="w-5 h-5 bg-purple-300 rounded border-2 border-slate-900 flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-900">+</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        );

      case 'nft':
        return (
          <div
            className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-lg hover:shadow-cyan-500/30 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            onClick={onClick}
          >
            {/* Hexagon pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-2 w-6 h-6 border border-white/30 transform rotate-45"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border border-white/20 transform rotate-45 delay-150"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/20 transform rotate-45 -translate-x-1/2 -translate-y-1/2 animate-spin delay-300" style={{ animationDuration: '8s' }}></div>
            </div>
            
            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm text-white flex items-center justify-center border border-white/40 shadow-lg group-hover:bg-white/35 transition-all duration-300 relative">
                  <ShoppingBag className="w-7 h-7" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Gem className="w-2 h-2 text-yellow-900" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white/90 uppercase tracking-wide">NFT</div>
                  <div className="text-xs text-white/70">Shop</div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-white mb-1">NFT Shop</h3>
              <p className="text-sm text-white/90">Audio NFTs</p>
              
              {/* Price indicator */}
              <div className="flex items-center gap-1 mt-3 bg-white/20 rounded-full px-3 py-1 w-fit">
                <TONCoin className="w-3 h-3 text-yellow-300" />
                <span className="text-xs font-medium text-white">TON</span>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-4 right-8 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
            <div className="absolute bottom-8 left-6 w-1 h-1 bg-white/40 rounded-full animate-ping delay-700"></div>
          </div>
        );

      case 'ai-studio':
        return (
          <div
            className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 shadow-lg hover:shadow-fuchsia-500/40 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            onClick={onClick}
          >
            {/* Circuit pattern */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-3 left-3 w-8 h-1 bg-white/40"></div>
              <div className="absolute top-3 left-7 w-1 h-4 bg-white/40"></div>
              <div className="absolute top-7 left-7 w-6 h-1 bg-white/40"></div>
              <div className="absolute bottom-6 right-4 w-5 h-1 bg-white/30"></div>
              <div className="absolute bottom-6 right-6 w-1 h-3 bg-white/30"></div>
            </div>
            
            {/* Animated AI brain waves */}
            <div className="absolute top-2 right-2">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-white/40 animate-pulse"></div>
                <div className="w-1 h-2 bg-white/40 animate-pulse delay-100"></div>
                <div className="w-1 h-4 bg-white/40 animate-pulse delay-200"></div>
                <div className="w-1 h-2 bg-white/40 animate-pulse delay-300"></div>
                <div className="w-1 h-3 bg-white/40 animate-pulse delay-400"></div>
              </div>
            </div>
            
            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-white/25 backdrop-blur-sm text-white flex items-center justify-center border border-white/40 shadow-lg group-hover:bg-white/35 transition-all duration-300 relative">
                  <Bot className="w-7 h-7" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                  <Wand2 className="w-3 h-3 text-white animate-pulse" />
                  <span className="text-xs text-white font-medium">AI</span>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-white mb-1">AI Studio</h3>
              <p className="text-sm text-white/90">Create remixes</p>
              
              {/* Progress bar */}
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-300 to-pink-300 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            {/* Magical sparkles */}
            <div className="absolute top-6 left-12 w-2 h-2 text-white/60">
              <Sparkles className="w-full h-full animate-ping" />
            </div>
            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 text-white/40">
              <Sparkles className="w-full h-full animate-ping delay-500" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Original Recently Played Component (from Figma import)
  const RecentlyPlayedSection = () => {
    // Use first popular track from Jamendo or fallback
    const recentTrack = jamendoTracks.popular[0] || {
      name: "Starlight Serenade",
      artist_name: "MelodyMix Artist",
      image: imgAlbumArt
    };

    return (
      <div className="px-6 pt-2 space-y-4">
        {/* Header with title and search button */}
        <div className="flex items-center justify-between w-full">
          <div className="w-[175px]">
            <h2 className="font-semibold text-lg text-foreground">Recently Played</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="w-5 h-5">
              <Search className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Single track card */}
        <div 
          className="bg-[#093067] rounded-lg w-full cursor-pointer group transition-all duration-300 hover:shadow-lg"
          onClick={() => handlePlayTrack(recentTrack)}
        >
          <div className="flex items-center px-4 py-3 gap-[15px]">
            {/* Album Art */}
            <div 
              className="w-12 h-12 rounded-lg bg-cover bg-center bg-[#484f58] shrink-0 group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url('${recentTrack.image || imgAlbumArt}')` }}
            />
            
            {/* Track Info */}
            <div className="flex-1 min-w-0 w-[164px]">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-[#c9d1d9] truncate">{recentTrack.name}</h3>
                <p className="font-semibold text-xs text-[#8b949e] truncate">{recentTrack.artist_name}</p>
              </div>
            </div>

            {/* Audio Visualizer and Play Button */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Animated Audio Visualizer */}
              <div className="bg-[#484f58] rounded w-10 h-[30px] flex items-end justify-center gap-[3.4px] px-[5.69px] py-0 overflow-hidden">
                <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-3 animate-pulse"></div>
                <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[21px] animate-pulse delay-100"></div>
                <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[16.5px] animate-pulse delay-200"></div>
                <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[25.5px] animate-pulse delay-300"></div>
                <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[18px] animate-pulse delay-400"></div>
              </div>

              {/* Play Button */}
              <Button variant="ghost" size="icon" className="w-6 h-6 text-[#FF22FB] hover:text-[#FF22FB]/80">
                {(currentTrack === recentTrack.name || currentTrack === "Starlight Serenade") && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Featured Contest Banner Component
  const FeaturedContestBanner = () => {
    return (
      <div className="px-6">
        <div 
          className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
          onClick={() => onNavigate?.("Contests", "contest-detail")}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${featuredContest.backgroundImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-600/80 to-orange-500/90 backdrop-blur-[1px]" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-8 right-12 w-6 h-6 bg-white/10 rounded-full animate-bounce delay-700"></div>
            <div className="absolute bottom-12 left-8 w-4 h-4 bg-white/10 rounded-full animate-bounce delay-300"></div>
            
            {/* Floating music notes */}
            <div className="absolute top-6 left-1/3 opacity-20">
              <Music className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute bottom-8 right-1/4 opacity-15">
              <AudioWaveform className="w-6 h-6 text-white animate-pulse delay-200" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Header with Badges */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500 text-black font-bold px-3 py-1 animate-pulse">
                  <Crown className="w-3 h-3 mr-1" />
                  FEATURED
                </Badge>
                {featuredContest.isHot && (
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1 animate-bounce">
                    <Flame className="w-3 h-3 mr-1" />
                    HOT
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-300 mb-1">
                  <TONCoin className="w-4 h-4" />
                  <span className="font-bold text-xl">{featuredContest.prize}</span>
                </div>
                <p className="text-xs text-white/80">Prize Pool</p>
              </div>
            </div>

            {/* Title and Description */}
            <div className="mb-4">
              <h2 className="font-bold text-2xl text-white mb-2 drop-shadow-lg">
                {featuredContest.title}
              </h2>
              <p className="text-lg text-white/90 font-medium mb-1 drop-shadow-md">
                {featuredContest.subtitle}
              </p>
              <p className="text-sm text-white/80 drop-shadow-sm">
                {featuredContest.description}
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{featuredContest.participants.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>{featuredContest.deadline}</span>
                </div>
                <Badge variant="outline" className="border-white/40 text-white bg-white/10">
                  {featuredContest.difficulty}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-white/90 mb-2">
                <span>Contest Progress</span>
                <span>{featuredContest.completionRate}% Complete</span>
              </div>
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
                  style={{ width: `${featuredContest.completionRate}%` }}
                />
              </div>
            </div>

            {/* Tags and Action */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {featuredContest.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Button 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.("Contests", "contest-detail");
                }}
              >
                Join Contest
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Hover Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
          
          {/* Header */}
          <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <Avatar 
                  className="w-10 h-10 border-2 border-primary/20 cursor-pointer"
                  onClick={() => onNavigate?.("Profile", "profile")}
                >
                  <AvatarImage src={user?.photo_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.first_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-lg">{getTimeGreeting()}</h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{user?.first_name || 'User'}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-chart-4 fill-current" />
                      <span className="text-xs text-chart-4 font-medium">{userStars}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs h-4">
                      Lv {userLevel}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8"
                  onClick={() => onNavigate?.("Home", "search")}
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Recently Played Section - Original Figma Design */}
          <RecentlyPlayedSection />

          {/* Content */}
          <div className="px-6 pb-20 space-y-8 mt-6">
            
            {/* Quick Access - Unique Designs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Quick Access</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <QuickAccessButton 
                  type="discover" 
                  onClick={() => onNavigate?.("Home", "discover")} 
                />
                <QuickAccessButton 
                  type="library" 
                  onClick={() => onNavigate?.("Library", "library")} 
                />
                <QuickAccessButton 
                  type="nft" 
                  onClick={() => onNavigate?.("NFT", "nft-marketplace")} 
                />
                <QuickAccessButton 
                  type="ai-studio" 
                  onClick={() => onNavigate?.("Home", "ai-studio")} 
                />
              </div>
            </div>

            {/* AI Generated Playlists */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Playlists</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-chart-4 text-primary-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                  {usingMockData && (
                    <Badge variant="outline" className="text-xs">
                      Demo
                    </Badge>
                  )}
                </div>
              </div>
              {loadingTracks ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading music from Jamendo...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {aiPlaylists.map((playlist) => (
                    <Card 
                      key={playlist.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => onNavigate?.("Home", "playlist-detail")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                            style={{ backgroundImage: `url('${playlist.cover}')` }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{playlist.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {playlist.aiTag}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {playlist.description} • {playlist.trackCount} tracks
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Contest Banner */}
            <div className="space-y-4">
              <FeaturedContestBanner />
            </div>

            {/* Live Contests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Live Contests</h2>
                <Badge className="bg-destructive text-primary-foreground animate-pulse">
                  <Flame className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="space-y-3">
                {liveContests.map((contest) => (
                  <Card 
                    key={contest.id} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors border-chart-1/20"
                    onClick={() => onNavigate?.("Contests", "contest-detail")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-chart-4" />
                          <h3 className="font-medium">{contest.title}</h3>
                        </div>
                        <Badge className="bg-chart-4 text-primary-foreground text-xs">
                          {contest.prize}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{contest.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {contest.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {contest.participants} participants
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {contest.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Community Remixes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Community Remixes</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {communityRemixes.map((remix) => (
                  <Card 
                    key={remix.id} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onNavigate?.("Home", "remix-detail")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                          style={{ backgroundImage: `url('${remix.cover}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{remix.title}</h3>
                            {remix.isHot && (
                              <Badge className="bg-chart-1 text-primary-foreground text-xs">
                                🔥 Hot
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{remix.artist}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={remix.remixerAvatar} />
                            <AvatarFallback className="text-xs">{remix.remixer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">by {remix.remixer}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {remix.likes}
                          </span>
                          <span>{remix.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mt-2">
                        {remix.effects.map((effect, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending Now - Now with Jamendo tracks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trending Now</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-chart-1 text-primary-foreground">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                  {usingMockData && (
                    <Badge variant="outline" className="text-xs">
                      Demo
                    </Badge>
                  )}
                </div>
              </div>
              {loadingTracks ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading trending tracks from Jamendo...
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingTracks.map((track, index) => (
                    <Card 
                      key={track.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handlePlayTrack(track.jamendoTrack || track.title)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            {track.rank}
                          </div>
                          <div 
                            className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                            style={{ backgroundImage: `url('${track.cover}')` }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{track.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-medium ${track.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {track.change}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {track.plays.toLocaleString()} plays
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Social Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Community Feed</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary"
                  onClick={() => setShowCreatePost(!showCreatePost)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create
                </Button>
              </div>

              {/* Create Post */}
              {showCreatePost && (
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.photo_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user?.first_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Textarea 
                        placeholder="Share your latest remix or music discovery..."
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Music className="w-4 h-4 mr-1" />
                          Add Track
                        </Button>
                        <Button variant="outline" size="sm">
                          <Zap className="w-4 h-4 mr-1" />
                          Effect
                        </Button>
                      </div>
                      <Button size="sm" disabled={!newPostText.trim()}>
                        <Send className="w-4 h-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Posts */}
              <div className="space-y-4">
                {socialPosts.map((post) => (
                  <Card key={post.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback className="text-sm">{post.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{post.user}</span>
                            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                          </div>
                          <p className="text-sm">{post.content}</p>
                        </div>
                      </div>

                      {post.track && (
                        <Card className="mb-3 bg-accent/30">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg bg-cover bg-center border border-border"
                                style={{ backgroundImage: `url('${post.trackCover}')` }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{post.track}</h4>
                                <p className="text-xs text-muted-foreground">Remix</p>
                              </div>
                              <Button variant="ghost" size="icon" className="w-6 h-6">
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button 
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                            onClick={() => setActiveCommentSection(activeCommentSection === post.id ? null : post.id)}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span>{post.shares}</span>
                          </button>
                        </div>
                        <button className="hover:text-primary transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Comments Section */}
                      {activeCommentSection === post.id && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex gap-2 mb-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user?.photo_url} />
                              <AvatarFallback className="text-xs">{user?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <Input 
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="text-sm"
                            />
                            <Button size="sm" variant="ghost" disabled={!newComment.trim()}>
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}