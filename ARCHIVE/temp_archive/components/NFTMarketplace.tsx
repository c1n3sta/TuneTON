import { useState } from "react";
import { ArrowLeft, Search, Filter, Plus, Clock, TrendingUp, Gem, Music, Palette, Trophy, Shield } from "lucide-react";
import svgPaths from "../imports/svg-g8zvlxcsj3";
import BottomNavigation from "./BottomNavigation";
import StylishTabs from "./StylishTabs";
import NFTCard from "./NFTCard";

// Import all images from the Figma design
import imgFeaturedNft from "figma:asset/063bcbc0dfe8da3f7c3395961e76884ea1607364.png";
import imgNftThumbnail from "figma:asset/9bad0196c7c040d346e64e8cfeed505171c08e59.png";
import imgNftThumbnail1 from "figma:asset/519b76b7e7012f7180a23406792b87a4c99a42d9.png";
import imgNftThumbnail2 from "figma:asset/ba59d117cf439a0f337c59b93c7ca4f92a996ce3.png";

interface NFTMarketplaceProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onOpenCreateNFT: () => void;
  onOpenMyNFTs: () => void;
  onOpenAuctions: () => void;
  onOpenNFTDetail: (nftId: string) => void;
}

export default function NFTMarketplace({ onBack, onNavigate, onOpenCreateNFT, onOpenMyNFTs, onOpenAuctions, onOpenNFTDetail }: NFTMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock NFT data - in a real app this would come from props or API
  const featuredNFTs = [
    {
      id: "featured-1",
      title: "Rare Remix Masterpiece",
      artist: "DJ BeatDrop",
      image: imgFeaturedNft,
      price: 1500,
      category: "Music",
      likes: 234,
      views: 1250,
      rarity: "legendary" as const,
      status: "listed" as const
    }
  ];

  const latestNFTs = [
    {
      id: "1",
      title: "Synthwave Anthem",
      artist: "RetroWave",
      image: imgNftThumbnail,
      price: 350,
      category: "Music",
      likes: 89,
      views: 432,
      rarity: "rare" as const,
      status: "listed" as const
    },
    {
      id: "2",
      title: "Vocal Sample Pack",
      artist: "VoiceCraft",
      image: imgNftThumbnail1,
      price: 200,
      category: "Samples",
      likes: 156,
      views: 678,
      rarity: "common" as const,
      status: "listed" as const
    },
    {
      id: "3",
      title: "Exclusive Album Art",
      artist: "ArtBeat",
      image: imgNftThumbnail2,
      price: 500,
      category: "Art",
      likes: 203,
      views: 891,
      rarity: "epic" as const,
      status: "listed" as const
    }
  ];

  const allNFTs = [...featuredNFTs, ...latestNFTs];

  const getFilteredNFTs = () => {
    if (selectedCategory === "All") {
      return latestNFTs;
    }
    return latestNFTs.filter(nft => nft.category === selectedCategory);
  };

  const handleSellNFT = () => {
    console.log("Open sell NFT modal");
  };

  const handleBuyNFT = (nftId: number) => {
    console.log(`Buy NFT ${nftId}`);
  };

  const handleBuyFeatured = () => {
    console.log("Buy featured NFT");
  };

  const handleNavigation = (tab: string) => {
    if (tab === "Home") {
      onBack();
    } else {
      onNavigate(tab);
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">NFT Marketplace</h1>
            <div className="flex items-center gap-4">
              <button className="w-5 h-5 text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                <Search className="w-full h-full" />
              </button>
              <button className="w-5 h-5 text-[#8b949e] hover:text-[#ff22fb] transition-colors">
                <Filter className="w-full h-full" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button 
              onClick={onOpenCreateNFT}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 text-center hover:border-[#ff22fb]/50 transition-colors"
            >
              <Plus className="w-6 h-6 text-[#ff22fb] mx-auto mb-2" />
              <p className="text-[12px] text-[#c9d1d9] font-semibold">Create NFT</p>
            </button>
            
            <button 
              onClick={onOpenMyNFTs}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 text-center hover:border-[#ff22fb]/50 transition-colors"
            >
              <svg className="w-6 h-6 text-[#d29922] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-2.5-2L15 2H9l-1.5 3"/>
              </svg>
              <p className="text-[12px] text-[#c9d1d9] font-semibold">My NFTs</p>
            </button>
            
            <button 
              onClick={onOpenAuctions}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 text-center hover:border-[#ff22fb]/50 transition-colors"
            >
              <Clock className="w-6 h-6 text-[#2ea043] mx-auto mb-2" />
              <p className="text-[12px] text-[#c9d1d9] font-semibold">Auctions</p>
            </button>
          </div>

          {/* Featured Collectibles */}
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-4">Featured Collectibles</h2>
            {featuredNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                variant="featured"
                onClick={onOpenNFTDetail}
                onBuy={(nftId) => console.log('Buy NFT:', nftId)}
                onLike={(nftId) => console.log('Like NFT:', nftId)}
              />
            ))}
          </div>

          {/* Enhanced Category Filter */}
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-4">Browse Categories</h2>
            <StylishTabs
              tabs={[
                { 
                  id: "All", 
                  label: "All", 
                  icon: <Gem className="w-4 h-4" />,
                  badge: allNFTs.length.toString()
                },
                { 
                  id: "Music", 
                  label: "Music", 
                  icon: <Music className="w-4 h-4" />,
                  badge: allNFTs.filter(nft => nft.category === "Music").length.toString()
                },
                { 
                  id: "Art", 
                  label: "Art", 
                  icon: <Palette className="w-4 h-4" />,
                  badge: allNFTs.filter(nft => nft.category === "Art").length.toString()
                },
                { 
                  id: "Collectibles", 
                  label: "Collectibles", 
                  icon: <Trophy className="w-4 h-4" />
                },
                { 
                  id: "Rights", 
                  label: "Rights", 
                  icon: <Shield className="w-4 h-4" />
                }
              ]}
              activeTab={selectedCategory}
              onTabChange={setSelectedCategory}
              variant="pills"
              size="sm"
              className="overflow-x-auto scrollbar-hide"
            />
          </div>

          {/* Latest Listings */}
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-4">Latest Listings</h2>
            <div className="space-y-2">
              {getFilteredNFTs().map((nft) => (
                <div key={nft.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg">
                  <div className="flex items-center gap-3 px-[17px] py-[13px]">
                    <div 
                      className="w-14 h-14 rounded-lg bg-no-repeat flex-shrink-0"
                      style={{ 
                        backgroundImage: `url('${nft.image}')`,
                        backgroundSize: "100% 100%",
                        backgroundPosition: "top"
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] leading-normal">{nft.title}</h3>
                      <p className="text-[12px] font-semibold text-[#8b949e] font-['Montserrat']">by {nft.artist}</p>
                    </div>
                    <div className="flex items-center gap-1 mr-2">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                        <path
                          d={svgPaths.p1fa08bc0}
                          stroke="#D29922"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.16667"
                        />
                      </svg>
                      <div className="text-center">
                        <p className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] leading-normal">{nft.price}</p>
                        <p className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] leading-normal">Stars</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBuyNFT(parseInt(nft.id))}
                      className="bg-[#ff22fb] px-3 py-1.5 rounded-md text-[12px] font-semibold text-white text-center font-['Montserrat'] hover:bg-[#ff22fb]/90 transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation 
        activeTab="NFT"
        onNavigate={handleNavigation}
      />
    </div>
  );
}