import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use environment variable or fallback to 3001
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
  const data = fs.readFileSync(tracksFile, 'utf8');
  return JSON.parse(data);
};

const writeTracks = (tracks: any[]) => {
  fs.writeFileSync(tracksFile, JSON.stringify(tracks, null, 2));
};

const readPlaybacks = () => {
  const data = fs.readFileSync(playbacksFile, 'utf8');
  return JSON.parse(data);
};

const writePlaybacks = (playbacks: any) => {
  fs.writeFileSync(playbacksFile, JSON.stringify(playbacks, null, 2));
};

// Cache for tracks
let cachedTracks: any[] = [];
let lastScanTime = 0;
const SCAN_INTERVAL = 60000; // 1 minute

// Function to get tracks with caching
const getTracks = () => {
  const now = Date.now();
  if (cachedTracks.length === 0 || now - lastScanTime > SCAN_INTERVAL) {
    console.log('Updating tracks cache...');
    cachedTracks = readTracks();
    lastScanTime = now;
  }
  return cachedTracks;
};

// Routes
app.get('/api/tracks', (req, res) => {
  try {
    const tracks = getTracks();
    res.json(tracks);
  } catch (error) {
    console.error('Error reading tracks:', error);
    res.status(500).json({ error: 'Failed to load tracks' });
  }
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  /api/tracks`);
  console.log(`  POST /api/playbacks/:trackId`);
  console.log(`  GET  /api/health`);
});
