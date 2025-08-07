# Audio Player Workflow

## Core Player Module
- Handles audio loading, playback, and state management
- Implements Web Audio API nodes and effects chain
- Manages audio context and resources

## Key Components
- `AudioEngine`: Core playback and effects processing
- `TrackManager`: Handles track loading and metadata
- `EffectChain`: Manages audio effects pipeline

## Development Rules
1. Keep audio processing in Web Workers when possible
2. Implement proper error handling for audio context
3. Use TypeScript interfaces for all public APIs
4. Write unit tests for all core functionality
