import React, { useState } from 'react';

// Artist data with their avatar URLs and names
const ARTISTS = [
  { id: 'weeknd', name: 'The Weeknd', avatar: 'http://localhost:3845/assets/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png' },
  { id: 'beyonce', name: 'Beyoncé', avatar: 'http://localhost:3845/assets/2c1ea409c4a8bfeb11753d30276fdd21b9e259ae.png' },
  { id: 'sza', name: 'SZA', avatar: 'http://localhost:3845/assets/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png' },
  { id: 'rihanna', name: 'Rihanna', avatar: 'http://localhost:3845/assets/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png' },
  { id: 'frank', name: 'Frank Ocean', avatar: 'http://localhost:3845/assets/fe77acbd3c2d9b2551ab121351073eed5eec763a.png' },
  { id: 'drake', name: 'Drake', avatar: 'http://localhost:3845/assets/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png' },
  { id: 'dojacat', name: 'Doja Cat', avatar: 'http://localhost:3845/assets/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png' },
  { id: 'bruno', name: 'Bruno Mars', avatar: 'http://localhost:3845/assets/02641910bdc93d1d98cf6da313c9fe42f75a5679.png' },
];

// Card rotation and positioning for the "thrown on table" look
const CARD_POSITIONS = [
  { rotate: '355deg', size: '180px', width: '160px', top: '3.37%', left: '2.85%' },
  { rotate: '8deg', size: '150px', width: '130px', top: '-1.22%', left: '55.28%' },
  { rotate: '2deg', size: '120px', width: '100px', top: '14.46%', left: '39.41%' },
  { rotate: '12deg', size: '180px', width: '160px', top: '19.9%', left: '39.73%' },
  { rotate: '350deg', size: '150px', width: '130px', top: '24.9%', left: '6.58%' },
  { rotate: '7deg', size: '150px', width: '130px', top: '43%', left: '2.54%' },
  { rotate: '357deg', size: '120px', width: '100px', top: '40.7%', left: '50%' },
  { rotate: '352deg', size: '120px', width: '100px', top: '50.5%', left: '54.36%' },
];

interface OnboardingArtistsProps {
  onNext?: () => void;
  onSkip?: () => void;
}

const OnboardingArtists: React.FC<OnboardingArtistsProps> = ({ onNext, onSkip }) => {
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
    <div className="bg-[#0d1117] min-h-screen flex justify-center p-5">
      <div className="relative w-full max-w-[400px] h-[680px] bg-[#0d1117] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <h1 className="text-[#c9d1d9] text-lg font-semibold">TuneTON</h1>
        </div>

        {/* Content */}
        <div className="h-full pt-16 pb-28 px-6 overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#c9d1d9] mb-2">Who are your favorite artists?</h2>
            <p className="text-[#8b949e] text-base">Select artists to refine your recommendations.</p>
          </div>

          {/* Artist Cards Container */}
          <div className="relative w-full h-[450px]">
            {ARTISTS.map((artist, index) => {
              const position = CARD_POSITIONS[index % CARD_POSITIONS.length];
              const isSelected = selectedArtists.has(artist.id);
              
              return (
                <div 
                  key={artist.id}
                  className={`absolute transition-all duration-200 ${isSelected ? 'z-50 scale-105 shadow-lg' : 'hover:z-30 hover:scale-105'}`}
                  style={{
                    top: position.top,
                    left: position.left,
                    transform: `rotate(${position.rotate})`,
                    width: position.width,
                    height: position.size,
                  }}
                  onClick={() => toggleArtist(artist.id)}
                >
                  <div className={`w-full h-full bg-[#161b22] rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-200 ${isSelected ? 'ring-2 ring-[#ff22fb]' : ''}`}>
                    <div 
                      className="rounded-full bg-cover bg-center mb-2" 
                      style={{
                        backgroundImage: `url(${artist.avatar})`,
                        width: '80px',
                        height: '80px',
                        backgroundSize: 'cover',
                      }}
                    />
                    <p className="text-[#c9d1d9] text-sm font-semibold text-center">
                      {artist.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-4">
          <button 
            onClick={onSkip}
            className="flex-1 bg-[#484f58] text-white py-3 px-6 rounded-lg font-medium text-base"
          >
            Skip
          </button>
          <button 
            onClick={onNext}
            className="flex-1 bg-[#ff22fb] text-white py-3 px-6 rounded-lg font-medium text-base"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingArtists;
