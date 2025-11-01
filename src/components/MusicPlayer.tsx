import { useState, useEffect } from "react";
import { 
  ChevronDown,
  List,
  Loader2,
  AlertCircle,
  WifiOff,
  Music,
  FileText,
  Heart,
  Share2,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Repeat1,
  BarChart3,
  Zap,
  Radio
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { Badge } from "./ui/badge";
import { jamendoAPI, JamendoTrack, getTuneTONRecommendations } from "../utils/jamendo-api";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { checkMixModeActive, formatTime, isValidAudioUrl } from "./player/utils";
import { convertJamendoToTrack } from "./player/utils";
import type { AudioTrack } from '../types/audio';
import { DEFAULT_EQ_VALUES, WAVEFORM_HEIGHTS } from "./player/constants";
import QueueView from "./player/QueueView";
import EffectsPanel from "./player/EffectsPanel";

// Define the EQ bands type to ensure consistency
type EqBands = typeof DEFAULT_EQ_VALUES;

interface MusicPlayerProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
  currentTrack?: JamendoTrack | string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export default function MusicPlayer({ 
  onBack, 
  onNavigate, 
  currentTrack, 
  isPlaying: initialIsPlaying = true, 
  onPlayPause 
}: MusicPlayerProps) {
  // Audio and playback state
  const [playerIsPlaying, setPlayerIsPlaying] = useState(initialIsPlaying);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playerVolumeState, setPlayerVolume] = useState(75);
  const [playerIsMuted, setPlayerIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: none, 1: all, 2: one
  const [playerPlaybackRate, setPlayerPlaybackRate] = useState(1);
  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showMixMode, setShowMixMode] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  // Jamendo integration
  const [currentJamendoTrack, setCurrentJamendoTrack] = useState<JamendoTrack | null>(null);
  const [queueTracks, setQueueTracks] = useState<JamendoTrack[]>([]);

  
  // Audio Effects States
  const [pitch, setPitch] = useState(0);
  const [mixModeActive, setMixModeActive] = useState(false);
  const [lofiIntensity, setLofiIntensity] = useState(0);
  const [backgroundNoise, setBackgroundNoise] = useState('none');
  const [noiseVolume, setNoiseVolume] = useState(30);
  const [vinylCrackle, setVinylCrackle] = useState(0);
  const [tapeWow, setTapeWow] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Audio player hook
  const {
    isPlaying,
    currentTime,
    duration,
    volume: playerVolume,
    isMuted,
    playbackRate,
    tempo,
    pitchSemitones,
    eqBands,
    eqMix,
    eqBypass,
    reverbMix,
    reverbPreDelay,
    reverbDamping,
    reverbPreset,
    reverbBypass,
    lowPassTone,
    lowPassResonance,
    lofiTone,
    lofiNoise,
    lofiWow,
    loadTrack,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setTempo,
    setPitchSemitones,
    setEffectBypass,
    setEffectMix,
    handleLofiToneChange,
    handleLofiNoiseChange,
    handleLofiWowChange,
    handleEQBandChange,
    handleEQMixChange,
    handleEQBypassChange,
    handleReverbMixChange,
    handleReverbPreDelayChange,
    handleReverbDampingChange,
    handleReverbPresetChange,
    handleReverbBypassChange,
    handleLowPassToneChange,
    handleLowPassResonanceChange,
    getAnalyser
  } = useAudioPlayer();

  // Navigation functions
  const handleNext = () => {
    if (queueTracks.length > 0) {
      const nextTrack = queueTracks[0];
      setCurrentJamendoTrack(nextTrack);
      setQueueTracks(prev => prev.slice(1));
      seek(0);
      
      if (currentJamendoTrack) {
        setQueueTracks(prev => [...prev, currentJamendoTrack]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentTime > 10) {
      seek(0);
    } else if (queueTracks.length > 0) {
      const prevTrack = queueTracks[queueTracks.length - 1];
      setCurrentJamendoTrack(prevTrack);
      setQueueTracks(prev => prev.slice(0, -1));
      seek(0);
    }
  };

  const trackName = typeof currentTrack === 'object' && currentTrack ? currentTrack.name : (typeof currentTrack === 'string' ? currentTrack : 'Unknown Track');
  const track = convertJamendoToTrack(currentJamendoTrack, trackName, currentTime, isLiked, isDisliked);

  // Update the player state when the track changes
  useEffect(() => {
    if (track) {
      loadTrack(track);
    }
  }, [track, loadTrack]);

  // Update volume when it changes
  useEffect(() => {
    setVolume(playerVolumeState / 100);
  }, [playerVolumeState, setVolume]);

  // Update playback rate when tempo changes
  useEffect(() => {
    setPlaybackRate(tempo / 100);
  }, [tempo, setPlaybackRate]);

  // Handle play/pause
  useEffect(() => {
    if (playerIsPlaying !== isPlaying) {
      togglePlayPause();
    }
  }, [playerIsPlaying, isPlaying, togglePlayPause]);

  // Handle errors
  useEffect(() => {
    if (hasError) {
      setErrorMessage('Unable to play audio');
      console.error('Audio playback error');
      
      // Additional debugging info
      if (track && 'audioUrl' in track && track.audioUrl) {
        console.log('Attempting to play URL:', track.audioUrl);
        // Check if URL is accessible
        fetch(track.audioUrl as string, { method: 'HEAD' })
          .then(response => {
            console.log(`Audio URL status: ${response.status} ${response.statusText}`);
            if (!response.ok) {
              console.error(`Audio URL returned status ${response.status}: ${response.statusText}`);
            }
          })
          .catch(err => {
            console.error('Failed to fetch audio URL:', err);
          });
      } else {
        console.log('No audio URL provided for track');
      }
      
      // Log the track object for debugging
      console.log('Current track object:', track);
    } else {
      setErrorMessage(null);
    }
  }, [hasError, track]);

  // Load Jamendo tracks
  useEffect(() => {
    const loadJamendoTracks = async () => {
      try {
        setIsLoading(true);
        console.log('🎵 MusicPlayer: Starting to load Jamendo tracks...');
        
        // If currentTrack is already a JamendoTrack object, use it directly
        if (currentTrack && typeof currentTrack === 'object' && 'id' in currentTrack && currentTrack.id) {
          // Validate that it has required fields
          const validTrack = currentTrack as JamendoTrack;
          if (validTrack.name && validTrack.artist_name && (validTrack.audio || validTrack.audiodownload)) {
            setCurrentJamendoTrack(validTrack);
            console.log('🎵 Using passed JamendoTrack:', validTrack.name, 'by', validTrack.artist_name);
          }
          
          // Still load recommendations for queue
          const recommendations = await getTuneTONRecommendations();
          const allTracks = [
            ...recommendations.popular,
            ...recommendations.trending,
            ...recommendations.lofi,
            ...recommendations.remixable
          ].filter(track => track.id !== currentTrack.id); // Exclude current track from queue
          
          setQueueTracks(allTracks.slice(0, 5));
          
          setIsLoading(false);
          return;
        }
        
        const recommendations = await getTuneTONRecommendations();
        console.log('🎵 Got recommendations:', recommendations);
        
        const allTracks = [
          ...recommendations.popular,
          ...recommendations.trending,
          ...recommendations.lofi,
          ...recommendations.remixable
        ];
        
        console.log('🎵 Total tracks loaded:', allTracks.length);
        setQueueTracks(allTracks.slice(1, 6));
        
        // Find track by name if currentTrack is a string
        const trackName = typeof currentTrack === 'string' ? currentTrack : '';
        let trackToPlay = allTracks.find(track => track.name === trackName) || allTracks[0];
        if (trackToPlay) {
          setCurrentJamendoTrack(trackToPlay);
          console.log('🎵 Selected track to play:', trackToPlay.name, 'by', trackToPlay.artist_name);
        }
        

      } catch (error) {
        console.error('🎵 Error loading Jamendo tracks:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadJamendoTracks();
  }, [currentTrack]);

  // Check mix mode active
  useEffect(() => {
    setMixModeActive(checkMixModeActive(lofiIntensity, backgroundNoise, vinylCrackle, tapeWow, 0, tempo, pitch));
  }, [lofiIntensity, backgroundNoise, vinylCrackle, tapeWow, tempo, pitch]);

  // Control handlers
  const togglePlay = () => {
    console.log('Toggle play called, track:', track);
    
    if ((!track.audioUrl || track.audioUrl === '') && !hasError) {
      setHasError(true);
      setErrorMessage('No audio source available');
      console.error('No audio source available for track:', track);
      return;
    }
    
    // Validate audio URL before playing
    if (track.audioUrl) {
      if (!isValidAudioUrl(track.audioUrl)) {
        setHasError(true);
        setErrorMessage('Invalid audio URL format');
        console.error('Invalid audio URL format:', track.audioUrl);
        return;
      }
    }
    
    const newPlayState = !playerIsPlaying;
    setPlayerIsPlaying(newPlayState);
    onPlayPause?.();
    
    if (hasError) {
      setHasError(false);
      setErrorMessage(null);
    }
  };

  const resetEqualizer = () => {
    const defaultArray = [
      DEFAULT_EQ_VALUES.subBass,
      DEFAULT_EQ_VALUES.bass,
      DEFAULT_EQ_VALUES.lowMid,
      DEFAULT_EQ_VALUES.mid,
      DEFAULT_EQ_VALUES.highMid,
      DEFAULT_EQ_VALUES.presence,
      DEFAULT_EQ_VALUES.brilliance
    ];
    handleEQBandChange(0, defaultArray[0]);
    handleEQBandChange(1, defaultArray[1]);
    handleEQBandChange(2, defaultArray[2]);
    handleEQBandChange(3, defaultArray[3]);
    handleEQBandChange(4, defaultArray[4]);
    handleEQBandChange(5, defaultArray[5]);
    handleEQBandChange(6, defaultArray[6]);
  };
  
  const resetMixMode = () => {
    setLofiIntensity(0);
    setBackgroundNoise('none');
    setNoiseVolume(30);
    setVinylCrackle(0);
    setTapeWow(0);
    setTempo(100);
    setPitch(0);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0 && !isMuted) {
      toggleMute();
    } else if (newVolume > 0 && isMuted) {
      toggleMute();
    }
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  // Map EQ band keys to array indices
  const eqBandKeyToIndex = {
    'subBass': 0,
    'bass': 1,
    'lowMid': 2,
    'mid': 3,
    'highMid': 4,
    'presence': 5,
    'brilliance': 6
  };

  const handleEqChange = (band: string, value: number | EqBands) => {
    if (band === 'preset') {
      // Convert object format to array format for the hook
      const presetObj = value as EqBands;
      const newArray = [
        presetObj.subBass,
        presetObj.bass,
        presetObj.lowMid,
        presetObj.mid,
        presetObj.highMid,
        presetObj.presence,
        presetObj.brilliance
      ];
      handleEQBandChange(0, newArray[0]);
      handleEQBandChange(1, newArray[1]);
      handleEQBandChange(2, newArray[2]);
      handleEQBandChange(3, newArray[3]);
      handleEQBandChange(4, newArray[4]);
      handleEQBandChange(5, newArray[5]);
      handleEQBandChange(6, newArray[6]);
    } else {
      const bandIndex = eqBandKeyToIndex[band as keyof typeof eqBandKeyToIndex];
      if (bandIndex !== undefined) {
        handleEQBandChange(bandIndex, value as number);
      }
    }
  };

  const handleMixPreset = (preset: any) => {
    setLofiIntensity(preset.lofiIntensity || 0);
    if (preset.backgroundNoise) setBackgroundNoise(preset.backgroundNoise);
    if (preset.noiseVolume) setNoiseVolume(preset.noiseVolume);
    if (preset.vinylCrackle !== undefined) setVinylCrackle(preset.vinylCrackle);
    if (preset.tapeWow !== undefined) setTapeWow(preset.tapeWow);
    if (preset.tempo !== undefined) setTempo(preset.tempo);
    if (preset.pitch !== undefined) setPitch(preset.pitch);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  // Show queue view
  if (showQueue) {
    return (
      <QueueView 
        track={track}
        queueTracks={queueTracks}
onClose={() => setShowQueue(false)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Hidden Audio Element - Always present to avoid browser autoplay policy issues */}
      {/* The audio element is now handled internally by the useAudioPlayer hook */}

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
            <div className="flex items-center gap-2">
              <h2 className="font-medium">Now Playing</h2>

            </div>
            <button 
              onClick={() => setShowQueue(!showQueue)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-32 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Loading track...</span>
              </div>
            )}

            {/* Error State */}
            {hasError && !isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive mb-2">{errorMessage || 'Unable to play audio'}</p>
                  {/* Add autoplay instruction if this might be an autoplay issue */}
                  {/* {!userInteracted && (
                    <p className="text-xs text-muted-foreground mb-3">
                      Tap anywhere on the screen to enable audio playback
                    </p>
                  )} */}
                  <button 
                    onClick={() => {
                      setHasError(false);
                      setErrorMessage(null);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Album Art */}
            {!isLoading && (
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
                      {tempo !== 100 && (
                        <div className="bg-chart-1 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                          {tempo}% SPEED
                        </div>
                      )}
                    </div>

                    {/* Background Noise Indicator */}
                    {backgroundNoise !== 'none' && (
                      <div className="absolute top-4 right-4 bg-chart-3 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium uppercase">
                        {backgroundNoise} {noiseVolume}%
                      </div>
                    )}

                    {/* Jamendo Badge */}
                    {currentJamendoTrack && !usingMockData && (
                      <div className="absolute bottom-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Jamendo
                      </div>
                    )}
                  </div>
                  
                  {/* Animated audio visualizer */}
                  {playerIsPlaying && !hasError && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end justify-center pb-8">
                      <div className="flex items-end gap-[2px]">
                        {WAVEFORM_HEIGHTS.map((height, i) => (
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
            )}

            {/* Track Info */}
            {!isLoading && (
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-medium leading-tight">{track.title}</h1>
                <p className="text-muted-foreground">{track.artist}</p>
                <p className="text-muted-foreground text-sm">{track.album}</p>
                {currentJamendoTrack?.musicinfo?.tags?.genres && (
                  <div className="flex justify-center gap-1 mt-2">
                    {currentJamendoTrack.musicinfo.tags.genres.slice(0, 3).map((genre: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {!isLoading && (
              <div className="space-y-2">
                <div 
                  className="h-1.5 bg-secondary rounded-full cursor-pointer relative"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-primary rounded-full relative"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>-{formatTime(duration - currentTime)}</span>
                </div>
              </div>
            )}

            {/* Main Controls */}
            {!isLoading && (
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full ${isShuffled ? 'text-primary' : 'text-muted-foreground'}`}
                  aria-label="Shuffle"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={handlePrevious}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-label={playerIsPlaying ? 'Pause' : 'Play'}
                >
                  {playerIsPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 pl-0.5" />
                  )}
                </button>
                
                <button 
                  onClick={handleNext}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Next track"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
                
                <button 
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full ${repeatMode > 0 ? 'text-primary' : 'text-muted-foreground'}`}
                  aria-label="Repeat"
                >
                  {repeatMode === 2 ? (
                    <Repeat1 className="w-5 h-5" />
                  ) : (
                    <Repeat className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {/* Additional Controls */}
            {!isLoading && (
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleLike}
                  className={`p-2 rounded-full ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
                  aria-label="Like"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={`p-2 rounded-full ${showLyrics ? 'text-primary' : 'text-muted-foreground'}`}
                    aria-label="Lyrics"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => setShowEqualizer(!showEqualizer)}
                    className={`p-2 rounded-full ${showEqualizer ? 'text-primary' : 'text-muted-foreground'}`}
                    aria-label="Equalizer"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => setShowMixMode(!showMixMode)}
                    className={`p-2 rounded-full ${showMixMode ? 'text-primary' : 'text-muted-foreground'}`}
                    aria-label="Mix Mode"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleToggleMute}
                    className="p-2 rounded-full text-muted-foreground"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div 
                    className="w-32 h-3 bg-gray-700 rounded-full relative cursor-pointer border-2 border-gray-600 shadow-md"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const width = rect.width;
                      const newVolume = Math.max(0, Math.min(100, Math.round((x / width) * 100)));
                      setPlayerVolume(newVolume);
                      handleVolumeChange(newVolume / 100);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = moveEvent.clientX - rect.left;
                        const width = rect.width;
                        const newVolume = Math.max(0, Math.min(100, Math.round((x / width) * 100)));
                        setPlayerVolume(newVolume);
                        handleVolumeChange(newVolume / 100);
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <div 
                      className="h-full bg-blue-500 rounded-full shadow-inner"
                      style={{ width: `${playerVolumeState}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Effects Panel */}
            {!isLoading && (
              <EffectsPanel
                showEqualizer={showEqualizer}
                eqBands={eqBands}
                onEqChange={handleEqChange}
                onResetEqualizer={resetEqualizer}
                showMixMode={showMixMode}
                tempo={tempo}
                pitch={pitch}
                lofiIntensity={lofiIntensity}
                backgroundNoise={backgroundNoise}
                noiseVolume={noiseVolume}
                vinylCrackle={vinylCrackle}
                tapeWow={tapeWow}
                onTempoChange={setTempo}
                onPitchChange={setPitch}
                onLofiIntensityChange={setLofiIntensity}
                onBackgroundNoiseChange={setBackgroundNoise}
                onNoiseVolumeChange={setNoiseVolume}
                onVinylCrackleChange={setVinylCrackle}
                onTapeWowChange={setTapeWow}
                onResetMixMode={resetMixMode}
                onApplyMixPreset={handleMixPreset}
              />
            )}

            {/* Lyrics Panel */}
            {showLyrics && !isLoading && (
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Lyrics
                </h4>
                <div className="max-h-64 overflow-y-auto scrollbar-hide">
                  <div className="space-y-2 text-sm leading-relaxed">
                    {/* Sample lyrics - In real implementation, these would come from lyrics API */}
                    <div className="text-muted-foreground">
                      <div className="mb-2 font-medium text-foreground">Verse 1:</div>
                      <div>In the silence of the midnight hour</div>
                      <div>When the world sleeps and dreams take power</div>
                      <div>I find myself lost in melodies</div>
                      <div>That dance through my memories</div>
                    </div>
                    <div className="text-muted-foreground">
                      <div className="mb-2 font-medium text-foreground">Chorus:</div>
                      <div>Starlight serenade, play for me tonight</div>
                      <div>Guide me through the darkness with your light</div>
                      <div>Every note's a story, every beat's a heart</div>
                      <div>Music is the language that sets us apart</div>
                    </div>
                    <div className="text-muted-foreground">
                      <div className="mb-2 font-medium text-foreground">Verse 2:</div>
                      <div>Through the static and the noise around</div>
                      <div>Your melody is all I've found</div>
                      <div>A rhythm that speaks to my soul</div>
                      <div>Making broken pieces whole</div>
                    </div>
                    <div className="text-muted-foreground">
                      <div className="mb-2 font-medium text-foreground">Bridge:</div>
                      <div>When words fail and silence calls</div>
                      <div>Music breaks down all the walls</div>
                      <div>Between hearts that need to feel</div>
                      <div>Something honest, something real</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Music className="w-3 h-3" />
                    Lyrics powered by TuneTON AI • Sync with track timing
                  </p>
                </div>
              </div>
            )}

            {/* Track Info from Jamendo API */}
            {currentJamendoTrack && !isLoading && !showLyrics && (
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Track Information
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div><span className="font-medium">Duration:</span> {formatTime(currentJamendoTrack.duration)}</div>
                  <div><span className="font-medium">Album:</span> {currentJamendoTrack.album_name}</div>
                  {currentJamendoTrack.musicinfo && (
                    <>
                      <div><span className="font-medium">Type:</span> {currentJamendoTrack.musicinfo.vocalinstrumental}</div>
                      <div><span className="font-medium">Speed:</span> {currentJamendoTrack.musicinfo.speed}</div>
                      {currentJamendoTrack.musicinfo.tags?.instruments && (
                        <div><span className="font-medium">Instruments:</span> {currentJamendoTrack.musicinfo.tags.instruments.join(', ')}</div>
                      )}
                    </>
                  )}
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