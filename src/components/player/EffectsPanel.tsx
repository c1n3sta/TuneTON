import { BarChart3, Radio, Zap } from "lucide-react";
import { EQ_BAND_CONFIG, EQ_PRESETS, MIX_EFFECT_PRESETS, BACKGROUND_NOISE_OPTIONS, DEFAULT_EQ_VALUES } from "./constants";

interface EffectsPanelProps {
  // Equalizer state
  showEqualizer: boolean;
  eqBands: number[] | typeof DEFAULT_EQ_VALUES;
  onEqChange: (band: string, value: number) => void;
  onResetEqualizer: () => void;
  
  // Mix mode state
  showMixMode: boolean;
  tempo: number;
  pitch: number;
  lofiIntensity: number;
  backgroundNoise: string;
  noiseVolume: number;
  vinylCrackle: number;
  tapeWow: number;
  
  // Handlers
  onTempoChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onLofiIntensityChange: (value: number) => void;
  onBackgroundNoiseChange: (value: string) => void;
  onNoiseVolumeChange: (value: number) => void;
  onVinylCrackleChange: (value: number) => void;
  onTapeWowChange: (value: number) => void;
  onResetMixMode: () => void;
  onApplyMixPreset: (preset: any) => void;
}

export default function EffectsPanel({
  showEqualizer,
  eqBands,
  onEqChange,
  onResetEqualizer,
  showMixMode,
  tempo,
  pitch,
  lofiIntensity,
  backgroundNoise,
  noiseVolume,
  vinylCrackle,
  tapeWow,
  onTempoChange,
  onPitchChange,
  onLofiIntensityChange,
  onBackgroundNoiseChange,
  onNoiseVolumeChange,
  onVinylCrackleChange,
  onTapeWowChange,
  onResetMixMode,
  onApplyMixPreset
}: EffectsPanelProps) {
  return (
    <>
      {/* 7-Band Equalizer Panel */}
      {showEqualizer && (
        <div className="bg-secondary rounded-xl p-4 space-y-4 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              7-Band Equalizer
            </h3>
            <button
              onClick={onResetEqualizer}
              className="px-3 py-1 text-xs bg-muted text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
            >
              Reset
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {EQ_BAND_CONFIG.map((band, index) => (
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
                      value={Array.isArray(eqBands) ? eqBands[index] : eqBands[band.key as keyof typeof eqBands]}
                      onChange={(e) => onEqChange(band.key, parseInt(e.target.value))}
                      className="eq-slider appearance-none bg-muted rounded-full cursor-pointer"
                      style={{
                        width: '4px',
                        height: '88px',
                        // writingMode: 'bt-lr',
                        WebkitAppearance: 'slider-vertical',
                        background: `linear-gradient(to top, ${band.color} 0%, ${band.color} ${Array.isArray(eqBands) ? eqBands[index] : eqBands[band.key as keyof typeof eqBands]}%, hsl(var(--muted)) ${Array.isArray(eqBands) ? eqBands[index] : eqBands[band.key as keyof typeof eqBands]}%, hsl(var(--muted)) 100%)`
                      }}
                    />
                  </div>
                </div>
                
                <div 
                  className="text-[9px] font-medium"
                  style={{ color: band.color }}
                >
                  {Array.isArray(eqBands) ? eqBands[index] : eqBands[band.key as keyof typeof eqBands]}%
                </div>
              </div>
            ))}
          </div>

          {/* EQ Presets */}
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Presets:</div>
            <div className="flex gap-2 flex-wrap">
              {EQ_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onEqChange('preset', preset.values as any)}
                  className="px-2 py-1 text-[10px] bg-muted text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
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
              onClick={onResetMixMode}
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
                onChange={(e) => onTempoChange(parseInt(e.target.value))}
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
                onChange={(e) => onPitchChange(parseInt(e.target.value))}
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
                  <label className="text-xs text-muted-foreground">Lo-Fi Intensity</label>
                  <span className="text-xs text-chart-4 font-medium">{lofiIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lofiIntensity}
                  onChange={(e) => onLofiIntensityChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--chart-4)) 0%, hsl(var(--chart-4)) ${lofiIntensity}%, hsl(var(--muted)) ${lofiIntensity}%, hsl(var(--muted)) 100%)`
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted-foreground">Background Noise</label>
                  <span className="text-xs text-chart-3 font-medium uppercase">{backgroundNoise}</span>
                </div>
                <div className="flex gap-2">
                  {BACKGROUND_NOISE_OPTIONS.map((noise) => (
                    <button
                      key={noise}
                      onClick={() => onBackgroundNoiseChange(noise)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        backgroundNoise === noise
                          ? 'bg-chart-3 text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:text-primary hover:bg-accent'
                      }`}
                    >
                      {noise}
                    </button>
                  ))}
                </div>
                
                {backgroundNoise !== 'none' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Noise Volume</span>
                      <span className="text-xs text-chart-3 font-medium">{noiseVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={noiseVolume}
                      onChange={(e) => onNoiseVolumeChange(parseInt(e.target.value))}
                      className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--chart-3)) 0%, hsl(var(--chart-3)) ${noiseVolume}%, hsl(var(--muted)) ${noiseVolume}%, hsl(var(--muted)) 100%)`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Effects */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground">Vinyl Crackle</label>
                <span className="text-xs text-chart-5 font-medium">{vinylCrackle}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vinylCrackle}
                onChange={(e) => onVinylCrackleChange(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--chart-5)) 0%, hsl(var(--chart-5)) ${vinylCrackle}%, hsl(var(--muted)) ${vinylCrackle}%, hsl(var(--muted)) 100%)`
                }}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground">Tape Wow</label>
                <span className="text-xs text-chart-2 font-medium">{tapeWow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tapeWow}
                onChange={(e) => onTapeWowChange(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--chart-2)) 0%, hsl(var(--chart-2)) ${tapeWow}%, hsl(var(--muted)) ${tapeWow}%, hsl(var(--muted)) 100%)`
                }}
              />
            </div>
          </div>

          {/* Preset Effects */}
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Effect Presets:</div>
            <div className="flex gap-2 flex-wrap">
              {MIX_EFFECT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onApplyMixPreset(preset.effects)}
                  className="px-2 py-1 text-[10px] bg-muted text-muted-foreground hover:text-primary hover:bg-accent rounded transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}