import { JamendoTrack } from "../../utils/jamendo-api";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  currentTime: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  audioUrl?: string;
  jamendoTrack?: JamendoTrack;
}

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const convertJamendoToTrack = (
  jamendoTrack: JamendoTrack | null, 
  currentTrack: string | undefined, 
  currentTime: number,
  isLiked: boolean,
  isDisliked: boolean
): Track => {
  if (!jamendoTrack) {
    return {
      id: "fallback",
      title: currentTrack || "Unknown Track",
      artist: "TuneTON Artist",
      album: "Digital Collection",
      cover: imgAlbumArt,
      duration: "3:23",
      currentTime: "0:00",
      isLiked: isLiked,
      isDisliked: isDisliked,
      audioUrl: ""
    };
  }

  return {
    id: jamendoTrack.id,
    title: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    album: jamendoTrack.album_name,
    cover: jamendoTrack.image || jamendoTrack.album_image || imgAlbumArt,
    duration: formatTime(jamendoTrack.duration),
    currentTime: formatTime(currentTime),
    isLiked: isLiked,
    isDisliked: isDisliked,
    audioUrl: jamendoTrack.audio || jamendoTrack.audiodownload,
    jamendoTrack: jamendoTrack
  };
};

export const checkMixModeActive = (
  lofiIntensity: number,
  backgroundNoise: string,
  vinylCrackle: number,
  tapeWow: number,
  radioCutoff: number,
  tempo: number,
  pitch: number
): boolean => {
  return lofiIntensity > 0 || backgroundNoise !== 'none' || vinylCrackle > 0 || 
         tapeWow > 0 || radioCutoff > 0 || tempo !== 100 || pitch !== 0;
};