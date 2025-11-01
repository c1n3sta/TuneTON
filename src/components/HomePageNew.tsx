import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Clock, Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

// Define theme interface to match the actual theme structure
interface Theme {
  colors?: {
    primary?: string;
    onSurface?: string;
    onSurfaceVariant?: string;
    surface?: string;
    surfaceVariant?: string;
  };
  shadows?: string[];
}

// Extend styled-components theme interface
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// Type definitions
interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number;
  isFavorite: boolean;
  audioSrc: string;
  plays: number;
  likes: number;
  shares: number;
  createdAt: string;
  genre: string;
  bpm: number;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  trackCount: number;
  duration: number;
  isPublic: boolean;
  creator: string;
  tracks: string[];
}

interface Contest {
  id: string;
  title: string;
  description: string;
  cover: string;
  prize: string;
  deadline: string;
  entries: number;
  rules: string;
  status: 'active' | 'upcoming' | 'ended';
  genre: string;
  createdAt: string;
}

// Styled components
const HomeContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors?.onSurface || '#000'};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-radius: 24px;
  padding: 0.5rem 1rem;
  max-width: 500px;
  margin: 0 auto 2rem;
  box-shadow: ${({ theme }) => theme.shadows?.[1] || '0 2px 4px rgba(0,0,0,0.1)'};
`;

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.colors?.onSurfaceVariant || '#666'};
  margin-right: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors?.onSurface || '#000'};
  font-size: 0.9375rem;
  padding: 0.5rem 0;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors?.onSurfaceVariant || '#666'};
    opacity: 0.7;
  }
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors?.onSurface || '#000'};
`;

const ViewAllButton = styled(Button)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors?.primary || '#007bff'};
  background: transparent;
  padding: 0.25rem 0.5rem;
  
  &:hover {
    background: rgba(88, 166, 255, 0.1);
  }
`;

const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TrackCard = styled(Card)`
  padding: 1rem;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const TrackImage = styled.div<{ $isPlaying?: boolean }>`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors?.surfaceVariant || '#f5f5f5'};
  margin-bottom: 0.75rem;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isPlaying }) => ($isPlaying ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TrackInfo = styled.div`
  h3 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors?.onSurfaceVariant || '#666'};
    margin: 0;
  }
`;

const TrackMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors?.onSurfaceVariant || '#666'};
  
  span {
    display: flex;
    align-items: center;
    margin-right: 0.75rem;
    
    svg {
      width: 14px;
      height: 14px;
      margin-right: 0.25rem;
    }
  }
`;

const ContestCard = styled(Card)`
  padding: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContestImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContestInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1rem;
    margin: 0 0 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors?.onSurfaceVariant || '#666'};
    margin: 0 0 0.5rem;
  }
`;

const ContestMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors?.primary || '#007bff'};
  
  svg {
    width: 14px;
    height: 14px;
    margin-right: 0.25rem;
  }
`;

const PlaylistCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const PlaylistImage = styled.div`
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaylistInfo = styled.div`
  padding: 1rem;
  
  h3 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }
  
  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors?.onSurfaceVariant || '#666'};
    margin: 0;
  }
`;



// Helper functions
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const formatTimeLeft = (dateString: string): string => {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return 'Ended';
  if (days === 0) return 'Ends today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
};

// Main component
const HomePageNew: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredTracks: Track[] = [];

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <HomeContainer>
      <SearchBar>
        <SearchIcon size={20} />
        <SearchInput 
          type="text" 
          placeholder="Search tracks, artists, or playlists..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      <Section>
        <SectionHeader>
          <SectionTitle>Recently Played</SectionTitle>
          <ViewAllButton variant="ghost">View All</ViewAllButton>
        </SectionHeader>
        <TracksGrid>
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} onClick={() => handleTrackClick(track)}>
              <TrackImage $isPlaying={currentTrack?.id === track.id && isPlaying}>
                <img src={track.cover} alt={track.title} />
              </TrackImage>
              <TrackInfo>
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
                <TrackMeta>
                  <span><Clock size={14} /> {formatDuration(track.duration)}</span>
                  <span><Heart size={14} /> {track.likes}</span>
                </TrackMeta>
              </TrackInfo>
            </TrackCard>
          ))}
        </TracksGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Active Contests</SectionTitle>
          <ViewAllButton variant="ghost">View All</ViewAllButton>
        </SectionHeader>
        <div>
          {/* Contest data will be loaded from API in production */}
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Featured Playlists</SectionTitle>
          <ViewAllButton variant="ghost">View All</ViewAllButton>
        </SectionHeader>
        <TracksGrid>
          {/* Playlist data will be loaded from API in production */}
        </TracksGrid>
      </Section>
    </HomeContainer>
  );
};

export default HomePageNew;
