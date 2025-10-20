# TuneTON Codebase Analysis Report

## Executive Summary

This document provides a comprehensive analysis of the TuneTON codebase, a music streaming application built as a Telegram Mini App with blockchain integration on the TON network. The application allows users to stream music, apply real-time audio effects, participate in remix contests, and engage with a social community.

## 1. Project Overview and Architecture

### Architecture Components:

- **Frontend**: React/TypeScript application with Vite build system
- **Backend**: Node.js/Express server with PHP API endpoints
- **Audio Engine**: Custom Web Audio API implementation with WASM effects
- **Authentication**: Telegram WebApp integration with Supabase
- **External Services**: Jamendo API for music content
- **Blockchain**: TON integration for NFT marketplace and rewards

## 2. Core Technologies and Frameworks

### Frontend Stack:

- **React 18** with TypeScript for UI components
- **Vite** as the build tool and development server
- **Tailwind CSS** for styling
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons
- **React Router** for navigation

### Backend Stack:

- **Node.js/Express** for the main server
- **PHP** for API endpoints
- **Supabase** for authentication and database
- **WASM (WebAssembly)** for audio processing

### Audio Technologies:

- **Web Audio API** for core audio processing
- **WebAssembly (Rust)** for high-performance audio effects
- **AudioWorklet** for real-time audio processing
- **Tone.js** for pitch shifting

## 3. Audio Engine and Processing

The audio engine is a sophisticated implementation with multiple effect modules:

### Core Components:

- **WebAudioEngine** (`src/core/audio/AudioEngine.ts`): Main audio processing class
- **Audio Effects Chain**: Tempo/Pitch, Lo-Fi, EQ, Reverb modules
- **Real-time Processing**: Using AudioWorklet for low-latency effects

### Effect Modules:

1. **Tempo/Pitch Shifting**: Independent control of tempo and pitch
2. **Lo-Fi Effects**: Bit depth reduction, downsampling, noise, wow/flutter
3. **7-band EQ**: Frequency-specific gain controls
4. **Reverb**: Convolution-based reverb with presets
5. **Low-pass Filter**: Tone control

## 4. Frontend Components and UI

### Main Components:

- **App.tsx**: Root component handling authentication and routing
- **HomeScreen.tsx**: Main dashboard with navigation
- **AudioPlayer.tsx**: Core player with effect controls
- **BottomNavigation.tsx**: Tab-based navigation system

### UI Features:

- Onboarding flow with multiple steps
- Track browsing and search
- Playlist management
- Contest participation
- Profile management
- Real-time audio visualization

## 5. Backend and API Structure

### Server Implementation:

- **Express Server** (`server/index.ts`): Main backend server
- **PHP API** (`public/api/`): Lightweight API endpoints
- **Data Storage**: JSON files for tracks and playbacks

### API Endpoints:

- `/api/tracks`: Get available tracks
- `/api/playbacks/:trackId`: Track playback counts
- `/api/health`: Health check endpoint

## 6. Authentication and User Management

### Telegram Integration:

- **Telegram WebApp SDK**: For Mini App integration
- **Supabase Authentication**: User management backend
- **Telegram OAuth**: Secure authentication flow
- **User Data Verification**: HMAC-based verification

### Auth Components:

- `useTelegramAuth` hook for authentication state
- `TelegramLoginButton` component
- Supabase integration for session management

## 7. External Integrations

### Jamendo API:

- Music content library integration
- Search and discovery features
- OAuth for user-specific content
- Fallback to mock data when API unavailable

### Telegram Mini App:

- Deep integration with Telegram ecosystem
- Support for Telegram Stars and gifts
- Social features and challenges
- NFT marketplace integration

## 8. Audio Effects and WASM Implementation

### WASM Audio Processing:

- **Rust Implementation**: High-performance audio effects
- **WebAssembly Compilation**: Using wasm-pack
- **AudioWorklet Integration**: Real-time processing
- **JavaScript Bridge**: Communication between JS and WASM

### Effects Pipeline:

1. Audio buffer management
2. Effect parameter automation
3. Real-time processing in AudioWorklet
4. Memory-efficient buffer operations

## 9. Data Management and Storage

### Local Storage:

- User preferences and settings
- Authentication tokens
- Recently played tracks
- Effect presets

### Server Storage:

- JSON files for track metadata
- Playback statistics
- User-generated content

### Supabase Database:

- User profiles and authentication
- Contest participation data
- Social features data

## 10. Build Process and Deployment

### Development Tools:

- **Vite Configuration**: Optimized build process
- **TypeScript**: Type checking and compilation
- **ESLint/Prettier**: Code quality and formatting
- **Environment Variables**: Configuration management

### Build Scripts:

- Development server with hot reload
- Production builds with optimization
- WASM compilation scripts
- Deployment scripts for Telegram functions

## 11. .gitignore Analysis

The `.gitignore` file excludes several categories of files from version control:

### Excluded Categories:

1. **Dependencies**: `node_modules/`, `.pnp*`
2. **Build Output**: `dist/`, `build/`, `.vite/`
3. **Environment Files**: `.env*` files
4. **IDE/Editor Files**: `.vscode/`, `.idea/`, temporary files
5. **OS Generated Files**: `.DS_Store`, `Thumbs.db`
6. **Logs and Cache**: `*.log`, `.cache/`, coverage reports
7. **Platform Specific**: `.netlify/`, `.vercel/`, `.supabase/`

This ensures that only source code and essential configuration files are tracked in the repository, keeping it clean and portable.

## 12. Summary and Key Features

### Core Features:

- Real-time audio effects processing
- Telegram Mini App integration
- Music streaming with licensed content
- Social features and remix contests
- NFT marketplace on TON blockchain
- Personalized audio profiles

### Technical Highlights:

- WASM-based audio processing for performance
- Modular audio effects architecture
- Telegram authentication and integration
- Responsive UI with Tailwind CSS
- Real-time audio visualization

### Unique Value Propositions:

- On-the-fly track customization
- Blockchain-based rewards system
- Community-driven remix challenges
- Integration with Telegram ecosystem
- Professional-grade audio effects in browser
