import { ArrowLeft, Settings, Edit, Star, Wallet, TrendingUp, Gift, Eye } from "lucide-react";
import svgPaths from "../imports/svg-n5jrz1crdo";
import imgUserAvatar from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgNft from "figma:asset/6aa1bca09cfd5686a63ce1963cf201a63c1d873d.png";
import imgNft1 from "figma:asset/8cb97999a364792fa2b921da0476d4b3c463d5bd.png";
import imgNft2 from "figma:asset/2da314c036af7e34d758806293d6755224f3ee49.png";
import imgTrackCover from "figma:asset/5f2e6cf5ce46e8c46e99ccb52801bd492da3929d.png";
import imgTrackCover1 from "figma:asset/cb5e6abbe13fd21efcd0485f3f8147c3aa3b3aa8.png";
import BottomNavigation from "./BottomNavigation";

interface UserProfileProps {
  onNavigate?: (tab: string, page?: string) => void;
  user?: any;
}

export default function UserProfile({ onNavigate, user }: UserProfileProps) {
  const handleBack = () => {
    onNavigate?.("Home", "home");
  };

  const handleEditProfile = () => {
    // In real app, this would open edit profile modal
    console.log("Edit profile");
  };

  const handleViewPublicProfile = () => {
    onNavigate?.("Home", "public-profile");
  };

  const handleManageWallets = () => {
    // In real app, this would navigate to wallet management
    console.log("Manage wallets");
  };

  const handleConvertStars = () => {
    // In real app, this would open conversion interface
    console.log("Convert stars to Toncoin");
  };

  const handleGiftStars = () => {
    // In real app, this would open gift interface
    console.log("Gift stars");
  };

  const handleSettings = () => {
    onNavigate?.("Profile", "settings");
  };

  const handleNavigation = (tab: string) => {
    onNavigate?.(tab);
  };

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#c9d1d9]" />
          </button>
          
          <div>
            <h1 className="text-[#c9d1d9] text-lg font-semibold">Profile & Settings</h1>
          </div>
          
          <button onClick={handleSettings} className="p-1">
            <Settings className="w-6 h-6 text-[#c9d1d9]" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="mx-6 mb-6 bg-[#161b22] rounded-lg p-5 flex flex-col items-center gap-3">
          <div 
            className="w-20 h-20 rounded-full bg-center bg-cover"
            style={{ backgroundImage: `url('${imgUserAvatar}')` }}
          />
          <div className="text-center">
            <h2 className="text-[#c9d1d9] text-base font-semibold">{user?.first_name || "Alex Johnson"}</h2>
            <p className="text-[#8b949e] text-sm">@{user?.username || "alexj_music"}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-1 text-[#ff22fb] text-sm font-semibold"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
            <button 
              onClick={handleViewPublicProfile}
              className="flex items-center gap-1 text-[#c9d1d9] text-sm font-semibold hover:text-[#ff22fb] transition-colors"
            >
              <Eye className="w-4 h-4" />
              How my profile looks
            </button>
          </div>
        </div>

        {/* NFT Gallery */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#c9d1d9] text-base font-semibold">NFT Gallery</h3>
            <button 
              className="text-[#ff22fb] text-sm font-semibold"
              onClick={() => onNavigate?.("Home", "my-nfts")}
            >
              View All
            </button>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#161b22] rounded-lg p-2 flex-1">
              <div 
                className="w-full h-[90px] rounded-lg mb-2 bg-center bg-cover"
                style={{ 
                  backgroundImage: `url('${imgNft}')`,
                  backgroundSize: '100% 129.63%',
                  backgroundPosition: '0% 50%'
                }}
              />
              <p className="text-[#c9d1d9] text-xs text-center font-semibold">Groove Guardian</p>
            </div>
            <div className="bg-[#161b22] rounded-lg p-2 flex-1">
              <div 
                className="w-full h-[90px] rounded-lg mb-2 bg-center bg-cover"
                style={{ 
                  backgroundImage: `url('${imgNft1}')`,
                  backgroundSize: '100% 122.14%',
                  backgroundPosition: '0% 50%'
                }}
              />
              <p className="text-[#c9d1d9] text-xs text-center font-semibold">Rhythm Rider</p>
            </div>
            <div className="bg-[#161b22] rounded-lg p-2 flex-1">
              <div 
                className="w-full h-[90px] rounded-lg mb-2 bg-center bg-cover"
                style={{ 
                  backgroundImage: `url('${imgNft2}')`,
                  backgroundSize: '144.43% 100%',
                  backgroundPosition: '50% 0%'
                }}
              />
              <p className="text-[#c9d1d9] text-xs text-center font-semibold">Sound Sorcerer</p>
            </div>
          </div>
        </div>

        {/* Your Badges */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#c9d1d9] text-base font-semibold">Your Badges</h3>
            <button className="text-[#ff22fb] text-sm font-semibold">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#484f58] rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28">
                <path
                  d={svgPaths.p30860120}
                  stroke="#D29922"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.33333"
                />
                <path
                  d={svgPaths.pe723a00}
                  stroke="#D29922"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.33333"
                />
              </svg>
              <span className="text-[#c9d1d9] text-base font-semibold">Top Remixer</span>
            </div>
            <div className="bg-[#484f58] rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28">
                <path
                  d={svgPaths.pce8aa00}
                  stroke="#FF22FB"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.33333"
                />
              </svg>
              <span className="text-[#c9d1d9] text-base font-semibold">Playlist Pro</span>
            </div>
            <div className="bg-[#484f58] rounded-xl px-4 py-2.5 flex items-center gap-2.5 col-span-2">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 28 28">
                <path
                  d={svgPaths.pe6b2c00}
                  stroke="#2EA043"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.33333"
                />
              </svg>
              <span className="text-[#c9d1d9] text-base font-semibold">Daily Listener</span>
            </div>
          </div>
        </div>

        {/* Listening Analytics */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#c9d1d9] text-base font-semibold">Listening Analytics</h3>
            <button 
              className="text-[#ff22fb] text-sm font-semibold"
              onClick={() => onNavigate?.("Home", "rankings")}
            >
              Rankings
            </button>
          </div>
          <div className="bg-[#161b22] rounded-lg p-4 flex justify-between">
            <div className="text-center">
              <div className="text-[#ff22fb] text-base font-semibold">120 hrs</div>
              <div className="text-[#8b949e] text-xs">Total Listening</div>
            </div>
            <div className="text-center">
              <div className="text-[#ff22fb] text-base font-semibold">Pop</div>
              <div className="text-[#8b949e] text-xs">Top Genre</div>
            </div>
            <div className="text-center">
              <div className="text-[#ff22fb] text-base font-semibold">15</div>
              <div className="text-[#8b949e] text-xs">Remixes Created</div>
            </div>
          </div>
        </div>

        {/* Hottest Tracks */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#c9d1d9] text-base font-semibold">Hottest Tracks</h3>
            <button 
              className="text-[#ff22fb] text-sm font-semibold"
              onClick={() => onNavigate?.("Library")}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div className="bg-[#161b22] rounded-lg p-3 flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded bg-center bg-cover"
                style={{ backgroundImage: `url('${imgTrackCover}')` }}
              />
              <div className="flex-1">
                <h4 className="text-[#c9d1d9] text-sm font-semibold">Midnight Groove</h4>
                <p className="text-[#8b949e] text-xs">Electro Vibes</p>
              </div>
              <div className="text-[#8b949e] text-xs">1.2K Plays</div>
            </div>
            <div className="bg-[#161b22] rounded-lg p-3 flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded bg-center bg-cover"
                style={{ 
                  backgroundImage: `url('${imgTrackCover1}')`,
                  backgroundSize: '154.73% 100%',
                  backgroundPosition: '50% 0%'
                }}
              />
              <div className="flex-1">
                <h4 className="text-[#c9d1d9] text-sm font-semibold">Sunrise Serenity</h4>
                <p className="text-[#8b949e] text-xs">Acoustic Dreams</p>
              </div>
              <div className="text-[#8b949e] text-xs">980 Plays</div>
            </div>
          </div>
        </div>

        {/* Blockchain Transactions */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#c9d1d9] text-base font-semibold">Blockchain Transactions</h3>
            <button className="text-[#ff22fb] text-sm font-semibold">View All</button>
          </div>
          <div className="space-y-3">
            <div className="bg-[#161b22] rounded-lg p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ff4400] rounded-[18px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#FF22FB]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[#c9d1d9] text-sm font-semibold">Gifted 50 Stars to @friend_x</h4>
                <p className="text-[#8b949e] text-xs">2 hours ago</p>
              </div>
              <div className="text-[#c9d1d9] text-sm font-semibold">-50 Stars</div>
            </div>
            <div className="bg-[#161b22] rounded-lg p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ff4400] rounded-[18px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#D29922]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[#c9d1d9] text-sm font-semibold">NFT Trade: "Groove Guardian"</h4>
                <p className="text-[#8b949e] text-xs">Yesterday</p>
              </div>
              <div className="text-[#c9d1d9] text-sm font-semibold">+0.5 TON</div>
            </div>
          </div>
        </div>

        {/* Wallet Integration */}
        <div className="px-6 mb-6">
          <div className="bg-[#161b22] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#c9d1d9] text-base font-semibold">Wallet Integration</h3>
              <button 
                onClick={handleManageWallets}
                className="flex items-center gap-1 text-[#ff22fb] text-sm font-semibold"
              >
                <Wallet className="w-5 h-5" />
                Add Wallet
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-6 h-6 text-[#c9d1d9]" />
                <span className="text-[#c9d1d9] text-base font-semibold">1.25 TON</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <path
                    d={svgPaths.p2875c4c0}
                    stroke="#C9D1D9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-[#c9d1d9] text-base font-semibold">0.003 ETH</span>
              </div>
              <button 
                onClick={handleManageWallets}
                className="w-full bg-[#ff4400] text-[#dffcf8] py-2.5 rounded-md text-sm font-semibold"
              >
                Manage Wallets
              </button>
            </div>
          </div>
        </div>

        {/* Your Stars Balance */}
        <div className="px-6 mb-6">
          <h3 className="text-[#c9d1d9] text-base font-semibold mb-4">Your Stars Balance</h3>
          <div className="bg-[#161b22] rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-[#D29922]" />
              <span className="text-[#c9d1d9] text-base font-semibold">1250 Stars</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleConvertStars}
                className="flex-1 bg-[#ff4400] text-[#dffcf8] py-2.5 px-4 rounded-md text-sm font-semibold flex items-center gap-1.5"
              >
                <TrendingUp className="w-4 h-4" />
                Convert to Toncoin
              </button>
              <button 
                onClick={handleGiftStars}
                className="flex-1 bg-[#ff4400] text-[#dffcf8] py-2.5 px-4 rounded-md text-sm font-semibold flex items-center gap-1.5"
              >
                <Gift className="w-4 h-4" />
                Gift Stars
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <h3 className="text-[#c9d1d9] text-base font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onNavigate?.("Home", "nft-marketplace")}
              className="bg-[#161b22] rounded-lg p-4 text-left hover:bg-[#21262d] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#ff22fb] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎨</span>
                </div>
                <span className="text-[#c9d1d9] text-sm font-semibold">NFT Shop</span>
              </div>
              <p className="text-[#8b949e] text-xs">Buy & sell audio NFTs</p>
            </button>
            
            <button 
              onClick={() => onNavigate?.("Home", "ai-studio")}
              className="bg-[#161b22] rounded-lg p-4 text-left hover:bg-[#21262d] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#ff4400] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <span className="text-[#c9d1d9] text-sm font-semibold">AI Studio</span>
              </div>
              <p className="text-[#8b949e] text-xs">Create smart remixes</p>
            </button>
            
            <button 
              onClick={() => onNavigate?.("Contests", "contests")}
              className="bg-[#161b22] rounded-lg p-4 text-left hover:bg-[#21262d] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#D29922] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <span className="text-[#c9d1d9] text-sm font-semibold">Contests</span>
              </div>
              <p className="text-[#8b949e] text-xs">Join remix competitions</p>
            </button>
            
            <button 
              onClick={() => onNavigate?.("Library")}
              className="bg-[#161b22] rounded-lg p-4 text-left hover:bg-[#21262d] transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#2EA043] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                <span className="text-[#c9d1d9] text-sm font-semibold">Library</span>
              </div>
              <p className="text-[#8b949e] text-xs">Your music collection</p>
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation 
        activeTab="Profile"
        onNavigate={handleNavigation}
      />
    </div>
  );
}