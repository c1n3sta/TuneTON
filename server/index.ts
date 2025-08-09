import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Enable compression
app.use(compression());

// In-memory cache with pre-allocation
let tracksCache: any[] = [];
let playbacksCache: Record<string, number> = {};
let lastCacheUpdate = 0;
const CACHE_TTL = 30000; // 30 seconds

// Pre-allocate array for better performance
const MAX_TRACKS = 100;
for (let i = 0; i < MAX_TRACKS; i++) {
  tracksCache.push({
    id: '',
    title: '',
    artist: '',
    duration: 0,
    playCount: 0,
    audioUrl: ''
  });
}
tracksCache = []; // Clear but keep pre-allocated memory

// Warm up cache on startup
const warmUpCache = async () => {
  try {
    const startTime = process.hrtime();
    const tracks = await Promise.resolve(scanAudioDirectory());
    tracksCache = tracks;
    playbacksCache = {};
    lastCacheUpdate = Date.now();
    const [seconds, nanoseconds] = process.hrtime(startTime);
    console.log(`Cache warmed up with ${tracks.length} tracks in ${(seconds * 1000 + nanoseconds / 1e6).toFixed(2)}ms`);
  } catch (error) {
    console.error('Error warming up cache:', error);
  }
};

// Initial warm up in non-blocking way
setImmediate(() => {
  warmUpCache().catch(console.error);
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://web.telegram.org',
  'https://web.telegram.org/*',
  'https://*.telegram.org'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith(allowedOrigin.replace('*', ''))
    )) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data file paths
const tracksFile = path.join(__dirname, '../data/tracks.json');
const playbacksFile = path.join(__dirname, '../data/playbacks.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Function to scan audio directory and generate tracks
const scanAudioDirectory = () => {
  const audioDir = path.join(__dirname, '../public/audio');
  const tracks: any[] = [];
  
  if (fs.existsSync(audioDir)) {
    const files = fs.readdirSync(audioDir);
    let id = 1;
    
    files.forEach(file => {
      if (file.match(/\.(mp3|flac|wav|ogg|m4a)$/i)) {
        // Extract title from filename (remove extension and replace underscores/hyphens with spaces)
        let title = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        
        // Try to extract artist from filename if it contains " - " or " by "
        let artist = 'Unknown Artist';
        if (title.includes(' - ')) {
          const parts = title.split(' - ');
          artist = parts[0];
          title = parts[1];
        } else if (title.includes(' by ')) {
          const parts = title.split(' by ');
          artist = parts[1];
          title = parts[0];
        }
        
        tracks.push({
          id: id.toString(),
          title: title,
          artist: artist,
          duration: 0, // Will be updated when track is loaded
          playCount: 0,
          audioUrl: `/audio/${file}`
        });
        id++;
      }
    });
  }
  
  return tracks;
};

// Initialize data files if they don't exist
if (!fs.existsSync(tracksFile)) {
  const initialTracks = scanAudioDirectory();
  fs.writeFileSync(tracksFile, JSON.stringify(initialTracks, null, 2));
}

if (!fs.existsSync(playbacksFile)) {
  const initialPlaybacks = {};
  fs.writeFileSync(playbacksFile, JSON.stringify(initialPlaybacks, null, 2));
}

// Helper functions
const readTracks = () => {
  const now = Date.now();
  if (!tracksCache || now - lastCacheUpdate > CACHE_TTL) {
    try {
      tracksCache = JSON.parse(fs.readFileSync(tracksFile, 'utf8'));
      lastCacheUpdate = now;
    } catch (error) {
      console.error('Error reading tracks:', error);
      return [];
    }
  }
  return [...tracksCache!];
};

const writeTracks = (tracks: any[]) => {
  fs.writeFileSync(tracksFile, JSON.stringify(tracks, null, 2));
};

const readPlaybacks = () => {
  if (!playbacksCache) {
    try {
      playbacksCache = JSON.parse(fs.readFileSync(playbacksFile, 'utf8'));
    } catch (error) {
      console.error('Error reading playbacks:', error);
      return {};
    }
  }
  return { ...playbacksCache };
};

const writePlaybacks = (playbacks: any) => {
  fs.writeFileSync(playbacksFile, JSON.stringify(playbacks, null, 2));
};

// Routes
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = readTracks();
    res.set({
      'Cache-Control': 'public, max-age=30, s-maxage=60',
      'ETag': `\"${lastCacheUpdate}\"`,
      'X-Cache': tracksCache === null ? 'MISS' : 'HIT'
    });
    res.json(tracks);
  } catch (error) {
    console.error('Error in /api/tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cache warm-up endpoint
app.get('/api/warmup', (req, res) => {
  warmUpCache();
  res.json({ status: 'cache_warmed', tracks: tracksCache?.length || 0 });
});

app.post('/api/playbacks/:trackId', (req, res) => {
  try {
    const { trackId } = req.params;
    const playbacks = readPlaybacks();
    const tracks = readTracks();
    
    // Increment playback count
    if (!playbacks[trackId]) {
      playbacks[trackId] = 0;
    }
    playbacks[trackId]++;
    
    // Update track playCount
    const track = tracks.find((t: any) => t.id === trackId);
    if (track) {
      track.playCount = playbacks[trackId];
    }
    
    writePlaybacks(playbacks);
    writeTracks(tracks);
    
    res.json({ 
      trackId, 
      playCount: playbacks[trackId],
      totalPlaybacks: Object.values(playbacks).reduce((a: any, b: any) => a + b, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update playback count' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET  /api/tracks');
  console.log('  POST /api/playbacks/:trackId');
  console.log('  GET  /api/health');
  console.log('  GET  /api/warmup');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
