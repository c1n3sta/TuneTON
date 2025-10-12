import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Heart, 
  Share, 
  ThumbsDown,
  Sliders,
  Zap,
  Volume2,
  AlertCircle,
  Bot,
  Coins,
  FileText
} from "lucide-react";

interface PlayerControlsProps {
  // Playback state
  playerIsPlaying: boolean;
  hasError: boolean;
  isShuffled: boolean;
  repeatMode: number;
  isLiked: boolean;
  isDisliked: boolean;
  showEqualizer: boolean;
  showMixMode: boolean;
  mixModeActive: boolean;
  volume: number;
  
  // Audio state
  currentTime: number;
  duration: number;
  
  // Handlers
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onToggleDislike: () => void;
  onToggleEqualizer: () => void;
  onToggleMixMode: () => void;
  onVolumeChange: (volume: number) => void;
  onProgressChange: (time: number) => void;
  onNavigateToAIStudio: () => void;
  onNavigateToNFTMarket: () => void;
  onToggleLyrics: () => void;
  
  // State
  showLyrics: boolean;
  
  // Utility
  formatTime: (seconds: number) => string;
}

export default function PlayerControls({
  playerIsPlaying,
  hasError,
  isShuffled,
  repeatMode,
  isLiked,
  isDisliked,
  showEqualizer,
  showMixMode,
  mixModeActive,
  volume,
  currentTime,
  duration,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onToggleDislike,
  onToggleEqualizer,
  onToggleMixMode,
  onVolumeChange,
  onProgressChange,
  onNavigateToAIStudio,
  onNavigateToNFTMarket,
  onToggleLyrics,
  showLyrics,
  formatTime
}: PlayerControlsProps) {
  return (
    <>
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onProgressChange(parseFloat(e.target.value))}
            disabled={hasError}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${duration ? (currentTime / duration) * 100 : 0}%, hsl(var(--muted)) ${duration ? (currentTime / duration) * 100 : 0}%, hsl(var(--muted)) 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={onToggleShuffle}
          className={`w-6 h-6 transition-colors ${isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <Shuffle className="w-full h-full" />
        </button>
        
        <button 
          onClick={onPrevious}
          className="w-8 h-8 text-foreground hover:text-primary hover:scale-110 transition-all duration-200"
        >
          <SkipBack className="w-full h-full" />
        </button>
        
        <button
          onClick={onTogglePlay}
          disabled={hasError}
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasError ? (
            <AlertCircle className="w-7 h-7" />
          ) : playerIsPlaying ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-0.5" />
          )}
        </button>
        
        <button 
          onClick={onNext}
          className="w-8 h-8 text-foreground hover:text-primary hover:scale-110 transition-all duration-200"
        >
          <SkipForward className="w-full h-full" />
        </button>
        
        <button
          onClick={onToggleRepeat}
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
      <div className="space-y-4">
        {/* Top Row - Like/Dislike & Effects */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleLike}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
              isLiked 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onToggleDislike}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
              isDisliked 
                ? 'text-destructive bg-destructive/10' 
                : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
            }`}
          >
            <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onToggleEqualizer}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
              showEqualizer 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <Sliders className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMixMode}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
              showMixMode || mixModeActive
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
          >
            <Zap className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleLyrics}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
              showLyrics
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
            title="Toggle lyrics"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
            <Share className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Row - Navigation & Volume */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToAIStudio}
            className="w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            title="AI Studio - Create custom mixes"
          >
            <Bot className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] font-medium">MIX</span>
          </button>

          <button
            onClick={onNavigateToNFTMarket}
            className="w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
            title="NFT Marketplace"
          >
            <Coins className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] font-medium">NFT</span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume}%, hsl(var(--muted)) ${volume}%, hsl(var(--muted)) 100%)`
              }}
            />
            <span className="text-xs text-muted-foreground w-8 text-center">{volume}%</span>
          </div>
        </div>
      </div>
    </>
  );
}