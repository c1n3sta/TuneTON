import { useState, useEffect } from "react";
import { 
  ChevronDown,
  List,
  Loader2,
  AlertCircle,
  WifiOff,
  Music,
  FileText
} from "lucide-react";
import BottomNavigation from "./BottomNavigation";
import { Badge } from "./ui/badge";
import { jamendoAPI, JamendoTrack, getTuneTONRecommendations } from "../utils/jamendo-api";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { convertJamendoToTrack, checkMixModeActive, formatTime } from "./player/utils";
import { DEFAULT_EQ_VALUES, WAVEFORM_HEIGHTS } from "./player/constants";
import QueueView from "./player/QueueView";
import PlayerControls from "./player/PlayerControls";
import EffectsPanel from "./player/EffectsPanel";

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
  isPlaying = true, 
  onPlayPause 
}: MusicPlayerProps) {
  // Audio and playback state
  const [playerIsPlaying, setPlayerIsPlaying] = useState(isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: none, 1: all, 2: one
  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showMixMode, setShowMixMode] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  // Jamendo integration
  const [currentJamendoTrack, setCurrentJamendoTrack] = useState<JamendoTrack | null>(null);
  const [queueTracks, setQueueTracks] = useState<JamendoTrack[]>([]);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Audio Effects States
  const [tempo, setTempo] = useState(100);
  const [pitch, setPitch] = useState(0);
  const [mixModeActive, setMixModeActive] = useState(false);
  const [lofiIntensity, setLofiIntensity] = useState(0);
  const [backgroundNoise, setBackgroundNoise] = useState('none');
  const [noiseVolume, setNoiseVolume] = useState(30);
  const [vinylCrackle, setVinylCrackle] = useState(0);
  const [tapeWow, setTapeWow] = useState(0);
  const [eqBands, setEqBands] = useState(DEFAULT_EQ_VALUES);

  // Navigation functions
  const handleNext = () => {
    if (queueTracks.length > 0) {
      const nextTrack = queueTracks[0];
      setCurrentJamendoTrack(nextTrack);
      setQueueTracks(prev => prev.slice(1));
      setCurrentTime(0);
      
      if (currentJamendoTrack) {
        setQueueTracks(prev => [...prev, currentJamendoTrack]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentTime > 10) {
      setCurrentTime(0);
    } else if (queueTracks.length > 0) {
      const prevTrack = queueTracks[queueTracks.length - 1];
      setCurrentJamendoTrack(prevTrack);
      setQueueTracks(prev => prev.slice(0, -1));
      setCurrentTime(0);
    }
  };

  const trackName = typeof currentTrack === 'object' ? currentTrack?.name : (typeof currentTrack === 'string' ? currentTrack : 'Unknown Track');
  const track = convertJamendoToTrack(currentJamendoTrack, trackName, currentTime, isLiked, isDisliked);

  // Audio player hook
  const { audioRef, seekTo } = useAudioPlayer({
    track,
    playerIsPlaying,
    volume,
    tempo,
    onNext: handleNext,
    onTimeUpdate: setCurrentTime,
    onDurationChange: setDuration,
    onError: () => {
      setHasError(true);
      setPlayerIsPlaying(false);
    },
    onCanPlay: () => setHasError(false)
  });

  // Load Jamendo tracks
  useEffect(() => {
    const loadJamendoTracks = async () => {
      try {
        setIsLoading(true);
        console.log('🎵 MusicPlayer: Starting to load Jamendo tracks...');
        console.log('🎵 API Available at start:', jamendoAPI.isApiAvailable());
        
        // If currentTrack is already a JamendoTrack object, use it directly
        if (currentTrack && typeof currentTrack === 'object' && 'id' in currentTrack) {
          setCurrentJamendoTrack(currentTrack);
          console.log('🎵 Using passed JamendoTrack:', currentTrack.name, 'by', currentTrack.artist_name);
          
          // Still load recommendations for queue
          const recommendations = await getTuneTONRecommendations();
          const allTracks = [
            ...recommendations.popular,
            ...recommendations.trending,
            ...recommendations.lofi,
            ...recommendations.remixable
          ].filter(track => track.id !== currentTrack.id); // Exclude current track from queue
          
          setQueueTracks(allTracks.slice(0, 5));
          
          const apiAvailable = jamendoAPI.isApiAvailable();
          setUsingMockData(!apiAvailable);
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
        const trackName = typeof currentTrack === 'string' ? currentTrack : 'Starlight Serenade';
        let trackToPlay = allTracks.find(track => track.name === trackName) || allTracks[0];
        if (trackToPlay) {
          setCurrentJamendoTrack(trackToPlay);
          console.log('🎵 Selected track to play:', trackToPlay.name, 'by', trackToPlay.artist_name);
        }
        
        const apiAvailable = jamendoAPI.isApiAvailable();
        setUsingMockData(!apiAvailable);
        console.log('🎵 API Available at end:', apiAvailable, '| Using mock data:', !apiAvailable);
      } catch (error) {
        console.error('🎵 Error loading Jamendo tracks:', error);
        setHasError(true);
        setUsingMockData(true);
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
    if (!track.audioUrl && !hasError) {
      setHasError(true);
      return;
    }
    
    const newPlayState = !playerIsPlaying;
    setPlayerIsPlaying(newPlayState);
    onPlayPause?.();
    
    if (hasError) {
      setHasError(false);
    }
  };

  const resetEqualizer = () => setEqBands(DEFAULT_EQ_VALUES);
  
  const resetMixMode = () => {
    setLofiIntensity(0);
    setBackgroundNoise('none');
    setNoiseVolume(30);
    setVinylCrackle(0);
    setTapeWow(0);
    setTempo(100);
    setPitch(0);
  };

  const handleEqChange = (band: string, value: number) => {
    if (band === 'preset') {
      setEqBands(value);
    } else {
      setEqBands(prev => ({ ...prev, [band]: value }));
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

  // Show queue view
  if (showQueue) {
    return (
      <QueueView 
        track={track}
        queueTracks={queueTracks}
        usingMockData={usingMockData}
        onClose={() => setShowQueue(false)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Hidden Audio Element */}
      {track.audioUrl && (
        <audio
          ref={audioRef}
          src={track.audioUrl}
          preload="metadata"
          crossOrigin="anonymous"
        />
      )}

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
              {usingMockData && (
                <Badge variant="outline" className="text-xs">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Demo
                </Badge>
              )}
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
                  <p className="text-sm text-destructive mb-2">Unable to play audio</p>
                  <button 
                    onClick={() => setHasError(false)}
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
                    {currentJamendoTrack.musicinfo.tags.genres.slice(0, 3).map((genre, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Player Controls */}
            {!isLoading && (
              <PlayerControls
                playerIsPlaying={playerIsPlaying}
                hasError={hasError}
                isShuffled={isShuffled}
                repeatMode={repeatMode}
                isLiked={isLiked}
                isDisliked={isDisliked}
                showEqualizer={showEqualizer}
                showMixMode={showMixMode}
                mixModeActive={mixModeActive}
                volume={volume}
                currentTime={currentTime}
                duration={duration}
                onTogglePlay={togglePlay}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToggleShuffle={() => setIsShuffled(!isShuffled)}
                onToggleRepeat={() => setRepeatMode((mode) => (mode + 1) % 3)}
                onToggleLike={() => {
                  setIsLiked(!isLiked);
                  if (!isLiked && isDisliked) setIsDisliked(false);
                }}
                onToggleDislike={() => {
                  setIsDisliked(!isDisliked);
                  if (!isDisliked && isLiked) setIsLiked(false);
                }}
                onToggleEqualizer={() => setShowEqualizer(!showEqualizer)}
                onToggleMixMode={() => setShowMixMode(!showMixMode)}
                onVolumeChange={setVolume}
                onProgressChange={seekTo}
                onNavigateToAIStudio={() => onNavigate?.("Home", "ai-studio")}
                onNavigateToNFTMarket={() => onNavigate?.("Home", "nft-marketplace")}
                onToggleLyrics={() => setShowLyrics(!showLyrics)}
                showLyrics={showLyrics}
                formatTime={formatTime}
              />
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