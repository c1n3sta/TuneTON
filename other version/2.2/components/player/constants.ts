// Player constants and configurations
export const EQ_BAND_CONFIG = [
  { key: 'subBass', label: 'Sub', frequency: '60Hz', color: 'hsl(var(--chart-1))' },
  { key: 'bass', label: 'Bass', frequency: '170Hz', color: 'hsl(var(--chart-2))' },
  { key: 'lowMid', label: 'Low Mid', frequency: '350Hz', color: 'hsl(var(--chart-3))' },
  { key: 'mid', label: 'Mid', frequency: '1kHz', color: 'hsl(var(--chart-4))' },
  { key: 'highMid', label: 'High Mid', frequency: '3kHz', color: 'hsl(var(--chart-5))' },
  { key: 'presence', label: 'Presence', frequency: '6kHz', color: 'hsl(var(--chart-1))' },
  { key: 'brilliance', label: 'Brilliance', frequency: '12kHz', color: 'hsl(var(--chart-2))' }
];

export const EQ_PRESETS = [
  { name: 'Flat', values: { subBass: 50, bass: 50, lowMid: 50, mid: 50, highMid: 50, presence: 50, brilliance: 50 } },
  { name: 'Rock', values: { subBass: 60, bass: 55, lowMid: 45, mid: 50, highMid: 55, presence: 60, brilliance: 65 } },
  { name: 'Pop', values: { subBass: 55, bass: 60, lowMid: 50, mid: 55, highMid: 60, presence: 65, brilliance: 60 } },
  { name: 'Jazz', values: { subBass: 45, bass: 50, lowMid: 55, mid: 60, highMid: 55, presence: 50, brilliance: 45 } },
  { name: 'Classical', values: { subBass: 40, bass: 45, lowMid: 50, mid: 55, highMid: 60, presence: 65, brilliance: 70 } },
  { name: 'Bass Boost', values: { subBass: 80, bass: 70, lowMid: 55, mid: 45, highMid: 40, presence: 45, brilliance: 50 } }
];

export const MIX_EFFECT_PRESETS = [
  { 
    name: 'Classic Vinyl', 
    effects: { lofiIntensity: 60, backgroundNoise: 'vinyl', vinylCrackle: 40, tapeWow: 20, tempo: 95 }
  },
  { 
    name: 'Rainy Café', 
    effects: { lofiIntensity: 45, backgroundNoise: 'rain', noiseVolume: 25, vinylCrackle: 10, tempo: 90 }
  },
  { 
    name: 'Cassette Deck', 
    effects: { lofiIntensity: 70, tapeWow: 60, vinylCrackle: 5, tempo: 98 }
  },
  { 
    name: 'Speed Up', 
    effects: { tempo: 125, pitch: 2 }
  },
  { 
    name: 'Slow Jam', 
    effects: { tempo: 80, pitch: -1, lofiIntensity: 30 }
  }
];

export const BACKGROUND_NOISE_OPTIONS = ['none', 'rain', 'cafe', 'vinyl'];

export const DEFAULT_EQ_VALUES = {
  subBass: 50,
  bass: 50,
  lowMid: 50,
  mid: 50,
  highMid: 50,
  presence: 50,
  brilliance: 50
};

export const WAVEFORM_HEIGHTS = [12, 20, 16, 24, 18, 28, 22, 14, 26, 15, 19, 25, 17, 21, 13];