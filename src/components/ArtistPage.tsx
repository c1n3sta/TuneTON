import { useState } from "react";
import { Play, Heart, Share2, Star, Calendar, ExternalLink, MessageCircle, Send, TrendingUp, Trophy, Music, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button-component";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import BottomNavigation from "./BottomNavigation";
import svgPaths from "../imports/svg-mm0ssevrl2";
import imgFeaturedAlbumCover from "figma:asset/20cb698982d776e1e84c052c455bbfbfbca1f7eb.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgMedia from "figma:asset/0f0bd1aa7cb80152118d7455a9240d0f8042b8d1.png";
import imgNft from "figma:asset/3260b153a4ff903e2d7b24a6d27e51b15a4ef6b0.png";
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgUserAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";

interface Track {
  id: string;
  title: string;
  plays: string;
  likes: string;
  remixes: string;
  albumArt: string;
}

interface Album {
  id: string;
  title: string;
  year: string;
  tracks: string;
  cover: string;
}

interface Event {
  id: string;
  date: string;
  title: string;
  location: string;
  type: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

interface ArtistPageProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
}

export default function ArtistPage({ onBack, onNavigate }: ArtistPageProps) {
  const [newComment, setNewComment] = useState("");
  
  const tracks: Track[] = [
    {
      id: "1",
      title: "Electric City",
      plays: "1.5M",
      likes: "25K",
      remixes: "1.2K",
      albumArt: imgAlbumArt
    },
    {
      id: "2", 
      title: "Midnight Drive",
      plays: "1.2M",
      likes: "20K", 
      remixes: "900",
      albumArt: imgAlbumArt
    },
    {
      id: "3",
      title: "Starlight Serenade", 
      plays: "980K",
      likes: "18K",
      remixes: "750",
      albumArt: imgAlbumArt
    }
  ];

  const albums: Album[] = [
    {
      id: "1",
      title: "Future Echoes",
      year: "2023",
      tracks: "10",
      cover: imgAlbumArt
    },
    {
      id: "2",
      title: "Neon City Nights", 
      year: "2022",
      tracks: "8",
      cover: imgAlbumArt
    },
    {
      id: "3",
      title: "Retrograde",
      year: "2021", 
      tracks: "12",
      cover: imgAlbumArt
    }
  ];

  const events: Event[] = [
    {
      id: "1",
      date: "AUG 15",
      title: "Synthwave Live @ The Grid",
      location: "Virtual Concert",
      type: "virtual"
    },
    {
      id: "2", 
      date: "SEP 02",
      title: "RetroFuture Fest",
      location: "Los Angeles, CA",
      type: "live"
    }
  ];

  const comments: Comment[] = [
    {
      id: "1",
      user: "MusicLover99",
      avatar: imgUserAvatar,
      text: "Electric City is my new obsession! The vibes are immaculate.",
      timeAgo: "2 days ago",
      likes: 12
    },
    {
      id: "2",
      user: "RemixKing", 
      avatar: imgUserAvatar1,
      text: "Just remixed Midnight Drive, check it out!",
      timeAgo: "5 days ago",
      likes: 8
    }
  ];

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-md mx-auto bg-[#161b22] min-h-screen">
        {/* Header with back button */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#21262d] flex items-center justify-center text-[#c9d1d9] hover:bg-[#30363d] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-[#c9d1d9]">SynthWave Sam</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Featured Album Header */}
        <div className="relative h-[300px] rounded-2xl overflow-hidden mx-4 mt-4">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imgFeaturedAlbumCover}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-lg font-semibold text-white mb-1">The New Era</h1>
            <p className="text-sm text-white/80">Future Sounds</p>
            <Button size="sm" className="absolute bottom-0 right-0 rounded-full bg-[#ff22fb] hover:bg-[#ff22fb]/90 h-12 w-12 p-0">
              <Play className="h-5 w-5 text-white fill-white" />
            </Button>
          </div>
        </div>

        {/* Artist Bio */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Artist Bio & Story</h2>
          <p className="text-sm text-[#c9d1d9] leading-relaxed">
            SynthWave Sam is a visionary electronic music producer known for his nostalgic yet futuristic 
            soundscapes. Blending 80s synth-pop with modern electronic beats, Sam creates immersive sonic 
            journeys that transport listeners to a vibrant, retro-futuristic world. His tracks are characterized by 
            pulsating basslines, shimmering synthesizers, and evocative melodies.
          </p>
          <Card className="bg-[#161b22] border-[#30363d]">
            <CardContent className="p-3 space-y-2">
              <p className="text-sm text-[#8b949e]">Favorite Synth: Roland Juno-106</p>
              <p className="text-sm text-[#8b949e]">First Instrument: Casio SK-1</p>
            </CardContent>
          </Card>
        </div>

        {/* Music Showcase */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Music Showcase</h2>
          <div className="space-y-4">
            {tracks.map((track) => (
              <Card key={track.id} className="bg-[#161b22] border-[#30363d]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div 
                    className="w-[60px] h-[60px] bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url('${track.albumArt}')` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#c9d1d9]">{track.title}</h3>
                    <p className="text-xs text-[#8b949e]">
                      {track.plays} Plays • {track.likes} Likes • {track.remixes} Remixes
                    </p>
                  </div>
                  <Button size="sm" className="bg-[#ff4400] hover:bg-[#ff4400]/90 text-[#dffcf8]">
                    <Music className="h-4 w-4 mr-1" />
                    Remix
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Discography */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Discography</h2>
          <div className="grid grid-cols-3 gap-3">
            {albums.map((album) => (
              <Card key={album.id} className="bg-[#161b22] border-none">
                <CardContent className="p-0">
                  <div 
                    className="w-full h-[100px] bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url('${album.cover}')` }}
                  />
                  <div className="p-2 text-center">
                    <h3 className="text-sm font-semibold text-[#c9d1d9] leading-tight">{album.title}</h3>
                    <p className="text-xs text-[#8b949e]">{album.year} • {album.tracks} Tracks</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ratings & Leaderboards */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Ratings & Leaderboards</h2>
          
          {/* Stats Row */}
          <div className="flex justify-around items-center py-4">
            <div className="text-center">
              <Trophy className="h-5 w-5 text-[#d29922] mx-auto mb-1" />
              <p className="text-xs text-[#8b949e]">Top Performer</p>
            </div>
            <div className="text-center">
              <Star className="h-5 w-5 text-[#d29922] mx-auto mb-1" />
              <p className="text-xs text-[#8b949e]">4.7 Stars</p>
            </div>
            <div className="text-center">
              <Music className="h-5 w-5 text-[#ff22fb] mx-auto mb-1" />
              <p className="text-xs text-[#8b949e]">3.5K Remixes</p>
            </div>
          </div>

          {/* Rankings */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-[#161b22] border-none">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-semibold text-[#ff22fb] mb-1">#2</p>
                <p className="text-xs text-[#8b949e]">Electronic Ranking</p>
              </CardContent>
            </Card>
            <Card className="bg-[#161b22] border-none">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-semibold text-[#ff22fb] mb-1">#5</p>
                <p className="text-xs text-[#8b949e]">Most Remixed</p>
              </CardContent>
            </Card>
            <Card className="bg-[#161b22] border-none">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-semibold text-[#ff22fb] mb-1">12</p>
                <p className="text-xs text-[#8b949e]">Collaborations</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Media Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div 
                  className="w-full h-[100px] bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url('${imgMedia}')` }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="bg-[#161b22] border-none">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#ff22fb]">{event.date}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#c9d1d9]">{event.title}</h3>
                    <p className="text-xs text-[#8b949e]">{event.location}</p>
                  </div>
                  <Button size="sm" className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white">
                    {event.type === 'virtual' ? 'RSVP' : 'Tickets'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social & Blockchain */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Social & Blockchain</h2>
          
          {/* Social Links */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-[#161b22] border-[#30363d] text-[#8b949e]">
              <ExternalLink className="h-4 w-4 mr-1" />
              Instagram
            </Button>
            <Button variant="outline" size="sm" className="bg-[#161b22] border-[#30363d] text-[#8b949e]">
              <MessageCircle className="h-4 w-4 mr-1" />
              Telegram
            </Button>
            <Button variant="outline" size="sm" className="bg-[#161b22] border-[#30363d] text-[#8b949e]">
              <ExternalLink className="h-4 w-4 mr-1" />
              Website
            </Button>
          </div>

          {/* Artist NFTs */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#c9d1d9]">Artist NFTs</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Cyberpunk Anthem #001", image: imgNft },
                { title: "Digital Sunset Art", image: imgNft }
              ].map((nft, i) => (
                <Card key={i} className="bg-[#161b22] border-none">
                  <CardContent className="p-0">
                    <div 
                      className="w-full h-[100px] bg-cover bg-center rounded-t-lg"
                      style={{ backgroundImage: `url('${nft.image}')` }}
                    />
                    <div className="p-2 text-center">
                      <p className="text-xs text-[#c9d1d9]">{nft.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="w-full bg-[#ff4400] hover:bg-[#ff4400]/90 text-[#dffcf8]">
              View on Marketplace
            </Button>
          </div>

          {/* Tip Button */}
          <Button className="w-full bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Tip with TON
          </Button>
        </div>

        {/* Fan Interaction & Comments */}
        <div className="p-6 space-y-4 pb-24">
          <h2 className="text-lg font-semibold text-[#c9d1d9]">Fan Interaction & Comments feed</h2>
          
          {/* Comment Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Leave a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-[#161b22] border-[#30363d] text-[#c9d1d9] placeholder:text-[#757575] flex-1"
            />
            <Button onClick={handleSubmitComment} className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div 
                  className="w-10 h-10 bg-cover bg-center rounded-full"
                  style={{ backgroundImage: `url('${comment.avatar}')` }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#c9d1d9]">{comment.user}</span>
                    <span className="text-xs text-[#8b949e]">{comment.timeAgo}</span>
                  </div>
                  <p className="text-sm text-[#c9d1d9] mb-2">{comment.text}</p>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-xs text-[#8b949e]">
                      <Heart className="h-3.5 w-3.5" />
                      {comment.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-[#8b949e]">
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="Artist" 
        onNavigate={onNavigate || (() => {})} 
      />
    </div>
  );
}