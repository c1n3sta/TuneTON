import React from 'react';

// Assets provided by Figma MCP local server for node 1-96
const imgUserAvatar = 'http://localhost:3845/assets/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png';
const imgGroup = 'http://localhost:3845/assets/cbc99b61600976f9c6b4a01d507611bfdbd91f7a.svg';
const imgGroup1 = 'http://localhost:3845/assets/c7334b8743c2a2f4420dea809352c8341f0b5e96.svg';

export interface OnboardingWelcomeSlide2Props {
  onNext?: () => void;
  userName?: string;
}

const OnboardingWelcomeSlide2: React.FC<OnboardingWelcomeSlide2Props> = ({ onNext, userName }) => {
  const name =
    userName ||
    (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.first_name ||
    (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.username ||
    'Alex';

  return (
    <div
      style={{
        background: '#161b22',
        borderRadius: 16,
        padding: 24,
        color: '#c9d1d9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Top brand */}
      <div style={{ width: '100%', paddingTop: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 48, height: 48 }}>
            <img src={imgGroup} alt="logo" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#c9d1d9' }}>MelodyMix</div>
        </div>
      </div>

      {/* Middle content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '24px 0' }}>
        <div style={{ width: 64, height: 64 }}>
          <img src={imgGroup1} alt="icon" style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>AI Remix Studio</div>
        <div style={{ color: '#8b949e', fontSize: 14, textAlign: 'center', lineHeight: '1.4', maxWidth: 360 }}>
          Unleash your creativity with AI Stem Editing and
          <br />
          detailed remix controls.
        </div>
        {/* Dots (third active) */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#484f58' }} />
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#484f58' }} />
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#58a6ff' }} />
        </div>
        {/* Next button */}
        <button
          onClick={onNext}
          style={{
            background: '#58a6ff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            width: 282,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Next
        </button>
      </div>

      {/* Bottom connect */}
      <div style={{ width: '100%', paddingBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ color: '#8b949e', fontSize: 14, textAlign: 'center' }}>
          Connect to personalize your experience
        </div>
        <div
          style={{
            background: '#238636',
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            color: '#dffcf8',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundImage: `url('${imgUserAvatar}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ fontWeight: 600 }}>Welcome, {name}!</div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcomeSlide2;
