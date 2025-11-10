import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Award, Calendar, Users, Music, Heart, Play, Star, Crown, Trophy, Target, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import BottomNavigation from "./BottomNavigation";

// Import images from existing assets
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgUserAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgUserAvatar2 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgRemixCover from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";

interface DetailRankingPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenContestDetail?: (contestId: string) => void;
  onOpenPublicProfile?: (userId: string) => void;
  rankingId?: string;
  category?: 'remixers' | 'performers' | 'tracks' | 'genres';
}

interface RankingData {
  id: string;
  name: string;
  avatar: string;
  currentRank: number;
  previousRank: number;
  category: string;
  stats: {
    totalPlays: string;
    totalLikes: string;
    totalRemixes: string;
    avgRating: number;
    followers: string;
  };
  achievements: Array<{
    title: string;
    icon: string;
    date: string;
    type: 'gold' | 'silver' | 'bronze';
  }>;
  recentTracks: Array<{
    id: string;
    title: string;
    plays: string;
    likes: string;
    cover: string;
    rank: number;
  }>;
  weeklyStats: Array<{
    week: string;
    rank: number;
    plays: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export default function DetailRankingPage({ onBack, onNavigate, onOpenContestDetail, onOpenPublicProfile, rankingId = "1", category = "remixers" }: DetailRankingPageProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock detailed ranking data
  const rankingData: RankingData = {
    id: "1",
    name: "DarkBeater",
    avatar: imgUserAvatar,
    currentRank: 1,
    previousRank: 3,
    category: "Top Remixer",
    stats: {
      totalPlays: "5.2M",
      totalLikes: "340K",
      totalRemixes: "2.1K",
      avgRating: 4.8,
      followers: "125K"
    },
    achievements: [
      { title: "Remix Master", icon: "🏆", date: "Dec 2024", type: "gold" },
      { title: "Top Weekly", icon: "⭐", date: "Nov 2024", type: "silver" },
      { title: "Rising Star", icon: "🌟", date: "Oct 2024", type: "bronze" },
      { title: "Community Choice", icon: "❤️", date: "Sep 2024", type: "gold" }
    ],
    recentTracks: [
      { id: "1", title: "Midnight Groove", plays: "250K", likes: "15K", cover: imgTrackCover, rank: 1 },
      { id: "2", title: "Electric Dreams", plays: "180K", likes: "12K", cover: imgRemixCover, rank: 3 },
      { id: "3", title: "Neon Nights", plays: "120K", likes: "8K", cover: imgAlbumArt, rank: 7 }
    ],
    weeklyStats: [
      { week: "W4", rank: 1, plays: 45000, trend: "up" },
      { week: "W3", rank: 2, plays: 42000, trend: "up" },
      { week: "W2", rank: 3, plays: 38000, trend: "stable" },
      { week: "W1", rank: 3, plays: 35000, trend: "down" }
    ]
  };

  const topCompetitors = [
    { rank: 2, name: "SynthGrover", avatar: imgUserAvatar1, change: "+1", plays: "4.8M" },
    { rank: 3, name: "GrooveBot", avatar: imgUserAvatar2, change: "-2", plays: "4.5M" },
    { rank: 4, name: "BeatMaster", avatar: imgUserAvatar, change: "+3", plays: "4.2M" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-[#d29922]" />;
      case 2:
        return <Trophy className="h-6 w-6 text-[#8b949e]" />;
      case 3:
        return <Star className="h-6 w-6 text-[#cd7f32]" />;
      default:
        return <span className="text-lg font-bold text-[#8b949e]">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-[#2ea043]" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-[#d73a49]" />;
      default:
        return <div className="h-4 w-4 bg-[#8b949e] rounded-full" />;
    }
  };

  const rankChange = rankingData.previousRank - rankingData.currentRank;

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
            <h1 className="text-lg font-semibold text-[#c9d1d9]">Ranking Details</h1>
            <p className="text-sm text-[#8b949e]">{rankingData.category}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Profile Header */}
        <div className="p-6 text-center border-b border-[#30363d]">
          <div className="relative inline-block mb-4">
            <button
              onClick={() => onOpenPublicProfile?.(rankingData.id)}
              className="w-24 h-24 bg-cover bg-center rounded-full border-4 border-[#ff22fb] hover:border-[#ff4400] transition-colors"
              style={{ backgroundImage: `url('${rankingData.avatar}')` }}
            />
            <div className="absolute -top-2 -right-2 bg-[#ff22fb] rounded-full p-2">
              {getRankIcon(rankingData.currentRank)}
            </div>
          </div>
          
          <button
            onClick={() => onOpenPublicProfile?.(rankingData.id)}
            className="text-xl font-bold text-[#c9d1d9] mb-2 hover:text-[#ff22fb] transition-colors"
          >
            {rankingData.name}
          </button>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-[#ff22fb] text-white">
              Rank #{rankingData.currentRank}
            </Badge>
            {rankChange > 0 && (
              <Badge className="bg-[#2ea043] text-white flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{rankChange}
              </Badge>
            )}
            {rankChange < 0 && (
              <Badge className="bg-[#d73a49] text-white flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                {rankChange}
              </Badge>
            )}
          </div>

          {/* View Profile Button */}
          <Button 
            onClick={() => onOpenPublicProfile?.(rankingData.id)}
            className="mb-4 bg-[#ff4400] hover:bg-[#ff4400]/90 text-white"
          >
            View Full Profile
          </Button>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[#ff22fb]">{rankingData.stats.totalPlays}</p>
              <p className="text-xs text-[#8b949e]">Total Plays</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#ff22fb]">{rankingData.stats.totalLikes}</p>
              <p className="text-xs text-[#8b949e]">Total Likes</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#ff22fb]">{rankingData.stats.totalRemixes}</p>
              <p className="text-xs text-[#8b949e]">Remixes</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid grid-cols-4 w-full bg-[#21262d] mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">Achievements</TabsTrigger>
            <TabsTrigger value="tracks" className="text-xs">Tracks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 pb-24">
            {/* Contest History */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#c9d1d9] flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#ff22fb]" />
                  Contest Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-[#161b22] rounded">
                  <div>
                    <p className="text-sm font-semibold text-[#c9d1d9]">Remix Rumble</p>
                    <p className="text-xs text-[#8b949e]">Currently leading • 1,250 votes</p>
                  </div>
                  <Badge className="bg-[#d29922] text-white">1st</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#161b22] rounded">
                  <div>
                    <p className="text-sm font-semibold text-[#c9d1d9]">Beat Drop Challenge</p>
                    <p className="text-xs text-[#8b949e]">Finished 2nd • $1,500 prize</p>
                  </div>
                  <Badge className="bg-[#8b949e] text-white">2nd</Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-[#ff4400] hover:bg-[#ff4400]/90 text-white"
                  onClick={() => onNavigate?.("Contests")}
                >
                  View All Contests
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#c9d1d9] flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#ff22fb]" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e]">Average Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= rankingData.stats.avgRating ? 'text-[#d29922] fill-current' : 'text-[#30363d]'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[#c9d1d9] font-semibold">{rankingData.stats.avgRating}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#8b949e]">Followers</span>
                  <span className="text-[#c9d1d9] font-semibold">{rankingData.stats.followers}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8b949e]">Rank Progress</span>
                    <span className="text-[#c9d1d9]">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-[#8b949e]">15% to reach next milestone</p>
                </div>
              </CardContent>
            </Card>

            {/* Competition */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#c9d1d9] flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#ff22fb]" />
                  Top Competitors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCompetitors.map((competitor) => (
                  <button
                    key={competitor.rank}
                    onClick={() => onOpenPublicProfile?.(competitor.name.toLowerCase())}
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#161b22] transition-colors"
                  >
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(competitor.rank)}
                    </div>
                    <div 
                      className="w-10 h-10 bg-cover bg-center rounded-full"
                      style={{ backgroundImage: `url('${competitor.avatar}')` }}
                    />
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-[#c9d1d9] hover:text-[#ff22fb] transition-colors">{competitor.name}</p>
                      <p className="text-xs text-[#8b949e]">{competitor.plays} plays</p>
                    </div>
                    <Badge 
                      className={`${
                        competitor.change.startsWith('+') ? 'bg-[#2ea043]' : 'bg-[#d73a49]'
                      } text-white text-xs`}
                    >
                      {competitor.change}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 pb-24">
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#c9d1d9] flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#ff22fb]" />
                  Weekly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rankingData.weeklyStats.map((week, index) => (
                    <div key={week.week} className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-[#8b949e] font-semibold">{week.week}</span>
                        <div className="flex items-center gap-2">
                          {getRankIcon(week.rank)}
                          {getTrendIcon(week.trend)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#c9d1d9] font-semibold">{week.plays.toLocaleString()}</p>
                        <p className="text-xs text-[#8b949e]">plays</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Growth */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#c9d1d9] flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#ff22fb]" />
                  Monthly Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[#161b22] rounded-lg">
                    <p className="text-lg font-bold text-[#2ea043]">+127%</p>
                    <p className="text-xs text-[#8b949e]">Plays Growth</p>
                  </div>
                  <div className="text-center p-3 bg-[#161b22] rounded-lg">
                    <p className="text-lg font-bold text-[#2ea043]">+89%</p>
                    <p className="text-xs text-[#8b949e]">Likes Growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 pb-24">
            <div className="grid grid-cols-2 gap-3">
              {rankingData.achievements.map((achievement, index) => (
                <Card key={index} className={`bg-[#21262d] border-2 ${
                  achievement.type === 'gold' ? 'border-[#d29922]' : 
                  achievement.type === 'silver' ? 'border-[#8b949e]' : 
                  'border-[#cd7f32]'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold text-[#c9d1d9] mb-1">{achievement.title}</h3>
                    <p className="text-xs text-[#8b949e]">{achievement.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <CardTitle className="text-[#c9d1d9] flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#ff22fb]" />
                  Next Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8b949e]">🏆 Hall of Fame</span>
                    <span className="text-[#c9d1d9]">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8b949e]">🌟 Legend Status</span>
                    <span className="text-[#c9d1d9]">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracks Tab */}
          <TabsContent value="tracks" className="space-y-4 pb-24">
            {rankingData.recentTracks.map((track) => (
              <Card key={track.id} className="bg-[#21262d] border-[#30363d]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(track.rank)}
                  </div>
                  <div 
                    className="w-12 h-12 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url('${track.cover}')` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#c9d1d9]">{track.title}</h3>
                    <p className="text-xs text-[#8b949e]">{track.plays} plays • {track.likes} likes</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-[#8b949e] hover:text-[#ff22fb] p-2">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-[#8b949e] hover:text-[#ff22fb] p-2">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="Rankings" 
        onNavigate={onNavigate || (() => {})} 
      />
    </div>
  );
}