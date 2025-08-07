---
description: USE THIS Project Structure
---

# Project Structure

```
src/
├── core/                  # Core application logic
│   ├── audio/            # Audio processing
│   │   └── AudioEngine.ts # Web Audio API implementation
│   ├── state/            # (Future) State management
│   └── utils/            # Utility functions
├── services/             # Microservices stubs
│   ├── audio/            # Audio processing service
│   ├── user/             # User management
│   └── storage/          # Local storage/cache
├── components/           # UI Components
│   ├── player/           # Player controls
│   │   ├── AudioPlayer.tsx
│   │   └── AudioPlayer.module.css
│   ├── effects/          # Effect controls
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   └── useAudioPlayer.ts # Audio player hook
├── types/                # TypeScript types
│   └── audio.ts          # Audio-related type definitions
└── assets/              # Static assets
```
## Development Rules
1. Keep components small and focused
2. Follow feature-based organization
3. Keep business logic out of components
4. Use absolute imports
5. Maintain clear module boundaries