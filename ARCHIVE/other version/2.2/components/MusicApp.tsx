import { useState, useEffect } from "react";
import HomePage from "./HomePage";
import BottomNavigation from "./BottomNavigation";
import MusicPlayer from "./MusicPlayer";
import PlaylistDetail from "./PlaylistDetail";
import ContestsPage from "./ContestsPage";
import ContestDetail from "./ContestDetail";
import UserProfile from "./UserProfile";
import PublicProfile from "./PublicProfile";
import SettingsPage from "./SettingsPage";
import NFTMarketplace from "./NFTMarketplace";
import NFTDetail from "./NFTDetail";
import CreateNFT from "./CreateNFT";
import MyNFTs from "./MyNFTs";
import NFTAuction from "./NFTAuction";
import RemixDetail from "./RemixDetail";
import AIStudio from "./AIStudio";
import ArtistPage from "./ArtistPage";
import RankingPage from "./RankingPage";
import DetailRankingPage from "./DetailRankingPage";
import OnboardingPage from "./OnboardingPage";
import SearchPage from "./SearchPage";
import DiscoverPage from "./DiscoverPage";
import LibraryPage from "./LibraryPage";
import JamendoTest from "./JamendoTest";
import JamendoOAuthCallback from "./JamendoOAuthCallback";
import { SwipeNavigationProvider } from "./SwipeNavigationProvider";

interface User {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export default function MusicApp() {
  const [activeTab, setActiveTab] = useState("Home");
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [currentTrack, setCurrentTrack] = useState("Starlight Serenade");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for OAuth callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is an OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');
      const oauthError = urlParams.get('error');
      
      if (authCode || oauthError || window.location.pathname.includes('/oauth/jamendo')) {
        setCurrentPage('oauth-callback');
        return;
      }
    }
  }, []);

  // Check for Telegram WebApp initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      
      if (tg) {
        tg.ready();
        
        if (tg.initDataUnsafe?.user) {
          const telegramUser = tg.initDataUnsafe.user;
          setUser({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            username: telegramUser.username,
            photo_url: telegramUser.photo_url,
            is_premium: telegramUser.is_premium
          });
          setIsAuthenticated(true);
          
          const hasCompletedOnboarding = localStorage.getItem('tunton_onboarding_completed');
          if (!hasCompletedOnboarding) {
            setShowOnboarding(true);
          }
        }
      } else {
        // Development mode - create mock user
        const mockUser = {
          id: 12345,
          first_name: "Dev User",
          username: "devuser",
          is_premium: false
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        
        const hasCompletedOnboarding = localStorage.getItem('tunton_onboarding_completed');
        if (!hasCompletedOnboarding) {
          setShowOnboarding(true);
        }
      }
    }
  }, []);

  const handleTelegramConnect = async () => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      
      if (tg) {
        if (!user && tg.initDataUnsafe?.user) {
          const telegramUser = tg.initDataUnsafe.user;
          setUser({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            username: telegramUser.username,
            photo_url: telegramUser.photo_url,
            is_premium: telegramUser.is_premium
          });
        }
        setIsAuthenticated(true);
        handleOnboardingComplete();
      } else {
        // Fallback for development
        const mockUser = {
          id: 12345,
          first_name: "Dev User",
          username: "devuser",
          is_premium: false
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        handleOnboardingComplete();
      }
    } catch (error) {
      console.error('Telegram connection failed:', error);
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('tunton_onboarding_completed', 'true');
    setActiveTab("Home");
    setCurrentPage("home");
  };

  const handleNavigation = (tab: string, page?: string) => {
    console.log('Navigation called:', tab, page);
    setActiveTab(tab);
    
    if (page) {
      setCurrentPage(page);
    } else {
      // Map tabs to their default pages
      const tabPageMap: { [key: string]: string } = {
        "Home": "home",
        "Library": "library",
        "Player": "player", 
        "Contests": "contests",
        "Profile": "profile",
        "Search": "search",
        "Discover": "discover",
        "NFT": "nft-marketplace"
      };
      setCurrentPage(tabPageMap[tab] || "home");
    }
  };

  const handleTrackChange = (track: string) => {
    setCurrentTrack(track);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Pages that should not show bottom navigation
  const pagesWithoutBottomNav = [
    "player", "onboarding", "settings", "nft-detail", 
    "create-nft", "my-nfts", "nft-auction", "remix-detail", 
    "ai-studio", "artist-page", "contest-detail",
    "playlist-detail", "public-profile", "rankings",
    "ranking-detail", "search"
  ];

  const shouldShowBottomNav = !pagesWithoutBottomNav.includes(currentPage);

  // Show onboarding if user hasn't completed it
  if (showOnboarding) {
    return (
      <OnboardingPage 
        onComplete={handleOnboardingComplete}
        onTelegramConnect={handleTelegramConnect}
      />
    );
  }

  // Main app content
  return (
    <SwipeNavigationProvider onNavigate={handleNavigation}>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        {currentPage === "home" && (
          <HomePage 
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            user={user}
          />
        )}
        
        {currentPage === "search" && (
          <SearchPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
          />
        )}

        {currentPage === "player" && (
          <MusicPlayer 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        )}

        {currentPage === "discover" && (
          <DiscoverPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
          />
        )}

        {currentPage === "library" && (
          <LibraryPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
            user={user}
          />
        )}

        {currentPage === "profile" && (
          <UserProfile 
            onNavigate={handleNavigation}
            user={user}
          />
        )}

        {currentPage === "contests" && (
          <ContestsPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
          />
        )}
        
        {/* Detail Pages */}
        {currentPage === "playlist-detail" && (
          <PlaylistDetail 
            onBack={() => handleNavigation("Library", "library")}
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
          />
        )}
        
        {currentPage === "contest-detail" && (
          <ContestDetail 
            onBack={() => handleNavigation("Contests", "contests")}
            onNavigate={handleNavigation}
          />
        )}
        
        {currentPage === "public-profile" && (
          <PublicProfile 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
          />
        )}
        
        {currentPage === "settings" && (
          <SettingsPage 
            onBack={() => handleNavigation("Profile", "profile")}
            onNavigate={handleNavigation}
            user={user}
          />
        )}
        
        {/* NFT Pages */}
        {currentPage === "nft-marketplace" && (
          <NFTMarketplace 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onOpenCreateNFT={() => handleNavigation("Home", "create-nft")}
            onOpenMyNFTs={() => handleNavigation("Home", "my-nfts")}
            onOpenAuctions={() => handleNavigation("Home", "nft-auction")}
            onOpenNFTDetail={(nftId) => handleNavigation("Home", "nft-detail")}
          />
        )}
        
        {currentPage === "nft-detail" && (
          <NFTDetail 
            nft={{
              id: "nft-detail-1",
              title: "Epic Remix Collection",
              artist: "DJ MixMaster",
              price: 500,
              image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
              description: "A rare collection of exclusive remix stems and loops created by legendary DJ MixMaster. This NFT includes commercial usage rights and stems for 5 different tracks.",
              category: "Music",
              views: 2340,
              likes: 312,
              isLiked: false,
              owner: "AudioCollector123",
              creator: "DJ MixMaster",
              royalties: 10,
              blockchain: "TON",
              tokenId: "TN1234567890ABCDEF",
              auctionEndTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
              currentBid: 450,
              isAuction: false
            }}
            onBack={() => handleNavigation("Home", "nft-marketplace")}
            onBuy={(nftId) => {
              console.log(`Buying NFT ${nftId}`);
            }}
            onBid={(nftId, amount) => {
              console.log(`Bidding ${amount} on NFT ${nftId}`);
            }}
            onLike={(nftId) => {
              console.log(`Liking NFT ${nftId}`);
            }}
          />
        )}
        
        {currentPage === "create-nft" && (
          <CreateNFT 
            onBack={() => handleNavigation("Home", "nft-marketplace")}
            onCreateNFT={(nftData) => {
              console.log('Creating NFT:', nftData);
              handleNavigation("Home", "my-nfts");
            }}
          />
        )}
        
        {currentPage === "my-nfts" && (
          <MyNFTs 
            onBack={() => handleNavigation("Home", "nft-marketplace")}
            onCreateNFT={() => handleNavigation("Home", "create-nft")}
            onViewNFT={(nftId) => handleNavigation("Home", "nft-detail")}
            userNFTs={{
              owned: [
                {
                  id: "owned-1",
                  title: "Chill Vibes Collection",
                  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                  price: 250,
                  category: "Music",
                  status: "listed" as const,
                  views: 1240,
                  likes: 89
                },
                {
                  id: "owned-2", 
                  title: "Synthwave Pack",
                  image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
                  price: 400,
                  category: "Samples",
                  status: "unlisted" as const,
                  views: 678,
                  likes: 156
                }
              ],
              created: [
                {
                  id: "created-1",
                  title: "My First Remix",
                  image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?w=400",
                  price: 150,
                  category: "Music", 
                  status: "sold" as const,
                  views: 2340,
                  likes: 312,
                  earnings: 75
                },
                {
                  id: "created-2",
                  title: "Vocal Sample NFT",
                  image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
                  price: 300,
                  category: "Samples",
                  status: "listed" as const,
                  views: 890,
                  likes: 203,
                  earnings: 120
                }
              ]
            }}
          />
        )}
        
        {currentPage === "nft-auction" && (
          <NFTAuction 
            onBack={() => handleNavigation("Home", "nft-marketplace")}
            activeAuctions={[
              {
                id: "auction-1",
                title: "Exclusive Remix Rights",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                currentBid: 450,
                startingBid: 200,
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                bidCount: 12,
                highestBidder: "MixMaster",
                category: "Rights",
                artist: "DJ ElectroBeats"
              },
              {
                id: "auction-2", 
                title: "Limited Edition Stems",
                image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?w=400",
                currentBid: 750,
                startingBid: 500,
                endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
                bidCount: 8,
                highestBidder: "RemixKing",
                category: "Stems",
                artist: "VocalVibes"
              }
            ]}
            userBids={[
              {
                auctionId: "auction-3",
                title: "Vintage Synth Collection",
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
                bidAmount: 300,
                bidTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                status: "outbid" as const,
                endTime: new Date(Date.now() + 12 * 60 * 60 * 1000)
              },
              {
                auctionId: "auction-4",
                title: "AI-Generated Melody Pack",
                image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400", 
                bidAmount: 180,
                bidTime: new Date(Date.now() - 30 * 60 * 1000),
                status: "winning" as const,
                endTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
              }
            ]}
            onPlaceBid={(auctionId, amount) => {
              console.log(`Placing bid of ${amount} on auction ${auctionId}`);
            }}
            onViewAuction={(auctionId) => {
              console.log(`Viewing auction ${auctionId}`);
              handleNavigation("Home", "nft-detail");
            }}
          />
        )}
        
        {/* Content Detail Pages */}
        {currentPage === "remix-detail" && (
          <RemixDetail 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
          />
        )}
        
        {currentPage === "ai-studio" && (
          <AIStudio 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            currentTrack={currentTrack}
          />
        )}
        
        {currentPage === "artist-page" && (
          <ArtistPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
          />
        )}
        
        {currentPage === "rankings" && (
          <RankingPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
          />
        )}
        
        {currentPage === "ranking-detail" && (
          <DetailRankingPage 
            onBack={() => handleNavigation("Home", "rankings")}
            onNavigate={handleNavigation}
          />
        )}

        {/* Jamendo API Test Page - for debugging */}
        {currentPage === "jamendo-test" && (
          <JamendoTest />
        )}

        {/* Jamendo OAuth Callback Page */}
        {currentPage === "oauth-callback" && (
          <JamendoOAuthCallback 
            onSuccess={() => {
              setCurrentPage("home");
              setActiveTab("Home");
            }}
            onError={(error) => {
              console.error('OAuth callback error:', error);
              setCurrentPage("home");
              setActiveTab("Home");
            }}
            onBack={() => {
              setCurrentPage("home");
              setActiveTab("Home");
            }}
          />
        )}

        {/* Bottom Navigation - Only show on main pages */}
        {shouldShowBottomNav && (
          <BottomNavigation 
            activeTab={activeTab} 
            onNavigate={handleNavigation} 
          />
        )}
      </div>
    </SwipeNavigationProvider>
  );
}