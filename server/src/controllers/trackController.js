// Track controller
import Playback from '../models/Playback.js';
import Track from '../models/Track.js';

/**
 * Get all tracks
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function getAllTracks(req, res) {
  try {
    const tracks = await Track.findAll();
    return res.status(200).json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}

/**
 * Get track by ID
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function getTrackById(req, res) {
  try {
    const { id } = req.params;
    const track = await Track.findById(id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    return res.status(200).json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}

/**
 * Increment track play count
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function incrementPlayCount(req, res) {
  try {
    const { id } = req.params;
    
    // First, find the track
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Increment play count in tracks table
    const updatedTrack = await Track.incrementPlayCount(id);
    
    // Find or create playback record
    let playback = await Playback.findByTrackId(id);
    if (playback) {
      playback = await Playback.incrementCount(playback.id);
    } else {
      playback = await Playback.create({ track_id: id, count: 1 });
    }
    
    return res.status(200).json({
      message: 'Play count incremented successfully',
      track: updatedTrack,
      playback: playback
    });
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}