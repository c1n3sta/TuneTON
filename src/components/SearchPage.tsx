import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Filter,
  Hash,
  Headphones,
  Heart,
  MoreHorizontal,
  Music,
  Play,
  Search,
  Star,
  TrendingUp,
  User,
  Volume2
} from "lucide-react";
import { useEffect, useState } from "react";
import { jamendoAPI } from "../utils/jamendo-api";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button-component";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Import images

interface SearchPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string, page?: string) => void;
  onTrackSelect?: (track: string) => void;
}

export default function SearchPage({ onBack, onNavigate, onTrackSelect }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState<any>({
    tracks: [],
    artists: [],
    remixes: []
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(["Lo-Fi Beats", "Synthwave Mix", "AI Studio"]);
  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    duration: '',
    sortBy: 'popularity'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const trendingSearches = [
    "Lo-Fi Hip Hop",
    "Synthwave",
    "Speed Remixes",
    "AI Generated",
    "Vocal Remove",
    "Bass Boost"
  ];

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleSearch = async (query: string) => {
    console.log('Handling search for query:', query);

    if (query.trim() === '') {
      setSearchResults({
        tracks: [],
        artists: [],
        remixes: []
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Making search request with filters:', filters);

      // Prepare search parameters with filters
      const searchParams: any = {
        limit: 10
      };

      // Add filters to search parameters
      if (filters.genre) {
        searchParams.tags = [filters.genre];
      }

      if (filters.sortBy === 'popularity') {
        searchParams.order = 'popularity_total';
      } else if (filters.sortBy === 'recent') {
        searchParams.order = 'releasedate_desc';
      } else if (filters.sortBy === 'duration') {
        searchParams.order = 'duration';
      }

      // Search for tracks using Jamendo API with filters
      const [trackResults, artistResults, remixResults] = await Promise.all([
        jamendoAPI.searchTracks({
          search: query,
          limit: 10,
          order: searchParams.order,
          tags: searchParams.tags
        }),
        jamendoAPI.searchArtistsByName(query, 10),
        jamendoAPI.searchTracks({
          search: query,
          limit: 10,
          order: searchParams.order,
          tags: searchParams.tags
        })
      ]);

      console.log('Search results received:', { tracks: trackResults, artists: artistResults, remixes: remixResults });

      // Add to recent searches if not already there
      setRecentSearches(prev => {
        const newRecent = [query, ...prev.filter(item => item !== query)];
        return newRecent.slice(0, 10); // Keep only the last 10 searches
      });

      setSearchResults({
        tracks: trackResults.results.map((track: any) => ({
          id: track.id,
          title: track.name,
          artist: track.artist_name,
          cover: track.album_image || track.image,
          duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
          plays: track.listens_total ? `${Math.floor(track.listens_total / 1000)}K` : '0',
          isLiked: false
        })),
        artists: artistResults.results.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          avatar: artist.image,
          followers: artist.followers || '0 followers',
          isVerified: false,
          topTrack: 'Top track N/A'
        })),
        remixes: remixResults.results.map((track: any) => ({
          id: track.id,
          title: track.name,
          originalArtist: track.artist_name,
          remixer: 'Unknown remixer',
          remixerAvatar: '',
          cover: track.album_image || track.image,
          likes: track.likes || 0,
          plays: track.listens_total || 0,
          effects: ['Remix']
        }))
      });
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setSearchResults({
        tracks: [],
        artists: [],
        remixes: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTrack = (track: any) => {
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
            <div className="flex items-center gap-4 p-6 pb-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full"
                onClick={onBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tracks, artists, remixes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-12 bg-muted border-0"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </Button>
                )}
              </div>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger className="w-10 h-10 p-0 border-0">
                  <Filter className="w-5 h-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-32">

            {!searchQuery && (
              <>
                {/* Trending Searches */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-chart-1" />
                    <h2 className="font-medium">Trending Now</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8"
                        onClick={() => setSearchQuery(term)}
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <h2 className="font-medium">Recent</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => setRecentSearches([])}
                    >
                      Clear all
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {recentSearches.map((term, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSearchQuery(term)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{term}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {searchQuery && (
              <div className="space-y-6">
                {/* Loading and Error States */}
                {isLoading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                    <p className="text-destructive font-medium">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleSearch(searchQuery)}
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Search Results Tabs */}
                {!isLoading && !error && (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                      <TabsTrigger value="tracks" className="text-xs">Tracks</TabsTrigger>
                      <TabsTrigger value="artists" className="text-xs">Artists</TabsTrigger>
                      <TabsTrigger value="remixes" className="text-xs">Remixes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-6 mt-6">
                      {/* Quick Results */}
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          Top Result
                        </h3>
                        {searchResults.tracks && searchResults.tracks.length > 0 ? (
                          <Card
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => searchResults.tracks[0] && handlePlayTrack(searchResults.tracks[0])}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-16 h-16 rounded-xl bg-cover bg-center border border-border"
                                  style={{ backgroundImage: `url('${searchResults.tracks[0]?.cover || ''}')` }}
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium">{searchResults.tracks[0]?.title || 'No title'}</h4>
                                  <p className="text-sm text-muted-foreground">{searchResults.tracks[0]?.artist || 'Unknown artist'}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">Track</Badge>
                                    <span className="text-xs text-muted-foreground">{searchResults.tracks[0]?.plays || '0'} plays</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                                  <Play className="w-5 h-5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <p className="text-muted-foreground text-sm">No tracks found</p>
                        )}
                      </div>

                      {/* Artists */}
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Artists
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {searchResults.artists && searchResults.artists.length > 0 ? searchResults.artists.slice(0, 3).map((artist: any) => (
                            <Card
                              key={artist.id}
                              className="flex-shrink-0 w-32 cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => onNavigate?.("Home", "artist-page")}
                            >
                              <CardContent className="p-3 text-center">
                                <Avatar className="w-16 h-16 mx-auto mb-2">
                                  <AvatarImage src={artist.avatar} />
                                  <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h4 className="font-medium text-sm truncate">{artist.name}</h4>
                                <p className="text-xs text-muted-foreground">{artist.followers}</p>
                              </CardContent>
                            </Card>
                          )) : (
                            <p className="text-muted-foreground text-sm">No artists found</p>
                          )}
                        </div>
                      </div>

                      {/* Tracks */}
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <Headphones className="w-4 h-4" />
                          Tracks
                        </h3>
                        <div className="space-y-2">
                          {searchResults.tracks && searchResults.tracks.length > 1 ? searchResults.tracks.slice(1, 3).map((track: any) => (
                            <Card
                              key={track.id}
                              className="cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => handlePlayTrack(track)}
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
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {Math.floor(Number(track.duration || 0) / 60)}:{String(Math.floor(Number(track.duration || 0) % 60)).padStart(2, '0')}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`w-6 h-6 p-0 ${track.isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
                                    >
                                      <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )) : (
                            <p className="text-muted-foreground text-sm">No additional tracks found</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tracks" className="space-y-4 mt-6">
                      {searchResults.tracks && searchResults.tracks.length > 0 ? searchResults.tracks.map((track: any) => (
                        <Card
                          key={track.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handlePlayTrack(track)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-14 h-14 rounded-lg bg-cover bg-center border border-border"
                                style={{ backgroundImage: `url('${track.cover || ''}')` }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{track.title || 'Untitled'}</h4>
                                <p className="text-sm text-muted-foreground truncate">{track.artist || 'Unknown artist'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{track.plays || '0'} plays</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{track.duration || '0:00'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`w-8 h-8 p-0 ${track.isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
                                >
                                  <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )) : (
                        <p className="text-muted-foreground text-sm">No tracks found</p>
                      )}
                    </TabsContent>

                    <TabsContent value="artists" className="space-y-4 mt-6">
                      {searchResults.artists && searchResults.artists.length > 0 ? searchResults.artists.map((artist: any) => (
                        <Card
                          key={artist.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => onNavigate?.("Home", "artist-page")}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={artist.avatar || ''} />
                                <AvatarFallback>{artist.name?.charAt(0) || 'A'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium truncate">{artist.name || 'Unknown Artist'}</h4>
                                  {artist.isVerified && (
                                    <Badge variant="secondary" className="h-4 px-1">
                                      ✓
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{artist.followers || '0'} followers</p>
                                <p className="text-xs text-muted-foreground">Top: {artist.topTrack || 'N/A'}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Follow
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )) : (
                        <p className="text-muted-foreground text-sm">No artists found</p>
                      )}
                    </TabsContent>

                    <TabsContent value="remixes" className="space-y-4 mt-6">
                      {searchResults.remixes && searchResults.remixes.length > 0 ? searchResults.remixes.map((remix: any) => (
                        <Card
                          key={remix.id}
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => onNavigate?.("Home", "remix-detail")}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-14 h-14 rounded-lg bg-cover bg-center border border-border"
                                style={{ backgroundImage: `url('${remix.cover || ''}')` }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{remix.title || 'Untitled Remix'}</h4>
                                <p className="text-xs text-muted-foreground truncate mb-1">
                                  Original by {remix.originalArtist || 'Unknown'}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage src={remix.remixerAvatar || ''} />
                                    <AvatarFallback>{remix.remixer?.charAt(0) || 'R'}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{remix.remixer || 'Unknown remixer'}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-wrap mb-2">
                                  {remix.effects && remix.effects.length > 0 ? remix.effects.slice(0, 2).map((effect: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs h-4">
                                      {effect}
                                    </Badge>
                                  )) : (
                                    <Badge variant="outline" className="text-xs h-4">
                                      No effects
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {(remix.likes || 0).toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Play className="w-3 h-3" />
                                    {(remix.plays || 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )) : (
                        <p className="text-muted-foreground text-sm">No remixes found</p>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            )}

          </div>

          {/* Featured Artist Promotion Banner - Moved to Bottom */}
          {!searchQuery && (
            <div className="mb-24 -mx-6">
              <div className="relative overflow-hidden rounded-2xl mx-6 bg-gradient-to-br from-[#ff22fb] via-[#8b22ff] to-[#ff6500] p-1">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,34,251,0.9)] via-[rgba(139,34,255,0.85)] to-[rgba(255,101,0,0.9)] backdrop-blur-sm">
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1693835742490-c0dc6e4889ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBlcmZvcm1lciUyMGNvbmNlcnR8ZW58MXx8fHwxNzU1Mjc2MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Featured Artist"
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,34,251,0.3)] to-[rgba(255,101,0,0.3)]" />
                  </div>

                  <div className="relative p-6 pb-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white/90 text-sm font-medium">Featured Artist</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        #1 Trending
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h2 className="text-white text-2xl font-bold mb-1">NOVA SYNTHWAVE</h2>
                        <p className="text-white/80 text-sm">Cyberpunk Electronic • 2.8M followers</p>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          className="bg-white text-[#ff22fb] hover:bg-white/90 font-medium flex items-center gap-2 shadow-lg"
                          onClick={() => onNavigate?.("Home", "artist-page")}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Play Now
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm flex items-center gap-2"
                          onClick={() => onNavigate?.("Home", "artist-page")}
                        >
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 pt-3 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          <span>8.2M monthly plays</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>425K likes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-[#ff22fb] via-transparent via-transparent to-[#ff6500] animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}