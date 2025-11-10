import { useState } from "react";
import { Heart, Eye, Clock, TrendingUp, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface NFTCardProps {
  nft: {
    id: string;
    title: string;
    artist: string;
    image: string;
    price: number;
    category: string;
    likes: number;
    views: number;
    isLiked?: boolean;
    isAuction?: boolean;
    currentBid?: number;
    timeRemaining?: string;
    status?: 'listed' | 'unlisted' | 'sold' | 'auction';
    rarity?: 'common' | 'rare' | 'legendary' | 'epic';
  };
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  onLike?: (nftId: string) => void;
  onClick?: (nftId: string) => void;
  onBuy?: (nftId: string) => void;
  onBid?: (nftId: string) => void;
  onShare?: (nftId: string) => void;
  onAddToWatchlist?: (nftId: string) => void;
}

export default function NFTCard({ 
  nft, 
  variant = 'default',
  showActions = true,
  onLike,
  onClick,
  onBuy,
  onBid,
  onShare,
  onAddToWatchlist
}: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(nft.isLiked || false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(nft.id);
  };

  const handleClick = () => {
    onClick?.(nft.id);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = () => {
    if (!nft.status) return null;
    
    const statusConfig = {
      listed: { color: 'bg-[#2ea043]', text: 'Listed' },
      unlisted: { color: 'bg-[#8b949e]', text: 'Unlisted' },
      sold: { color: 'bg-[#ff4400]', text: 'Sold' },
      auction: { color: 'bg-[#ff22fb]', text: 'Auction' }
    };

    const config = statusConfig[nft.status];
    if (!config) return null;

    return (
      <Badge className={`${config.color} hover:${config.color}/90 text-white text-xs`}>
        {config.text}
      </Badge>
    );
  };

  if (variant === 'compact') {
    return (
      <div 
        className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 cursor-pointer hover:border-[#ff22fb]/50 transition-colors"
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url('${nft.image}')` }}
            />
            {nft.rarity && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getRarityColor(nft.rarity)}`} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] truncate">
              {nft.title}
            </h3>
            <p className="text-[12px] text-[#8b949e] truncate">{nft.artist}</p>
          </div>
          
          <div className="text-right">
            <p className="text-[14px] font-bold text-[#d29922]">{nft.isAuction ? nft.currentBid : nft.price} ⭐</p>
            <p className="text-[10px] text-[#8b949e]">{nft.isAuction ? 'Current Bid' : 'Price'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div 
        className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden cursor-pointer hover:border-[#ff22fb]/50 transition-all hover:scale-[1.02]"
        onClick={handleClick}
      >
        <div className="relative">
          <div 
            className="w-full h-64 bg-cover bg-center"
            style={{ backgroundImage: `url('${nft.image}')` }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] backdrop-blur-sm">
                {nft.category}
              </Badge>
              {getStatusBadge()}
            </div>
            {showActions && (
              <button 
                onClick={handleLike}
                className="bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-black/40 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#ff22fb] text-[#ff22fb]' : 'text-white'}`} />
              </button>
            )}
          </div>
          
          {/* Auction timer */}
          {nft.isAuction && nft.timeRemaining && (
            <div className="absolute top-3 right-3 bg-[#ff22fb]/20 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#ff22fb]" />
              <span className="text-xs text-white font-semibold">{nft.timeRemaining}</span>
            </div>
          )}
          
          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-[18px] font-bold text-white font-['Montserrat'] mb-1">{nft.title}</h3>
            <p className="text-[14px] text-white/80 mb-3">by {nft.artist}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-white/60">{nft.isAuction ? 'Current Bid' : 'Price'}</p>
                <p className="text-[20px] font-bold text-[#d29922]">{nft.isAuction ? nft.currentBid : nft.price} ⭐</p>
              </div>
              
              <div className="flex items-center gap-2">
                {nft.isAuction ? (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBid?.(nft.id);
                    }}
                    className="bg-[#ff22fb] hover:bg-[#ff22fb]/90"
                  >
                    Place Bid
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuy?.(nft.id);
                    }}
                    className="bg-[#ff22fb] hover:bg-[#ff22fb]/90"
                  >
                    Buy Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden cursor-pointer hover:border-[#ff22fb]/50 transition-colors group"
      onClick={handleClick}
    >
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url('${nft.image}')` }}
        />
        
        {/* Rarity indicator */}
        {nft.rarity && (
          <div className={`absolute top-3 left-3 w-4 h-4 rounded-full ${getRarityColor(nft.rarity)}`} />
        )}
        
        {/* Actions overlay */}
        {showActions && (
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleLike}
              className="bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-black/40 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#ff22fb] text-[#ff22fb]' : 'text-white'}`} />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-black/20 backdrop-blur-sm rounded-full p-2 hover:bg-black/40 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(nft.id);
                  }}
                  className="text-[#c9d1d9] hover:bg-[#30363d]"
                >
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWatchlist?.(nft.id);
                  }}
                  className="text-[#c9d1d9] hover:bg-[#30363d]"
                >
                  Add to Watchlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute bottom-3 left-3">
          {getStatusBadge()}
        </div>
        
        {/* Auction timer */}
        {nft.isAuction && nft.timeRemaining && (
          <div className="absolute bottom-3 right-3 bg-[#ff22fb]/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-semibold">{nft.timeRemaining}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">
            {nft.category}
          </Badge>
          <div className="flex items-center gap-3 text-[#8b949e] text-sm">
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
        
        <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-1 line-clamp-1">
          {nft.title}
        </h3>
        <p className="text-[14px] text-[#8b949e] font-['Montserrat'] mb-3">by {nft.artist}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[#8b949e]">{nft.isAuction ? 'Current Bid' : 'Price'}</p>
            <p className="text-[18px] font-bold text-[#d29922]">{nft.isAuction ? nft.currentBid : nft.price} ⭐</p>
          </div>
          
          <div className="flex items-center gap-2">
            {nft.isAuction ? (
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBid?.(nft.id);
                }}
                className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-xs px-3 py-1 h-auto"
              >
                Bid
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuy?.(nft.id);
                }}
                className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-xs px-3 py-1 h-auto"
              >
                Buy
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}