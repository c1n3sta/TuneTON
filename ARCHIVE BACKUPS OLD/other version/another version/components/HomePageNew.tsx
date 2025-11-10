import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Clock, Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { theme } from '../theme';

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
  color: ${({ theme }) => theme.colors.onSurface};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  padding: 0.5rem 1rem;
  max-width: 500px;
  margin: 0 auto 2rem;
  box-shadow: ${({ theme }) => theme.shadows[1]};
`;

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  margin-right: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 0.9375rem;
  padding: 0.5rem 0;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.onSurfaceVariant};
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
  color: ${({ theme }) => theme.colors.onSurface};
`;

const ViewAllButton = styled(Button)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
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
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
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
    color: ${({ theme }) => theme.colors.onSurfaceVariant};
    margin: 0;
  }
`;

const TrackMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  
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
    color: ${({ theme }) => theme.colors.onSurfaceVariant};
    margin: 0 0 0.5rem;
  }
`;

const ContestMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  
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
    color: ${({ theme }) => theme.colors.onSurfaceVariant};
    margin: 0;
  }
`;

// Mock data
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'Chill Wave',
    cover: 'https://via.placeholder.com/300',
    duration: 225,
    isFavorite: true,
    audioSrc: '',
    plays: 1245,
    likes: 234,
    shares: 56,
    createdAt: new Date('2023-05-15').toISOString(),
    genre: 'Chill',
    bpm: 95
  },
  // Add more mock tracks as needed
];

const mockPlaylists: Playlist[] = [
  {
    id: 'p1',
    title: 'Chill Vibes',
    description: 'Relaxing beats for your day',
    cover: 'https://via.placeholder.com/300/3366cc',
    trackCount: 24,
    duration: 5234,
    isPublic: true,
    creator: 'TuneTON',
    tracks: ['1']
  },
  // Add more mock playlists as needed
];

const mockContests: Contest[] = [
  {
    id: 'c1',
    title: 'Summer Beats 2023',
    description: 'Create the ultimate summer anthem',
    cover: 'https://via.placeholder.com/600/ff9900',
    prize: '$5,000',
    deadline: '2023-09-30T23:59:59Z',
    entries: 124,
    rules: 'Submit your best summer track. Must be original work.',
    status: 'active',
    genre: 'All Genres',
    createdAt: '2023-05-01T00:00:00Z'
  },
  // Add more mock contests as needed
];

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

  const filteredTracks = mockTracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <ViewAllButton variant="text">View All</ViewAllButton>
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
          <ViewAllButton variant="text">View All</ViewAllButton>
        </SectionHeader>
        <div>
          {mockContests.map((contest) => (
            <ContestCard key={contest.id}>
              <ContestImage>
                <img src={contest.cover} alt={contest.title} />
              </ContestImage>
              <ContestInfo>
                <h3>{contest.title}</h3>
                <p>{contest.description}</p>
                <ContestMeta>
                  <Clock size={14} />
                  {formatTimeLeft(contest.deadline)} • {contest.entries} entries
                </ContestMeta>
              </ContestInfo>
              <Button variant="outlined">Enter Now</Button>
            </ContestCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Featured Playlists</SectionTitle>
          <ViewAllButton variant="text">View All</ViewAllButton>
        </SectionHeader>
        <TracksGrid>
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id}>
              <PlaylistImage>
                <img src={playlist.cover} alt={playlist.title} />
              </PlaylistImage>
              <PlaylistInfo>
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
              </PlaylistInfo>
            </PlaylistCard>
          ))}
        </TracksGrid>
      </Section>
    </HomeContainer>
  );
};

export default HomePageNew;
