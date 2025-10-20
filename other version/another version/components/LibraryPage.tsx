import { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Search,
  MoreHorizontal,
  Play,
  Heart,
  Download,
  Grid3X3,
  List,
  Clock,
  Music,
  User,
  Folder,
  Star,
  Filter,
  Share2,
  Edit,
  Trash2,
  Bot,
  Compass
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

// Import images
import imgPlaylistCover from "figma:asset/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png";
import imgPlaylistCover1 from "figma:asset/059d630bf1b73c65663230f6fe3660d07bc060b8.png";
import imgPlaylistCover2 from "figma:asset/20bb8fe31b212ec3236e8224dd3efe441043be2f.png";
import imgPlaylistCover3 from "figma:asset/a1ad22f09bf6f15ef5bc637a1785d31b1ca3884a.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgRemixerAvatar from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgRemixerAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";

interface LibraryPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string, page?: string) => void;
  onTrackSelect?: (track: string) => void;
  user?: any;
}

export default function LibraryPage({ onBack, onNavigate, onTrackSelect, user }: LibraryPageProps) {
  const [activeTab, setActiveTab] = useState("playlists");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const userPlaylists = [
    {
      id: "1",
      title: "My Lo-Fi Collection",
      description: "Chill beats for focus",
      cover: imgPlaylistCover,
      trackCount: 47,
      isPrivate: false,
      lastUpdated: "2 days ago",
      totalDuration: "3h 12m",
      isLiked: true
    },
    {
      id: "2", 
      title: "Speed Remixes",
      description: "High energy tempo boosted tracks",
      cover: imgPlaylistCover1,
      trackCount: 23,
      isPrivate: false,
      lastUpdated: "1 week ago", 
      totalDuration: "1h 45m",
      isLiked: false
    },
    {
      id: "3",
      title: "AI Experiments",
      description: "My AI-generated masterpieces",
      cover: imgPlaylistCover2,
      trackCount: 15,
      isPrivate: true,
      lastUpdated: "3 days ago",
      totalDuration: "58m",
      isLiked: true
    },
    {
      id: "4",
      title: "Favorites",
      description: "All-time favorite tracks",
      cover: imgPlaylistCover3,
      trackCount: 89,
      isPrivate: false,
      lastUpdated: "Yesterday",
      totalDuration: "5h 32m",
      isLiked: true
    }
  ];

  const likedTracks = [
    {
      id: "1",
      title: "Starlight Serenade",
      artist: "MelodyMix Artist",
      cover: imgAlbumArt,
      duration: "3:23",
      dateAdded: "2 days ago",
      album: "Night Vibes"
    },
    {
      id: "2",
      title: "Sunset Drive", 
      artist: "Chillwave Collective",
      cover: imgTrackCover,
      duration: "4:12",
      dateAdded: "1 week ago",
      album: "Summer Dreams"
    },
    {
      id: "3",
      title: "City Lights",
      artist: "Urban Beats",
      cover: imgTrackCover1,
      duration: "3:45",
      dateAdded: "3 days ago", 
      album: "Metropolitan"
    }
  ];

  const followedArtists = [
    {
      id: "1",
      name: "MelodyMix Artist",
      avatar: imgRemixerAvatar,
      followers: "2.1M",
      isVerified: true,
      latestRelease: "Starlight Serenade",
      monthlyListeners: "1.8M"
    },
    {
      id: "2",
      name: "Chillwave Collective", 
      avatar: imgRemixerAvatar1,
      followers: "1.8M",
      isVerified: true,
      latestRelease: "Ocean Waves",
      monthlyListeners: "1.5M"
    }
  ];

  const downloadedContent = [
    {
      id: "1",
      title: "Lo-Fi Study Mix",
      type: "playlist",
      cover: imgPlaylistCover,
      size: "245 MB",
      downloadDate: "Yesterday",
      trackCount: 32
    },
    {
      id: "2",
      title: "Neon Dreams (Lo-Fi Remix)",
      type: "track", 
      cover: imgAlbumArt,
      size: "8.2 MB",
      downloadDate: "2 days ago",
      artist: "LoFiMaster"
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

  const handleCreatePlaylist = () => {
    // In real app, this would open a create playlist modal
    console.log("Create playlist");
  };

  const filteredPlaylists = userPlaylists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTracks = likedTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <h1 className="font-medium">Your Library</h1>
                  <p className="text-sm text-muted-foreground">Music collection</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                >
                  {viewMode === "grid" ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted border-0"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-32 space-y-6">
            
            {/* Library Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="playlists" className="text-xs">
                  <Music className="w-3 h-3 mr-1" />
                  Lists
                </TabsTrigger>
                <TabsTrigger value="liked" className="text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Liked
                </TabsTrigger>
                <TabsTrigger value="artists" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Artists
                </TabsTrigger>
                <TabsTrigger value="downloads" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Saved
                </TabsTrigger>
              </TabsList>

              <TabsContent value="playlists" className="space-y-4 mt-6">
                {/* Create Playlist Button */}
                <Card 
                  className="cursor-pointer hover:bg-accent transition-colors border-dashed"
                  onClick={handleCreatePlaylist}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Create Playlist</h4>
                        <p className="text-sm text-muted-foreground">Build your music collection</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Playlists Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredPlaylists.map((playlist) => (
                      <Card 
                        key={playlist.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onNavigate?.("Library", "playlist-detail")}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="relative">
                            <div 
                              className="w-full aspect-square rounded-lg bg-cover bg-center border border-border"
                              style={{ backgroundImage: `url('${playlist.cover}')` }}
                            />
                            {playlist.isPrivate && (
                              <Badge className="absolute top-2 right-2 text-xs h-5">
                                Private
                              </Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute bottom-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm truncate">{playlist.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{playlist.trackCount} tracks</p>
                            <p className="text-xs text-muted-foreground truncate">{playlist.totalDuration}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredPlaylists.map((playlist) => (
                      <Card 
                        key={playlist.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onNavigate?.("Library", "playlist-detail")}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                              style={{ backgroundImage: `url('${playlist.cover}')` }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm truncate">{playlist.title}</h4>
                                {playlist.isPrivate && (
                                  <Badge variant="outline" className="text-xs h-4">
                                    Private
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{playlist.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span>{playlist.trackCount} tracks</span>
                                <span>•</span>
                                <span>{playlist.totalDuration}</span>
                                <span>•</span>
                                <span>{playlist.lastUpdated}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {playlist.isLiked && (
                                <Heart className="w-4 h-4 text-destructive fill-current" />
                              )}
                              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="liked" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive" />
                    <h2 className="font-medium">Liked Songs</h2>
                    <Badge variant="secondary" className="text-xs">
                      {likedTracks.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {filteredTracks.map((track) => (
                    <Card 
                      key={track.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handlePlayTrack(track.title)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                            style={{ backgroundImage: `url('${track.cover}')` }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{track.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{track.duration}</span>
                              <span>•</span>
                              <span>{track.album}</span>
                              <span>•</span>
                              <span>Added {track.dateAdded}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-destructive">
                              <Heart className="w-4 h-4 fill-current" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="artists" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-chart-2" />
                    <h2 className="font-medium">Following</h2>
                    <Badge variant="secondary" className="text-xs">
                      {followedArtists.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {followedArtists.map((artist) => (
                    <Card 
                      key={artist.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => onNavigate?.("Home", "artist-page")}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={artist.avatar} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate">{artist.name}</h4>
                              {artist.isVerified && (
                                <Badge variant="secondary" className="h-4 px-1">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{artist.followers} followers</p>
                            <p className="text-xs text-muted-foreground">
                              Latest: {artist.latestRelease}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {artist.monthlyListeners} monthly listeners
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Following
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="downloads" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-chart-3" />
                    <h2 className="font-medium">Downloaded</h2>
                    <Badge variant="secondary" className="text-xs">
                      {downloadedContent.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">253 MB used</span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {downloadedContent.map((item) => (
                    <Card 
                      key={item.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => item.type === "playlist" ? onNavigate?.("Library", "playlist-detail") : handlePlayTrack(item.title)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div 
                              className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                              style={{ backgroundImage: `url('${item.cover}')` }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-chart-3 rounded-full flex items-center justify-center">
                              <Download className="w-3 h-3 text-primary-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.type === "playlist" ? `${item.trackCount} tracks` : item.artist}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{item.size}</span>
                              <span>•</span>
                              <span>Downloaded {item.downloadDate}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

          </div>

          {/* Quick Actions Footer */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="gap-2 h-12"
                onClick={() => onNavigate?.("Home", "ai-studio")}
              >
                <Bot className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">AI Studio</div>
                  <div className="text-xs text-muted-foreground">Create remixes</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 h-12"
                onClick={() => onNavigate?.("Home", "discover")}
              >
                <Compass className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Discover</div>
                  <div className="text-xs text-muted-foreground">Find new music</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}