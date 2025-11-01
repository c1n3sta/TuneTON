import {
  TrendingUp,
  Compass,
  Library,
  ShoppingBag,
  Gem,
  Bot,
  Wand2,
  Sparkles,
  Waves,
  Coins as TONCoin
} from "lucide-react";

interface QuickAccessButtonProps {
  type: 'discover' | 'library' | 'nft' | 'ai-studio';
  onClick: () => void;
}

export default function QuickAccessButton({ type, onClick }: QuickAccessButtonProps) {
  switch (type) {
    case 'discover':
      return (
        <div
          className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
          onClick={onClick}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
          
          {/* Animated waves background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-100"></div>
            <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
            <Waves className="absolute top-2 right-2 w-8 h-8 text-white/30 animate-pulse" />
          </div>
          
          <div className="relative z-10 p-5 text-left">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300">
                <Compass className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                <TrendingUp className="w-3 h-3 text-white" />
                <span className="text-xs text-white font-medium">Hot</span>
              </div>
            </div>
            <h3 className="font-bold text-lg text-white drop-shadow-lg">Discover</h3>
            <p className="text-sm text-white/90 drop-shadow-md">Trending music</p>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </div>
      );

    case 'library':
      return (
        <div
          className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
          onClick={onClick}
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="relative z-10 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 backdrop-blur-sm text-purple-200 flex items-center justify-center border border-purple-400/40 shadow-lg group-hover:bg-purple-500/30 transition-all duration-300">
                <Library className="w-7 h-7" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-purple-400/60 rounded-full mt-1"></div>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-white mb-1">Library</h3>
            <p className="text-sm text-purple-200/80">Your collection</p>
            
            {/* Mini collection preview */}
            <div className="flex -space-x-2 mt-3">
              <div className="w-5 h-5 bg-purple-400 rounded border-2 border-slate-900"></div>
              <div className="w-5 h-5 bg-pink-400 rounded border-2 border-slate-900"></div>
              <div className="w-5 h-5 bg-blue-400 rounded border-2 border-slate-900"></div>
              <div className="w-5 h-5 bg-purple-300 rounded border-2 border-slate-900 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-900">+</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
        </div>
      );

    case 'nft':
      return (
        <div
          className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-lg hover:shadow-cyan-500/30 hover:shadow-2xl transition-all duration-500 hover:scale-105"
          onClick={onClick}
        >
          {/* Hexagon pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 w-6 h-6 border border-white/30 transform rotate-45"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border border-white/20 transform rotate-45 delay-150"></div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/20 transform rotate-45 -translate-x-1/2 -translate-y-1/2 animate-spin delay-300" style={{ animationDuration: '8s' }}></div>
          </div>
          
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm text-white flex items-center justify-center border border-white/40 shadow-lg group-hover:bg-white/35 transition-all duration-300 relative">
                <ShoppingBag className="w-7 h-7" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gem className="w-2 h-2 text-yellow-900" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white/90 uppercase tracking-wide">NFT</div>
                <div className="text-xs text-white/70">Shop</div>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-white mb-1">NFT Shop</h3>
            <p className="text-sm text-white/90">Audio NFTs</p>
            
            {/* Price indicator */}
            <div className="flex items-center gap-1 mt-3 bg-white/20 rounded-full px-3 py-1 w-fit">
              <TONCoin className="w-3 h-3 text-yellow-300" />
              <span className="text-xs font-medium text-white">TON</span>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-4 right-8 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 left-6 w-1 h-1 bg-white/40 rounded-full animate-ping delay-700"></div>
        </div>
      );

    case 'ai-studio':
      return (
        <div
          className="relative cursor-pointer group overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 shadow-lg hover:shadow-fuchsia-500/40 hover:shadow-2xl transition-all duration-500 hover:scale-105"
          onClick={onClick}
        >
          {/* Circuit pattern */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-3 left-3 w-8 h-1 bg-white/40"></div>
            <div className="absolute top-3 left-7 w-1 h-4 bg-white/40"></div>
            <div className="absolute top-7 left-7 w-6 h-1 bg-white/40"></div>
            <div className="absolute bottom-6 right-4 w-5 h-1 bg-white/30"></div>
            <div className="absolute bottom-6 right-6 w-1 h-3 bg-white/30"></div>
          </div>
          
          {/* Animated AI brain waves */}
          <div className="absolute top-2 right-2">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-white/40 animate-pulse"></div>
              <div className="w-1 h-2 bg-white/40 animate-pulse delay-100"></div>
              <div className="w-1 h-4 bg-white/40 animate-pulse delay-200"></div>
              <div className="w-1 h-2 bg-white/40 animate-pulse delay-300"></div>
              <div className="w-1 h-3 bg-white/40 animate-pulse delay-400"></div>
            </div>
          </div>
          
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/25 backdrop-blur-sm text-white flex items-center justify-center border border-white/40 shadow-lg group-hover:bg-white/35 transition-all duration-300 relative">
                <Bot className="w-7 h-7" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                <Wand2 className="w-3 h-3 text-white animate-pulse" />
                <span className="text-xs text-white font-medium">AI</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-white mb-1">AI Studio</h3>
            <p className="text-sm text-white/90">Create remixes</p>
            
            {/* Progress bar */}
            <div className="mt-3 bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-300 to-pink-300 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
          
          {/* Magical sparkles */}
          <div className="absolute top-6 left-12 w-2 h-2 text-white/60">
            <Sparkles className="w-full h-full animate-ping" />
          </div>
          <div className="absolute bottom-8 right-8 w-1.5 h-1.5 text-white/40">
            <Sparkles className="w-full h-full animate-ping delay-500" />
          </div>
        </div>
      );

    default:
      return null;
  }
}