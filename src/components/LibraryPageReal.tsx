import { useState, useEffect } from "react";
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
  Compass,
  Loader2
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { Button } from "./ui/button-component";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

// API imports
import { tuneTONAPI, TuneTONAPI, TuneTONPlaylist, LibraryStats, getPlaylistDuration, formatDateAdded } from "../utils/tuneton-api";
import { jamendoAPI, JamendoTrack } from "../utils/jamendo-api";

interface LibraryPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string, page?: string, data?: any) => void;
  onTrackSelect?: (track: JamendoTrack) => void;
  user?: any;
}

export default function LibraryPageReal({ onBack, onNavigate, onTrackSelect, user }: LibraryPageProps) {
  const [activeTab, setActiveTab] = useState("playlists");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Data states
  const [playlists, setPlaylists] = useState<TuneTONPlaylist[]>([]);
  const [likedTracks, setLikedTracks] = useState<JamendoTrack[]>([]);
  const [libraryStats, setLibraryStats] = useState({ playlistCount: 0, likedTracksCount: 0, totalTracks: 0 });
  
  // Create playlist form
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    isPrivate: false
  });

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    setLoading(true);
    try {
      // Set auth token if user is logged in
      if (user?.access_token) {
        console.log('🔐 LibraryPageReal: Setting access token:', user.access_token);
        tuneTONAPI.setAccessToken(user.access_token, user.id);
      } else {
        console.warn('🔐 LibraryPageReal: No access token available', { user });
      }

      console.log('🔐 LibraryPageReal: Starting API calls...');

      const [playlistsData, likedTracksData, statsData] = await Promise.all([
        tuneTONAPI.getUserPlaylists(user?.id || '').catch((err): TuneTONPlaylist[] => {
          console.error('🔐 getUserPlaylists failed:', err);
          return [];
        }),
        tuneTONAPI.getLikedTracks(user?.id || '').catch((err): JamendoTrack[] => {
          console.error('🔐 getLikedTracks failed:', err);
          return [];
        }),
        tuneTONAPI.getLibraryStats(user?.id || '').catch((err): LibraryStats => {
          console.error('🔐 getLibraryStats failed:', err);
          return { playlistCount: 0, likedTracksCount: 0, totalTracks: 0 };
        })
      ]);

      console.log('🔐 LibraryPageReal: API calls completed', { playlistsData, likedTracksData, statsData });

      setPlaylists(playlistsData);
      setLikedTracks(likedTracksData);
      setLibraryStats(statsData);
    } catch (error) {
      console.error('Failed to load library data:', error);
      toast.error('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      const playlist = await tuneTONAPI.createPlaylist({
        user_id: user?.id || '',
        title: newPlaylist.name,
        description: newPlaylist.description || '',
        is_public: !newPlaylist.isPrivate
      });

      if (playlist) {
        setPlaylists(prev => [playlist, ...prev]);
        setNewPlaylist({ name: "", description: "", isPrivate: false });
        setShowCreateDialog(false);
        toast.success('Playlist created successfully!');
      } else {
        toast.error('Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const success = await tuneTONAPI.deletePlaylist(playlistId);
      if (success) {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        toast.success('Playlist deleted');
      } else {
        toast.error('Failed to delete playlist');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const handleToggleTrackLike = async (track: JamendoTrack, isCurrentlyLiked: boolean) => {
    try {
      const newLikedState = await tuneTONAPI.toggleTrackLike(track, !isCurrentlyLiked, user?.id || '');
      
      if (newLikedState !== isCurrentlyLiked) {
        if (newLikedState) {
          setLikedTracks(prev => [...prev, { ...track, isLiked: true }]);
        } else {
          setLikedTracks(prev => prev.filter(t => t.id !== track.id));
        }
        toast.success(newLikedState ? 'Added to liked songs' : 'Removed from liked songs');
      }
    } catch (error) {
      console.error('Error toggling track like:', error);
      toast.error('Failed to update liked songs');
    }
  };

  const handlePlayTrack = (track: JamendoTrack) => {
    if (onTrackSelect) {
      onTrackSelect(track);
    }
    if (onNavigate) {
      onNavigate("Player", "player");
    }
  };

  const handleOpenPlaylist = (playlist: TuneTONPlaylist) => {
    if (onNavigate) {
      onNavigate("Library", "playlist-detail-real", { playlist });
    }
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTracks = likedTracks.filter(track =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-foreground flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your library...</span>
        </div>
      </div>
    );
  }

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
                  <p className="text-sm text-muted-foreground">
                    {libraryStats.playlistCount} playlists • {libraryStats.likedTracksCount} liked
                  </p>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="playlists" className="text-xs">
                  <Music className="w-3 h-3 mr-1" />
                  Playlists
                </TabsTrigger>
                <TabsTrigger value="liked" className="text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Liked
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
                  onClick={() => setShowCreateDialog(true)}
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
                        onClick={() => handleOpenPlaylist(playlist)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="relative">
                            <div className="w-full aspect-square rounded-lg bg-muted border border-border flex items-center justify-center">
                              {playlist.cover_image_url ? (
                                <ImageWithFallback 
                                  src={playlist.cover_image_url}
                                  alt={playlist.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Music className="w-8 h-8 text-muted-foreground" />
                              )}
                            </div>
                            {!playlist.is_public && (
                              <Badge className="absolute top-2 right-2 text-xs h-5">
                                Private
                              </Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute bottom-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (playlist.track_count > 0) {
                                  // Play first track - would need to fetch tracks first
                              // handlePlayTrack(playlist.tracks[0]);
                                }
                              }}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{playlist.track_count} tracks</p>
                            <p className="text-xs text-muted-foreground truncate">{playlist.track_count > 0 ? Math.floor(playlist.track_count * 180 / 60) + ' min' : '0 min'}</p>
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
                        onClick={() => handleOpenPlaylist(playlist)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                              {playlist.cover_image_url ? (
                                <ImageWithFallback 
                                  src={playlist.cover_image_url}
                                  alt={playlist.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Music className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
                                {!playlist.is_public && (
                                  <Badge variant="outline" className="text-xs h-4">
                                    Private
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{playlist.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span>{playlist.track_count} tracks</span>
                                <span>•</span>
                                <span>{playlist.track_count > 0 ? Math.floor(playlist.track_count * 180 / 60) + ' min' : '0 min'}</span>
                                <span>•</span>
                                <span>{formatDateAdded(playlist.updated_at)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-6 h-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePlaylist(playlist.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
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
                      onClick={() => handlePlayTrack(track)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted border border-border">
                            <ImageWithFallback 
                              src={track.image || track.album_image}
                              alt={track.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{track.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{track.artist_name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                              <span>•</span>
                              <span>{track.album_name}</span>
                              {'likedAt' in track && track.likedAt && typeof track.likedAt === 'string' && (
                                <>
                                  <span>•</span>
                                  <span>Added {formatDateAdded(track.likedAt)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-6 h-6 p-0 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTrackLike(track, true);
                              }}
                            >
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

              <TabsContent value="downloads" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-chart-3" />
                    <h2 className="font-medium">Downloaded</h2>
                    <Badge variant="secondary" className="text-xs">
                      0
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">0 MB used</span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Download className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No downloaded content yet</p>
                  <p className="text-xs">Downloaded tracks will appear here</p>
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

      {/* Create Playlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playlist-name">Playlist Name</Label>
              <Input
                id="playlist-name"
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Awesome Playlist"
              />
            </div>
            <div>
              <Label htmlFor="playlist-description">Description (Optional)</Label>
              <Textarea
                id="playlist-description"
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your playlist..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="playlist-private"
                checked={newPlaylist.isPrivate}
                onCheckedChange={(checked) => setNewPlaylist(prev => ({ ...prev, isPrivate: checked }))}
              />
              <Label htmlFor="playlist-private">Make this playlist private</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlaylist}>
              Create Playlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}