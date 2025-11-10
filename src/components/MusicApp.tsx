import { useState, useEffect } from "react";
import HomePage from "./HomePage";
import BottomNavigation from "./BottomNavigation";
import MusicPlayer from "./MusicPlayer";
import PlaylistDetail from "./PlaylistDetail";
import PlaylistDetailReal from "./PlaylistDetailReal";
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
import LibraryPageReal from "./LibraryPageReal";
import { SwipeNavigationProvider } from "./SwipeNavigationProvider";
import { useTelegramAuth } from "./TelegramAuthProvider";
import { JamendoTrack } from "../utils/jamendo-api";
import { TuneTONPlaylist, tuneTONAPI } from "../utils/tuneton-api";
import { musicServiceManager, UniversalTrack } from "../utils/music-service-manager";
import { AudioTrack } from "../types/audio";

interface User {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
  access_token?: string;
}

interface NavigationData {
  playlist?: TuneTONPlaylist;
  playlistId?: string;
  [key: string]: any;
}

export default function MusicApp() {
  const [activeTab, setActiveTab] = useState("Home");
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [currentTrack, setCurrentTrack] = useState<JamendoTrack | null>(null);
  const [currentTrackName, setCurrentTrackName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  
  // Use Telegram auth context
  const { user: telegramUser, isAuthenticated, isDarkMode } = useTelegramAuth();
  
  // Convert Telegram user to app user format
  const user: User | null = telegramUser ? {
    id: telegramUser.id,
    first_name: telegramUser.first_name,
    username: telegramUser.username,
    photo_url: telegramUser.photo_url,
    is_premium: telegramUser.is_premium,
    access_token: `real_user_${telegramUser.id}_${Date.now()}`
  } : null;


  // Set up API with user access token when authenticated
  useEffect(() => {
    if (isAuthenticated && telegramUser) {
      // In a real implementation, we would get the actual access token from authentication
      // For now, we'll use a placeholder that indicates this is a real user
      const accessToken = `real_user_${telegramUser.id}_${Date.now()}`;
      tuneTONAPI.setAccessToken(accessToken, telegramUser.id.toString());
      
      const hasCompletedOnboarding = localStorage.getItem('tunton_onboarding_completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, telegramUser]);

  const handleTelegramConnect = async () => {
    try {
      // In the new implementation, connection is handled by TelegramAuthProvider
      // We just need to ensure onboarding is completed
      handleOnboardingComplete();
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

  const handleNavigation = (tab: string, page?: string, data?: NavigationData) => {
    console.log('Navigation called:', tab, page, data);
    setActiveTab(tab);
    
    // Store navigation data for pages that need it
    if (data) {
      setNavigationData(data);
    }
    
    if (page) {
      setCurrentPage(page);
    } else {
      // Map tabs to their default pages
      const tabPageMap: { [key: string]: string } = {
        "Home": "home",
        "Library": "library-real",
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

  const handleTrackChange = async (track: JamendoTrack | string | UniversalTrack) => {
    // Handle UniversalTrack
    if (typeof track !== 'string' && 'source' in track && (track as UniversalTrack).source) {
      const universalTrack = track as UniversalTrack;
      
      // Only handle Jamendo tracks now (SoundCloud support removed)
      if (universalTrack.source === 'jamendo') {
        // For Jamendo tracks, convert to JamendoTrack format
        const jamendoTrack: JamendoTrack = {
          id: universalTrack.originalId.toString(),
          name: universalTrack.title,
          artist_name: universalTrack.artist,
          duration: universalTrack.duration,
          artist_id: '',
          artist_idstr: '',
          album_id: '',
          album_name: universalTrack.genre || 'Track',
          album_image: universalTrack.coverArt || '',
          audio: universalTrack.audioUrl || '',
          audiodownload: universalTrack.audioUrl || '',
          prourl: universalTrack.permalink || '',
          shorturl: universalTrack.permalink || '',
          shareurl: universalTrack.permalink || '',
          waveform: '',
          image: universalTrack.coverArt || ''
        };
        
        setCurrentTrack(jamendoTrack);
        setCurrentTrackName(universalTrack.title);
        return;
      }
      
      // Handle unknown source by creating a placeholder track
      const placeholderTrack: JamendoTrack = {
        id: 'unknown',
        name: 'Track Unavailable',
        artist_name: 'Unknown Artist',
        duration: 0,
        artist_id: '',
        artist_idstr: '',
        album_id: '',
        album_name: 'Unknown Album',
        album_image: '',
        audio: '',
        audiodownload: '',
        prourl: '',
        shorturl: '',
        shareurl: '',
        waveform: '',
        image: ''
      };
      
      setCurrentTrack(placeholderTrack);
      setCurrentTrackName('Track Unavailable');
      return;
    }
    
    // Handle string track name (legacy)
    if (typeof track === 'string') {
      // Search for the actual track
      try {
        const { jamendoAPI } = await import("../utils/jamendo-api");
        const searchResults = await jamendoAPI.searchTracks({ search: track, limit: 1 });
        if (searchResults.results.length > 0) {
          setCurrentTrack(searchResults.results[0]);
        } else {
          // If search fails, don't set a track
        }
      } catch (error) {
        console.error('Error searching for track:', error);
        // If search fails, don't set a track
      }
    } else {
      setCurrentTrack(track as JamendoTrack);
    }
    // Update currentTrackName for HomePage component
    setCurrentTrackName(typeof track === 'string' ? track : (track as JamendoTrack).name);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Pages that should not show bottom navigation
  const pagesWithoutBottomNav = [
    "player", "onboarding", "settings", "nft-detail", 
    "create-nft", "my-nfts", "nft-auction", "remix-detail", 
    "ai-studio", "artist-page", "contest-detail",
    "playlist-detail", "playlist-detail-real", "public-profile", "rankings",
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
    <SwipeNavigationProvider>
      <div className="min-h-screen bg-background">
        {/* Test button - only shown in development */}
        {import.meta.env.DEV && (
          <div className="fixed top-4 right-4 z-50">
            <button 
              onClick={() => handleNavigation("Test", "jamendo-test")}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Test Jamendo
            </button>
          </div>
        )}
        {/* Main Content */}
        {currentPage === "home" && (
          <HomePage 
            onNavigate={handleNavigation}
            onTrackSelect={handleTrackChange}
            currentTrack={currentTrackName}
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

        {currentPage === "library-real" && (
          <LibraryPageReal 
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
            onPlayTrack={handleTrackChange}
          />
        )}

        {currentPage === "playlist-detail-real" && (
          <PlaylistDetailReal 
            onBack={() => handleNavigation("Library", "library-real")}
            onPlayTrack={handleTrackChange}
            onNavigate={handleNavigation}
            playlist={navigationData.playlist}
            playlistId={navigationData.playlistId}
            user={user}
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
                bidTime: new Date(Date.now() - 30 * 60 * 60 * 1000),
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
            onOpenAIStudio={() => handleNavigation("AI Studio", "ai-studio")}
            remixId="remix-1"
          />
        )}
        
        {currentPage === "ai-studio" && (
          <AIStudio 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
            onOpenCreateNFT={() => handleNavigation("NFT", "create-nft")}
          />
        )}
        
        {currentPage === "artist-page" && (
          <ArtistPage 
            onBack={() => handleNavigation("Home")}
            onNavigate={handleNavigation}
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