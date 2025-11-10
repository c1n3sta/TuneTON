import { useState } from "react";
import { ArrowLeft, Search, Crown, Trophy, Star, TrendingUp, Music, Heart, Play, Clock, Calendar, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import BottomNavigation from "./BottomNavigation";
import StylishTabs from "./StylishTabs";

// Import images from existing assets
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgUserAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgUserAvatar2 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";
import imgRemixCover from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgRemixCover1 from "figma:asset/2445cdb838670e8ea661ef232b16e90503fdec0b.png";

interface User {
  id: string;
  name: string;
  avatar: string;
  stats: string;
  position: number;
  badge?: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  stats: string;
  position: number;
  genre?: string;
}

interface RankingPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenDetailRanking?: (rankingId: string, category: 'remixers' | 'performers' | 'tracks' | 'genres') => void;
  onOpenContestDetail?: (contestId: string) => void;
}

export default function RankingPage({ onBack, onNavigate, onOpenDetailRanking, onOpenContestDetail }: RankingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Weekly");

  const topRemixers: User[] = [
    {
      id: "1",
      name: "DarkBeater",
      avatar: imgUserAvatar,
      stats: "2K Remixes | 4.8",
      position: 1,
      badge: "Weekly Ranking"
    },
    {
      id: "2", 
      name: "SynthGrover",
      avatar: imgUserAvatar1,
      stats: "1.8K Remixes | 4.7",
      position: 2
    },
    {
      id: "3",
      name: "GrooveBot",
      avatar: imgUserAvatar2,
      stats: "1.5K Remixes | 4.6",
      position: 3
    }
  ];

  const topPerformers: User[] = [
    {
      id: "1",
      name: "Ace",
      avatar: imgUserAvatar,
      stats: "2M Plays | 4.9 Avg Rating",
      position: 1,
      badge: "Monthly Ranking"
    },
    {
      id: "2",
      name: "Echo",
      avatar: imgUserAvatar1,
      stats: "1.8M Plays | 4.8 Avg Rating",
      position: 2
    },
    {
      id: "3",
      name: "Vibe",
      avatar: imgUserAvatar2,
      stats: "1.6M Plays | 4.7 Avg Rating",
      position: 3
    }
  ];

  const mostLikedPerformers: User[] = [
    {
      id: "1",
      name: "SynthWave",
      avatar: imgUserAvatar,
      stats: "850K Likes | High Engagement",
      position: 1
    },
    {
      id: "2",
      name: "Bass",
      avatar: imgUserAvatar1,
      stats: "720K Likes | Medium Engagement",
      position: 2
    },
    {
      id: "3",
      name: "Melody",
      avatar: imgUserAvatar2,
      stats: "650K Likes | Medium Engagement",
      position: 3
    }
  ];

  const topRemixesByGenre: Track[] = [
    {
      id: "1",
      title: "Electro",
      artist: "340 Remixes | High Popularity",
      cover: imgRemixCover,
      stats: "View Stats Stats Info",
      position: 1,
      genre: "Electronic"
    },
    {
      id: "2",
      title: "Hip-Hop", 
      artist: "280 Remixes | Medium Popularity",
      cover: imgRemixCover1,
      stats: "View Stats Stats Info",
      position: 2,
      genre: "Hip-Hop"
    },
    {
      id: "3",
      title: "Pop",
      artist: "250 Remixes | Medium Popularity", 
      cover: imgAlbumArt,
      stats: "View Stats Stats Info",
      position: 3,
      genre: "Pop"
    }
  ];

  const topTracksByPopularity: Track[] = [
    {
      id: "1",
      title: "Midnight Groove (Remix)",
      artist: "DJ Echo | 2.5M Plays | 340K Likes",
      cover: imgTrackCover,
      stats: "",
      position: 1
    },
    {
      id: "2",
      title: "Electric Dreams AM",
      artist: "Neon | 2.2M Plays | 320K Likes",
      cover: imgTrackCover1,
      stats: "",
      position: 2
    },
    {
      id: "3",
      title: "Urban Pulse (Experimental)",
      artist: "BeatMaster | 2.0M Plays | 280K Likes",
      cover: imgRemixCover,
      stats: "",
      position: 3
    }
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-[#d29922]" />;
      case 2:
        return <Trophy className="h-5 w-5 text-[#8b949e]" />;
      case 3:
        return <Star className="h-5 w-5 text-[#cd7f32]" />;
      default:
        return <span className="text-[#8b949e] font-semibold">{position}</span>;
    }
  };

  const renderUserRanking = (users: User[], title: string, badgeColor: string = "bg-[#ff22fb]", category: 'remixers' | 'performers' | 'tracks' | 'genres' = 'remixers') => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-[#ff22fb]" />
        <h3 className="text-lg font-semibold text-[#c9d1d9]">{title}</h3>
        {users[0]?.badge && (
          <Badge className={`${badgeColor} text-white text-xs px-2 py-1`}>
            {users[0].badge}
          </Badge>
        )}
      </div>
      {users.map((user, index) => (
        <Card key={user.id} className="bg-[#161b22] border-[#30363d] hover:bg-[#21262d] transition-colors">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-8">
              {getRankIcon(user.position)}
            </div>
            <div 
              className="w-12 h-12 bg-cover bg-center rounded-full border-2 border-[#30363d]"
              style={{ backgroundImage: `url('${user.avatar}')` }}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-[#c9d1d9]">{user.name}</h4>
              <p className="text-sm text-[#8b949e]">{user.stats}</p>
            </div>
            <Button 
              size="sm" 
              className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white"
              onClick={() => onOpenDetailRanking?.(user.id, category)}
            >
              View
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTrackRanking = (tracks: Track[], title: string, badgeColor: string = "bg-[#ff22fb]") => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5 text-[#ff22fb]" />
        <h3 className="text-lg font-semibold text-[#c9d1d9]">{title}</h3>
        <Badge className={`${badgeColor} text-white text-xs px-2 py-1`}>
          View Stats Stats Info
        </Badge>
      </div>
      {tracks.map((track) => (
        <Card key={track.id} className="bg-[#161b22] border-[#30363d] hover:bg-[#21262d] transition-colors">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-8">
              {getRankIcon(track.position)}
            </div>
            <div 
              className="w-12 h-12 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url('${track.cover}')` }}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-[#c9d1d9]">{track.title}</h4>
              <p className="text-sm text-[#8b949e]">{track.artist}</p>
              {track.stats && (
                <p className="text-xs text-[#ff22fb] mt-1">{track.stats}</p>
              )}
            </div>
            <Button size="sm" variant="ghost" className="text-[#8b949e] hover:text-[#ff22fb] p-2">
              <Play className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-md mx-auto bg-[#161b22] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#21262d] flex items-center justify-center text-[#c9d1d9] hover:bg-[#30363d] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-[#c9d1d9]">TuneTON Leaderboards &</h1>
            <p className="text-sm text-[#c9d1d9]">Ratings</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Description */}
        <div className="p-4 text-center">
          <p className="text-sm text-[#8b949e]">
            Explore top creators, best performers,
            <br />
            trending content, and community favorites.
          </p>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
            <Input
              placeholder="Search artists, remixers, or..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#21262d] border-[#30363d] text-[#c9d1d9] placeholder:text-[#8b949e] pl-10"
            />
          </div>
        </div>

        {/* Enhanced Filter Tabs */}
        <div className="px-4 pb-6">
          <StylishTabs
            tabs={[
              { 
                id: "Weekly", 
                label: "Weekly", 
                icon: <Clock className="w-4 h-4" />
              },
              { 
                id: "Monthly", 
                label: "Monthly", 
                icon: <Calendar className="w-4 h-4" />
              },
              { 
                id: "All-time", 
                label: "All-time", 
                icon: <Zap className="w-4 h-4" />
              }
            ]}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
            variant="underline"
            size="md"
          />
        </div>

        {/* Rankings Content */}
        <div className="px-4 space-y-8 pb-24">
          {/* Contest Rankings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#ff22fb]" />
                <h3 className="text-lg font-semibold text-[#c9d1d9]">Contest Leaderboards</h3>
              </div>
              <Button 
                size="sm" 
                onClick={() => onNavigate?.("Contests")}
                className="bg-[#ff4400] hover:bg-[#ff4400]/90 text-white text-xs"
              >
                View Contests
              </Button>
            </div>
            
            {/* Active Contest Rankings */}
            <Card className="bg-[#161b22] border-[#30363d] hover:bg-[#21262d] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-[#c9d1d9]">Remix Rumble Contest</h4>
                    <p className="text-xs text-[#8b949e]">Ends in 2 days • 342 participants</p>
                  </div>
                  <Badge className="bg-[#d29922] text-white">LIVE</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-[#d29922]" />
                    <span className="text-sm text-[#c9d1d9]">1st: DarkBeater - 1,250 votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#8b949e]" />
                    <span className="text-sm text-[#c9d1d9]">2nd: SynthGrover - 980 votes</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white"
                  onClick={() => onOpenContestDetail?.("remix-rumble")}
                >
                  View Contest Details
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Top Remixers */}
          {renderUserRanking(topRemixers, "Top Remixers", "bg-[#ff22fb]", 'remixers')}

          {/* Top Performers */}
          {renderUserRanking(topPerformers, "Top Performers", "bg-[#ff4400]", 'performers')}

          {/* Most Liked Performers */}
          {renderUserRanking(mostLikedPerformers, "Most Liked Performers", "bg-[#2ea043]", 'performers')}

          {/* Top Remixes by Genre */}
          {renderTrackRanking(topRemixesByGenre, "Top Remixes by Genre", "bg-[#d29922]")}

          {/* Top Tracks by Popularity */}
          {renderTrackRanking(topTracksByPopularity, "Top Tracks by Popularity", "bg-[#8b5cf6]")}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="Rankings" 
        onNavigate={onNavigate || (() => {})} 
      />
    </div>
  );
}