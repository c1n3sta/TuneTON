# TuneTON Complete Application Guide

## Overview

TuneTON is a sophisticated music streaming and NFT marketplace application built as a Telegram WebApp. It combines advanced audio processing capabilities with blockchain integration, allowing users to discover, play, and create music while participating in contests and trading music-related NFTs.

## Application Architecture

### Core Components
1. **Frontend**: React 18 with TypeScript, Vite build tool
2. **Backend**: Supabase Edge Functions with PostgreSQL database
3. **Audio Engine**: Web Audio API with Tone.js for effects processing
4. **Blockchain**: TON integration for NFT marketplace
5. **Authentication**: Telegram WebApp SDK for secure user authentication
6. **Music Content**: Jamendo API integration

### Key Features
- Music streaming with real-time audio effects
- NFT marketplace for music-related digital assets
- Music creation contests and challenges
- Social features and user profiles
- AI-powered music studio tools
- Playlist management and library organization

## Screen-by-Screen Application Flow

### 1. Authentication Flow

#### TelegramAuthProvider Component
The application begins with Telegram authentication using the `TelegramAuthProvider` component:
- Validates Telegram WebApp initData using HMAC-SHA256
- Authenticates users through Supabase Edge Functions
- Manages user sessions and theme integration
- Provides context for user data throughout the app

#### Onboarding Process
New users go through an onboarding flow:
- Welcome screen explaining the app's features
- Telegram connection explanation
- Authentication flow demonstration
- Music preference selection (genres and artists)
- Feature overview and getting started guide

### 2. Home Screen

#### HomePage Component
The main dashboard provides access to all core features:
- Personalized music recommendations
- Recently played tracks
- Quick access to playlists
- Featured contests and challenges
- Trending NFTs in the marketplace
- Quick actions for music discovery

### 3. Music Player

#### MusicPlayer Component
The core audio experience with advanced effects:
- **Playback Controls**: Play/pause, skip, volume control
- **Track Information**: Album art, title, artist, duration
- **Audio Effects Panel**:
  - Tempo adjustment (50-200%)
  - Pitch shifting (-12 to +12 semitones)
  - 7-band EQ with customizable frequencies
  - Lo-Fi effects (tone, noise, wow/flutter, crackle)
  - Reverb with presets (small, medium, large)
- **Visualizations**: Real-time audio waveform display
- **Queue Management**: Upcoming tracks and playback history

### 4. Library Management

#### LibraryPageReal Component
Users can organize their music collection:
- **Playlists**: Create, edit, and manage custom playlists
- **Liked Songs**: Collection of favorited tracks
- **Downloaded Content**: Offline accessible music (planned feature)
- **View Options**: Grid or list view for content browsing
- **Search Functionality**: Find tracks, artists, or playlists

#### PlaylistDetailReal Component
Detailed playlist management:
- Add/remove tracks from playlists
- Playlist sharing and collaboration
- Playlist metadata editing (name, description, privacy)
- Track reordering and organization

### 5. Music Discovery

#### DiscoverPage Component
Explore new music content:
- Genre-based recommendations
- Trending tracks and artists
- Curated playlists and collections
- Personalized suggestions based on listening history

#### SearchPage Component
Find specific content:
- Track, artist, or album search
- Filter by genre, mood, or instrument
- Search history and suggestions
- Instant preview of search results

### 6. NFT Marketplace

#### NFTMarketplace Component
Digital asset trading platform:
- **Featured Collectibles**: Highlighted NFTs
- **Latest Listings**: Recently added items
- **Category Browsing**: Music, Art, Collectibles, Rights
- **Quick Actions**: Create NFT, View My NFTs, Auctions

#### NFTDetail Component
Detailed NFT viewing:
- High-resolution asset display
- Ownership and creator information
- Pricing and bidding details
- Transaction history and provenance
- Like and share functionality

#### CreateNFT Component
Mint new digital assets:
- Upload music files or artwork
- Set pricing and royalty percentages
- Add metadata and descriptions
- Choose blockchain and smart contract

#### MyNFTs Component
User's NFT portfolio:
- Owned and created NFTs
- Sales and earnings tracking
- Listing management
- Collection organization

#### NFTAuction Component
Auction-based trading:
- Active auctions with countdown timers
- Bid history and current leaders
- User's active bids
- Auction creation and management

### 7. Contests and Challenges

#### ContestsPage Component
Competitive music creation platform:
- **Featured Contests**: Highlighted challenges with prizes
- **Active Contests**: Ongoing competitions by category
- **Leaderboards**: Real-time ranking of participants
- **User Stats**: Personal contest performance metrics

#### ContestDetail Component
Detailed contest information:
- Challenge rules and requirements
- Prize details and judging criteria
- Submission deadline and timeline
- Participant list and entries
- Join/submit functionality

### 8. AI Studio

#### AIStudio Component
Music creation tools:
- AI-powered music generation
- Track remixing and editing
- Sound design tools
- Collaboration features
- Export and sharing options

### 9. User Profiles

#### UserProfile Component
Personal account management:
- Profile customization (avatar, bio, display name)
- Listening statistics and achievements
- Social connections and followers
- Privacy settings and preferences

#### PublicProfile Component
View other users' profiles:
- Shared playlists and favorite tracks
- Created content and NFTs
- Social activity and interactions
- Follow and message options

### 10. Settings and Configuration

#### SettingsPage Component
Application customization:
- Audio quality and streaming preferences
- Notification settings
- Privacy controls
- Account management
- Theme and display options

## Core Functionality Areas

### Audio Processing Engine

The application features a sophisticated audio processing system:
- **Tempo/Pitch Control**: Independent adjustment of playback speed and musical pitch
- **Equalizer**: 7-band parametric EQ with shelving filters
- **Lo-Fi Effects**: Vintage audio processing simulation
- **Reverb**: Convolution-based spatial effects
- **Real-time Visualization**: Spectrum analysis and waveform display

### Blockchain Integration

TON blockchain features for NFT marketplace:
- Music NFT creation and trading
- Smart contract execution for royalties
- Digital rights management
- Transparent transaction history
- Wallet integration for purchases

### Social Features

Community engagement tools:
- Playlist sharing and collaboration
- Music recommendations and discovery
- Contest participation and competition
- User profiles and social connections
- Commenting and feedback systems

### Data Management

Backend services powered by Supabase:
- User authentication and session management
- Playlist and library storage
- Playback tracking and analytics
- NFT metadata and ownership records
- Contest submissions and judging

## Technical Implementation Details

### Authentication Security
- HMAC-SHA256 validation of Telegram data
- Rate limiting (10 requests per 15 minutes per IP)
- Session management with secure tokens
- Timestamp validation (1-hour limit for auth data)

### Audio Engine Architecture
- Web Audio API for core processing
- Tone.js for advanced effects
- Custom audio nodes for EQ and filtering
- Real-time parameter automation
- Cross-browser compatibility

### Data Flow Patterns
- REST API calls to Supabase Edge Functions
- JSON data format for all communications
- CDN caching for static assets
- Database indexing for performance

### Performance Optimization
- Code splitting and lazy loading
- Asset compression and optimization
- Efficient state management
- Memory leak prevention
- Responsive design for mobile devices

## Development and Deployment

### Build Process
- Vite for fast development builds
- TypeScript for type safety
- ESLint and Prettier for code quality
- Testing with Vitest
- Production optimization with Rollup

### Deployment Architecture
- Static file hosting for frontend
- Supabase Edge Functions for backend logic
- PostgreSQL database with RLS
- CDN distribution for assets
- Telegram WebApp integration

This comprehensive guide provides an overview of the TuneTON application's structure, functionality, and user experience. The app combines music streaming, social features, and blockchain technology to create a unique platform for music discovery and creation within the Telegram ecosystem.