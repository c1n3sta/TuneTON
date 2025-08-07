# TuneTON Developer Guide

## Table of Contents

1. [Project Structure](#project-structure)
2. [Core Components](#core-components)
3. [Audio Processing](#audio-processing)
4. [State Management](#state-management)
5. [Telegram Integration](#telegram-integration)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Useful Commands](#useful-commands)


## Project Structure

```
src/
├── components/       # React components
│   └── player/      # Audio player components
├── core/
│   └── audio/       # Core audio processing
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Core Components

### AudioEngine (`src/core/audio/AudioEngine.ts`)

The core audio processing class that handles all audio operations.

**Key Methods:**
- `loadTrack(track: AudioTrack)`: Loads an audio track
- `play()`: Starts or resumes playback
- `pause()`: Pauses playback
- `setVolume(volume: number)`: Sets the playback volume (0-1)
- `setEQ(band: 'low'|'mid'|'high', value: number)`: Adjusts EQ settings
- `setPitch(pitch: number)`: Changes the pitch of playback

### AudioPlayer (`src/components/player/AudioPlayer.tsx`)

The main player UI component.

**Features:**
- Playback controls
- Progress bar with seeking
- Volume control
- EQ adjustments
- Pitch and tempo controls

### useAudioPlayer (`src/hooks/useAudioPlayer.ts`)

Custom hook that manages audio state and provides player controls.

**State:**
- `isPlaying`: Boolean indicating if audio is playing
- `currentTime`: Current playback position
- `duration`: Total duration of the current track
- `volume`: Current volume level
- `eqSettings`: Current EQ settings

**Methods:**
- `loadTrack(track)`: Load a new track
- `togglePlayPause()`: Toggle between play and pause
- `seek(time)`: Seek to a specific time
- `setVolume(volume)`: Set the volume
- `setEQ(band, value)`: Adjust EQ settings

## Audio Processing

The audio processing pipeline:
```
Audio Source → Pitch Shifter → EQ → Gain → Analyser → Output
```

### Adding New Effects
1. Create a new method in `AudioEngine` for the effect
2. Add the effect to the audio processing chain
3. Update the `AudioEffect` type if needed
4. Add controls to the UI if necessary

## State Management

State is managed using React's built-in state management with custom hooks:
- Local component state for UI elements
- `useAudioPlayer` hook for audio state
- No external state management library required

## Telegram Integration

The app is designed to work as a Telegram WebApp:
- Automatically detects Telegram WebView
- Uses Telegram's theming
- Supports user authentication

### Testing Telegram Features
1. Use Telegram's WebApp bot
2. Or set `window.Telegram` mock in development:
   ```typescript
   // In your entry file or test setup
   window.Telegram = {
     WebApp: {
       initData: '',
       initDataUnsafe: { user: { id: 12345, first_name: 'Test' } },
       ready: () => {},
       expand: () => {},
       onEvent: () => {},
       offEvent: () => {}
     }
   };
   ```

### Common Issues

1. **Audio not playing**
   - Check browser console for errors
   - Ensure audio context is not suspended (browsers require user interaction)
   - Verify file paths and CORS settings

2. **TypeScript Errors**
   - Run type checking: `npx tsc --noEmit`
   - Check type definitions in `src/types`

3. **Build Failures**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter |
| `npm run type-check` | Check TypeScript types |
| `npm test` | Run tests |
