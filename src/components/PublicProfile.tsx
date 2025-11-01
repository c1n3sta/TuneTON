import { ArrowLeft, MoreVertical, Play, Heart, Users, Music, List, Award, TrendingUp, Trophy } from "lucide-react";
import svgPaths from "../imports/svg-ty8h9m23bx";
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgRemixThumbnail from "figma:asset/9131a8d559e61759624112848c7efd789a821304.png";
import imgRemixThumbnail1 from "figma:asset/9b70de60c9c6fca835689966d784c1342e0cae63.png";
import imgRemixThumbnail2 from "figma:asset/32f8c11f6ddbee1a59d210d5725d72775f8b4e07.png";
// Import playlist covers from existing assets
import imgPlaylistCover from "figma:asset/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png";
import imgPlaylistCover1 from "figma:asset/059d630bf1b73c65663230f6fe3660d07bc060b8.png";
import imgPlaylistCover2 from "figma:asset/20bb8fe31b212ec3236e8224dd3efe441043be2f.png";
import imgPlaylistCover3 from "figma:asset/a1ad22f09bf6f15ef5bc637a1785d31b1ca3884a.png";
import imgPlaylistCover4 from "figma:asset/08ea158ebabf976cca7bb1f8ec91d0c456a2f915.png";
// Import NFT and track covers for galleries
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";
import imgFeaturedRemixCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgRemixCover from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import BottomNavigation from "./BottomNavigation";
import StylishTabs from "./StylishTabs";
import SwipeableTabContent from "./SwipeableTabContent";
import { useSwipeConfig } from "./useMobileDetection";
import { useState } from "react";

interface PublicProfileProps {
  onBack: () => void;
  onNavigate?: (tab: string) => void;
  onOpenPlaylistDetail?: (playlist: any) => void;
  userId?: string;
}

export default function PublicProfile({ onBack, onNavigate, onOpenPlaylistDetail, userId }: PublicProfileProps) {
  const [activeTab, setActiveTab] = useState("remixes");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(5200);
  const [followingCount, setFollowingCount] = useState(1834);
  
  // Get optimal swipe configuration for current device
  const { isMobile, isTouch, swipeConfig } = useSwipeConfig();

  // Mock data for the content
  const publicPlaylists = [
    {
      id: "1",
      name: "Electronic Essentials",
      trackCount: 45,
      cover: imgPlaylistCover,
      plays: "2.3M",
      likes: 542,
      followers: 1205,
      description: "My favorite electronic tracks curated over the years"
    },
    {
      id: "2", 
      name: "Chill Remix Sessions",
      trackCount: 28,
      cover: imgPlaylistCover1,
      plays: "1.8M",
      likes: 423,
      followers: 890,
      description: "Perfect for late night studio sessions"
    },
    {
      id: "3",
      name: "Club Bangers 2024", 
      trackCount: 32,
      cover: imgPlaylistCover2,
      plays: "3.1M",
      likes: 756,
      followers: 1456,
      description: "The hottest tracks that get the crowd moving"
    },
    {
      id: "4",
      name: "Remix Inspirations",
      trackCount: 19,
      cover: imgPlaylistCover3,
      plays: "980K",
      likes: 234,
      followers: 567,
      description: "Tracks that inspire my remix work"
    }
  ];

  const userNFTs = [
    {
      id: "nft-1",
      title: "Beat Genesis #001",
      image: imgAlbumArt,
      price: 2.5,
      rarity: "Legendary",
      category: "Music NFT",
      likes: 145,
      views: 2341
    },
    {
      id: "nft-2",
      title: "Remix Master Badge",
      image: imgFeaturedRemixCover,
      price: 1.8,
      rarity: "Epic",
      category: "Achievement",
      likes: 89,
      views: 1567
    },
    {
      id: "nft-3",
      title: "Synth Wave Collection",
      image: imgTrackCover,
      price: 3.2,
      rarity: "Rare",
      category: "Audio Pack",
      likes: 234,
      views: 3452
    },
    {
      id: "nft-4",
      title: "Electronic Dreams",
      image: imgTrackCover1,
      price: 1.5,
      rarity: "Common",
      category: "Artwork",
      likes: 67,
      views: 987
    },
    {
      id: "nft-5",
      title: "Cosmic Beats",
      image: imgRemixCover,
      price: 4.1,
      rarity: "Legendary",
      category: "Music NFT",
      likes: 312,
      views: 4523
    },
    {
      id: "nft-6",
      title: "Producer Pro License",
      image: imgPlaylistCover4,
      price: 2.9,
      rarity: "Epic",
      category: "License",
      likes: 178,
      views: 2876
    }
  ];

  const userBadges = [
    {
      id: "badge-1",
      name: "Remix Pioneer",
      description: "First to remix a featured track",
      icon: "🎵",
      rarity: "Legendary",
      earnedDate: "March 2024",
      isAnimated: true
    },
    {
      id: "badge-2", 
      name: "Contest Champion",
      description: "Won 3 remix competitions",
      icon: "🏆",
      rarity: "Epic",
      earnedDate: "February 2024",
      isAnimated: true
    },
    {
      id: "badge-3",
      name: "Community Favorite",
      description: "Received 10K+ likes on remixes",
      icon: "❤️",
      rarity: "Rare",
      earnedDate: "January 2024",
      isAnimated: false
    },
    {
      id: "badge-4",
      name: "Early Adopter",
      description: "One of the first 1000 users",
      icon: "🚀",
      rarity: "Epic",
      earnedDate: "December 2023",
      isAnimated: true
    },
    {
      id: "badge-5",
      name: "Collaboration Master",
      description: "Collaborated with 50+ artists",
      icon: "🤝",
      rarity: "Rare",
      earnedDate: "November 2023",
      isAnimated: false
    },
    {
      id: "badge-6",
      name: "Streamer",
      description: "1M+ plays on remixes",
      icon: "📻",
      rarity: "Epic", 
      earnedDate: "October 2023",
      isAnimated: true
    },
    {
      id: "badge-7",
      name: "Beat Creator",
      description: "Created first original beat",
      icon: "🎶",
      rarity: "Common",
      earnedDate: "September 2023",
      isAnimated: false
    },
    {
      id: "badge-8",
      name: "NFT Collector",
      description: "Owns 25+ music NFTs",
      icon: "💎",
      rarity: "Rare",
      earnedDate: "August 2023",
      isAnimated: false
    }
  ];

  const userRankings = {
    currentRank: 14,
    globalRank: 14,
    countryRank: 8,
    genreRank: 3,
    points: 8640,
    weeklyPoints: 245,
    monthlyPoints: 1120,
    lastWeekRank: 18,
    bestRank: 7,
    bestRankDate: "February 2024",
    currentStreak: 12,
    longestStreak: 28,
    rankedWeeks: 45,
    totalWeeks: 52
  };

  const leaderboardCategories = [
    {
      category: "Overall",
      rank: 14,
      points: 8640,
      change: "+4",
      trend: "up",
      participants: "156.2K"
    },
    {
      category: "Electronic",
      rank: 3,
      points: 3420,
      change: "+1",
      trend: "up",
      participants: "23.8K"
    },
    {
      category: "Remix Masters",
      rank: 8,
      points: 2890,
      change: "-2",
      trend: "down",
      participants: "45.1K"
    },
    {
      category: "Producer",
      rank: 22,
      points: 1845,
      change: "0",
      trend: "stable",
      participants: "89.5K"
    },
    {
      category: "Weekly Top",
      rank: 6,
      points: 245,
      change: "+8",
      trend: "up",
      participants: "12.3K"
    },
    {
      category: "Country (US)",
      rank: 8,
      points: 8640,
      change: "+2",
      trend: "up",
      participants: "28.7K"
    }
  ];

  const handleBack = () => {
    onBack();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (isFollowing) {
      setFollowersCount(prev => prev - 1);
    } else {
      setFollowersCount(prev => prev + 1);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleNavigation = (tab: string) => {
    if (tab === "Home") {
      onBack();
    } else if (onNavigate) {
      onNavigate(tab);
    }
  };

  const renderRemixes = () => (
    <div className="space-y-3">
      {/* Remix 1 */}
      <div className="flex items-center gap-3 py-2">
        <div 
          className="w-16 h-16 rounded-lg bg-center bg-cover"
          style={{ 
            backgroundImage: `url('${imgRemixThumbnail}')`,
            backgroundSize: '150% 100%',
            backgroundPosition: '50% 0%'
          }}
        />
        <div className="flex-1">
          <h3 className="text-[#c9d1d9] text-sm font-semibold">Summer Vibes (DJ BeatMaster Remix)</h3>
          <p className="text-[#8b949e] text-xs">Original by Artist A</p>
          <div className="flex items-center gap-2 mt-1">
            <Play className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs">1.5M</span>
            <Heart className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs">25K</span>
          </div>
        </div>
      </div>

      {/* Remix 2 */}
      <div className="flex items-center gap-3 py-2">
        <div 
          className="w-16 h-16 rounded-lg bg-center bg-cover"
          style={{ 
            backgroundImage: `url('${imgRemixThumbnail1}')`,
            backgroundSize: '100% 133.33%',
            backgroundPosition: '0% 50%'
          }}
        />
        <div className="flex-1">
          <h3 className="text-[#c9d1d9] text-sm font-semibold">City Lights (DJ BeatMaster Remix)</h3>
          <p className="text-[#8b949e] text-xs">Original by Artist B</p>
          <div className="flex items-center gap-2 mt-1">
            <Play className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs">980K</span>
            <Heart className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs">18K</span>
          </div>
        </div>
      </div>

      {/* Remix 3 */}
      <div className="flex items-center gap-3 py-2">
        <div 
          className="w-16 h-16 rounded-lg bg-center bg-cover"
          style={{ 
            backgroundImage: `url('${imgRemixThumbnail2}')`,
            backgroundSize: '128.42% 100%',
            backgroundPosition: '50% 0%'
          }}
        />
        <div className="flex-1">
          <h3 className="text-[#c9d1d9] text-sm font-semibold">Midnight Groove (DJ BeatMaster Remix)</h3>
          <p className="text-[#8b949e] text-xs">Original by Artist C</p>
          <div className="flex items-center gap-2 mt-1">
            <Play className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs">720K</span>
            <Heart className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-[#8b949e] text-xs">12K</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaylists = () => (
    <div className="space-y-4">
      {publicPlaylists.map((playlist) => (
        <button 
          key={playlist.id} 
          onClick={() => onOpenPlaylistDetail?.(playlist)}
          className="w-full bg-[#21262d] rounded-lg p-3 hover:bg-[#30363d] transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-16 h-16 rounded-lg bg-center bg-cover"
              style={{ backgroundImage: `url('${playlist.cover}')` }}
            />
            <div className="flex-1 text-left">
              <h3 className="text-[#c9d1d9] text-sm font-semibold">{playlist.name}</h3>
              <p className="text-[#8b949e] text-xs">{playlist.trackCount} tracks</p>
              <div className="flex items-center gap-2 mt-1">
                <Play className="w-3.5 h-3.5 text-[#8b949e]" />
                <span className="text-[#8b949e] text-xs">{playlist.plays}</span>
                <Heart className="w-3.5 h-3.5 text-[#8b949e]" />
                <span className="text-[#8b949e] text-xs">{playlist.likes}</span>
                <Users className="w-3.5 h-3.5 text-[#8b949e]" />
                <span className="text-[#8b949e] text-xs">{playlist.followers}</span>
              </div>
            </div>
            <div className="bg-[#ff22fb] text-white p-2 rounded-full hover:bg-[#ff22fb]/90 transition-colors">
              <Play className="w-4 h-4" />
            </div>
          </div>
          
          {playlist.description && (
            <p className="text-[#8b949e] text-xs mt-2 ml-[76px] mr-[52px] text-left">
              {playlist.description}
            </p>
          )}
        </button>
      ))}
    </div>
  );

  const renderNFTGallery = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {userNFTs.map((nft) => (
          <div key={nft.id} className="bg-[#21262d] rounded-lg p-3 hover:bg-[#30363d] transition-colors">
            <div 
              className="w-full h-24 rounded-lg bg-center bg-cover mb-2"
              style={{ backgroundImage: `url('${nft.image}')` }}
            />
            <div className="space-y-1">
              <h4 className="text-[#c9d1d9] text-xs font-semibold truncate">{nft.title}</h4>
              <p className="text-[#8b949e] text-xs">{nft.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#ff22fb] text-xs font-semibold">{nft.price} TON</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  nft.rarity === 'Legendary' ? 'bg-[#d29922] text-black' :
                  nft.rarity === 'Epic' ? 'bg-[#8b5cf6] text-white' :
                  nft.rarity === 'Rare' ? 'bg-[#06b6d4] text-white' :
                  'bg-[#6b7280] text-white'
                }`}>
                  {nft.rarity}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                <Heart className="w-3 h-3" />
                <span>{nft.likes}</span>
                <span>•</span>
                <span>{nft.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {userBadges.map((badge) => (
          <div key={badge.id} className={`bg-[#21262d] rounded-lg p-3 hover:bg-[#30363d] transition-all relative overflow-hidden ${
            badge.isAnimated ? 'hover:scale-105' : ''
          }`}>
            {badge.isAnimated && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff22fb]/10 to-[#ff4400]/10 animate-pulse" />
            )}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${badge.isAnimated ? 'animate-bounce' : ''}`}>
                  {badge.icon}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  badge.rarity === 'Legendary' ? 'bg-[#d29922] text-black' :
                  badge.rarity === 'Epic' ? 'bg-[#8b5cf6] text-white' :
                  badge.rarity === 'Rare' ? 'bg-[#06b6d4] text-white' :
                  'bg-[#6b7280] text-white'
                }`}>
                  {badge.rarity}
                </span>
              </div>
              <h4 className="text-[#c9d1d9] text-sm font-semibold mb-1">{badge.name}</h4>
              <p className="text-[#8b949e] text-xs leading-4 mb-2">{badge.description}</p>
              <p className="text-[#8b949e] text-xs opacity-75">Earned {badge.earnedDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRankings = () => (
    <div className="space-y-4">
      {/* Overall Stats */}
      <div className="bg-[#21262d] rounded-lg p-4">
        <h3 className="text-[#c9d1d9] text-sm font-semibold mb-3">Ranking Overview</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="text-[#ff22fb] text-lg font-semibold">#{userRankings.globalRank}</div>
            <div className="text-[#8b949e] text-xs">Global Rank</div>
          </div>
          <div className="text-center">
            <div className="text-[#ff4400] text-lg font-semibold">{formatCount(userRankings.points)}</div>
            <div className="text-[#8b949e] text-xs">Total Points</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[#c9d1d9] text-sm font-semibold">#{userRankings.bestRank}</div>
            <div className="text-[#8b949e] text-xs">Best Rank</div>
            <div className="text-[#8b949e] text-xs opacity-75">{userRankings.bestRankDate}</div>
          </div>
          <div>
            <div className="text-[#c9d1d9] text-sm font-semibold">{userRankings.currentStreak}</div>
            <div className="text-[#8b949e] text-xs">Week Streak</div>
          </div>
          <div>
            <div className="text-[#c9d1d9] text-sm font-semibold">{userRankings.rankedWeeks}/{userRankings.totalWeeks}</div>
            <div className="text-[#8b949e] text-xs">Weeks Ranked</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Categories */}
      <div className="space-y-3">
        <h3 className="text-[#c9d1d9] text-sm font-semibold">Leaderboard Performance</h3>
        {leaderboardCategories.map((category, index) => (
          <div key={index} className="bg-[#21262d] rounded-lg p-3 hover:bg-[#30363d] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  category.rank <= 10 
                    ? 'bg-[#d29922] text-black' 
                    : category.rank <= 50 
                    ? 'bg-[#8b5cf6] text-white' 
                    : 'bg-[#484f58] text-white'
                }`}>
                  #{category.rank}
                </div>
                <div>
                  <h4 className="text-[#c9d1d9] text-sm font-semibold">{category.category}</h4>
                  <p className="text-[#8b949e] text-xs">{category.participants} participants</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#c9d1d9] text-sm font-semibold">{formatCount(category.points)} pts</div>
                <div className={`flex items-center justify-end gap-1 text-xs ${
                  category.trend === 'up' ? 'text-[#ff4400]' : 
                  category.trend === 'down' ? 'text-red-400' : 'text-[#8b949e]'
                }`}>
                  {category.trend === 'up' && '↗'}
                  {category.trend === 'down' && '↘'}
                  {category.trend === 'stable' && '→'}
                  <span>{category.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "remixes":
        return renderRemixes();
      case "playlists":
        return renderPlaylists();
      case "nfts":
        return renderNFTGallery();
      case "badges":
        return renderBadges();
      case "rankings":
        return renderRankings();
      default:
        return renderRemixes();
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#c9d1d9]" />
          </button>
          
          <div className="text-center">
            <h1 className="text-[#c9d1d9] text-lg font-semibold">DJ BeatMaster</h1>
          </div>
          
          <button className="p-1">
            <MoreVertical className="w-6 h-6 text-[#c9d1d9]" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-20 h-20 rounded-full bg-center bg-cover border-2 border-[#ff22fb]"
              style={{ backgroundImage: `url('${imgUserAvatar}')` }}
            />
            <div className="flex-1">
              <h2 className="text-[#c9d1d9] text-xl font-semibold">DJ BeatMaster</h2>
              <p className="text-[#8b949e] text-sm">@djbeatmaster</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[#ff22fb] text-sm font-semibold">#{userRankings.globalRank} Global</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-[#c9d1d9] text-sm mb-4">
            Electronic music producer & remix artist. Specializing in progressive house and techno beats. 
            Creating soundscapes that move the soul 🎵✨
          </p>

          {/* Stats */}
          <div className="flex justify-around bg-[#21262d] rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-[#c9d1d9] text-lg font-semibold">{formatCount(followersCount)}</div>
              <div className="text-[#8b949e] text-xs">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-[#c9d1d9] text-lg font-semibold">{formatCount(followingCount)}</div>
              <div className="text-[#8b949e] text-xs">Following</div>
            </div>
            <div className="text-center">
              <div className="text-[#c9d1d9] text-lg font-semibold">15</div>
              <div className="text-[#8b949e] text-xs">Remixes</div>
            </div>
            <div className="text-center">
              <div className="text-[#c9d1d9] text-lg font-semibold">2.5M</div>
              <div className="text-[#8b949e] text-xs">Plays</div>
            </div>
          </div>

          {/* Follow Button */}
          <button 
            onClick={handleFollow}
            className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 ${
              isFollowing
                ? "bg-[#21262d] border border-[#ff22fb] text-[#ff22fb] hover:bg-[#ff22fb]/10"
                : "bg-gradient-to-r from-[#ff22fb] to-[#ff4400] text-white hover:shadow-lg hover:shadow-[#ff22fb]/25"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        {/* Enhanced Profile Tabs */}
        <div className="px-6 mb-6">
          <StylishTabs
            tabs={[
              { 
                id: "remixes", 
                label: "Remixes", 
                icon: <Music className="w-4 h-4" />,
                badge: "15"
              },
              { 
                id: "playlists", 
                label: "Playlists", 
                icon: <List className="w-4 h-4" />,
                badge: publicPlaylists.length.toString()
              },
              { 
                id: "nfts", 
                label: "NFTs", 
                icon: <Award className="w-4 h-4" />,
                badge: userNFTs.length.toString()
              },
              { 
                id: "badges", 
                label: "Badges", 
                icon: <Trophy className="w-4 h-4" />,
                badge: userBadges.length.toString()
              },
              { 
                id: "rankings", 
                label: "Rankings", 
                icon: <TrendingUp className="w-4 h-4" />
              }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="default"
            size="sm"
            enableSwipe={swipeConfig.enabled}
          />
        </div>

        {/* Swipeable Tab Content */}
        <div className="px-6 pb-6">
          <SwipeableTabContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: "remixes", content: renderRemixes() },
              { id: "playlists", content: renderPlaylists() },
              { id: "nfts", content: renderNFTGallery() },
              { id: "badges", content: renderBadges() },
              { id: "rankings", content: renderRankings() }
            ]}
            swipeEnabled={swipeConfig.enabled}
          />
        </div>
      </div>

      <BottomNavigation 
        activeTab="Profile"
        onNavigate={handleNavigation}
      />
    </div>
  );
}