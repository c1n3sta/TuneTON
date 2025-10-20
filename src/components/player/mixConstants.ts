// MIX Mode constants and configurations
export const MIX_EFFECT_PRESETS = [
  { 
    name: 'Classic Vinyl', 
    effects: { 
      lofiIntensity: 60, 
      backgroundNoise: 'vinyl', 
      vinylCrackle: 40, 
      tapeWow: 20, 
      tempo: 0.95 
    }
  },
  { 
    name: 'Rainy Café', 
    effects: { 
      lofiIntensity: 45, 
      backgroundNoise: 'rain', 
      noiseVolume: 25, 
      vinylCrackle: 10, 
      tempo: 0.90 
    }
  },
  { 
    name: 'Cassette Deck', 
    effects: { 
      lofiIntensity: 70, 
      tapeWow: 60, 
      vinylCrackle: 5, 
      tempo: 0.98 
    }
  },
  { 
    name: 'Speed Up', 
    effects: { 
      tempo: 1.25, 
      pitch: 2 
    }
  },
  { 
    name: 'Slow Jam', 
    effects: { 
      tempo: 0.80, 
      pitch: -1, 
      lofiIntensity: 30 
    }
  }
];

export const BACKGROUND_NOISE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'rain', label: 'Rain' },
  { value: 'cafe', label: 'Café' },
  { value: 'vinyl', label: 'Vinyl' }
];

export const WAVEFORM_HEIGHTS = [
  12, 20, 16, 24, 18, 28, 22, 14, 
  26, 15, 19, 25, 17, 21, 13, 23
];