import React, { useMemo, useState } from 'react';

export interface OnboardingGenresProps {
  onNext?: (selected: string[]) => void;
  defaultSelected?: string[];
}

// A representative set of genres/artists from the Figma screen.
// You can freely expand this list; the UI supports many entries with virtual-free scrolling.
const GENRES = [
  'Pop','Rock','Hip Hop','Electronic','Jazz','Funk','Soul','House','Techno','Trance','Drum & Bass','Dubstep','Afrobeats','R&B','Indie','Alternative','Metal','Classical','Country','Reggae','Ska','Dancehall','Latin','Salsa','Bachata','K-Pop','J-Pop','World','Blues','Folk','Gospel','Disco','EDM','Lo-fi','Chillwave','Downtempo','Ambient','Synthwave','New Wave','Punk','Grunge','Trip Hop','Trap','Garage','Deep House','Tropical House','Progressive House','Hardstyle','Psytrance','Tribal','Electro','Industrial','Opera','Chanson','Swing','Symphonic Rock','Surf Rock','Thrash Metal'
];

const circleColors = [
  '#ff7f50','#1f6feb','#db61a2','#f0883e','#8b949e','#7ee787','#d2a8ff','#58a6ff','#ff6f91','#2ea043','#f85149','#a5d6ff','#79c0ff','#ffb86b','#f8d847'
];

const OnboardingGenres: React.FC<OnboardingGenresProps> = ({ onNext, defaultSelected }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected ?? []));

  const items = useMemo(() => GENRES.map((name, i) => ({
    name,
    size: [72, 96, 120][i % 3],
    color: circleColors[i % circleColors.length],
  })), []);

  const toggle = (name: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(name)) s.delete(name); else s.add(name);
      return s;
    });
  };

  const proceed = () => onNext?.(Array.from(selected));

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: 400, borderRadius: 16, overflow: 'hidden', background: '#161b22', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', textAlign: 'center', color: '#fff', fontSize: 20, fontFamily: 'Cabin, system-ui, sans-serif' }}>Discover Your Sound</div>
        <div style={{ padding: '0 24px 12px', textAlign: 'center', color: '#aaaaaa', fontSize: 14 }}>Select genres that define your musical journey.</div>

        {/* Scrollable cloud */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', maxHeight: '65vh' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {items.map(({ name, size, color }) => {
              const active = selected.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    border: active ? '2px solid #fff' : '2px solid transparent',
                    background: color,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: size === 72 ? 12 : size === 96 ? 14 : 16,
                    cursor: 'pointer',
                  }}
                  aria-pressed={active}
                >
                  <span style={{ padding: '0 6px', lineHeight: 1.1 }}>{name.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ padding: 16 }}>
          <button
            onClick={proceed}
            style={{
              width: '100%',
              background: '#ff4500',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 20px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Next
          </button>
          <div style={{ color: '#8b949e', fontSize: 12, textAlign: 'center', marginTop: 8 }}>{selected.size} selected</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGenres;
