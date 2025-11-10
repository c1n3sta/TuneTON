import { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Sliders, 
  Zap, 
  Heart, 
  Users, 
  Trophy, 
  Coins, 
  ChevronRight, 
  ChevronLeft,
  Music,
  Headphones,
  Radio,
  Sparkles,
  Star,
  Gift,
  Share2,
  ArrowRight,
  Volume2,
  Mic,
  AudioWaveform,
  Clock,
  Palette,
  Layers,
  Waveform,
  Bot
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface OnboardingPageProps {
  onComplete: () => void;
  onTelegramConnect?: () => void;
}

export default function OnboardingPage({ onComplete, onTelegramConnect }: OnboardingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animateWaveform, setAnimateWaveform] = useState(false);
  const [stemSeparation, setStemSeparation] = useState(false);

  const slides = [
    {
      id: "welcome",
      title: "Welcome to TunTON",
      subtitle: "The Future of Music Streaming",
      description: "Transform any track in real-time with professional audio effects. Experience music like never before.",
      icon: <Music className="w-12 h-12 text-[#ff22fb]" />,
      animation: "fadeIn"
    },
    {
      id: "mix-mode",
      title: "MIX Mode Studio",
      subtitle: "Your Personal Audio Laboratory",
      description: "Real-time tempo control, pitch shifting, lo-fi effects, and background ambience. Make every song uniquely yours.",
      icon: <Zap className="w-12 h-12 text-[#ff6500]" />,
      animation: "slideFromRight"
    },
    {
      id: "ai-stem",
      title: "AI STEM Separation",
      subtitle: "Isolate Any Sound Element",
      description: "Remove vocals, isolate instruments, or emphasize specific parts using advanced AI technology. Perfect for remixing and karaoke.",
      icon: <Layers className="w-12 h-12 text-[#00ff88]" />,
      animation: "slideFromLeft"
    },
    {
      id: "social",
      title: "Social Music Community",
      subtitle: "Share, Compete & Discover",
      description: "Join remix contests, share custom presets, earn TON rewards, and discover amazing creations from the community.",
      icon: <Users className="w-12 h-12 text-[#4444ff]" />,
      animation: "fadeIn"
    },
    {
      id: "blockchain",
      title: "TON Blockchain Powered",
      subtitle: "Transparent & Rewarding",
      description: "Earn Toncoin rewards for participation, trade NFT presets, and enjoy transparent artist royalty distribution.",
      icon: <Coins className="w-12 h-12 text-[#ffd700]" />,
      animation: "slideFromRight"
    },
    {
      id: "telegram",
      title: "Telegram Integration",
      subtitle: "Seamless Social Experience",
      description: "Connect with your Telegram account for instant access, share mixes in chats, and earn Stars for achievements.",
      icon: <Share2 className="w-12 h-12 text-[#0088cc]" />,
      animation: "slideFromLeft"
    }
  ];

  const features = [
    { icon: <Volume2 className="w-5 h-5" />, text: "Real-time Audio Effects" },
    { icon: <Layers className="w-5 h-5" />, text: "AI Stem Separation" },
    { icon: <Radio className="w-5 h-5" />, text: "Lo-Fi & Vintage Modes" },
    { icon: <Clock className="w-5 h-5" />, text: "Tempo & Pitch Control" },
    { icon: <Palette className="w-5 h-5" />, text: "Background Ambience" },
    { icon: <Star className="w-5 h-5" />, text: "Social Challenges" }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAnimateWaveform(!animateWaveform);
  };

  const toggleStemSeparation = () => {
    setStemSeparation(!stemSeparation);
  };

  const handleGetStarted = () => {
    if (onTelegramConnect) {
      onTelegramConnect();
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    // Auto-advance slides for demo (optional)
    const timer = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 6000);
    
    return () => clearInterval(timer);
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="bg-[#0d1117] min-h-screen text-white overflow-hidden">
      <div className="flex justify-center">
        <div className="w-[400px] bg-[#161b22] rounded-2xl min-h-screen relative overflow-hidden border border-[#30363d]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-[#30363d]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ff22fb] to-[#ff6500] rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-[18px] font-medium text-[#c9d1d9]">TunTON</h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-[#8b949e] hover:text-[#ff22fb] hover:bg-[#30363d] bg-transparent border-none"
            >
              Skip
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="px-6 py-8 space-y-8">
            {/* Slide Indicator */}
            <div className="flex justify-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 bg-[#ff22fb]' 
                      : 'w-2 bg-[#484f58]'
                  }`}
                />
              ))}
            </div>

            {/* Slide Content */}
            <div className="text-center space-y-6 min-h-[400px] flex flex-col justify-center">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-[#21262d] rounded-2xl flex items-center justify-center border border-[#30363d]">
                  {currentSlideData.icon}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h2 className="text-[28px] font-medium text-[#c9d1d9] leading-tight">{currentSlideData.title}</h2>
                <p className="text-[16px] text-[#ff22fb]">{currentSlideData.subtitle}</p>
              </div>

              {/* Description */}
              <p className="text-[14px] text-[#8b949e] leading-relaxed px-4">
                {currentSlideData.description}
              </p>

              {/* Interactive Demo for MIX Mode slide */}
              {currentSlide === 1 && (
                <div className="bg-[#21262d] rounded-xl p-4 space-y-4 border border-[#30363d]">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 bg-[#ff22fb] rounded-full flex items-center justify-center text-white hover:bg-[#e91e63] transition-colors shadow-[0_4px_16px_rgba(255,34,251,0.3)]"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-medium text-[#c9d1d9]">Try MIX Mode</p>
                      <p className="text-[12px] text-[#8b949e]">Tap to hear the difference</p>
                    </div>
                  </div>
                  
                  {/* Animated Waveform */}
                  <div className="flex items-center justify-center gap-1">
                    {[8, 12, 16, 20, 14, 18, 22, 12, 16, 10, 14, 18, 12, 16, 8].map((height, i) => (
                      <div
                        key={i}
                        className={`bg-[#ff6500] rounded-sm w-1 transition-all duration-200 ${
                          animateWaveform ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          height: `${height}px`,
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* AI STEM Separation Demo */}
              {currentSlide === 2 && (
                <div className="bg-[#21262d] rounded-xl p-4 space-y-4 border border-[#30363d]">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={toggleStemSeparation}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg ${
                        stemSeparation 
                          ? 'bg-[#00ff88] text-black' 
                          : 'bg-[#30363d] text-[#8b949e] hover:bg-[#484f58]'
                      }`}
                    >
                      <Layers className="w-5 h-5" />
                    </button>
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-medium text-[#c9d1d9]">AI STEM Separation</p>
                      <p className="text-[12px] text-[#8b949e]">{stemSeparation ? 'Vocals isolated' : 'Tap to isolate vocals'}</p>
                    </div>
                  </div>
                  
                  {/* STEM Visualization */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`bg-[#161b22] rounded-lg p-3 border transition-all duration-200 ${
                      stemSeparation ? 'border-[#00ff88] bg-[rgba(0,255,136,0.1)]' : 'border-[#30363d]'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-[12px] text-[#c9d1d9] font-medium">Vocals</span>
                      </div>
                      <div className="flex items-end gap-1 h-8">
                        {[6, 10, 8, 12, 9, 11].map((height, i) => (
                          <div
                            key={i}
                            className={`rounded-sm w-1 transition-all duration-300 ${
                              stemSeparation ? 'bg-[#00ff88]' : 'bg-[#484f58]'
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className={`bg-[#161b22] rounded-lg p-3 border transition-all duration-200 ${
                      stemSeparation ? 'border-[#30363d] opacity-50' : 'border-[#30363d]'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <AudioWaveform className="w-4 h-4 text-[#4444ff]" />
                        <span className="text-[12px] text-[#c9d1d9] font-medium">Instruments</span>
                      </div>
                      <div className="flex items-end gap-1 h-8">
                        {[4, 7, 5, 9, 6, 8].map((height, i) => (
                          <div
                            key={i}
                            className={`rounded-sm w-1 transition-all duration-300 ${
                              stemSeparation ? 'bg-[#484f58]' : 'bg-[#4444ff]'
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Grid for Social slide */}
              {currentSlide === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  {features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="bg-[#21262d] rounded-lg p-3 flex items-center gap-2 border border-[#30363d]">
                      <div className="text-[#4444ff]">
                        {feature.icon}
                      </div>
                      <span className="text-[12px] text-[#c9d1d9]">{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TON Benefits for Blockchain slide */}
              {currentSlide === 4 && (
                <div className="space-y-3">
                  {[
                    { icon: <Trophy className="w-5 h-5" />, text: "Earn TON rewards for contests", color: "#ffd700" },
                    { icon: <Heart className="w-5 h-5" />, text: "Trade NFT audio presets", color: "#ff22fb" },
                    { icon: <Sparkles className="w-5 h-5" />, text: "Transparent artist royalties", color: "#00ff88" }
                  ].map((benefit, index) => (
                    <div key={index} className="bg-[#21262d] rounded-lg p-3 flex items-center gap-3 border border-[#30363d]">
                      <div style={{ color: benefit.color }}>
                        {benefit.icon}
                      </div>
                      <span className="text-[14px] text-[#c9d1d9]">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Telegram Integration Demo */}
              {currentSlide === 5 && (
                <div className="bg-gradient-to-r from-[rgba(0,136,204,0.1)] to-[rgba(255,34,251,0.1)] rounded-xl p-4 space-y-3 border border-[rgba(0,136,204,0.3)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-[#c9d1d9]">Telegram Mini App</p>
                      <p className="text-[12px] text-[#8b949e]">No installation required</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div className="bg-[rgba(255,215,0,0.1)] rounded-lg p-2 text-center border border-[rgba(255,215,0,0.3)]">
                      <Star className="w-4 h-4 mx-auto mb-1 text-[#ffd700]" />
                      <span className="text-[#c9d1d9]">Earn Stars</span>
                    </div>
                    <div className="bg-[rgba(0,255,136,0.1)] rounded-lg p-2 text-center border border-[rgba(0,255,136,0.3)]">
                      <Gift className="w-4 h-4 mx-auto mb-1 text-[#00ff88]" />
                      <span className="text-[#c9d1d9]">Get Gifts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-6 right-6">
            <div className="flex items-center justify-between gap-4">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`w-12 h-12 rounded-full border border-[#30363d] bg-[#21262d] flex items-center justify-center transition-colors ${
                  currentSlide === 0 
                    ? 'text-[#484f58] cursor-not-allowed' 
                    : 'text-[#8b949e] hover:text-[#ff22fb] hover:border-[#ff22fb]'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main CTA */}
              {currentSlide === slides.length - 1 ? (
                <button 
                  onClick={handleGetStarted}
                  className="flex-1 bg-gradient-to-r from-[#ff22fb] to-[#ff6500] hover:from-[#e91e63] hover:to-[#ff5500] px-4 py-3 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  Connect Telegram
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={nextSlide}
                  className="flex-1 bg-[#ff22fb] hover:bg-[#e91e63] px-4 py-3 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg font-medium"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className={`w-12 h-12 rounded-full border border-[#30363d] bg-[#21262d] flex items-center justify-center transition-colors ${
                  currentSlide === slides.length - 1 
                    ? 'text-[#484f58] cursor-not-allowed' 
                    : 'text-[#8b949e] hover:text-[#ff22fb] hover:border-[#ff22fb]'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Background Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-10 w-20 h-20 bg-[rgba(255,34,251,0.05)] rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 -right-10 w-16 h-16 bg-[rgba(255,101,0,0.05)] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[rgba(0,255,136,0.05)] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}