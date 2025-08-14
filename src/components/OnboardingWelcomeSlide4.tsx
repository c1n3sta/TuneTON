import React from 'react';

// Assets from Figma MCP local server for node 1-185
const imgGift = 'http://localhost:3845/assets/2b38cd1c5a3c479dca93e2816f9e8772d32c7d2e.svg';

export interface OnboardingWelcomeSlide4Props {
  onNext?: () => void; // triggered by "Start your Free Trial"
  onSkip?: () => void; // optional Skip action
}

const OnboardingWelcomeSlide4: React.FC<OnboardingWelcomeSlide4Props> = ({ onNext, onSkip }) => {
  return (
    <div
      style={{
        background: '#0d1117',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#161b22',
          width: 400,
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 680,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Top bar with brand and skip */}
        <div style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 32px', alignItems: 'center' }}>
          <div style={{ color: '#c9d1d9', fontSize: 18, fontWeight: 600 }}>TuneTON</div>
          <button onClick={onSkip} style={{ background: 'transparent', border: 'none', color: '#8b949e', fontSize: 14, cursor: 'pointer' }}>Skip</button>
        </div>

        {/* Content */}
        <div style={{ marginTop: 80, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {/* Gift icon */}
          <div style={{ width: 100, height: 100, background: '#ff4400', borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={imgGift} alt="gift" style={{ width: 56, height: 56 }} />
          </div>

          {/* Headline */}
          <div style={{ color: '#c9d1d9', fontSize: 32, fontWeight: 600, textAlign: 'center', lineHeight: '1.15', maxWidth: 322 }}>
            <div>Welcome Gift: Enjoy 2</div>
            <div>Months of TuneTON</div>
            <div>for Free!</div>
          </div>

          {/* Description */}
          <div style={{ color: '#8b949e', fontSize: 16, textAlign: 'center', lineHeight: '24px', maxWidth: 300 }}>
            <div>Claim your exclusive welcome gift!</div>
            <div>Enjoy 2 months of TuneTON for free.</div>
            <div>Dive into personalized real-time track</div>
            <div>editing, access a vast music library, and</div>
            <div>effortlessly save, share, and remix</div>
            <div>music with friends. Explore AI-powered</div>
            <div>vocal/instrument separation, seamless</div>
            <div>Telegram integration, and exciting</div>
            <div>gamification with rewards and NFTs.</div>
          </div>

          {/* CTA */}
          <div style={{ width: 280, marginTop: 8 }}>
            <button
              onClick={onNext}
              style={{
                width: '100%',
                background: '#ff4400',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                padding: '14px 24px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Start your Free Trial
            </button>
          </div>
          <div style={{ height: 15 }} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcomeSlide4;
