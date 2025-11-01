import { useState, useEffect } from "react";
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
  Filter,
  Loader2,
  Trash2,
  Edit,
  X
} from "lucide-react";
import { Button } from "./ui/button-component";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

// API imports
import { tuneTONAPI, TuneTONPlaylist, getPlaylistDuration, formatDateAdded } from "../utils/tuneton-api";
import { jamendoAPI, JamendoTrack, searchMusicForRemix } from "../utils/jamendo-api";

interface PlaylistDetailRealProps {
  onBack?: () => void;
  onPlayTrack?: (track: JamendoTrack) => void;
  onNavigate?: (tab: string) => void;
  playlist?: TuneTONPlaylist;
  playlistId?: string;
  user?: any;
}

export default function PlaylistDetailReal({ 
  onBack, 
  onPlayTrack, 
  onNavigate, 
  playlist: initialPlaylist,
  playlistId,
  user 
}: PlaylistDetailRealProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<TuneTONPlaylist | null>(initialPlaylist || null);
  const [playlistTracks, setPlaylistTracks] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(!initialPlaylist);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<JamendoTrack[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!playlist && playlistId) {
      loadPlaylist();
    }
  }, [playlistId]);

  useEffect(() => {
    // Set auth token
    if (user?.access_token) {
      tuneTONAPI.setAccessToken(user.access_token, user.id);
    }
  }, [user]);

  const loadPlaylist = async () => {
    if (!playlistId) return;
    
    setLoading(true);
    try {
      const playlistData = await tuneTONAPI.getPlaylist(playlistId);
      if (playlistData) {
        setPlaylist(playlistData);
        // Load tracks for the playlist
        const tracks = await tuneTONAPI.getPlaylistTracks(playlistId);
        setPlaylistTracks(tracks);
      } else {
        toast.error('Playlist not found');
        onBack?.();
      }
    } catch (error) {
      console.error('Failed to load playlist:', error);
      toast.error('Failed to load playlist');
      onBack?.();
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: JamendoTrack) => {
    setCurrentlyPlaying(track.id);
    onPlayTrack?.(track);
  };

  const handlePlayPlaylist = () => {
    if (playlist && playlistTracks.length > 0) {
      handlePlayTrack(playlistTracks[0]);
    }
  };

  const handleShufflePlaylist = () => {
    if (playlist && playlistTracks.length > 0) {
      const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];
      handlePlayTrack(randomTrack);
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!playlist) return;

    try {
      const success = await tuneTONAPI.removeTrackFromPlaylist(playlist.id, trackId);
      if (success) {
        // Refresh tracks
        const tracks = await tuneTONAPI.getPlaylistTracks(playlist.id);
        setPlaylistTracks(tracks);
        toast.success('Track removed from playlist');
      } else {
        toast.error('Failed to remove track');
      }
    } catch (error) {
      console.error('Error removing track:', error);
      toast.error('Failed to remove track');
    }
  };

  const handleSearchTracks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchMusicForRemix(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleAddTrack = async (track: JamendoTrack) => {
    if (!playlist) return;

    try {
      const success = await tuneTONAPI.addTrackToPlaylist(playlist.id, track);
      if (success) {
        // Refresh tracks
        const tracks = await tuneTONAPI.getPlaylistTracks(playlist.id);
        setPlaylistTracks(tracks);
        setShowAddTrack(false);
        setSearchQuery("");
        setSearchResults([]);
        toast.success('Track added to playlist');
      } else {
        toast.error('Failed to add track');
      }
    } catch (error) {
      console.error('Error adding track:', error);
      toast.error('Failed to add track');
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-foreground flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading playlist...</span>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="bg-background min-h-screen text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Playlist Not Found</h2>
          <p className="text-muted-foreground mb-4">The playlist you're looking for doesn't exist.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <Button 
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 rounded-full"
              onClick={onBack}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-lg font-semibold">Playlist</h2>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              <MoreHorizontal className="w-6 h-6" />
            </Button>
          </div>

          {/* Playlist Cover and Info */}
          <div className="flex flex-col items-center gap-4 px-6 mb-8">
            <div className="w-44 h-44 rounded-xl bg-muted border border-border flex items-center justify-center">
              {playlist.cover_image_url ? (
                <ImageWithFallback 
                  src={playlist.cover_image_url}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">No Cover</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold mb-1">{playlist.name}</h1>
              <p className="text-sm text-muted-foreground">
                {playlistTracks.length} tracks • {getPlaylistDuration(playlistTracks)}
              </p>
              {playlist.description && (
                <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                {!playlist.is_public && (
                  <Badge variant="outline" className="text-xs">Private</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Updated {formatDateAdded(playlist.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 px-6 mb-8">
            <Button
              onClick={handlePlayPlaylist}
              className="flex-1 gap-2"
              disabled={playlistTracks.length === 0}
            >
              <Play className="w-5 h-5" />
              Play
            </Button>
            <Button
              variant="outline"
              onClick={handleShufflePlaylist}
              className="flex-1 gap-2"
              disabled={playlistTracks.length === 0}
            >
              <Shuffle className="w-5 h-5" />
              Shuffle
            </Button>
          </div>

          {/* Add Track Button */}
          <div className="px-6 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowAddTrack(true)}
              className="w-full gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Tracks
            </Button>
          </div>

          {/* Track List */}
          <div className="px-6 space-y-3 pb-32">
            {playlistTracks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tracks in this playlist yet</p>
                <p className="text-xs">Add some tracks to get started</p>
              </div>
            ) : (
              playlistTracks.map((track, index) => (
                <Card
                  key={`${track.id}-${index}`}
                  className="cursor-pointer hover:bg-accent transition-colors group"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-muted border border-border">
                        <ImageWithFallback 
                          src={track.image || track.album_image}
                          alt={track.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handlePlayTrack(track)}
                      >
                        <h3 className="font-medium text-sm truncate">{track.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{track.artist_name}</p>
                        {'addedAt' in track && track.addedAt && typeof track.addedAt === 'string' && (
                          <p className="text-xs text-muted-foreground">
                            Added {formatDateAdded(track.addedAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTrack(track.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Add Track Dialog */}
      <Dialog open={showAddTrack} onOpenChange={setShowAddTrack}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tracks to Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for tracks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchTracks(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            
            {searching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {searchResults.map((track) => (
                  <Card key={track.id} className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-muted">
                          <ImageWithFallback 
                            src={track.image || track.album_image}
                            alt={track.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{track.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{track.artist_name}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddTrack(track)}
                          disabled={playlistTracks.some(t => t.id === track.id)}
                        >
                          {playlistTracks.some(t => t.id === track.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tracks found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Search for tracks to add</p>
                <p className="text-xs">Type in the search box above</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTrack(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}