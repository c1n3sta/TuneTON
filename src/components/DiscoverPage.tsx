import { useState } from "react";
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  Plus,
  TrendingUp,
  Flame,
  Star,
  Users,
  Music,
  Zap,
  Crown,
  Globe,
  Calendar,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Trophy
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { Button } from "./ui/button-component";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Import images
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgPlaylistCover from "figma:asset/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png";  
import imgPlaylistCover1 from "figma:asset/059d630bf1b73c65663230f6fe3660d07bc060b8.png";
import imgPlaylistCover2 from "figma:asset/20bb8fe31b212ec3236e8224dd3efe441043be2f.png";
import imgRemixerAvatar from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgRemixerAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgRemixerAvatar2 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";
import imgFeaturedRemixCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";

interface DiscoverPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string, page?: string) => void;
  onTrackSelect?: (track: string) => void;
}

export default function DiscoverPage({ onBack, onNavigate, onTrackSelect }: DiscoverPageProps) {
  const [activeTab, setActiveTab] = useState("trending");

  const featuredContent = {
    trending: [
      {
        id: "1",
        title: "Neon Dreams (Lo-Fi Remix)",
        artist: "LoFiMaster",
        originalArtist: "Synthwave Pro",
        cover: imgFeaturedRemixCover,
        type: "remix",
        plays: 45600,
        likes: 3200,
        tags: ["Lo-Fi", "Trending", "Viral"],
        isNew: true
      },
      {
        id: "2",
        title: "Speed Challenge Winner",
        artist: "FlashRemixer",
        originalArtist: "Electronic Vibes",
        cover: imgTrackCover,
        type: "remix",
        plays: 28900,
        likes: 2100,
        tags: ["Speed", "Contest", "Winner"],
        isNew: false
      },
      {
        id: "3",
        title: "AI Generated Masterpiece",
        artist: "AI Studio Pro",
        originalArtist: "Classical Mix",
        cover: imgAlbumArt,
        type: "ai_generated", 
        plays: 67800,
        likes: 4500,
        tags: ["AI", "Experimental", "Viral"],
        isNew: true
      }
    ],
    global: [
      {
        id: "1",
        title: "Tokyo Night Vibes",
        artist: "JapanBeats",
        country: "Japan",
        cover: imgPlaylistCover,
        type: "playlist",
        followers: "127K",
        tracks: 45,
        tags: ["Asia", "Lo-Fi", "Night"]
      },
      {
        id: "2", 
        title: "European Summer Mix",
        artist: "EuroRemix",
        country: "Germany",
        cover: imgPlaylistCover1,
        type: "playlist", 
        followers: "89K",
        tracks: 32,
        tags: ["Europe", "Summer", "Dance"]
      },
      {
        id: "3",
        title: "American Dream Remix",
        artist: "USABeats",
        country: "USA",
        cover: imgPlaylistCover2,
        type: "playlist",
        followers: "156K", 
        tracks: 28,
        tags: ["USA", "Hip-Hop", "Modern"]
      }
    ],
    genres: [
      {
        id: "lofi",
        name: "Lo-Fi Hip Hop",
        cover: imgPlaylistCover,
        trackCount: "2.1K tracks",
        gradient: "from-purple-500 to-pink-500",
        description: "Chill beats and nostalgic vibes"
      },
      {
        id: "synthwave", 
        name: "Synthwave",
        cover: imgPlaylistCover1,
        trackCount: "1.8K tracks",
        gradient: "from-cyan-500 to-blue-500",
        description: "Retro futuristic electronic music"
      },
      {
        id: "speed",
        name: "Speed Remixes", 
        cover: imgPlaylistCover2,
        trackCount: "890 tracks",
        gradient: "from-red-500 to-orange-500", 
        description: "High energy tempo boosted tracks"
      },
      {
        id: "ai",
        name: "AI Generated",
        cover: imgAlbumArt,
        trackCount: "1.3K tracks", 
        gradient: "from-green-500 to-teal-500",
        description: "Music created by artificial intelligence"
      }
    ]
  };

  const topRemixers = [
    {
      id: "1",
      name: "LoFiMaster",
      avatar: imgRemixerAvatar,
      followers: "45.2K",
      totalRemixes: 267,
      totalLikes: "2.1M",
      isVerified: true,
      speciality: "Lo-Fi & Chill"
    },
    {
      id: "2",
      name: "SpeedDemon",
      avatar: imgRemixerAvatar1, 
      followers: "32.8K",
      totalRemixes: 189,
      totalLikes: "1.7M",
      isVerified: true,
      speciality: "Tempo & Bass"
    },
    {
      id: "3",
      name: "VocalKing",
      avatar: imgRemixerAvatar2,
      followers: "28.1K", 
      totalRemixes: 145,
      totalLikes: "1.3M",
      isVerified: false,
      speciality: "Vocal Processing"
    }
  ];

  const handlePlayTrack = (track: string) => {
    if (onTrackSelect) {
      onTrackSelect(track);
    }
    if (onNavigate) {
      onNavigate("Player", "player");
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
          
          {/* Header */}
          <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-full"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="font-medium">Discover</h1>
                  <p className="text-sm text-muted-foreground">Explore trending music</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Filter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Globe className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-32 space-y-6">
            
            {/* Discover Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trending" className="text-xs">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="global" className="text-xs">
                  <Globe className="w-4 h-4 mr-1" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="genres" className="text-xs">
                  <Music className="w-4 h-4 mr-1" />
                  Genres
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-6 mt-6">
                {/* Featured Trending */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-destructive" />
                      <h2 className="font-medium">Hot Right Now</h2>
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        LIVE
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      See all
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {featuredContent.trending.map((item, index) => (
                      <Card 
                        key={item.id}
                        className="cursor-pointer hover:bg-accent transition-colors relative overflow-hidden"
                        onClick={() => item.type === "remix" ? onNavigate?.("Home", "remix-detail") : handlePlayTrack(item.title)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <span className="absolute -left-2 -top-2 text-lg font-bold text-chart-1">
                                #{index + 1}
                              </span>
                              <div 
                                className="w-16 h-16 rounded-xl bg-cover bg-center border border-border"
                                style={{ backgroundImage: `url('${item.cover}')` }}
                              />
                              {item.isNew && (
                                <Badge className="absolute -top-1 -right-1 text-xs h-5 bg-destructive text-destructive-foreground">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{item.title}</h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.type === "remix" ? `${item.artist} • Original by ${item.originalArtist}` : item.artist}
                              </p>
                              <div className="flex items-center gap-1 flex-wrap mt-1">
                                {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs h-4">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Play className="w-3 h-3" />
                                  {item.plays.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {item.likes.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                              <Play className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Top Remixers */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-chart-4" />
                    <h2 className="font-medium">Top Remixers</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {topRemixers.map((remixer, index) => (
                      <Card 
                        key={remixer.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onNavigate?.("Home", "public-profile")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-chart-4 w-6">
                                #{index + 1}
                              </span>
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={remixer.avatar} />
                                <AvatarFallback>{remixer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium truncate">{remixer.name}</h4>
                                {remixer.isVerified && (
                                  <Badge variant="secondary" className="h-4 px-1">
                                    <Crown className="w-2 h-2" />
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{remixer.speciality}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {remixer.followers}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Music className="w-3 h-3" />
                                  {remixer.totalRemixes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {remixer.totalLikes}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Follow
                            </Button>
                          </div>  
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="global" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-chart-2" />
                    <h2 className="font-medium">Global Charts</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {featuredContent.global.map((item, index) => (
                      <Card 
                        key={item.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onNavigate?.("Library", "playlist-detail")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <span className="absolute -left-2 -top-2 text-lg font-bold text-chart-2">
                                #{index + 1}
                              </span>
                              <div 
                                className="w-16 h-16 rounded-xl bg-cover bg-center border border-border"
                                style={{ backgroundImage: `url('${item.cover}')` }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{item.title}</h4>
                              <p className="text-sm text-muted-foreground truncate">{item.artist} • {item.country}</p>
                              <div className="flex items-center gap-1 flex-wrap mt-1">
                                {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs h-4">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {item.followers}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Music className="w-3 h-3" />
                                  {item.tracks} tracks
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                              <Play className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="genres" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-chart-3" />
                    <h2 className="font-medium">Browse Genres</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {featuredContent.genres.map((genre) => (
                      <Card 
                        key={genre.id}
                        className="cursor-pointer hover:bg-accent transition-colors relative overflow-hidden"
                        onClick={() => onNavigate?.("Library", "playlist-detail")}
                      >
                        <CardContent className="p-0">
                          <div className={`relative h-24 bg-gradient-to-r ${genre.gradient} rounded-t-lg`}>
                            <div 
                              className="absolute inset-0 bg-cover bg-center opacity-20 rounded-t-lg"
                              style={{ backgroundImage: `url('${genre.cover}')` }}
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-t-lg" />
                            <div className="absolute bottom-3 left-4 right-4">
                              <h4 className="font-medium text-white">{genre.name}</h4>
                              <p className="text-xs text-white/80">{genre.trackCount}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/20 hover:bg-white/30 text-white"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground">{genre.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

          </div>

          {/* Quick Access Footer */}
          <div className="px-6 pb-6">
            <Card className="bg-gradient-to-r from-chart-1/10 to-chart-2/10 border-chart-1/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">Ready to create?</h4>
                    <p className="text-xs text-muted-foreground">Start making your own remixes</p>
                  </div>
                  <Button 
                    className="gap-2"
                    onClick={() => onNavigate?.("Home", "ai-studio")}
                  >
                    <Zap className="w-4 h-4" />
                    AI Studio
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => onNavigate?.("Library")}
                  >
                    <Music className="w-4 h-4" />
                    My Library
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => onNavigate?.("Contests", "contests")}
                  >
                    <Trophy className="w-4 h-4" />
                    Contests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}