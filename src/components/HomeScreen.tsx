import React, { useState, useEffect } from 'react';
import { loadMontserratFont } from '../utils/fontLoader';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@emotion/react';
import { SxProps, Theme } from '@mui/material';

// Type definitions
interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isPlaying?: boolean;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  cover: string;
  tracks: number;
  duration: string;
}

interface Contest {
  id: number;
  title: string;
  description: string;
  cover: string;
  prize: string;
  deadline: string;
  participants: number;
  remixer: {
    name: string;
    avatar: string;
  };
}

// Extended CSSProperties with pseudo-selectors and nested selectors
type CSSProperties = React.CSSProperties & {
  '&:hover'?: React.CSSProperties;
  '&:active'?: React.CSSProperties;
  '&:focus'?: React.CSSProperties;
  '& svg'?: React.CSSProperties;
  '&::-webkit-scrollbar'?: React.CSSProperties;
  '&:nth-of-type(n)'?: React.CSSProperties;
  '&.active'?: React.CSSProperties;
  [key: string]: any; // Allow any other string key for dynamic selectors
};

type StyleSheet = {
  [key: string]: CSSProperties;
};

// Image assets from Figma - Single source of truth
const imgAssets = {
  albumArt: "http://localhost:3845/assets/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png",
  playlistCovers: [
    "http://localhost:3845/assets/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png",
    "http://localhost:3845/assets/059d630bf1b73c65663230f6fe3660d07bc060b8.png",
    "http://localhost:3845/assets/20bb8fe31b212ec3236e8224dd3efe441043be2f.png",
    "http://localhost:3845/assets/a1ad22f09bf6f15ef5bc637a1785d31b1ca3884a.png",
    "http://localhost:3845/assets/08ea158ebabf976cca7bb1f8ec91d0c456a2f915.png"
  ],
  trackCovers: [
    "http://localhost:3845/assets/5c0570c22db9da4233071e8dc020249fbd9aeece.png",
    "http://localhost:3845/assets/ee4dceec67617340be718a9b700bd99946447425.png"
  ],
  remixCovers: [
    "http://localhost:3845/assets/92af5e42f7a6be5cc4a3570d7557d9b846376457.png",
    "http://localhost:3845/assets/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png",
    "http://localhost:3845/assets/2445cdb838670e8ea661ef232b16e90503fdec0b.png",
    "http://localhost:3845/assets/f6899fe4451eb26d22ac13df75a794b76f152b36.png"
  ],
  remixerAvatars: [
    "http://localhost:3845/assets/02641910bdc93d1d98cf6da313c9fe42f75a5679.png",
    "http://localhost:3845/assets/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png",
    "http://localhost:3845/assets/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png"
  ]
};

// Define keyframes for animations
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Styled components
const PlayButton = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 40,
  height: 40,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 1,
  },
  '& svg': {
    color: '#fff',
    fontSize: 20,
  },
});

// Create a type-safe style helper
const createStyle = <T extends Record<string, CSSProperties>>(styles: T): T => styles;

const PlaylistDescription = styled(Typography)({
  fontSize: '12px',
  color: '#8B949E',
  marginBottom: '8px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// Styles object with proper TypeScript types
const styles = createStyle({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    minHeight: '100vh',
    color: '#C9D1D9',
    fontFamily: 'Montserrat, sans-serif',
  },
  
  // Main content area
  mainContent: {
    padding: '16px',
    paddingBottom: '100px', // Space for bottom navigation
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
  },
  
  // Section styles
  section: {
    marginBottom: '24px',
  },
  
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#E6EDF3',
    margin: 0,
  },
  
  seeAllText: {
    color: '#58A6FF',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Playlist Grid
  playlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },

  playlistCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    aspectRatio: '1',
    '&:hover': {
      '& .playButton': {
        opacity: 1,
      },
    },
  } as any,

  playlistCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  playlistInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px',
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
  },

  playlistTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  playlistMeta: {
    fontSize: '12px',
    color: '#E5E7EB',
    margin: 0,
    opacity: 0.8,
  },

  // Contest List
  contestList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  contestCard: {
    backgroundColor: '#161B22',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    gap: '12px',
  },

  contestCover: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },

  contestInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  contestTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#E6EDF3',
    margin: 0,
    marginBottom: '4px',
  },

  contestPrize: {
    fontSize: '12px',
    color: '#8B949E',
    margin: 0,
    marginBottom: '8px',
  },

  contestStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contestStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  contestStatText: {
    fontSize: '12px',
    color: '#8B949E',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D1117',
    borderTop: '1px solid #30363D',
    padding: '8px 0',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  },

  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(240, 246, 252, 0.1)',
    },
  } as any,

  navIcon: {
    width: '24px',
    height: '24px',
    marginBottom: '4px',
    color: '#8B949E',
    '&.active': {
      color: '#58A6FF',
    },
  },

  navLabel: {
    fontSize: '10px',
    color: '#8B949E',
    marginTop: '2px',
    '&.active': {
      color: '#58A6FF',
    },
  },

  // Top Navigation
  topNav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#0D1117',
    borderBottom: '1px solid #30363D',
  },
  
  // Search Bar
  searchBar: {
    flex: 1,
    margin: '0 16px',
    position: 'relative',
  },
  
  searchIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  
  searchInput: {
    width: '100%',
    backgroundColor: '#0D1117',
    border: '1px solid #30363D',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#C9D1D9',
    fontSize: '14px',
    '&:focus': {
      outline: 'none',
      borderColor: '#58A6FF',
    },
  },
  
  // Notification Icon
  notificationIcon: {
    marginLeft: '12px',
    padding: '4px',
    cursor: 'pointer',
  },
  
  // Main Content
  mainContainer: {
    padding: '16px',
    paddingBottom: '80px', // Add space for bottom navigation
  },

  // Section Styles (consolidated with existing styles above)
  // Note: These styles are defined earlier in the file to avoid duplicates

  iconButton: {
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(240, 246, 252, 0.1)',
    },
  },

  // Currently Playing
  currentlyPlaying: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
  },

  currentlyPlayingCover: {
    width: '48px',
    height: '48px',
    borderRadius: '4px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginRight: '12px',
  },

  currentlyPlayingInfo: {
    flex: 1,
    overflow: 'hidden',
  },

  currentlyPlayingTitle: {
    color: '#E6EDF3',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '2px',
  },

  currentlyPlayingArtist: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
  },
  
  featuredTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  
  featuredArtist: {
    fontSize: '14px',
    color: '#8B949E',
    marginBottom: '8px',
  },
  
  featuredMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Recently played list
  recentlyPlayedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  // Track item in list
  trackItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#161B22',
    },
  },
  
  trackNumber: {
    width: '24px',
    textAlign: 'center',
    color: '#8B949E',
    fontSize: '14px',
  },
  
  // Playing track
  playingTrack: {
    backgroundColor: '#1F2937',
    '& $trackNumber': {
      color: '#58A6FF',
    },
  },
  
  // Nav button
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    color: '#6E7681',
    textDecoration: 'none',
    '&.active': {
      color: '#58A6FF',
    },
  },
  
  navButtonActive: {
    color: '#58A6FF',
  },
  
  // Contest grid
  contestGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  
  // Play button
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 1,
    },
  },
});

// Using imgAssets as the single source of truth for all images

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load Montserrat font
  React.useEffect(() => {
    loadMontserratFont();
  }, []);

  // Data for the component
  const tracks: Track[] = [
    {
      id: 1,
      title: 'Starlight Serenade',
      artist: 'MelodyMix Artist',
      cover: imgAssets.albumArt,
      duration: '3:45',
      isPlaying: true,
    },
    {
      id: 2,
      title: 'Midnight Dreams',
      artist: 'Nocturnal Beats',
      cover: imgAssets.playlistCovers[1],
      duration: '4:12',
      isPlaying: false,
    },
  ];
  
  const recentlyPlayedTracks = tracks;

  const featuredPlaylists = [
    { 
      id: 1, 
      title: 'Chill Vibes', 
      description: 'Relaxing beats for your day',
      cover: imgAssets.playlistCovers[0],
      tracksCount: 24, 
      duration: '2h 15m' 
    },
    { 
      id: 2, 
      title: 'Workout Mix', 
      description: 'High energy tracks',
      cover: imgAssets.playlistCovers[1],
      tracksCount: 18, 
      duration: '1h 45m' 
    },
  ];

  const activeContests = [
    {
      id: 1,
      title: 'Summer Remix Contest',
      description: 'Create your best summer remix',
      cover: imgAssets.remixCovers[0],
      prize: '$5,000',
      deadline: '2023-08-31',
      participants: 124,
      remixer: {
        name: 'DJ Summer',
        avatar: imgAssets.remixerAvatars[0]
      }
    }
  ];

  return (
    <Box sx={styles.container}>
      {/* Main Content Wrapper */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%',
        backgroundColor: '#161B22',
        borderRadius: '16px',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top Navigation */}
        <Box sx={styles.topNav}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              color: '#C9D1D9',
              lineHeight: '21px',
            }}>
              Welcome back,
            </Typography>
            <Typography sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: '28px',
              marginTop: '4px',
            }}>
              Username
            </Typography>
          </Box>
          
          {/* Search Bar */}
          <Box sx={styles.searchBar}>
            <input
              type="text"
              placeholder="Search tracks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <Box sx={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#8B949E"/>
              </svg>
            </Box>
          </Box>
          
          {/* Notification and Profile Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={styles.notificationIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#C9D1D9"/>
              </svg>
            </Box>
            <Box sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#30363D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '12px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#C9D1D9"/>
              </svg>
            </Box>
          </Box>
        </Box>
      
        {/* Now Playing Bar */}
      <Box sx={{
        position: 'fixed',
        bottom: '60px',
        left: 0,
        right: 0,
        backgroundColor: '#161B22',
        borderTop: '1px solid #30363D',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <Box sx={{
          width: '48px',
          height: '48px',
          borderRadius: '4px',
          backgroundColor: '#30363D',
          backgroundImage: `url(${tracks[0]?.cover || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginRight: '12px',
        }} />
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{
            color: '#E6EDF3',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {tracks[0]?.title || 'No track playing'}
          </Typography>
          <Typography sx={{
            color: '#8B949E',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {tracks[0]?.artist || 'Unknown artist'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#E6EDF3',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H8V18H6V6ZM9.5 12L18 6V18L9.5 12Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button style={{
            background: 'none',
            border: 'none',
            color: '#E6EDF3',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button style={{
            background: 'none',
            border: 'none',
            color: '#E6EDF3',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19H8V5H6V19ZM16 5V19L22 12L16 5Z" fill="currentColor"/>
            </svg>
          </button>
        </Box>
      </Box>
      
        {/* Main Content */}
        <Box sx={{
          padding: '16px',
          paddingBottom: '160px', // Space for bottom navigation and now playing bar
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for Chrome, Safari and Opera
          },
          msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
        }}>
        {/* Recently Played Section */}
        <Box sx={styles.section}>
          <Box sx={styles.sectionHeader}>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Recently Played
            </Typography>
            <Typography sx={styles.seeAllText}>See All</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tracks.map((trackItem) => (
              <Box 
                key={trackItem.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: trackItem.isPlaying ? '#1F2937' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#1F2937',
                    cursor: 'pointer',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Box
                    component="img"
                    src={trackItem.cover}
                    alt={trackItem.title}
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                    }}
                  />
                  <Box>
                    <Typography sx={{ 
                      color: '#E5E7EB', 
                      fontWeight: 500,
                      fontSize: '14px',
                    }}>
                      {trackItem.title}
                    </Typography>
                    <Typography sx={{
                      color: '#9CA3AF',
                      fontSize: '12px',
                    }}>
                      {trackItem.artist}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {trackItem.isPlaying && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', height: '16px' }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Box 
                          key={i} 
                          sx={{
                            width: '2px',
                            height: `${Math.random() * 16 + 4}px`,
                            backgroundColor: '#3B82F6',
                            borderRadius: '2px',
                            animation: 'visualize 1s ease-in-out infinite',
                            animationDelay: `${i * 0.1}s`,
                            '@keyframes visualize': {
                              '0%, 100%': {
                                height: '4px',
                              },
                              '50%': {
                                height: '20px',
                              },
                            }
                          } as any}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography sx={{
                    color: '#9CA3AF',
                    fontSize: '12px',
                    minWidth: '40px',
                    textAlign: 'right',
                  }}>
                    {trackItem.duration}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Featured Playlists Section */}
        <Box sx={styles.section}>
          <Box sx={styles.sectionHeader}>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Featured Playlists
            </Typography>
            <Typography sx={styles.seeAllText}>See All</Typography>
          </Box>
          
          <Box sx={styles.playlistGrid}>
            {featuredPlaylists.map((playlist) => (
              <Box key={playlist.id} sx={styles.playlistCard}>
                <Box
                  component="img"
                  src={playlist.cover}
                  alt={playlist.title}
                  sx={styles.playlistCover}
                />
                <Box sx={styles.playlistInfo}>
                  <Typography sx={styles.playlistTitle}>
                    {playlist.title}
                  </Typography>
                  <Typography sx={styles.playlistMeta}>
                    {playlist.tracksCount} tracks • {playlist.duration}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Active Contests Section */}
        <Box sx={styles.section}>
          <Box sx={styles.sectionHeader}>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Active Contests
            </Typography>
            <Typography sx={styles.seeAllText}>See All</Typography>
          </Box>
          
          <Box sx={styles.contestList}>
            {activeContests.map((contest) => (
              <Box key={contest.id} sx={styles.contestCard}>
                <Box
                  component="img"
                  src={contest.cover}
                  alt={contest.title}
                  sx={styles.contestCover}
                />
                <Box sx={styles.contestInfo}>
                  <Typography sx={styles.contestTitle}>
                    {contest.title}
                  </Typography>
                  <Typography sx={styles.contestPrize}>
                    Prize: {contest.prize}
                  </Typography>
                  <Box sx={styles.contestStats}>
                    <Box sx={styles.contestStat}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#8B949E"/>
                      </svg>
                      <Typography sx={styles.contestStatText}>
                        {contest.participants} Participants
                      </Typography>
                    </Box>
                    <Box sx={styles.contestStat}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#8B949E"/>
                        <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#8B949E"/>
                      </svg>
                      <Typography sx={styles.contestStatText}>
                        {Math.ceil((new Date(contest.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d left
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      </Box>
      
      {/* Bottom Navigation */}
      <Box sx={styles.bottomNav}>
        <Box 
          component="button"
          onClick={() => setActiveTab('home')}
          sx={{
            ...styles.navButton,
            ...(activeTab === 'home' ? styles.navButtonActive : {})
          }}
        >
          <Box component="span" sx={styles.navIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2L4 7V22H20V7L12 2Z" 
                fill={activeTab === 'home' ? '#58A6FF' : '#8B949E'}
              />
            </svg>
          </Box>
          <Box component="span" sx={styles.navLabel}>
            Home
          </Box>
        </Box>
        
        <Box 
          component="button"
          onClick={() => setActiveTab('discover')}
          sx={{
            ...styles.navButton,
            ...(activeTab === 'discover' ? styles.navButtonActive : {})
          }}
        >
          <Box component="span" sx={styles.navIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
                fill={activeTab === 'discover' ? '#58A6FF' : '#8B949E'}
              />
              <path 
                d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7Z" 
                fill={activeTab === 'discover' ? '#58A6FF' : '#8B949E'}
              />
            </svg>
          </Box>
          <Box component="span" sx={styles.navLabel}>
            Discover
          </Box>
        </Box>
        
        <Box 
          component="button"
          onClick={() => setActiveTab('contests')}
          sx={{
            ...styles.navButton,
            ...(activeTab === 'contests' ? styles.navButtonActive : {})
          }}
        >
          <Box component="span" sx={styles.navIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M19 5H17V3H15V5H13V7H15V9H17V7H19V5ZM12 15V17H14V19H16V17H18V15H16V13H14V15H12ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM20.1 3.9L18.7 5.3L20.7 7.3L22.1 5.9C22.5 5.5 22.5 4.8 22.1 4.4L21.6 3.9C21.2 3.5 20.5 3.5 20.1 3.9ZM19.7 8.7L17.7 6.7L7 17.4V20H9.6L20.3 9.3L19.7 8.7Z" 
                fill={activeTab === 'contests' ? '#58A6FF' : '#8B949E'}
              />
            </svg>
          </Box>
          <Box component="span" sx={styles.navLabel}>
            Contests
          </Box>
        </Box>
        
        <Box 
          component="button"
          onClick={() => setActiveTab('profile')}
          sx={{
            ...styles.navButton,
            ...(activeTab === 'profile' ? styles.navButtonActive : {})
          }}
        >
          <Box component="span" sx={styles.navIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                fill={activeTab === 'profile' ? '#58A6FF' : '#8B949E'}
              />
            </svg>
          </Box>
          <Box component="span" sx={styles.navLabel}>
            Profile
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeScreen;
