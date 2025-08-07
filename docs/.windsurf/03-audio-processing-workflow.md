# Audio Processing Workflow

## Core Processing Modules
- `PitchShifter`: Handles pitch and tempo adjustment
- `Equalizer`: Manages multi-band EQ controls
- `AudioAnalyzer`: Provides visualization data

## Development Rules
1. Keep audio processing in separate Web Workers
2. Implement proper audio buffer management
3. Use the AudioWorklet API for real-time processing
4. Implement proper cleanup of audio nodes
5. Add comprehensive error handling
