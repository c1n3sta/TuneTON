import { useState } from "react";
import { ArrowLeft, Search, Filter, Plus, Clock, TrendingUp, Gem, Music, Palette, Trophy, Shield, Heart, Eye, Crown } from "lucide-react";
import BottomNavigation from "../home/BottomNavigation";

interface NFT {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  category: string;
  likes: number;
  views: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  status: "listed" | "sold" | "auction";
}

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
  const featuredNFTs: NFT[] = [
    {
      id: "featured-1",
      title: "Rare Remix Masterpiece",
      artist: "DJ BeatDrop",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      price: 1500,
      category: "Music",
      likes: 234,
      views: 1250,
      rarity: "legendary",
      status: "listed"
    }
  ];

  const latestNFTs: NFT[] = [
    {
      id: "1",
      title: "Synthwave Anthem",
      artist: "RetroWave",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      price: 350,
      category: "Music",
      likes: 89,
      views: 432,
      rarity: "rare",
      status: "listed"
    },
    {
      id: "2",
      title: "Vocal Sample Pack",
      artist: "VoiceCraft",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      price: 200,
      category: "Samples",
      likes: 156,
      views: 678,
      rarity: "common",
      status: "listed"
    },
    {
      id: "3",
      title: "Exclusive Album Art",
      artist: "ArtBeat",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
      price: 500,
      category: "Art",
      likes: 203,
      views: 891,
      rarity: "epic",
      status: "listed"
    }
  ];

  const allNFTs = [...featuredNFTs, ...latestNFTs];

  const getFilteredNFTs = () => {
    if (selectedCategory === "All") {
      return latestNFTs;
    }
    return latestNFTs.filter(nft => nft.category === selectedCategory);
  };

  const handleBuyNFT = (nftId: string) => {
    console.log(`Buy NFT ${nftId}`);
  };

  const handleLikeNFT = (nftId: string) => {
    console.log(`Like NFT ${nftId}`);
  };

  const getCategoryCount = (category: string) => {
    if (category === "All") return allNFTs.length;
    return allNFTs.filter(nft => nft.category === category).length;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-500";
      case "rare": return "text-blue-500";
      case "epic": return "text-purple-500";
      case "legendary": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-500";
      case "rare": return "border-blue-500";
      case "epic": return "border-purple-500";
      case "legendary": return "border-yellow-500";
      default: return "border-gray-500";
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-card rounded-2xl min-h-screen relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-lg font-semibold">NFT Marketplace</h1>
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

          <div className="p-4 pb-24">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={onOpenCreateNFT}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors"
              >
                <Plus className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold">Create NFT</p>
              </button>
              
              <button 
                onClick={onOpenMyNFTs}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors"
              >
                <Shield className="w-6 h-6 text-chart-4 mx-auto mb-2" />
                <p className="text-xs font-semibold">My NFTs</p>
              </button>
              
              <button 
                onClick={onOpenAuctions}
                className="bg-card border border-border rounded-lg p-4 text-center hover:bg-accent transition-colors"
              >
                <Clock className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                <p className="text-xs font-semibold">Auctions</p>
              </button>
            </div>

            {/* Featured Collectibles */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Featured Collectibles</h2>
              {featuredNFTs.map((nft) => (
                <div 
                  key={nft.id}
                  className={`bg-card border ${getRarityBorder(nft.rarity)} rounded-xl p-4 mb-3 hover:bg-accent transition-colors cursor-pointer`}
                  onClick={() => onOpenNFTDetail(nft.id)}
                >
                  <div className="flex gap-4">
                    <div 
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${nft.image}')` }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-foreground">{nft.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(nft.rarity)} bg-opacity-20`}>
                          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {nft.artist}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{nft.price} TON</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{nft.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{nft.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Category Filter */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["All", "Music", "Art", "Samples", "Collectibles", "Rights"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {category}
                    <span className="ml-2 bg-background bg-opacity-30 px-2 py-0.5 rounded-full">
                      {getCategoryCount(category)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Listings */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Latest Listings</h2>
                <span className="text-sm text-muted-foreground">{getFilteredNFTs().length} items</span>
              </div>
              <div className="space-y-3">
                {getFilteredNFTs().map((nft) => (
                  <div 
                    key={nft.id} 
                    className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onOpenNFTDetail(nft.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-14 h-14 rounded-lg bg-cover bg-center border border-border flex-shrink-0"
                        style={{ backgroundImage: `url('${nft.image}')` }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{nft.title}</h3>
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
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{nft.price} TON</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNFT(nft.id);
                          }}
                          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
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

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0">
            <BottomNavigation activeTab="Marketplace" onTabChange={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}
