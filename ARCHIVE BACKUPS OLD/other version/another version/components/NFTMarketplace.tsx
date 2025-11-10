import { useState } from "react";
import { ArrowLeft, Search, Filter, Plus, Clock, TrendingUp, Gem, Music, Palette, Trophy, Shield } from "lucide-react";
import svgPaths from "../imports/svg-g8zvlxcsj3";
import StylishTabs from "./StylishTabs";
import NFTCard from "./NFTCard";

// Import all images from the Figma design
import imgFeaturedNft from "figma:asset/063bcbc0dfe8da3f7c3395961e76884ea1607364.png";
import imgNftThumbnail from "figma:asset/9bad0196c7c040d346e64e8cfeed505171c08e59.png";
import imgNftThumbnail1 from "figma:asset/519b76b7e7012f7180a23406792b87a4c99a42d9.png";
import imgNftThumbnail2 from "figma:asset/ba59d117cf439a0f337c59b93c7ca4f92a996ce3.png";

interface NFTMarketplaceProps {
  onBack: () => void;
  onNavigate: (tab: string, page?: string) => void;
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

  const handleBuyNFT = (nftId: number) => {
    console.log(`Buy NFT ${nftId}`);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden border border-border">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onBack}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-semibold">NFT Marketplace</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={onOpenCreateNFT}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors"
              >
                <Plus className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold">Create NFT</p>
              </button>
              
              <button 
                onClick={onOpenMyNFTs}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors"
              >
                <svg className="w-6 h-6 text-chart-4 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-2.5-2L15 2H9l-1.5 3"/>
                </svg>
                <p className="text-sm font-semibold">My NFTs</p>
              </button>
              
              <button 
                onClick={onOpenAuctions}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors"
              >
                <Clock className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                <p className="text-sm font-semibold">Auctions</p>
              </button>
            </div>

            {/* Featured Collectibles */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Featured Collectibles</h2>
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
              <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
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
              <h2 className="text-lg font-semibold mb-4">Latest Listings</h2>
              <div className="space-y-3">
                {getFilteredNFTs().map((nft) => (
                  <div key={nft.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-14 h-14 rounded-lg bg-cover bg-center border border-border cursor-pointer"
                        style={{ backgroundImage: `url('${nft.image}')` }}
                        onClick={() => onOpenNFTDetail(nft.id)}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{nft.title}</h3>
                        <p className="text-sm text-muted-foreground">by {nft.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {nft.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {nft.views} views
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14">
                            <path
                              d={svgPaths.p1fa08bc0}
                              stroke="#D29922"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.16667"
                            />
                          </svg>
                          <span className="font-semibold">{nft.price}</span>
                        </div>
                        <button 
                          onClick={() => handleBuyNFT(parseInt(nft.id))}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}