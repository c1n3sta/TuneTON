# Third-Party Integration Guides

## Overview

This document provides detailed guides for integrating with all third-party services used in the TuneTON application. It covers setup procedures, authentication methods, API usage patterns, and best practices for each integrated service.

## Telegram Integration Guide

### Setup Process

#### 1. Bot Creation

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Provide bot name and username
4. Copy the provided bot token

#### 2. WebApp Configuration

1. Send `/setmenubutton` to BotFather
2. Select your bot
3. Set the WebApp URL to your application endpoint
4. Configure the button text

#### 3. Environment Configuration

Add to your `.env` file:

```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### WebApp SDK Integration

#### Initialization

```html
<head>
  <script src="https://telegram.org/js/telegram-web-app.js?59"></script>
</head>
```

#### Basic Usage

```javascript
// Check if running in Telegram
if (window.Telegram && window.Telegram.WebApp) {
  const webApp = window.Telegram.WebApp;

  // Initialize
  webApp.ready();

  // Expand to full height
  webApp.expand();

  // Get user data
  const user = webApp.initDataUnsafe.user;
}
```

#### Theme Integration

```javascript
// Apply Telegram theme
function applyTelegramTheme() {
  const theme = window.Telegram.WebApp.themeParams;

  document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
  document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
  document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color);
  document.documentElement.style.setProperty('--tg-link-color', theme.link_color);
  document.documentElement.style.setProperty('--tg-button-color', theme.button_color);
  document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color);
}

// Listen for theme changes
window.Telegram.WebApp.onEvent('themeChanged', applyTelegramTheme);
```

### Authentication Implementation

#### Client-Side Validation

```typescript
// src/utils/telegramAuth.ts
export async function verifyTelegramData(initData: string, botToken: string): Promise<boolean> {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const authDate = params.get('auth_date');

    // Check required parameters
    if (!hash || !authDate) {
      console.warn('Missing required parameters in Telegram initData');
      return false;
    }

    // Check timestamp (1 hour validity)
    const authTimestamp = parseInt(authDate);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - authTimestamp > 3600) {
      console.warn('Telegram auth data is too old');
      return false;
    }

    // Validate hash
    // ... implementation details
    return true;
  } catch (error) {
    console.error('Error verifying Telegram data:', error);
    return false;
  }
}
```

#### Server-Side Authentication

```typescript
// supabase/functions/telegram-auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface AuthResponse {
  success: boolean;
  user?: TelegramUser;
  token?: string;
  error?: {
    code: string;
    message: string;
  };
}

serve(async (req) => {
  try {
    const { initData, botToken } = await req.json();

    // Validate input
    if (!initData || !botToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing initData or botToken"
          }
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify Telegram data
    const isValid = await verifyTelegramData(initData, botToken);
    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_INIT_DATA",
            message: "Telegram initData validation failed"
          }
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Process authentication
    // ... implementation details

    return new Response(
      JSON.stringify({
        success: true,
        user: telegramUser,
        token: jwtToken,
        expiresIn: 3600
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Authentication processing failed"
        }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

### Best Practices

#### Security Recommendations

1. Always validate initData on both client and server
2. Use HTTPS for all communications
3. Implement rate limiting to prevent abuse
4. Store bot tokens securely in environment variables
5. Regularly rotate bot tokens

#### User Experience

1. Provide clear feedback during authentication
2. Handle errors gracefully with user-friendly messages
3. Implement auto-login for returning users
4. Use Telegram's theme parameters for consistent UI
5. Respect safe area insets on mobile devices

## Supabase Integration Guide

### Setup Process

#### 1. Project Creation

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note the Project URL and API keys

#### 2. Environment Configuration

Add to your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 3. Database Schema

Create the required tables:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  auth_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create playbacks table
CREATE TABLE playbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_playbacks_track_id ON playbacks(track_id);
CREATE INDEX idx_playbacks_user_id ON playbacks(user_id);
CREATE INDEX idx_playbacks_created_at ON playbacks(created_at);
```

### Client-Side Integration

#### Initialization

```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Authentication

```typescript
// src/hooks/useSupabaseAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useSupabaseAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}
```

#### Database Operations

```typescript
// src/services/database.ts
import { supabase } from './supabaseClient';

// Get user by Telegram ID
export async function getUserByTelegramId(telegramId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (error) throw error;
  return data;
}

// Create or update user
export async function upsertUser(userData: any) {
  const { data, error } = await supabase
    .from('users')
    .upsert(userData, { onConflict: 'telegram_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Record playback
export async function recordPlayback(trackId: string, userId?: string, ipAddress?: string) {
  const { data, error } = await supabase
    .from('playbacks')
    .insert({
      track_id: trackId,
      user_id: userId,
      ip_address: ipAddress
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Function Development

#### Local Development

```bash
# Start Supabase local development
supabase start

# Serve functions locally
supabase functions serve
```

#### Deployment

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy telegram-auth --project-ref your_project_ref
```

#### Function Structure

```typescript
// supabase/functions/telegram-auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Function implementation
  // ... see authentication implementation above
});
```

### Best Practices

#### Security

1. Use service role key only for server-side operations
2. Implement proper row-level security (RLS)
3. Validate all inputs before database operations
4. Use prepared statements to prevent SQL injection
5. Regularly rotate API keys

#### Performance

1. Create appropriate database indexes
2. Use connection pooling
3. Implement caching for frequently accessed data
4. Optimize queries with proper WHERE clauses
5. Use pagination for large result sets

## Jamendo API Integration Guide

### Setup Process

#### 1. API Access

1. Go to [Jamendo Developers](https://devportal.jamendo.com/)
2. Create a developer account
3. Register a new application
4. Note the Client ID

#### 2. Environment Configuration

Add to your `.env` file:

```env
JAMENDO_CLIENT_ID=your_client_id
```

### API Usage

#### Search Implementation

```php
// api/search.php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get search query
$query = $_GET['q'] ?? '';
$limit = min($_GET['limit'] ?? 20, 100);
$offset = $_GET['offset'] ?? 0;

if (empty($query)) {
    http_response_code(400);
    echo json_encode(['error' => 'Search query is required']);
    exit;
}

// Jamendo API endpoint
$jamendoUrl = "https://api.jamendo.com/v3.0/tracks";
$jamendoUrl .= "?client_id=" . getenv('JAMENDO_CLIENT_ID');
$jamendoUrl .= "&format=json";
$jamendoUrl .= "&limit=" . $limit;
$jamendoUrl .= "&offset=" . $offset;
$jamendoUrl .= "&search=" . urlencode($query);

// Make API request
$response = file_get_contents($jamendoUrl);
$data = json_decode($response, true);

if ($data && isset($data['results'])) {
    // Process and format results
    $formattedResults = array_map(function($track) {
        return [
            'id' => $track['id'],
            'title' => $track['name'],
            'artist' => $track['artist_name'],
            'duration' => $track['duration'],
            'album' => $track['album_name'],
            'genre' => $track['genre'],
            'coverArt' => $track['image'],
            'audioUrl' => $track['audio'],
            'tags' => $track['tags']
        ];
    }, $data['results']);

    echo json_encode([
        'query' => $query,
        'results' => $formattedResults,
        'total' => $data['headers']['results_count'] ?? count($formattedResults),
        'limit' => $limit,
        'offset' => $offset
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch data from Jamendo']);
}
?>
```

#### Track Details

```php
// api/tracks.php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get track ID
$trackId = $_GET['id'] ?? '';

if (empty($trackId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Track ID is required']);
    exit;
}

// Jamendo API endpoint
$jamendoUrl = "https://api.jamendo.com/v3.0/tracks";
$jamendoUrl .= "?client_id=" . getenv('JAMENDO_CLIENT_ID');
$jamendoUrl .= "&format=json";
$jamendoUrl .= "&id=" . urlencode($trackId);

// Make API request
$response = file_get_contents($jamendoUrl);
$data = json_decode($response, true);

if ($data && isset($data['results']) && count($data['results']) > 0) {
    $track = $data['results'][0];

    // Format track data
    $formattedTrack = [
        'id' => $track['id'],
        'title' => $track['name'],
        'artist' => $track['artist_name'],
        'duration' => $track['duration'],
        'album' => $track['album_name'],
        'genre' => $track['genre'],
        'releaseDate' => $track['release_date'],
        'description' => $track['prourl'],
        'tags' => $track['tags'],
        'coverArt' => $track['image'],
        'audioUrl' => $track['audio'],
        'downloadUrl' => $track['audiodownload']
    ];

    echo json_encode($formattedTrack);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Track not found']);
}
?>
```

### Rate Limiting and Caching

#### Client-Side Caching

```javascript
// src/services/jamendoClient.ts
class JamendoClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async searchTracks(query: string, limit: number = 20, offset: number = 0) {
    const cacheKey = `search:${query}:${limit}:${offset}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Fetch from API
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    const data = await response.json();

    // Cache result
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  async getTrackDetails(trackId: string) {
    const cacheKey = `track:${trackId}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Fetch from API
    const response = await fetch(`/api/tracks?id=${encodeURIComponent(trackId)}`);
    const data = await response.json();

    // Cache result
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }
}

export const jamendoClient = new JamendoClient();
```

### Best Practices

#### API Usage

1. Respect rate limits (1000 requests per day)
2. Implement caching to reduce API calls
3. Handle API errors gracefully
4. Use appropriate query parameters for efficient searches
5. Validate and sanitize all inputs

#### Data Processing

1. Format API responses for consistent internal usage
2. Handle missing or null data appropriately
3. Implement fallback values for optional fields
4. Normalize data structures across different sources
5. Log API usage for monitoring and debugging

## TON Blockchain Integration Guide

### Setup Process

#### 1. TON Environment

1. Install TON development tools
2. Set up TON wallet for development
3. Obtain testnet tokens if needed

#### 2. Smart Contract Development

1. Write smart contracts in FunC
2. Compile to TVM bytecode
3. Deploy to testnet for testing

#### 3. Frontend Integration

1. Install TON client libraries
2. Configure network endpoints
3. Implement wallet connection

### Smart Contract Integration

#### NFT Marketplace Contract

```solidity
// Example TON smart contract structure (FunC)
() main(slice in_msg_body) {
  slice cs = in_msg_body;
  int op = cs~load_uint(32);

  if (op == 1) {
    // Mint NFT operation
    // ... implementation
  }
  if (op == 2) {
    // Transfer NFT operation
    // ... implementation
  }
  if (op == 3) {
    // List NFT for sale operation
    // ... implementation
  }
}
```

#### Client-Side Integration

```typescript
// src/services/tonClient.ts
import { TonClient, WalletContract, Address } from "@ton/ton";

class TonService {
  private client: TonClient;

  constructor() {
    this.client = new TonClient({
      endpoint: "https://toncenter.com/api/v2/jsonRPC",
      apiKey: process.env.TON_API_KEY
    });
  }

  async connectWallet() {
    // Implementation for wallet connection
    // ... wallet connection logic
  }

  async mintNFT(metadata: any) {
    // Implementation for NFT minting
    // ... NFT minting logic
  }

  async transferNFT(nftAddress: string, toAddress: string) {
    // Implementation for NFT transfer
    // ... NFT transfer logic
  }
}

export const tonService = new TonService();
```

### Best Practices

#### Security

1. Audit smart contracts before deployment
2. Use established contract standards
3. Implement proper access controls
4. Test extensively on testnet
5. Monitor contract activity

#### Performance

1. Optimize gas usage in contracts
2. Implement efficient data structures
3. Use appropriate transaction batching
4. Cache frequently accessed data
5. Monitor network congestion

## Web Audio API Integration Guide

### WASM Module Integration

#### Rust Implementation

```rust
// src/wasm/src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct AudioProcessor {
    sample_rate: f32,
    // ... other fields
}

#[wasm_bindgen]
impl AudioProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new(sample_rate: f32) -> AudioProcessor {
        AudioProcessor {
            sample_rate,
            // ... initialization
        }
    }

    #[wasm_bindgen]
    pub fn process(&mut self, input: &[f32], output: &mut [f32]) {
        // Audio processing implementation
        // ... processing logic
    }

    #[wasm_bindgen]
    pub fn set_parameter(&mut self, param: u32, value: f32) {
        // Parameter setting implementation
        // ... parameter logic
    }
}
```

#### JavaScript Integration

```javascript
// src/core/audio/wasmAudio.js
import { AudioProcessor } from '../../wasm/pkg/tuneton_wasm.js';

class WASMAudioProcessor {
  constructor() {
    this.processor = null;
  }

  async initialize(sampleRate) {
    // Initialize WASM module
    this.processor = new AudioProcessor(sampleRate);
  }

  processAudio(inputBuffer, outputBuffer) {
    if (!this.processor) return;

    // Process audio through WASM
    this.processor.process(inputBuffer, outputBuffer);
  }

  setParameter(paramId, value) {
    if (!this.processor) return;

    this.processor.set_parameter(paramId, value);
  }
}

export const wasmAudioProcessor = new WASMAudioProcessor();
```

### AudioWorklet Integration

#### Worklet Processor

```javascript
// src/core/audio/worklets/wsolaPitchShifter.worklet.js
class WSOLAPitchShifter extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    // ... initialization
  }

  handleMessage(event) {
    const { type, payload } = event.data;

    switch (type) {
      case 'SET_TEMPO':
        this.tempo = payload;
        break;
      case 'SET_PITCH':
        this.pitch = payload;
        break;
      // ... other message handlers
    }
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0 && output.length > 0) {
      // Process audio
      // ... audio processing logic
    }

    return true; // Keep processor alive
  }
}

registerProcessor('wsola-pitch-shifter', WSOLAPitchShifter);
```

#### Main Thread Integration

```javascript
// src/core/audio/AudioEngine.ts
class WebAudioEngine {
  private audioContext: AudioContext;
  private workletNode: AudioWorkletNode | null = null;

  async initialize() {
    // Create audio context
    this.audioContext = new AudioContext();

    // Load AudioWorklet module
    await this.audioContext.audioWorklet.addModule(
      '/src/core/audio/worklets/wsolaPitchShifter.worklet.js'
    );

    // Create worklet node
    this.workletNode = new AudioWorkletNode(
      this.audioContext,
      'wsola-pitch-shifter'
    );

    // Connect to output
    this.workletNode.connect(this.audioContext.destination);
  }

  setTempo(tempo: number) {
    if (this.workletNode) {
      this.workletNode.port.postMessage({
        type: 'SET_TEMPO',
        payload: tempo
      });
    }
  }

  setPitch(pitch: number) {
    if (this.workletNode) {
      this.workletNode.port.postMessage({
        type: 'SET_PITCH',
        payload: pitch
      });
    }
  }
}
```

### Best Practices

#### Performance

1. Offload CPU-intensive processing to WASM
2. Use AudioWorklets for real-time processing
3. Implement efficient buffer management
4. Minimize memory allocations during processing
5. Use appropriate sample rates and buffer sizes

#### Compatibility

1. Provide fallbacks for browsers without Web Audio API
2. Handle different audio formats gracefully
3. Test across different devices and browsers
4. Implement graceful degradation for older browsers
5. Provide clear error messages for unsupported features

This guide provides comprehensive instructions for integrating with all third-party services used in the TuneTON application, ensuring proper setup, implementation, and best practices for each integration.
