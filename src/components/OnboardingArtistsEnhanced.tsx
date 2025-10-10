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
};

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
};

// Artist data with exact positions from Figma
const ARTISTS = [
  {
    id: 'weeknd',
    name: 'The Weeknd',
    avatar: 'http://localhost:3845/assets/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png',
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
    avatar: 'http://localhost:3845/assets/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png',
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
    avatar: 'http://localhost:3845/assets/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png',
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
    avatar: 'http://localhost:3845/assets/2c1ea409c4a8bfeb11753d30276fdd21b9e259ae.png',
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
    avatar: 'http://localhost:3845/assets/fe77acbd3c2d9b2551ab121351073eed5eec763a.png',
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
    avatar: 'http://localhost:3845/assets/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png',
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
    avatar: 'http://localhost:3845/assets/02641910bdc93d1d98cf6da313c9fe42f75a5679.png',
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
    avatar: 'http://localhost:3845/assets/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png',
    position: {
      top: '50.5%',
      left: '54.36%',
      rotate: '352deg',
      width: '100px',
      height: '120px'
    }
  }
];

interface ArtistCardProps {
  artist: typeof ARTISTS[0];
  isSelected: boolean;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, isSelected, onClick }) => {
  const { position } = artist;
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
            {ARTISTS.map(artist => (
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
