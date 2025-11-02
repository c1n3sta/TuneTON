import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  MessageCircle, 
  Share, 
  Download,
  PlusCircle,
  Star,
  Send,
  MoreHorizontal,
  Smile,
  Mic,
  X,
  Clock,
  Volume2
} from "lucide-react";
import svgPaths from "../imports/svg-v3dj02t4hj";
import BottomNavigation from "./BottomNavigation";

// Import images from the Figma design
import imgRemixCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgUserAvatar from "figma:asset/2c1ea409c4a8bfeb11753d30276fdd21b9e259ae.png";
import imgUserAvatar1 from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgUserAvatar2 from "figma:asset/fe77acbd3c2d9b2551ab121351073eed5eec763a.png";
import imgUserAvatar3 from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgUserAvatar4 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgTrackCover from "figma:asset/063bcbc0dfe8da3f7c3395961e76884ea1607364.png";
import imgTrackCover1 from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgUserAvatar5 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";

interface RemixDetailProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onOpenAIStudio: () => void;
  remixId?: string;
}

interface TimeComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
  timestamp: number; // in seconds
  timestampDisplay: string;
  likes: number;
  isCreator?: boolean;
  replies?: TimeComment[];
  x: number; // position percentage on timeline
}

export default function RemixDetail({ onBack, onNavigate, onOpenAIStudio, remixId }: RemixDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(183); // 3:03
  const [isLiked, setIsLiked] = useState(false);
  const [starCount, setStarCount] = useState(250);
  const [likeCount, setLikeCount] = useState(1200);
  const [isStarred, setIsStarred] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentTime, setCommentTime] = useState("0:00");
  const [activePopupComment, setActivePopupComment] = useState<string | null>(null);
  const [hoveredTimelinePosition, setHoveredTimelinePosition] = useState<number | null>(null);

  // Mock remix data - in a real app this would come from props or API
  const remixData = {
    id: remixId || "remix-1",
    title: "Galactic Groove (Remix)",
    originalArtist: "StarDust",
    remixer: "DJ Echo",
    plays: "35.8K",
    comments: 89,
    cover: imgRemixCover,
    tags: ["ELECTRONIC", "UPLIFTING"],
    releaseDate: "2024-07-20",
    genre: "Electronic, House",
    bpm: 128,
    key: "C Minor",
    blockchain: {
      edition: "#001",
      nftOwnership: true,
    },
    stats: {
      plays: "35.8K",
      likes: "1.2K",
      starsGifted: "250",
      remixes: "5"
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };
  
  const toggleStar = () => {
    setIsStarred(!isStarred);
    setStarCount(prev => isStarred ? prev - 1 : prev + 1);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // In a real app, this would submit the comment
      console.log("Comment submitted:", { text: commentText, time: commentTime });
      setCommentText("");
      setCommentTime("0:00");
    }
  };

  const handleRemixTrack = () => {
    console.log(`Opening AI Studio to remix: ${remixData.title}`);
    onOpenAIStudio();
  };

  // Enhanced time-based comments with precise positioning
  const timeComments: TimeComment[] = [
    {
      id: "tc-1",
      user: "BeatLover",
      avatar: imgUserAvatar3,
      text: "🔥 This intro drop is absolutely insane! The way it builds up gives me chills every time!",
      timeAgo: "2 min ago",
      timestamp: 15,
      timestampDisplay: "0:15",
      likes: 8,
      x: 8.2, // 15/183 * 100
      replies: []
    },
    {
      id: "tc-2",
      user: "GrooveLover",
      avatar: imgUserAvatar,
      text: "Anyone else getting major summer vibes from this? ☀️ Perfect for beach parties!",
      timeAgo: "30 sec ago",
      timestamp: 45,
      timestampDisplay: "0:45",
      likes: 12,
      x: 24.6, // 45/183 * 100
      replies: [
        {
          id: "tc-2-1",
          user: "SummerVibes",
          avatar: imgUserAvatar5,
          text: "Totally! This is going straight to my summer playlist 🌊",
          timeAgo: "20 sec ago",
          timestamp: 45,
          timestampDisplay: "0:45",
          likes: 3,
          x: 24.6
        }
      ]
    },
    {
      id: "tc-3",
      user: "MusicFanatic", 
      avatar: imgUserAvatar1,
      text: "This remix is pure energy! Love the drop at 1:30. The bassline just hits different! 🔥🎵",
      timeAgo: "5 min ago",
      timestamp: 90,
      timestampDisplay: "1:30",
      likes: 25,
      x: 49.2, // 90/183 * 100
      replies: [
        {
          id: "tc-3-1",
          user: "RemixLover",
          avatar: imgUserAvatar5,
          text: "Totally agree! The bassline is insane here. Producer skills on point! 💯",
          timeAgo: "3 min ago",
          timestamp: 95,
          timestampDisplay: "1:35",
          likes: 7,
          x: 51.9
        }
      ]
    },
    {
      id: "tc-4",
      user: "DJ Echo",
      avatar: imgUserAvatar2,
      text: "Thanks everyone! 🙏 That drop took me weeks to perfect. The secret is layering 3 different synths! 🎛️✨",
      timeAgo: "3 min ago", 
      timestamp: 110,
      timestampDisplay: "1:50",
      likes: 43,
      isCreator: true,
      x: 60.1, // 110/183 * 100
      replies: [
        {
          id: "tc-4-1",
          user: "ProducerLife",
          avatar: imgUserAvatar4,
          text: "Legend! Can you share more about your production process? 🤯",
          timeAgo: "2 min ago",
          timestamp: 110,
          timestampDisplay: "1:50",
          likes: 5,
          x: 60.1
        }
      ]
    },
    {
      id: "tc-5",
      user: "DanceFloorKing",
      avatar: imgUserAvatar4,
      text: "This breakdown section is PERFECT for mixing! Already planning my next set around this 🎧💫",
      timeAgo: "1 min ago",
      timestamp: 135,
      timestampDisplay: "2:15",
      likes: 15,
      x: 73.8, // 135/183 * 100
      replies: []
    }
  ];

  const relatedTracks = [
    {
      id: "1",
      title: "Cosmic Echoes (Remix)",
      artist: "DJ Nova",
      cover: imgTrackCover
    },
    {
      id: "2", 
      title: "Starlight Serenade (Original)",
      artist: "StarDust",
      cover: imgTrackCover1
    }
  ];

  const regularComments = [
    {
      id: "1",
      user: "NewListener",
      avatar: imgUserAvatar,
      text: "Just discovered this remix and I'm blown away! How did I miss this masterpiece? 🤩",
      timeAgo: "10 min ago",
      likes: 6,
      replies: []
    },
    {
      id: "2",
      user: "VinylCollector", 
      avatar: imgUserAvatar1,
      text: "This needs to be pressed on vinyl ASAP! The dynamics would sound incredible on analog. 💿✨",
      timeAgo: "15 min ago",
      likes: 18,
      replies: [
        {
          id: "2-1",
          user: "DJ Echo",
          avatar: imgUserAvatar2,
          text: "Working on it! 😉 Should have vinyl pre-orders up soon!",
          timeAgo: "12 min ago",
          likes: 8,
          isCreator: true
        }
      ]
    }
  ];

  const handleTimeCommentClick = (comment: TimeComment) => {
    setCurrentTime(comment.timestamp);
    setActivePopupComment(activePopupComment === comment.id ? null : comment.id);
  };

  const handleTimelineHover = (e: React.MouseEvent, isHovering: boolean) => {
    if (isHovering) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const timeInSeconds = (percentage / 100) * duration;
      setHoveredTimelinePosition(timeInSeconds);
    } else {
      setHoveredTimelinePosition(null);
    }
  };

  // Auto-hide popup after 5 seconds
  useEffect(() => {
    if (activePopupComment) {
      const timer = setTimeout(() => {
        setActivePopupComment(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activePopupComment]);

  return (
    <div className="bg-[#0d1117] min-h-screen text-white">
      <div className="flex justify-center">
        <div className="w-[400px] bg-[#161b22] rounded-2xl min-h-screen relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#21262d] text-[#8b949e] hover:text-[#ff22fb] hover:bg-[#30363d] transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <h2 className="text-[18px] font-bold text-[#c9d1d9]">{remixData.title}</h2>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#21262d] text-[#8b949e] hover:text-[#ff22fb] hover:bg-[#30363d] transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-32">
            
            {/* Enhanced Track Info Section with Larger Cover */}
            <div className="mb-8">
              {/* Large Cover Image */}
              <div className="mb-6">
                <div 
                  className="w-full h-[280px] rounded-2xl bg-cover bg-center shadow-2xl shadow-[#ff22fb]/20 relative overflow-hidden"
                  style={{ backgroundImage: `url('${remixData.cover}')` }}
                >
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating play button */}
                  <button
                    onClick={togglePlay}
                    className="absolute bottom-6 right-6 bg-[#ff22fb] rounded-full w-16 h-16 flex items-center justify-center text-white hover:bg-[#e91e63] transition-all transform hover:scale-110 shadow-lg shadow-[#ff22fb]/25"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                  
                  {/* NFT Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ff22fb] rounded-full animate-pulse" />
                      <span className="text-[12px] font-bold text-white">NFT #{remixData.blockchain.edition.slice(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Track Details */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-[24px] font-bold text-[#c9d1d9] mb-2">{remixData.title}</h1>
                  <p className="text-[16px] text-[#8b949e] mb-1">Original by <span className="text-[#ff22fb] font-semibold">{remixData.originalArtist}</span></p>
                  <p className="text-[16px] text-[#8b949e]">Remixed by <span className="text-[#ff22fb] font-semibold">{remixData.remixer}</span></p>
                </div>
                
                {/* Enhanced Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#8b949e]" />
                    <span className="text-[16px] font-bold text-[#c9d1d9]">{remixData.plays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#8b949e]" />
                    <span className="text-[16px] font-bold text-[#c9d1d9]">{remixData.comments}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8b949e]" />
                    <span className="text-[16px] font-bold text-[#c9d1d9]">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleStar}
                    className="bg-[#161b22] flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-[#21262d] transition-all hover:scale-105"
                  >
                    <Star className={`w-6 h-6 ${isStarred ? 'fill-[#d29922] text-[#d29922]' : 'text-[#d29922]'}`} />
                    <span className="text-[16px] font-bold text-[#c9d1d9]">{starCount}</span>
                  </button>
                  <button 
                    onClick={toggleLike}
                    className="bg-[#161b22] flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-[#21262d] transition-all hover:scale-105"
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-[#d73a49] text-[#d73a49]' : 'text-[#d73a49]'}`} />
                    <span className="text-[16px] font-bold text-[#c9d1d9]">{likeCount > 1000 ? `${(likeCount/1000).toFixed(1)}K` : likeCount}</span>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-all hover:scale-105">
                    <Share className="w-5 h-5 text-[#ff22fb]" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  {remixData.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-gradient-to-r from-[#ff22fb]/10 to-[#ff4400]/10 border border-[#ff22fb]/30 px-3 py-2 rounded-full text-[12px] font-bold text-[#ff22fb] uppercase tracking-[0.5px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Audio Player with Timeline Comments */}
            <div className="mb-8">
              {/* Timeline with Interactive Comments */}
              <div 
                className="bg-[#161b22] rounded-lg h-[80px] overflow-visible relative mb-4 cursor-pointer"
                onMouseMove={(e) => handleTimelineHover(e, true)}
                onMouseLeave={(e) => handleTimelineHover(e, false)}
              >
                {/* Progress Background */}
                <div 
                  className="bg-[#ff22fb] opacity-70 rounded-bl-lg rounded-tl-lg absolute left-0 top-0 bottom-0 transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                
                {/* Hover Time Indicator */}
                {hoveredTimelinePosition !== null && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white/50 pointer-events-none z-10"
                    style={{ left: `${(hoveredTimelinePosition / duration) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                      {formatTime(Math.floor(hoveredTimelinePosition))}
                    </div>
                  </div>
                )}
                
                {/* Time-based Comment Bubbles */}
                {timeComments.map((comment) => (
                  <div key={comment.id} className="relative">
                    {/* Comment Bubble */}
                    <button
                      onClick={() => handleTimeCommentClick(comment)}
                      className="absolute w-8 h-8 rounded-full bg-cover bg-center border-3 border-[#ff22fb] transition-all duration-200 hover:scale-125 hover:border-[#00ff88] z-20"
                      style={{ 
                        left: `${comment.x}%`, 
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundImage: `url('${comment.avatar}')`,
                        boxShadow: activePopupComment === comment.id ? '0 0 20px rgba(255, 34, 251, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    />
                    
                    {/* Popup Comment */}
                    {activePopupComment === comment.id && (
                      <div 
                        className="absolute z-30 w-72 bg-[#0d1117] border border-[#30363d] rounded-xl p-4 shadow-2xl animate-in slide-in-from-bottom-2 duration-300"
                        style={{ 
                          left: `${comment.x}%`,
                          bottom: '100%',
                          transform: 'translateX(-50%)',
                          marginBottom: '60px'
                        }}
                      >
                        {/* Close Button */}
                        <button
                          onClick={() => setActivePopupComment(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff22fb] rounded-full flex items-center justify-center text-white hover:bg-[#e91e63] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        {/* Comment Content */}
                        <div className="flex gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url('${comment.avatar}')` }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[14px] font-bold ${comment.isCreator ? 'text-[#ff22fb]' : 'text-[#c9d1d9]'}`}>
                                {comment.user}
                                {comment.isCreator && <span className="text-[#ff22fb]">✓</span>}
                              </span>
                              <span className="text-[12px] text-[#8b949e]">{comment.timeAgo}</span>
                              <span className="text-[12px] font-bold text-[#ff22fb] bg-[#ff22fb]/10 px-2 py-1 rounded">
                                @ {comment.timestampDisplay}
                              </span>
                            </div>
                            <p className="text-[14px] text-[#c9d1d9] leading-relaxed mb-3">{comment.text}</p>
                            
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-[12px] font-bold">{comment.likes}</span>
                              </button>
                              <button className="text-[12px] font-bold text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                                Reply
                              </button>
                              <button 
                                onClick={() => setCurrentTime(comment.timestamp)}
                                className="text-[12px] font-bold text-[#ff22fb] hover:text-[#00ff88] transition-colors"
                              >
                                ▶ Play from here
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="border-l-2 border-[#30363d] pl-4 mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div 
                                  className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                                  style={{ backgroundImage: `url('${reply.avatar}')` }}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[13px] font-bold text-[#c9d1d9]">{reply.user}</span>
                                    <span className="text-[11px] text-[#8b949e]">{reply.timeAgo}</span>
                                  </div>
                                  <p className="text-[13px] text-[#c9d1d9] leading-relaxed mb-2">{reply.text}</p>
                                  <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-1 text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                                      <Heart className="w-3 h-3" />
                                      <span className="text-[11px] font-bold">{reply.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Pointer */}
                        <div 
                          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#0d1117]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-2 bg-[#30363d] rounded-full appearance-none cursor-pointer mb-3"
                style={{
                  background: `linear-gradient(to right, #ff22fb 0%, #ff22fb ${(currentTime / duration) * 100}%, #30363d ${(currentTime / duration) * 100}%, #30363d 100%)`
                }}
              />
              
              {/* Time markers */}
              <div className="flex justify-between text-[12px] text-[#8b949e] mb-6">
                <span>{formatTime(currentTime)}</span>
                <span>1:00</span>
                <span>2:00</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-8">
                <button className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors p-2">
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={togglePlay}
                  className="bg-[#ff22fb] rounded-full w-16 h-16 flex items-center justify-center text-white hover:bg-[#e91e63] transition-all transform hover:scale-110 shadow-lg shadow-[#ff22fb]/25"
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
                <button className="text-[#c9d1d9] hover:text-[#ff22fb] transition-colors p-2">
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Track Details */}
            <div className="mb-8">
              <h3 className="text-[20px] font-bold text-[#c9d1d9] mb-4">Track Details</h3>
              <div className="bg-[#0d1117] rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] font-bold text-[#8b949e] mb-1">Release Date</p>
                    <p className="text-[14px] font-bold text-[#c9d1d9]">{remixData.releaseDate}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#8b949e] mb-1">Genre</p>
                    <p className="text-[14px] font-bold text-[#c9d1d9]">{remixData.genre}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#8b949e] mb-1">BPM</p>
                    <p className="text-[14px] font-bold text-[#c9d1d9]">{remixData.bpm}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#8b949e] mb-1">Key</p>
                    <p className="text-[14px] font-bold text-[#c9d1d9]">{remixData.key}</p>
                  </div>
                </div>
                
                {/* Blockchain Info */}
                <div className="border-t border-[#30363d] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ff22fb] rounded-full animate-pulse" />
                      <span className="text-[14px] font-bold text-[#c9d1d9]">NFT Edition {remixData.blockchain.edition}</span>
                    </div>
                    <button className="bg-[#ff22fb] text-white px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-[#e91e63] transition-colors">
                      View on TON
                    </button>
                  </div>
                  <button className="bg-gradient-to-r from-[#ff22fb] to-[#ff4400] text-white px-4 py-2 rounded-lg text-[14px] font-bold hover:shadow-lg transition-all w-full">
                    🌟 Tip Creator with TON
                  </button>
                </div>
              </div>
            </div>

            {/* Related Tracks */}
            <div className="mb-8">
              <h3 className="text-[18px] font-bold text-[#c9d1d9] mb-4">Related Tracks & Remixes</h3>
              <div className="space-y-3 mb-4">
                {relatedTracks.map((track) => (
                  <div key={track.id} className="bg-[#161b22] rounded-xl p-4 flex items-center gap-4 hover:bg-[#21262d] transition-colors">
                    <div 
                      className="w-16 h-16 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url('${track.cover}')` }}
                    />
                    <div className="flex-1">
                      <h4 className="text-[16px] font-bold text-[#c9d1d9]">{track.title}</h4>
                      <p className="text-[14px] text-[#8b949e]">By {track.artist}</p>
                    </div>
                    <button className="text-[#ff22fb] hover:text-[#00ff88] transition-colors p-3">
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleRemixTrack}
                className="bg-[#ff22fb] rounded-xl w-full py-4 px-5 flex items-center justify-center gap-2 hover:bg-[#e91e63] transition-all transform hover:scale-105 shadow-lg shadow-[#ff22fb]/25"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 18 18">
                  <path d={svgPaths.p1b130100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d={svgPaths.p5f8c180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d={svgPaths.p29ab6b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                  <path d="M11.1 11.1L15 15" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
                <span className="text-[14px] font-bold text-white">🎵 Remix this track in AI Studio</span>
              </button>
            </div>

            {/* General Comments Section */}
            <div className="mb-6">
              <h3 className="text-[18px] font-bold text-[#c9d1d9] mb-4">Comments ({regularComments.length + timeComments.length})</h3>
              
              {/* Comment Input */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-[#161b22] rounded-lg px-4 py-3 text-[14px] text-[#c9d1d9] placeholder-[#8b949e] outline-none border border-[#30363d] focus:border-[#ff22fb] transition-colors"
                />
                <input
                  type="text"
                  placeholder="0:00"
                  value={commentTime}
                  onChange={(e) => setCommentTime(e.target.value)}
                  className="bg-[#161b22] rounded-lg px-3 py-3 w-[70px] text-[14px] text-[#8b949e] text-center outline-none border border-[#30363d] focus:border-[#ff22fb] transition-colors"
                />
                <button className="text-[#8b949e] hover:text-[#ff22fb] transition-colors p-3">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="text-[#8b949e] hover:text-[#ff22fb] transition-colors p-3">
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCommentSubmit}
                  className="bg-[#ff22fb] rounded-lg px-4 py-3 hover:bg-[#e91e63] transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {regularComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div 
                      className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${comment.avatar}')` }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[16px] font-bold text-[#c9d1d9]">{comment.user}</span>
                        <span className="text-[14px] text-[#8b949e]">{comment.timeAgo}</span>
                      </div>
                      <p className="text-[15px] text-[#c9d1d9] leading-relaxed mb-3">{comment.text}</p>
                      
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-[14px] font-bold">{comment.likes}</span>
                        </button>
                        <button className="text-[14px] font-bold text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                          Reply
                        </button>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="border-l-2 border-[#30363d] pl-6 mt-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div 
                                className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url('${reply.avatar}')` }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[14px] font-bold ${reply.isCreator ? 'text-[#ff22fb]' : 'text-[#c9d1d9]'}`}>
                                    {reply.user}
                                    {reply.isCreator && <span className="text-[#ff22fb] ml-1">✓</span>}
                                  </span>
                                  <span className="text-[12px] text-[#8b949e]">{reply.timeAgo}</span>
                                </div>
                                <p className="text-[14px] text-[#c9d1d9] leading-relaxed mb-3">{reply.text}</p>
                                
                                <div className="flex items-center gap-3">
                                  <button className="flex items-center gap-1 text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                                    <Heart className="w-3 h-3" />
                                    <span className="text-[12px] font-bold">{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab="Home" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}