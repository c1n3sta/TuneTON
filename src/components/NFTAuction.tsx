import { useState, useEffect } from "react";
import { ArrowLeft, Clock, TrendingUp, Users, AlertCircle } from "lucide-react";
import { Button } from "./ui/button-component";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";

interface NFTAuctionProps {
  onBack: () => void;
  activeAuctions: Array<{
    id: string;
    title: string;
    image: string;
    currentBid: number;
    startingBid: number;
    endTime: Date;
    bidCount: number;
    highestBidder: string;
    category: string;
    artist: string;
  }>;
  userBids: Array<{
    auctionId: string;
    title: string;
    image: string;
    bidAmount: number;
    bidTime: Date;
    status: 'winning' | 'outbid' | 'won' | 'lost';
    endTime: Date;
  }>;
  onPlaceBid: (auctionId: string, amount: number) => void;
  onViewAuction: (auctionId: string) => void;
}

export default function NFTAuction({ onBack, activeAuctions, userBids, onPlaceBid, onViewAuction }: NFTAuctionProps) {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: string}>({});

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: {[key: string]: string} = {};
      
      [...activeAuctions, ...userBids].forEach((item) => {
        const endTime = item.endTime;
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          const itemId = 'id' in item ? item.id : item.auctionId;
          if (days > 0) {
            newTimeRemaining[itemId] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeRemaining[itemId] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeRemaining[itemId] = `${minutes}m ${seconds}s`;
          }
        } else {
          const itemId = 'id' in item ? item.id : item.auctionId;
          newTimeRemaining[itemId] = 'Ended';
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAuctions, userBids]);

  const handleBid = (auctionId: string) => {
    const auction = activeAuctions.find(a => a.id === auctionId);
    if (!auction || bidAmount <= auction.currentBid) {
      alert('Bid must be higher than current bid');
      return;
    }
    
    onPlaceBid(auctionId, bidAmount);
    setSelectedAuction(null);
    setBidAmount(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winning': return 'bg-[#2ea043] hover:bg-[#2ea043]/90';
      case 'outbid': return 'bg-[#ff4400] hover:bg-[#ff4400]/90';
      case 'won': return 'bg-[#d29922] hover:bg-[#d29922]/90';
      case 'lost': return 'bg-[#8b949e] hover:bg-[#8b949e]/90';
      default: return 'bg-[#8b949e] hover:bg-[#8b949e]/90';
    }
  };

  const AuctionCard = ({ auction }: { auction: any }) => (
    <Card 
      className="bg-[#0d1117] border-[#30363d] cursor-pointer hover:border-[#ff22fb]/50 transition-colors"
      onClick={() => onViewAuction(auction.id)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div 
            className="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0"
            style={{ backgroundImage: `url('${auction.image}')` }}
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">
                {auction.category}
              </Badge>
              <div className="flex items-center gap-1 text-[#ff22fb]">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-semibold">
                  {timeRemaining[auction.id] || 'Loading...'}
                </span>
              </div>
            </div>
            
            <h3 className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-1 line-clamp-1">
              {auction.title}
            </h3>
            <p className="text-[12px] text-[#8b949e] mb-2">by {auction.artist}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#8b949e]">Current Bid</p>
                <p className="text-[14px] font-bold text-[#d29922]">{auction.currentBid} ⭐</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#8b949e]">{auction.bidCount} bids</p>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAuction(auction.id);
                    setBidAmount(auction.currentBid + 10);
                  }}
                  className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 text-xs px-3 py-1 h-auto"
                >
                  Bid
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BidCard = ({ bid }: { bid: any }) => (
    <Card className="bg-[#0d1117] border-[#30363d]">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div 
            className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
            style={{ backgroundImage: `url('${bid.image}')` }}
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-semibold text-[#c9d1d9] font-['Montserrat'] line-clamp-1">
                {bid.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={`text-xs text-white ${getStatusColor(bid.status)}`}
              >
                {bid.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#8b949e]">Your Bid</p>
                <p className="text-[14px] font-bold text-[#d29922]">{bid.bidAmount} ⭐</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#8b949e]">
                  {timeRemaining[bid.auctionId] === 'Ended' ? 'Ended' : 'Ends in'}
                </p>
                <p className="text-[12px] font-semibold text-[#c9d1d9]">
                  {timeRemaining[bid.auctionId] || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#c9d1d9]" />
          </button>
          <h1 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">NFT Auctions</h1>
          <div className="w-8" />
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-[#0d1117] border-[#30363d]">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#ff22fb]" />
                  <span className="text-[20px] font-bold text-[#c9d1d9]">{activeAuctions.length}</span>
                </div>
                <p className="text-[12px] text-[#8b949e]">Active Auctions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0d1117] border-[#30363d]">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-[#d29922]" />
                  <span className="text-[20px] font-bold text-[#c9d1d9]">{userBids.length}</span>
                </div>
                <p className="text-[12px] text-[#8b949e]">Your Bids</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#0d1117] border border-[#30363d]">
              <TabsTrigger 
                value="active" 
                className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white"
              >
                Active Auctions
              </TabsTrigger>
              <TabsTrigger 
                value="bids" 
                className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white"
              >
                My Bids
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              {activeAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-[18px] font-semibold text-[#c9d1d9] mb-2">No Active Auctions</h3>
                  <p className="text-[#8b949e]">Check back later for new auctions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bids" className="mt-6">
              {userBids.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-[18px] font-semibold text-[#c9d1d9] mb-2">No Bids Yet</h3>
                  <p className="text-[#8b949e]">Start bidding on NFT auctions to track them here</p>
                </div>
              ) : (
                <>
                  {userBids.filter(bid => bid.status === 'outbid').length > 0 && (
                    <Alert className="mb-4 bg-[#ff4400]/10 border-[#ff4400]/20">
                      <AlertCircle className="h-4 w-4 text-[#ff4400]" />
                      <AlertDescription className="text-[#c9d1d9]">
                        You've been outbid on {userBids.filter(bid => bid.status === 'outbid').length} auction(s). 
                        Place higher bids to stay competitive!
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    {userBids.map((bid) => (
                      <BidCard key={bid.auctionId} bid={bid} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Bid Modal */}
        {selectedAuction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-[#161b22] border-[#30363d] w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-[18px] text-[#c9d1d9]">Place Bid</CardTitle>
                <CardDescription className="text-[#8b949e]">
                  Current bid: {activeAuctions.find(a => a.id === selectedAuction)?.currentBid} ⭐
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-[14px] text-[#c9d1d9] mb-2 block">Your Bid (Stars)</label>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={(activeAuctions.find(a => a.id === selectedAuction)?.currentBid || 0) + 1}
                    className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedAuction(null)}
                    className="flex-1 border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleBid(selectedAuction)}
                    className="flex-1 bg-[#ff22fb] hover:bg-[#ff22fb]/90"
                  >
                    Place Bid
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}