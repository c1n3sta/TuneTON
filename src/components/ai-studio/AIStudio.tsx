import { useState, useEffect } from "react";
import { 
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  MessageCircle,
  Share,
  Download,
  PlusCircle,
  Star,
  Send,
  MoreHorizontal,
  Smile,
  Mic,
  X,
  Clock,
  AudioWaveform,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Scissors,
  Copy,
  ClipboardPaste,
  Piano,
  Settings,
  Sparkles,
  Save,
  Users,
  Coins,
  ChevronUp,
  Sliders,
  Headphones,
  Music,
  Zap,
  Radio,
  Waves,
  Filter,
  Mic2,
  Bot,
  Shuffle,
  Square,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Layers,
  SplitSquareHorizontal,
  Repeat,
  Move
} from "lucide-react";
import BottomNavigation from "../home/BottomNavigation";
import { audioEffectsManager, DEFAULT_PRESETS } from '../../utils/audioEffects';

interface AIStudioProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onOpenCreateNFT: () => void;
}

interface Selection {
  start: number;
  end: number;
  track: 'full' | 'vocals' | 'instruments' | 'bass' | 'drums';
}

export default function AIStudio({ onBack, onNavigate, onOpenCreateNFT }: AIStudioProps) {
  // Popular effects controls
  const [autoTune, setAutoTune] = useState(0);
  const [reverb, setReverb] = useState(25);
  const [distortion, setDistortion] = useState(0);
  const [vocoder, setVocoder] = useState(0);
  const [harmonizer, setHarmonizer] = useState(0);
  const [pitchShift, setPitchShift] = useState(50);
  
  // Essential controls
  const [tempo, setTempo] = useState(75);
  const [pitch, setPitch] = useState(50);
  const [equalizer, setEqualizer] = useState(50);
  const [crossfade, setCrossfade] = useState(30);
  
  // 2025 Trending modes
  const [lofiMode, setLofiMode] = useState(false);
  const [reverseReverb, setReverseReverb] = useState(false);
  const [genreBending, setGenreBending] = useState(false);
  
  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullMixPlaying, setIsFullMixPlaying] = useState(false);
  const [isVocalsPlaying, setIsVocalsPlaying] = useState(true);
  const [isInstrumentsPlaying, setIsInstrumentsPlaying] = useState(true);
  const [isBassPlaying, setIsBassPlaying] = useState(true);
  const [isDrumsPlaying, setIsDrumsPlaying] = useState(true);
  
  // Solo states
  const [isFullMixSolo, setIsFullMixSolo] = useState(false);
  const [isVocalsSolo, setIsVocalsSolo] = useState(false);
  const [isInstrumentsSolo, setIsInstrumentsSolo] = useState(false);
  const [isBassSolo, setIsBassSolo] = useState(false);
  const [isDrumsSolo, setIsDrumsSolo] = useState(false);
  
  // Editing states
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [clipboard, setClipboard] = useState<Selection | null>(null);
  const [playheadPosition, setPlayheadPosition] = useState(35); // Position in percentage
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'full' | 'vocals' | 'instruments' | 'bass' | 'drums'>('full');
  const [editMode, setEditMode] = useState<'normal' | 'select' | 'cut' | 'copy'>('normal');
  
  // UI states
  const [activeTab, setActiveTab] = useState("editor");
  const [expandedSections, setExpandedSections] = useState({
    waveform: true,
    effects: false,
    automation: false
  });

  const handleSliderChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(parseInt(e.target.value));
  };

  // Fix the toggleSection type issue
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Audio effects state
  const [audioEffects, setAudioEffects] = useState({
    pitchShift: 1.0,
    bassBoost: 0,
    loFi: { bitDepth: 16, downsampleFactor: 1 },
    eq: { 100: 0, 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 }
  });
  
  const [selectedPreset, setSelectedPreset] = useState('flat');
  
  // Initialize audio effects manager
  useEffect(() => {
    const initAudioEffects = async () => {
      try {
        await audioEffectsManager.initialize();
      } catch (error) {
        console.error('Failed to initialize audio effects:', error);
      }
    };
    
    initAudioEffects();
  }, []);
  
  // Apply effects when they change
  useEffect(() => {
    if (audioEffectsManager.isReady()) {
      audioEffectsManager.applyEffects(audioEffects);
    }
  }, [audioEffects]);
  
  // Handle preset selection
  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = DEFAULT_PRESETS[presetName];
    if (preset) {
      setAudioEffects(prev => ({
        ...prev,
        ...preset,
        eq: { ...prev.eq, ...preset.eq }
      }));
    }
  };
  
  // Handle effect parameter changes
  const handlePitchShiftChange = (value: number) => {
    setAudioEffects(prev => ({
      ...prev,
      pitchShift: value
    }));
  };
  
  const handleBassBoostChange = (value: number) => {
    setAudioEffects(prev => ({
      ...prev,
      bassBoost: value
    }));
  };
  
  const handleLoFiChange = (param: 'bitDepth' | 'downsampleFactor', value: number) => {
    setAudioEffects(prev => ({
      ...prev,
      loFi: {
        ...prev.loFi,
        [param]: value
      }
    }));
  };
  
  const handleEqChange = (frequency: number, gain: number) => {
    setAudioEffects(prev => ({
      ...prev,
      eq: {
        ...prev.eq,
        [frequency]: gain
      }
    }));
  };
  
  const handleWaveformClick = (e: React.MouseEvent, trackType: 'full' | 'vocals' | 'instruments' | 'bass' | 'drums') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = ((e.clientX - rect.left) / rect.width) * 100;
    
    if (editMode === 'select') {
      if (!isSelecting) {
        setCurrentSelection({ start: clickPosition, end: clickPosition, track: trackType });
        setIsSelecting(true);
      } else {
        if (currentSelection) {
          setCurrentSelection({
            ...currentSelection,
            end: clickPosition,
            track: trackType
          });
          setIsSelecting(false);
        }
      }
    } else {
      setPlayheadPosition(clickPosition);
    }
  };

  const handleCut = () => {
    if (currentSelection) {
      setClipboard(currentSelection);
      console.log(`Cut selection from ${currentSelection.start.toFixed(1)}% to ${currentSelection.end.toFixed(1)}% on ${currentSelection.track} track`);
      setCurrentSelection(null);
    }
  };

  const handleCopy = () => {
    if (currentSelection) {
      setClipboard(currentSelection);
      console.log(`Copied selection from ${currentSelection.start.toFixed(1)}% to ${currentSelection.end.toFixed(1)}% on ${currentSelection.track} track`);
    }
  };

  const handlePaste = () => {
    if (clipboard) {
      console.log(`Pasted selection at ${playheadPosition.toFixed(1)}% position on ${selectedTrack} track`);
    }
  };

  const handleLoop = () => {
    if (currentSelection) {
      console.log(`Looping selection from ${currentSelection.start.toFixed(1)}% to ${currentSelection.end.toFixed(1)}% on ${currentSelection.track} track`);
    }
  };

  const handleMintNFT = () => {
    console.log('Opening NFT creation page from AI Studio');
    onOpenCreateNFT();
  };

  const renderSlider = (value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label?: string, description?: string) => (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[14px] font-semibold text-[#c9d1d9]">{label}</span>
            {description && <p className="text-[11px] text-[#8b949e] mt-1">{description}</p>}
          </div>
          <span className="text-[12px] text-[#ff22fb] font-semibold">{value}%</span>
        </div>
      )}
      <div className="relative w-full h-3 bg-[#161b22] rounded-full border border-[#30363d]">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#ff22fb] via-[#ff4400] to-[#ff22fb] rounded-full transition-all duration-200"
          style={{ width: `${value}%` }}
        />
        <div 
          className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 border-2 border-[#ff22fb] transition-all duration-200 hover:scale-110"
          style={{ left: `calc(${value}% - 10px)` }}
        />
      </div>
    </div>
  );

  const WaveformVisualization = ({ 
    isPlaying, 
    type,
    trackType 
  }: { 
    isPlaying: boolean; 
    type: 'full' | 'vocals' | 'instruments' | 'bass' | 'drums';
    trackType: 'full' | 'vocals' | 'instruments' | 'bass' | 'drums';
  }) => {
    const bars = type === 'full' ? 60 : 30;
    const generateHeights = () => {
      return Array.from({ length: bars }, (_, i) => {
        let base = 8 + Math.sin(i * 0.2) * 12;
        const variation = Math.random() * 16;
        
        // Adjust height based on track type
        if (type === 'bass') base *= 1.2;
        if (type === 'drums') base = 6 + Math.sin(i * 0.4) * 8;
        if (type === 'vocals') base = 10 + Math.sin(i * 0.3) * 10;
        
        const autotune = autoTune > 0 ? Math.sin(i * 0.8) * (autoTune * 0.3) : 0;
        const reverbEffect = reverb > 0 ? Math.sin(i * 0.1) * (reverb * 0.2) : 0;
        return Math.max(4, base + variation + autotune + reverbEffect);
      });
    };

    const heights = generateHeights();

    return (
      <div 
        className="bg-[#0d1117] h-24 rounded-lg flex items-end overflow-hidden px-4 border border-[#30363d] relative cursor-pointer hover:border-[#ff22fb]/50 transition-colors"
        onClick={(e) => handleWaveformClick(e, trackType)}
      >
        <div className="flex items-end justify-between w-full gap-px">
          {Array.from({ length: bars }).map((_, i) => {
            const position = (i / bars) * 100;
            const isInSelection = currentSelection && 
              currentSelection.track === trackType && 
              position >= Math.min(currentSelection.start, currentSelection.end) && 
              position <= Math.max(currentSelection.start, currentSelection.end);
            
            return (
              <div
                key={i}
                className={`rounded-sm transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                } ${isInSelection ? 'opacity-100' : 'opacity-80'}`}
                style={{ 
                  width: `${100/bars - 1}%`,
                  height: `${heights[i]}px`,
                  background: isInSelection 
                    ? `linear-gradient(to top, #00ff88, #00cc66)`
                    : autoTune > 0 
                    ? `linear-gradient(to top, #ff22fb, #00ff88)` 
                    : distortion > 0 
                    ? `linear-gradient(to top, #ff4400, #ff0000)`
                    : type === 'bass'
                    ? `linear-gradient(to top, #ff4400, #ff6600)`
                    : type === 'drums'
                    ? `linear-gradient(to top, #ffaa00, #ff8800)`
                    : type === 'vocals'
                    ? `linear-gradient(to top, #4444ff, #6666ff)`
                    : `linear-gradient(to top, #ff22fb, #ff4400)`,
                  animationDelay: `${i * 0.02}s`,
                  animationDuration: isPlaying ? '1.5s' : '0s'
                }}
              />
            );
          })}
        </div>
        
        {/* Selection overlay */}
        {currentSelection && currentSelection.track === trackType && (
          <div 
            className="absolute top-0 bottom-0 bg-[#00ff88]/20 border-l-2 border-r-2 border-[#00ff88] pointer-events-none"
            style={{
              left: `${Math.min(currentSelection.start, currentSelection.end)}%`,
              width: `${Math.abs(currentSelection.end - currentSelection.start)}%`
            }}
          />
        )}
        
        {/* Effect indicators */}
        {autoTune > 0 && type === 'vocals' && (
          <div className="absolute top-2 left-4 text-[10px] font-bold text-[#00ff88] bg-black/50 px-2 py-1 rounded">
            AUTO-TUNE
          </div>
        )}
        {reverb > 30 && (
          <div className="absolute top-2 right-4 text-[10px] font-bold text-[#4444ff] bg-black/50 px-2 py-1 rounded">
            REVERB
          </div>
        )}
        
        {/* Track label */}
        <div className="absolute bottom-2 left-4 text-[10px] font-bold text-[#8b949e] bg-black/50 px-2 py-1 rounded uppercase">
          {type}
        </div>
        
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white opacity-90 shadow-lg pointer-events-none"
          style={{ left: `${playheadPosition}%` }}
        />
        
        {/* Time markers */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-between text-[8px] text-[#8b949e] px-4">
          <span>0:00</span>
          <span>1:30</span>
          <span>3:00</span>
        </div>
      </div>
    );
  };

  const renderTrackControls = (
    label: string,
    isPlaying: boolean,
    isSolo: boolean,
    onPlayToggle: () => void,
    onSoloToggle: () => void,
    trackType: 'full' | 'vocals' | 'instruments' | 'bass' | 'drums',
    color: string = "#ff22fb"
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#c9d1d9] uppercase tracking-[0.8px]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedTrack(trackType)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border-2 ${
              selectedTrack === trackType
                ? 'border-[#ff22fb] bg-[#ff22fb]/20 text-[#ff22fb]'
                : 'border-[#30363d] text-[#8b949e] hover:border-[#ff22fb]/50'
            }`}
          >
            <Square className="w-3 h-3" />
          </button>
          <button 
            onClick={onPlayToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              isPlaying 
                ? `bg-gradient-to-r from-[${color}] to-[#ff4400] text-white shadow-lg shadow-[${color}]/25` 
                : 'bg-[#161b22] text-[#8b949e] hover:text-[#ff22fb] hover:bg-[#21262d]'
            }`}
          >
            {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button 
            onClick={onSoloToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              isSolo 
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ffaa00] text-white shadow-lg shadow-[#ff4400]/25' 
                : 'bg-[#161b22] text-[#8b949e] hover:text-[#ff4400] hover:bg-[#21262d]'
            }`}
          >
            <span className="text-[11px] font-bold">S</span>
          </button>
        </div>
      </div>
      <WaveformVisualization isPlaying={isPlaying} type={trackType} trackType={trackType} />
    </div>
  );

  const PopularEffectButton = ({ 
    icon: Icon, 
    title, 
    description, 
    isActive, 
    onClick, 
    gradient = "from-[#ff22fb] to-[#ff4400]",
    trending = false 
  }: {
    icon: any;
    title: string;
    description: string;
    isActive: boolean;
    onClick: () => void;
    gradient?: string;
    trending?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
        isActive 
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-[#ff22fb]/20` 
          : 'bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d] border border-[#30363d]'
      }`}
    >
      {trending && (
        <div className="absolute -top-2 -right-2 bg-[#00ff88] text-black text-[9px] font-bold px-2 py-1 rounded-full">
          HOT
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-6 h-6" />
        <div className="text-center">
          <div className="text-[13px] font-semibold">{title}</div>
          <div className="text-[10px] opacity-80">{description}</div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-center">
        <div className="w-[400px] bg-[#161b22] rounded-2xl min-h-screen relative overflow-hidden">
          
          {/* Header with Track Info */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-[#161b22] to-[#161b22]/95 border-b border-[#30363d] backdrop-blur-sm">
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex flex-col">
                <h1 className="text-[18px] font-bold text-[#c9d1d9]">AI Music Studio</h1>
                <p className="text-[14px] text-[#8b949e]">Advanced Audio Editor</p>
              </div>
              <div 
                className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-[#ff22fb] shadow-lg shadow-[#ff22fb]/25"
              />
            </div>

            {/* Main Transport Controls */}
            <div className="flex items-center justify-center gap-8 py-5 border-t border-[#30363d]">
              <button className="p-3 text-[#8b949e] hover:text-[#ff22fb] hover:bg-[#21262d] rounded-full transition-all duration-200">
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-5 bg-gradient-to-r from-[#ff22fb] to-[#ff4400] text-white rounded-full hover:shadow-xl hover:shadow-[#ff22fb]/25 transition-all duration-200 transform hover:scale-110"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
              </button>
              <button className="p-3 text-[#8b949e] hover:text-[#ff22fb] hover:bg-[#21262d] rounded-full transition-all duration-200">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Edit Mode Controls */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setEditMode('normal')}
                  className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                    editMode === 'normal' 
                      ? 'bg-[#ff22fb] text-white' 
                      : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d]'
                  }`}
                >
                  <Move className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditMode('select')}
                  className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                    editMode === 'select' 
                      ? 'bg-[#ff22fb] text-white' 
                      : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d]'
                  }`}
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={handleCut}
                    disabled={!currentSelection}
                    className="p-2 rounded-lg bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] disabled:opacity-50 transition-colors"
                  >
                    <Scissors className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!currentSelection}
                    className="p-2 rounded-lg bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] disabled:opacity-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePaste}
                    disabled={!clipboard}
                    className="p-2 rounded-lg bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] disabled:opacity-50 transition-colors"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLoop}
                    disabled={!currentSelection}
                    className="p-2 rounded-lg bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] disabled:opacity-50 transition-colors"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {currentSelection && (
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                  <div className="text-[11px] text-[#8b949e] mb-1">SELECTION</div>
                  <div className="text-[12px] text-[#c9d1d9] font-semibold">
                    {currentSelection.track.toUpperCase()}: {currentSelection.start.toFixed(1)}% - {currentSelection.end.toFixed(1)}% 
                    ({Math.abs(currentSelection.end - currentSelection.start).toFixed(1)}% duration)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 pb-32 space-y-6">
            
            {/* Enhanced Multi-Track Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-[#c9d1d9] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#ff22fb]" />
                  Multi-Track Editor
                </h3>
                <button 
                  onClick={() => toggleSection('waveform')}
                  className="p-2 text-[#8b949e] hover:text-[#ff22fb] transition-colors rounded-lg hover:bg-[#21262d]"
                >
                  {expandedSections.waveform ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              
              {expandedSections.waveform && (
                <div className="space-y-4">
                  {renderTrackControls(
                    "FULL MIX",
                    isFullMixPlaying,
                    isFullMixSolo,
                    () => setIsFullMixPlaying(!isFullMixPlaying),
                    () => setIsFullMixSolo(!isFullMixSolo),
                    'full',
                    '#ff22fb'
                  )}
                  {renderTrackControls(
                    "VOCALS",
                    isVocalsPlaying,
                    isVocalsSolo,
                    () => setIsVocalsPlaying(!isVocalsPlaying),
                    () => setIsVocalsSolo(!isVocalsSolo),
                    'vocals',
                    '#4444ff'
                  )}
                  {renderTrackControls(
                    "INSTRUMENTS",
                    isInstrumentsPlaying,
                    isInstrumentsSolo,
                    () => setIsInstrumentsPlaying(!isInstrumentsPlaying),
                    () => setIsInstrumentsSolo(!isInstrumentsSolo),
                    'instruments',
                    '#ff4400'
                  )}
                  {renderTrackControls(
                    "BASS",
                    isBassPlaying,
                    isBassSolo,
                    () => setIsBassPlaying(!isBassPlaying),
                    () => setIsBassSolo(!isBassSolo),
                    'bass',
                    '#ff6600'
                  )}
                  {renderTrackControls(
                    "DRUMS",
                    isDrumsPlaying,
                    isDrumsSolo,
                    () => setIsDrumsPlaying(!isDrumsPlaying),
                    () => setIsDrumsSolo(!isDrumsSolo),
                    'drums',
                    '#ffaa00'
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Editing Tabs */}
            <div className="space-y-4">
              <h3 className="text-[17px] font-bold text-[#c9d1d9] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff22fb]" />
                Audio Tools & Effects
              </h3>
              
              <div className="min-h-[400px] space-y-6">
                {activeTab === "editor" && (
                  <div className="space-y-6">
                    {/* Track Editing Tools */}
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#c9d1d9] mb-4 flex items-center gap-2">
                        <SplitSquareHorizontal className="w-4 h-4 text-[#ff22fb]" />
                        Track Editing Tools
                      </h4>
                      
                      <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] mb-4">
                        <div className="text-[12px] text-[#8b949e] mb-3">CURRENT TRACK: {selectedTrack.toUpperCase()}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-[#161b22] rounded-lg p-3 flex items-center gap-2 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <Scissors className="w-4 h-4 text-[#ff22fb]" />
                            <span className="text-[12px] font-semibold text-[#c9d1d9]">Smart Cut</span>
                          </button>
                          <button className="bg-[#161b22] rounded-lg p-3 flex items-center gap-2 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <Copy className="w-4 h-4 text-[#ff22fb]" />
                            <span className="text-[12px] font-semibold text-[#c9d1d9]">Duplicate</span>
                          </button>
                          <button className="bg-[#161b22] rounded-lg p-3 flex items-center gap-2 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <Repeat className="w-4 h-4 text-[#ff22fb]" />
                            <span className="text-[12px] font-semibold text-[#c9d1d9]">Loop Region</span>
                          </button>
                          <button className="bg-[#161b22] rounded-lg p-3 flex items-center gap-2 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <RotateCw className="w-4 h-4 text-[#ff22fb]" />
                            <span className="text-[12px] font-semibold text-[#c9d1d9]">Reverse</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="text-[14px] font-semibold text-[#c9d1d9]">AI Stem Separation</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <button className="bg-[#161b22] rounded-lg p-4 flex items-center gap-3 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <Mic className="w-5 h-5 text-[#ff22fb]" />
                            <div className="text-left flex-1">
                              <div className="text-[14px] font-semibold text-[#c9d1d9]">Extract Vocals</div>
                              <div className="text-[12px] text-[#8b949e]">Isolate vocal track with AI</div>
                            </div>
                            <div className="text-[10px] bg-[#ff22fb] text-white px-2 py-1 rounded-full font-bold">AI</div>
                          </button>
                          <button className="bg-[#161b22] rounded-lg p-4 flex items-center gap-3 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <Music className="w-5 h-5 text-[#ff22fb]" />
                            <div className="text-left flex-1">
                              <div className="text-[14px] font-semibold text-[#c9d1d9]">Extract Instruments</div>
                              <div className="text-[12px] text-[#8b949e]">Get clean instrumental track</div>
                            </div>
                            <div className="text-[10px] bg-[#ff22fb] text-white px-2 py-1 rounded-full font-bold">AI</div>
                          </button>
                          <button className="bg-[#161b22] rounded-lg p-4 flex items-center gap-3 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                            <AudioWaveform className="w-5 h-5 text-[#ff22fb]" />
                            <div className="text-left flex-1">
                              <div className="text-[14px] font-semibold text-[#c9d1d9]">Extract Bass & Drums</div>
                              <div className="text-[12px] text-[#8b949e]">Separate rhythm section</div>
                            </div>
                            <div className="text-[10px] bg-[#ff22fb] text-white px-2 py-1 rounded-full font-bold">AI</div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Selection Info */}
                    {currentSelection && (
                      <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                        <h5 className="text-[14px] font-semibold text-[#c9d1d9] mb-3">Selection Details</h5>
                        <div className="space-y-2 text-[12px]">
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">Track:</span>
                            <span className="text-[#c9d1d9] font-semibold">{currentSelection.track.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">Start:</span>
                            <span className="text-[#c9d1d9]">{currentSelection.start.toFixed(1)}% (≈{(currentSelection.start * 3 / 100).toFixed(1)}s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">End:</span>
                            <span className="text-[#c9d1d9]">{currentSelection.end.toFixed(1)}% (≈{(currentSelection.end * 3 / 100).toFixed(1)}s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">Duration:</span>
                            <span className="text-[#c9d1d9] font-semibold">{Math.abs(currentSelection.end - currentSelection.start).toFixed(1)}% (≈{(Math.abs(currentSelection.end - currentSelection.start) * 3 / 100).toFixed(1)}s)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "popular" && (
                  <div className="space-y-6">
                    {/* Most Popular Effects */}
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#c9d1d9] mb-4 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#ff22fb]" />
                        Most Loved Effects
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <PopularEffectButton
                          icon={Mic2}
                          title="Auto-Tune"
                          description="Pitch correction & vocal style"
                          isActive={autoTune > 0}
                          onClick={() => setAutoTune(autoTune > 0 ? 0 : 65)}
                          gradient="from-[#00ff88] to-[#00cc66]"
                        />
                        <PopularEffectButton
                          icon={Waves}
                          title="Reverb"
                          description="Spacious echo effect"
                          isActive={reverb > 50}
                          onClick={() => setReverb(reverb > 50 ? 25 : 75)}
                          gradient="from-[#4444ff] to-[#6666ff]"
                        />
                        <PopularEffectButton
                          icon={Zap}
                          title="Distortion"
                          description="Raw, fuzzy energy"
                          isActive={distortion > 0}
                          onClick={() => setDistortion(distortion > 0 ? 0 : 60)}
                          gradient="from-[#ff4400] to-[#ff6600]"
                        />
                        <PopularEffectButton
                          icon={Bot}
                          title="Vocoder"
                          description="Robotic vocal sound"
                          isActive={vocoder > 0}
                          onClick={() => setVocoder(vocoder > 0 ? 0 : 70)}
                          gradient="from-[#8844ff] to-[#aa66ff]"
                        />
                      </div>
                      
                      {/* Fine Controls for Active Effects */}
                      {autoTune > 0 && (
                        <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] mb-4">
                          {renderSlider(autoTune, handleSliderChange(setAutoTune), "Auto-Tune Intensity", "Perfect for modern pop & hip-hop vocals")}
                        </div>
                      )}
                      
                      {reverb > 50 && (
                        <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] mb-4">
                          {renderSlider(reverb, handleSliderChange(setReverb), "Reverb Amount", "Creates immersive spatial depth")}
                        </div>
                      )}
                      
                      {distortion > 0 && (
                        <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] mb-4">
                          {renderSlider(distortion, handleSliderChange(setDistortion), "Distortion Level", "Adds dramatic impact to any sound")}
                        </div>
                      )}
                      
                      {vocoder > 0 && (
                        <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] mb-4">
                          {renderSlider(vocoder, handleSliderChange(setVocoder), "Vocoder Mix", "Creates that classic robotic voice")}
                        </div>
                      )}
                    </div>
                    
                    {/* Additional Popular Effects */}
                    <div className="space-y-4">
                      <h4 className="text-[15px] font-semibold text-[#c9d1d9]">More Popular Effects</h4>
                      <div className="space-y-3">
                        {renderSlider(harmonizer, handleSliderChange(setHarmonizer), "Harmonizer", "Adds beautiful vocal harmonies")}
                        {renderSlider(pitchShift, handleSliderChange(setPitchShift), "Pitch Shift", "Creative pitch manipulation")}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "trending" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#c9d1d9] mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00ff88]" />
                        2025 Trending Effects
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <PopularEffectButton
                          icon={Radio}
                          title="Lo-fi Mode"
                          description="Authentic imperfect sound"
                          isActive={lofiMode}
                          onClick={() => setLofiMode(!lofiMode)}
                          gradient="from-[#ff8800] to-[#ffaa44]"
                          trending={true}
                        />
                        <PopularEffectButton
                          icon={RotateCcw}
                          title="Reverse Reverb"
                          description="Swelling dramatic effect"
                          isActive={reverseReverb}
                          onClick={() => setReverseReverb(!reverseReverb)}
                          gradient="from-[#00ffff] to-[#44aaff]"
                          trending={true}
                        />
                        <PopularEffectButton
                          icon={Shuffle}
                          title="Genre Bending"
                          description="Mix traditional & electronic"
                          isActive={genreBending}
                          onClick={() => setGenreBending(!genreBending)}
                          gradient="from-[#ff00ff] to-[#aa44ff]"
                          trending={true}
                        />
                        <PopularEffectButton
                          icon={Filter}
                          title="Dirty Aesthetics"
                          description="Deliberately raw sound"
                          isActive={false}
                          onClick={() => {}}
                          gradient="from-[#666666] to-[#999999]"
                          trending={true}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                      <h4 className="text-[14px] font-semibold text-[#c9d1d9] mb-3">✨ Emotional Impact</h4>
                      <p className="text-[12px] text-[#8b949e] leading-relaxed mb-3">
                        These effects are scientifically proven to boost dopamine and oxytocin, creating that "frisson" (chills) feeling that makes people love music!
                      </p>
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-[#ff22fb] to-[#ff4400] text-white px-3 py-2 rounded-lg text-[12px] font-semibold">
                          Boost Happy Chemicals
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "presets" && (
                  <div className="space-y-4">
                    <h4 className="text-[15px] font-semibold text-[#c9d1d9] mb-4">Popular Style Presets</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gradient-to-r from-[#ff8800] to-[#ffaa44] rounded-lg px-4 py-3 text-center">
                        <span className="text-[13px] font-semibold text-white">Chill Lo-fi</span>
                      </button>
                      <button className="bg-gradient-to-r from-[#ff22fb] to-[#ff4400] rounded-lg px-4 py-3 text-center">
                        <span className="text-[13px] font-semibold text-white">Energetic EDM</span>
                      </button>
                      <button className="bg-gradient-to-r from-[#00ff88] to-[#44cc88] rounded-lg px-4 py-3 text-center">
                        <span className="text-[13px] font-semibold text-white">Auto-Tune Pop</span>
                      </button>
                      <button className="bg-gradient-to-r from-[#8844ff] to-[#aa66ff] rounded-lg px-4 py-3 text-center">
                        <span className="text-[13px] font-semibold text-white">Retro Funk</span>
                      </button>
                      <button className="bg-gradient-to-r from-[#4444ff] to-[#6666ff] rounded-lg px-4 py-3 text-center">
                        <span className="text-[13px] font-semibold text-white">Spacey Reverb</span>
                      </button>
                      <button className="bg-gradient-to-r from-[#ff4400] to-[#ff6600] rounded-lg px-4 py-3 text-center">
                        <span className="text-[13px] font-semibold text-white">Rock Distortion</span>
                      </button>
                    </div>
                    
                    <button className="bg-gradient-to-r from-[#ff22fb] to-[#ff4400] rounded-lg w-full py-4 flex items-center justify-center gap-2 mt-6">
                      <Save className="w-5 h-5 text-white" />
                      <span className="text-[14px] text-white font-semibold">Save My Custom Preset</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Share & Export */}
            <div className="space-y-4">
              <h3 className="text-[16px] font-bold text-[#c9d1d9] flex items-center gap-2">
                <Share className="w-5 h-5 text-[#ff22fb]" />
                Share & Export
              </h3>
              
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-[#ff22fb] to-[#ff4400] rounded-lg px-6 py-4 flex items-center gap-2 flex-1 hover:shadow-lg hover:shadow-[#ff22fb]/25 transition-all">
                  <Play className="w-5 h-5 text-white" />
                  <span className="text-[14px] text-white font-semibold">Preview</span>
                </button>
                <button className="bg-[#161b22] rounded-lg px-6 py-4 flex items-center gap-2 flex-1 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                  <Share className="w-5 h-5 text-[#c9d1d9]" />
                  <span className="text-[14px] text-[#c9d1d9] font-semibold">Share</span>
                </button>
              </div>
              
              <button 
                onClick={handleMintNFT}
                className="bg-gradient-to-r from-[#ff22fb] to-[#ff4400] rounded-lg w-full py-4 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ff22fb]/25 transition-all"
              >
                <Coins className="w-5 h-5 text-white" />
                <span className="text-[14px] text-white font-semibold">Mint NFT (TON Blockchain)</span>
              </button>
              
              <button className="bg-[#161b22] rounded-lg w-full py-4 flex items-center justify-center gap-2 hover:bg-[#21262d] transition-colors border border-[#30363d]">
                <Users className="w-5 h-5 text-[#c9d1d9]" />
                <span className="text-[14px] text-[#c9d1d9] font-semibold">Collaborate with Others</span>
              </button>
            </div>
          </div>

          {/* Fixed Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0">
            <BottomNavigation activeTab="AI Studio" onTabChange={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}
