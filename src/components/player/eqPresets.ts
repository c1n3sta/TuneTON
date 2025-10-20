// EQ Presets
export const EQ_PRESETS = [
  { name: 'Flat', values: [0, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', values: [4, 3, 0, 0, 2, 4, 5] },
  { name: 'Pop', values: [2, 3, 1, 0, 1, 3, 4] },
  { name: 'Jazz', values: [1, 2, 3, 4, 3, 1, 0] },
  { name: 'Classical', values: [0, 1, 2, 3, 4, 5, 6] },
  { name: 'Bass Boost', values: [6, 5, 4, 0, -2, -3, -4] },
  { name: 'Treble Boost', values: [-4, -3, -2, 0, 2, 4, 6] }
];

// EQ Band Configuration
export const EQ_BAND_CONFIG = [
  { key: 'subBass', label: 'Sub', frequency: '60Hz', color: '#FF6B6B' },
  { key: 'bass', label: 'Bass', frequency: '170Hz', color: '#4ECDC4' },
  { key: 'lowMid', label: 'Low Mid', frequency: '350Hz', color: '#45B7D1' },
  { key: 'mid', label: 'Mid', frequency: '1kHz', color: '#96CEB4' },
  { key: 'highMid', label: 'High Mid', frequency: '3kHz', color: '#FFEAA7' },
  { key: 'presence', label: 'Presence', frequency: '6kHz', color: '#DDA0DD' },
  { key: 'brilliance', label: 'Brilliance', frequency: '12kHz', color: '#98D8C8' }
];