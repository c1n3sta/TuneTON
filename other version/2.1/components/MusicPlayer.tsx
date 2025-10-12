import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronDown,
  MoreHorizontal, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Heart, 
  Share, 
  Download,
  PlusCircle,
  Volume2,
  List,
  BarChart3,
  Menu,
  Music,
  ThumbsDown,
  Sliders,
  Zap,
  Cloud,
  Headphones,
  Radio,
  Mic,
  Settings,
  Layers,
  Clock,
  Filter,
  Waves,
  AudioWaveform,
  Sparkles,
  X
} from "lucide-react";
import svgPaths from "../imports/svg-68u3b9ml9g";
import BottomNavigation from "./BottomNavigation";

// Import images from the existing music app
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  currentTime: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface MusicPlayerProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
  currentTrack?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export default function MusicPlayer({ 
  onBack, 
  onNavigate, 
  currentTrack = "Starlight Serenade", 
  isPlaying = true, 
  onPlayPause 
}: MusicPlayerProps) {
  const [playerIsPlaying, setPlayerIsPlaying] = useState(isPlaying);
  const [currentTime, setCurrentTime] = useState(127); // seconds
  const [duration] = useState(203); // seconds
  const [volume, setVolume] = useState(75);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: none, 1: all, 2: one
  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showMixMode, setShowMixMode] = useState(false);
  
  // Audio Effects States
  const [tempo, setTempo] = useState(100); // 100 = normal speed
  const [pitch, setPitch] = useState(0); // semitones
  const [mixModeActive, setMixModeActive] = useState(false);
  
  // MIX Mode Effects
  const [lofiIntensity, setLofiIntensity] = useState(0); // 0-100
  const [backgroundNoise, setBackgroundNoise] = useState('none'); // 'none', 'rain', 'cafe', 'vinyl'
  const [noiseVolume, setNoiseVolume] = useState(30); // 0-100
  const [vinylCrackle, setVinylCrackle] = useState(0); // 0-100
  const [tapeWow, setTapeWow] = useState(0); // 0-100
  const [radioCutoff, setRadioCutoff] = useState(0); // 0-100
  
  // 7-Band EQ Settings
  const [eqBands, setEqBands] = useState({
    subBass: 50,    // 60Hz
    bass: 50,       // 170Hz
    lowMid: 50,     // 350Hz
    mid: 50,        // 1kHz
    highMid: 50,    // 3kHz
    presence: 50,   // 6kHz
    brilliance: 50  // 12kHz
  });

  const eqBandConfig = [
    { key: 'subBass', label: 'Sub', frequency: '60Hz', color: 'hsl(var(--chart-1))' },
    { key: 'bass', label: 'Bass', frequency: '170Hz', color: 'hsl(var(--chart-2))' },
    { key: 'lowMid', label: 'Low Mid', frequency: '350Hz', color: 'hsl(var(--chart-3))' },
    { key: 'mid', label: 'Mid', frequency: '1kHz', color: 'hsl(var(--chart-4))' },
    { key: 'highMid', label: 'High Mid', frequency: '3kHz', color: 'hsl(var(--chart-5))' },
    { key: 'presence', label: 'Presence', frequency: '6kHz', color: 'hsl(var(--chart-1))' },
    { key: 'brilliance', label: 'Brilliance', frequency: '12kHz', color: 'hsl(var(--chart-2))' }
  ];

  const track: Track = {
    id: "1",
    title: currentTrack,
    artist: "MelodyMix Artist",
    album: "Digital Dreams",
    cover: imgAlbumArt,
    duration: "3:23",
    currentTime: "2:07",
    isLiked: isLiked,
    isDisliked: isDisliked
  };

  const queue: Track[] = [
    {
      id: "2",
      title: "Sunset Drive",
      artist: "Chillwave Collective",
      album: "Neon Nights",
      cover: imgTrackCover,
      duration: "4:12",
      currentTime: "0:00"
    },
    {
      id: "3",
      title: "City Lights",
      artist: "Urban Beats",
      album: "Metropolitan",
      cover: imgTrackCover1,
      duration: "3:45",
      currentTime: "0:00"
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setPlayerIsPlaying(!playerIsPlaying);
    onPlayPause?.();
  };

  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleRepeat = () => setRepeatMode((mode) => (mode + 1) % 3);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked && isDisliked) setIsDisliked(false);
  };
  
  const toggleDislike = () => {
    setIsDisliked(!isDisliked);
    if (!isDisliked && isLiked) setIsLiked(false);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(parseInt(e.target.value));
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPitch(parseInt(e.target.value));
  };

  const handleEqChange = (band: string, value: number) => {
    setEqBands(prev => ({ ...prev, [band]: value }));
  };

  const resetEqualizer = () => {
    setEqBands({
      subBass: 50,
      bass: 50,
      lowMid: 50,
      mid: 50,
      highMid: 50,
      presence: 50,
      brilliance: 50
    });
  };

  const resetMixMode = () => {
    setLofiIntensity(0);
    setBackgroundNoise('none');
    setNoiseVolume(30);
    setVinylCrackle(0);
    setTapeWow(0);
    setRadioCutoff(0);
    setTempo(100);
    setPitch(0);
  };

  // Check if any MIX mode effects are active
  useEffect(() => {
    const isActive = lofiIntensity > 0 || backgroundNoise !== 'none' || vinylCrackle > 0 || 
                     tapeWow > 0 || radioCutoff > 0 || tempo !== 100 || pitch !== 0;
    setMixModeActive(isActive);
  }, [lofiIntensity, backgroundNoise, vinylCrackle, tapeWow, radioCutoff, tempo, pitch]);

  // Simulate time progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playerIsPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(time => Math.min(time + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playerIsPlaying, currentTime, duration]);

  if (showQueue) {
    return (
      <div className="bg-background min-h-screen text-foreground">
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
            {/* Queue Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <button 
                onClick={() => setShowQueue(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <h2 className="font-medium">Playing Queue</h2>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-32">
              {/* Currently Playing */}
              <div className="mb-6">
                <h3 className="mb-4">Now Playing</h3>
                <div className="bg-primary/5 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl bg-cover bg-center border border-border"
                      style={{ backgroundImage: `url('${track.cover}')` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{track.title}</h3>
                      <p className="text-muted-foreground truncate">{track.artist}</p>
                      <p className="text-muted-foreground text-sm truncate">{track.album}</p>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {track.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Up Next */}
              <div>
                <h3 className="mb-4">Up Next ({queue.length})</h3>
                <div className="space-y-3">
                  {queue.map((queueTrack, index) => (
                    <div key={queueTrack.id} className="bg-card rounded-xl p-3 hover:bg-accent transition-colors cursor-pointer border border-border">
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground w-6 flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <div 
                          className="w-12 h-12 rounded-lg bg-cover bg-center border border-border"
                          style={{ backgroundImage: `url('${queueTrack.cover}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{queueTrack.title}</h4>
                          <p className="text-muted-foreground text-sm truncate">{queueTrack.artist}</p>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {queueTrack.duration}
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation activeTab="Player" onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <h2 className="font-medium">Now Playing</h2>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-32 space-y-6">
            {/* Album Art */}
            <div className="flex justify-center pt-4">
              <div className="relative">
                <div 
                  className="w-80 h-80 rounded-2xl bg-cover bg-center shadow-2xl border border-border"
                  style={{ backgroundImage: `url('${track.cover}')` }}
                >
                  {/* MIX Mode Indicators */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {mixModeActive && (
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        MIX MODE
                      </div>
                    )}
                    {lofiIntensity > 0 && (
                      <div className="bg-chart-4 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        LO-FI {lofiIntensity}%
                      </div>
                    )}
                  </div>

                  {/* Background Noise Indicator */}
                  {backgroundNoise !== 'none' && (
                    <div className="absolute top-4 right-4 bg-chart-3 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium uppercase">
                      {backgroundNoise} {noiseVolume}%
                    </div>
                  )}
                </div>
                
                {/* Animated audio visualizer overlay */}
                {playerIsPlaying && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end justify-center pb-8">
                    <div className="flex items-end gap-[2px]">
                      {[12, 20, 16, 24, 18, 28, 22, 14, 26, 15, 19, 25, 17, 21, 13].map((height, i) => (
                        <div
                          key={i}
                          className="bg-primary opacity-80 rounded-sm w-[2px] animate-pulse"
                          style={{ 
                            height: `${height}px`,
                            animationDelay: `${i * 0.08}s`,
                            animationDuration: '1.2s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-medium leading-tight">{track.title}</h1>
              <p className="text-muted-foreground">{track.artist}</p>
              <p className="text-muted-foreground text-sm">{track.album}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(currentTime / duration) * 100}%, hsl(var(--muted)) ${(currentTime / duration) * 100}%, hsl(var(--muted)) 100%)`
                  }}
                />
                <style jsx>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    cursor: pointer;
                    border: 2px solid hsl(var(--background));
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  }
                  .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    cursor: pointer;
                    border: 2px solid hsl(var(--background));
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={toggleShuffle}
                className={`w-6 h-6 transition-colors ${isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Shuffle className="w-full h-full" />
              </button>
              
              <button className="w-8 h-8 text-foreground hover:text-primary hover:scale-110 transition-all duration-200">
                <SkipBack className="w-full h-full" />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {playerIsPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
              </button>
              
              <button className="w-8 h-8 text-foreground hover:text-primary hover:scale-110 transition-all duration-200">
                <SkipForward className="w-full h-full" />
              </button>
              
              <button
                onClick={toggleRepeat}
                className={`w-6 h-6 transition-colors relative ${repeatMode > 0 ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Repeat className="w-full h-full" />
                {repeatMode === 2 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center text-[8px] font-medium text-primary-foreground">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Like/Dislike & Secondary Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={toggleLike}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                  isLiked 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={toggleDislike}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                  isDisliked 
                    ? 'text-destructive bg-destructive/10' 
                    : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setShowEqualizer(!showEqualizer)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                  showEqualizer 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                <Sliders className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowMixMode(!showMixMode)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                  showMixMode || mixModeActive
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                <Zap className="w-5 h-5" />
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
                <Download className="w-5 h-5" />
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
                <Share className="w-5 h-5" />
              </button>
            </div>

            {/* 7-Band Equalizer Panel */}
            {showEqualizer && (
              <div className="bg-secondary rounded-xl p-4 space-y-4 border border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    7-Band Equalizer
                  </h3>
                  <button
                    onClick={resetEqualizer}
                    className="px-3 py-1 text-xs bg-muted text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {eqBandConfig.map((band) => (
                    <div key={band.key} className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-1 font-medium">
                        {band.label}
                      </div>
                      <div className="text-[8px] text-muted-foreground mb-2">
                        {band.frequency}
                      </div>
                      
                      {/* Vertical Slider Container */}
                      <div className="flex justify-center mb-2">
                        <div className="relative h-24 w-6 flex items-center justify-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={eqBands[band.key as keyof typeof eqBands]}
                            onChange={(e) => handleEqChange(band.key, parseInt(e.target.value))}
                            className="eq-slider appearance-none bg-muted rounded-full cursor-pointer"
                            style={{
                              width: '4px',
                              height: '88px',
                              writingMode: 'bt-lr',
                              WebkitAppearance: 'slider-vertical',
                              background: `linear-gradient(to top, ${band.color} 0%, ${band.color} ${eqBands[band.key as keyof typeof eqBands]}%, hsl(var(--muted)) ${eqBands[band.key as keyof typeof eqBands]}%, hsl(var(--muted)) 100%)`
                            }}
                          />
                        </div>
                      </div>
                      
                      <div 
                        className="text-[9px] font-medium"
                        style={{ color: band.color }}
                      >
                        {eqBands[band.key as keyof typeof eqBands]}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* EQ Presets */}
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Presets:</div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { name: 'Flat', values: { subBass: 50, bass: 50, lowMid: 50, mid: 50, highMid: 50, presence: 50, brilliance: 50 } },
                      { name: 'Rock', values: { subBass: 60, bass: 55, lowMid: 45, mid: 50, highMid: 55, presence: 60, brilliance: 65 } },
                      { name: 'Pop', values: { subBass: 55, bass: 60, lowMid: 50, mid: 55, highMid: 60, presence: 65, brilliance: 60 } },
                      { name: 'Jazz', values: { subBass: 45, bass: 50, lowMid: 55, mid: 60, highMid: 55, presence: 50, brilliance: 45 } },
                      { name: 'Classical', values: { subBass: 40, bass: 45, lowMid: 50, mid: 55, highMid: 60, presence: 65, brilliance: 70 } },
                      { name: 'Bass Boost', values: { subBass: 80, bass: 70, lowMid: 55, mid: 45, highMid: 40, presence: 45, brilliance: 50 } }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setEqBands(preset.values)}
                        className="px-2 py-1 text-[10px] bg-muted text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <style jsx>{`
                  .eq-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    cursor: pointer;
                    border: 1px solid hsl(var(--background));
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  }
                  .eq-slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    cursor: pointer;
                    border: 1px solid hsl(var(--background));
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>
            )}

            {/* MIX Mode Panel */}
            {showMixMode && (
              <div className="bg-secondary rounded-xl p-4 space-y-4 border border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    MIX Mode Studio
                  </h3>
                  <button
                    onClick={resetMixMode}
                    className="px-3 py-1 text-xs bg-muted text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    Reset All
                  </button>
                </div>

                {/* Tempo & Pitch Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-muted-foreground">Tempo</label>
                      <span className="text-xs text-primary font-medium">{tempo}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={tempo}
                      onChange={handleTempoChange}
                      className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(tempo - 50) / 150 * 100}%, hsl(var(--muted)) ${(tempo - 50) / 150 * 100}%, hsl(var(--muted)) 100%)`
                      }}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-muted-foreground">Pitch</label>
                      <span className="text-xs text-primary font-medium">{pitch > 0 ? '+' : ''}{pitch}</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={pitch}
                      onChange={handlePitchChange}
                      className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(pitch + 12) / 24 * 100}%, hsl(var(--muted)) ${(pitch + 12) / 24 * 100}%, hsl(var(--muted)) 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Lo-Fi Effects */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Lo-Fi Effects
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-muted-foreground">Overall Lo-Fi</label>
                        <span className="text-xs text-chart-4 font-medium">{lofiIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={lofiIntensity}
                        onChange={(e) => setLofiIntensity(parseInt(e.target.value))}
                        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--chart-4)) 0%, hsl(var(--chart-4)) ${lofiIntensity}%, hsl(var(--muted)) ${lofiIntensity}%, hsl(var(--muted)) 100%)`
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] text-muted-foreground">Vinyl</label>
                          <span className="text-[10px] text-chart-1 font-medium">{vinylCrackle}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={vinylCrackle}
                          onChange={(e) => setVinylCrackle(parseInt(e.target.value))}
                          className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, hsl(var(--chart-1)) 0%, hsl(var(--chart-1)) ${vinylCrackle}%, hsl(var(--muted)) ${vinylCrackle}%, hsl(var(--muted)) 100%)`
                          }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] text-muted-foreground">Tape</label>
                          <span className="text-[10px] text-chart-2 font-medium">{tapeWow}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tapeWow}
                          onChange={(e) => setTapeWow(parseInt(e.target.value))}
                          className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, hsl(var(--chart-2)) 0%, hsl(var(--chart-2)) ${tapeWow}%, hsl(var(--muted)) ${tapeWow}%, hsl(var(--muted)) 100%)`
                          }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] text-muted-foreground">Radio</label>
                          <span className="text-[10px] text-chart-5 font-medium">{radioCutoff}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={radioCutoff}
                          onChange={(e) => setRadioCutoff(parseInt(e.target.value))}
                          className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, hsl(var(--chart-5)) 0%, hsl(var(--chart-5)) ${radioCutoff}%, hsl(var(--muted)) ${radioCutoff}%, hsl(var(--muted)) 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Ambience */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Background Ambience
                  </h4>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'none', label: 'None', icon: X },
                      { value: 'rain', label: 'Rain', icon: Cloud },
                      { value: 'cafe', label: 'Café', icon: Headphones },
                      { value: 'vinyl', label: 'Vinyl', icon: AudioWaveform }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setBackgroundNoise(value)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                          backgroundNoise === value
                            ? 'bg-chart-3 text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {backgroundNoise !== 'none' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-muted-foreground">Ambience Volume</label>
                        <span className="text-xs text-chart-3 font-medium">{noiseVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={noiseVolume}
                        onChange={(e) => setNoiseVolume(parseInt(e.target.value))}
                        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--chart-3)) 0%, hsl(var(--chart-3)) ${noiseVolume}%, hsl(var(--muted)) ${noiseVolume}%, hsl(var(--muted)) 100%)`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer volume-slider"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume}%, hsl(var(--muted)) ${volume}%, hsl(var(--muted)) 100%)`
                  }}
                />
                <style jsx>{`
                  .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    cursor: pointer;
                    border: 1px solid hsl(var(--background));
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  }
                  .volume-slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    cursor: pointer;
                    border: 1px solid hsl(var(--background));
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>
              <span className="text-sm text-muted-foreground w-8 text-right">{volume}%</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowQueue(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-accent px-3 py-3 rounded-xl text-foreground transition-colors"
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Queue</span>
              </button>
              
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-colors ${
                  showLyrics 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-accent text-foreground'
                }`}
              >
                <Music className="w-4 h-4" />
                <span className="text-sm font-medium">Lyrics</span>
              </button>
            </div>

            {/* AI Studio & NFT Marketplace Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigate?.("AI Studio")}
                className="flex-1 bg-chart-1 hover:bg-chart-1/90 px-4 py-3 rounded-xl text-primary-foreground transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <span className="font-medium">AI Studio</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.("NFT")}
                className="flex-1 bg-chart-5 hover:bg-chart-5/90 px-4 py-3 rounded-xl text-primary-foreground transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">NFT Marketplace</span>
              </button>
            </div>

            {/* Lyrics Panel */}
            {showLyrics && (
              <div className="bg-secondary rounded-xl p-4 border border-border">
                <h3 className="font-medium mb-4">Lyrics</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p className="text-primary">In the silence of the night</p>
                  <p>Stars are dancing in the light</p>
                  <p>Melodies that touch my soul</p>
                  <p>Music makes me feel whole</p>
                  <p className="text-muted-foreground/70">...</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab="Player" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}