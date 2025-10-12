import React, { useState, useEffect } from 'react';
import { loadMontserratFont } from '../utils/fontLoader';
import './OnboardingArtistsEnhanced.css';

// Define types for our styles
type Styles = {
  container: React.CSSProperties;
  mainContainer: React.CSSProperties;
  card: React.CSSProperties;
  selectedCard: React.CSSProperties;
  buttonContainer: React.CSSProperties;
  button: React.CSSProperties;
  skipButton: React.CSSProperties;
  nextButton: React.CSSProperties & { '&:hover'?: React.CSSProperties };
  content: React.CSSProperties;
  title: React.CSSProperties;
  subtitle: React.CSSProperties;
  cardsContainer: React.CSSProperties;
  loadingContainer: React.CSSProperties;
};

interface Artist {
  id: string;
  name: string;
  avatar: string;
  position?: {
    top: string;
    left: string;
    rotate: string;
    width: string;
    height: string;
  };
}

// Component styles with proper typing
const styles: Styles = {
  container: {
    ...loadMontserratFont(),
    background: 'linear-gradient(180deg, #0D1117 0%, #1A1F2E 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  mainContainer: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '400px',
    height: '680px',
    borderRadius: '24px',
    overflow: 'hidden' as const,
    background: '#0D1117',
  },
  card: {
    position: 'absolute' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    borderRadius: '16px',
    background: '#161B22',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  selectedCard: {
    boxShadow: '0 0 0 2px #FF22FB',
  },
  buttonContainer: {
    position: 'absolute' as const,
    bottom: '24px',
    left: '24px',
    right: '24px',
    display: 'flex',
    gap: '16px',
  },
  button: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  skipButton: {
    background: '#2D333B',
    color: '#FFFFFF',
  },
  nextButton: {
    background: '#FF22FB',
    color: '#FFFFFF',
    '&:hover': {
      background: '#FF4AFC',
      boxShadow: '0 4px 14px rgba(255, 34, 251, 0.3)',
    },
  },
  content: {
    height: '100%',
    paddingTop: '80px',
    paddingBottom: '120px',
    paddingLeft: '24px',
    paddingRight: '24px',
    overflow: 'hidden' as const,
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#C9D1D9',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: '16px',
    color: '#8B949E',
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  cardsContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#C9D1D9',
    fontSize: '18px',
  },
};

interface ArtistCardProps {
  artist: Artist;
  isSelected: boolean;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, isSelected, onClick }) => {
  const position = artist.position || {
    top: '20%',
    left: '20%',
    rotate: '0deg',
    width: '120px',
    height: '140px'
  };
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    '--card-rotate': position.rotate,
    '--card-top': position.top,
    '--card-left': position.left,
    '--card-width': position.width,
    '--card-height': position.height,
  } as React.CSSProperties;

  const cardStyles: React.CSSProperties = {
    ...styles.card,
    ...cardStyle,
    zIndex: isSelected ? 50 : isHovered ? 30 : 10,
    transform: `rotate(${position.rotate}) scale(${isSelected || isHovered ? 1.05 : 1})`,
    top: position.top,
    left: position.left,
    width: position.width,
    height: position.height,
  };

  return (
    <div 
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#161B22',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          ...(isSelected ? styles.selectedCard : {}),
        }}
      >
        <div 
          className="rounded-full bg-cover bg-center mb-2 overflow-hidden"
          style={{
            backgroundImage: `url(${artist.avatar})`,
            width: '80px',
            height: '80px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <p style={{
          color: '#c9d1d9',
          fontSize: '0.875rem',
          fontWeight: 600,
          textAlign: 'center',
          margin: 0,
          marginTop: '0.5rem',
        }}>
          {artist.name}
        </p>
      </div>
    </div>
  );
};

interface OnboardingArtistsProps {
  onNext?: () => void;
  onSkip?: () => void;
}

const OnboardingArtistsEnhanced: React.FC<OnboardingArtistsProps> = ({ onNext, onSkip }) => {
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularArtists = async () => {
      try {
        // Dynamically import the Jamendo API to avoid issues with static imports
        const { jamendoAPI } = await import('../utils/jamendo-api');
        
        // Fetch popular artists from Jamendo API
        const response = await jamendoAPI.getPopularArtists(8);
        const formattedArtists = response.results.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          avatar: artist.image
        }));
        
        // Add positions to artists
        const artistsWithPositions = formattedArtists.map((artist: Artist, index: number) => {
          // Predefined positions from Figma
          const positions = [
            {
              top: '3.37%',
              left: '2.85%',
              rotate: '355deg',
              width: '160px',
              height: '180px'
            },
            {
              top: '-1.22%',
              left: '55.28%',
              rotate: '8deg',
              width: '130px',
              height: '150px'
            },
            {
              top: '14.46%',
              left: '39.41%',
              rotate: '2deg',
              width: '100px',
              height: '120px'
            },
            {
              top: '19.9%',
              left: '39.73%',
              rotate: '12deg',
              width: '160px',
              height: '180px'
            },
            {
              top: '24.9%',
              left: '6.58%',
              rotate: '350deg',
              width: '130px',
              height: '150px'
            },
            {
              top: '43%',
              left: '2.54%',
              rotate: '7deg',
              width: '130px',
              height: '150px'
            },
            {
              top: '40.7%',
              left: '50%',
              rotate: '357deg',
              width: '100px',
              height: '120px'
            },
            {
              top: '50.5%',
              left: '54.36%',
              rotate: '352deg',
              width: '100px',
              height: '120px'
            }
          ];
          
          return {
            ...artist,
            position: positions[index % positions.length]
          };
        });
        
        setArtists(artistsWithPositions);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch popular artists:', error);
        // Fallback to static data if API fails
        const fallbackArtists: Artist[] = [
          {
            id: 'weeknd',
            name: 'The Weeknd',
            avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            position: {
              top: '3.37%',
              left: '2.85%',
              rotate: '355deg',
              width: '160px',
              height: '180px'
            }
          },
          {
            id: 'dojacat',
            name: 'Doja Cat',
            avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
            position: {
              top: '-1.22%',
              left: '55.28%',
              rotate: '8deg',
              width: '130px',
              height: '150px'
            }
          },
          {
            id: 'sza',
            name: 'SZA',
            avatar: 'https://images.unsplash.com/photo-1574914629385-46448b767aec?w=400',
            position: {
              top: '14.46%',
              left: '39.41%',
              rotate: '2deg',
              width: '100px',
              height: '120px'
            }
          },
          {
            id: 'beyonce',
            name: 'Beyoncé',
            avatar: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
            position: {
              top: '19.9%',
              left: '39.73%',
              rotate: '12deg',
              width: '160px',
              height: '180px'
            }
          },
          {
            id: 'frank',
            name: 'Frank Ocean',
            avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            position: {
              top: '24.9%',
              left: '6.58%',
              rotate: '350deg',
              width: '130px',
              height: '150px'
            }
          },
          {
            id: 'rihanna',
            name: 'Rihanna',
            avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            position: {
              top: '43%',
              left: '2.54%',
              rotate: '7deg',
              width: '130px',
              height: '150px'
            }
          },
          {
            id: 'bruno',
            name: 'Bruno Mars',
            avatar: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
            position: {
              top: '40.7%',
              left: '50%',
              rotate: '357deg',
              width: '100px',
              height: '120px'
            }
          },
          {
            id: 'drake',
            name: 'Drake',
            avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
            position: {
              top: '50.5%',
              left: '54.36%',
              rotate: '352deg',
              width: '100px',
              height: '120px'
            }
          }
        ];
        setArtists(fallbackArtists);
        setLoading(false);
      }
    };

    fetchPopularArtists();
  }, []);

  const toggleArtist = (id: string) => {
    setSelectedArtists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.mainContainer}>
          <div style={styles.loadingContainer}>
            Loading artists...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', zIndex: 10 }}>
          <h1 style={{ color: '#C9D1D9', fontSize: '18px', fontWeight: 600, margin: 0 }}>TuneTON</h1>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div>
            <h2 style={styles.title}>Who are your favorite artists?</h2>
            <p style={styles.subtitle}>Select artists to refine your recommendations.</p>
          </div>

          {/* Artist Cards Container */}
          <div style={styles.cardsContainer}>
            {artists.map(artist => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                isSelected={selectedArtists.has(artist.id)}
                onClick={() => toggleArtist(artist.id)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            onClick={onSkip}
            style={{
              ...styles.button,
              ...styles.skipButton,
              ':hover': undefined, // Remove hover styles as we'll handle them with CSS
            } as React.CSSProperties}
            className="skip-button"
          >
            Skip
          </button>
          <button 
            onClick={onNext}
            style={{
              ...styles.button,
              ...styles.nextButton,
              ':hover': undefined, // Remove hover styles as we'll handle them with CSS
            } as React.CSSProperties}
            className="next-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingArtistsEnhanced;