import { useState } from "react";
import { ArrowLeft, Search, Filter, Grid3X3, List, Plus, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface MyNFTsProps {
  onBack: () => void;
  onCreateNFT: () => void;
  onViewNFT: (nftId: string) => void;
  userNFTs: {
    owned: Array<{
      id: string;
      title: string;
      image: string;
      price: number;
      category: string;
      status: 'listed' | 'unlisted' | 'sold';
      views: number;
      likes: number;
    }>;
    created: Array<{
      id: string;
      title: string;
      image: string;
      price: number;
      category: string;
      status: 'listed' | 'unlisted' | 'sold';
      views: number;
      likes: number;
      earnings: number;
    }>;
  };
}

export default function MyNFTs({ onBack, onCreateNFT, onViewNFT, userNFTs }: MyNFTsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleNFTAction = (action: string, nftId: string) => {
    console.log(`${action} NFT:`, nftId);
    // Handle different actions like edit, delist, share, etc.
  };

  const filteredNFTs = (nfts: any[]) => {
    return nfts.filter(nft => {
      const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || nft.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  };

  const NFTCard = ({ nft, showEarnings = false }: { nft: any; showEarnings?: boolean }) => (
    <div 
      className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden cursor-pointer hover:border-[#ff22fb]/50 transition-colors"
      onClick={() => onViewNFT(nft.id)}
    >
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url('${nft.image}')` }}
        />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNFTAction('edit', nft.id);
                }}
                className="text-[#c9d1d9] hover:bg-[#30363d]"
              >
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNFTAction('delist', nft.id);
                }}
                className="text-[#c9d1d9] hover:bg-[#30363d]"
              >
                {nft.status === 'listed' ? 'Delist' : 'List for Sale'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNFTAction('share', nft.id);
                }}
                className="text-[#c9d1d9] hover:bg-[#30363d]"
              >
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-3 left-3">
          <Badge 
            variant={nft.status === 'listed' ? 'default' : nft.status === 'sold' ? 'secondary' : 'outline'}
            className={
              nft.status === 'listed' ? 'bg-[#2ea043] hover:bg-[#2ea043]/90' :
              nft.status === 'sold' ? 'bg-[#8b949e] hover:bg-[#8b949e]/90' :
              'bg-[#ff4400] hover:bg-[#ff4400]/90'
            }
          >
            {nft.status === 'listed' ? 'Listed' : nft.status === 'sold' ? 'Sold' : 'Unlisted'}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">
            {nft.category}
          </Badge>
          <span className="text-[#d29922] font-semibold">{nft.price} ⭐</span>
        </div>
        
        <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat'] mb-2 line-clamp-1">
          {nft.title}
        </h3>
        
        <div className="flex items-center justify-between text-[#8b949e] text-sm">
          <div className="flex items-center gap-3">
            <span>👁 {nft.views}</span>
            <span>❤️ {nft.likes}</span>
          </div>
          {showEarnings && nft.earnings > 0 && (
            <span className="text-[#2ea043] font-semibold">+{nft.earnings} ⭐</span>
          )}
        </div>
      </div>
    </div>
  );

  const NFTListItem = ({ nft, showEarnings = false }: { nft: any; showEarnings?: boolean }) => (
    <div 
      className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#ff22fb]/50 transition-colors"
      onClick={() => onViewNFT(nft.id)}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
          style={{ backgroundImage: `url('${nft.image}')` }}
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[16px] font-semibold text-[#c9d1d9] font-['Montserrat']">{nft.title}</h3>
            <Badge 
              variant={nft.status === 'listed' ? 'default' : nft.status === 'sold' ? 'secondary' : 'outline'}
              className={`text-xs ${
                nft.status === 'listed' ? 'bg-[#2ea043] hover:bg-[#2ea043]/90' :
                nft.status === 'sold' ? 'bg-[#8b949e] hover:bg-[#8b949e]/90' :
                'bg-[#ff4400] hover:bg-[#ff4400]/90'
              }`}
            >
              {nft.status}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[#8b949e] text-sm">
              <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">
                {nft.category}
              </Badge>
              <span>👁 {nft.views}</span>
              <span>❤️ {nft.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              {showEarnings && nft.earnings > 0 && (
                <span className="text-[#2ea043] font-semibold text-sm">+{nft.earnings} ⭐</span>
              )}
              <span className="text-[#d29922] font-semibold">{nft.price} ⭐</span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => e.stopPropagation()}
              className="text-[#8b949e] hover:text-[#c9d1d9]"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleNFTAction('edit', nft.id);
              }}
              className="text-[#c9d1d9] hover:bg-[#30363d]"
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleNFTAction('delist', nft.id);
              }}
              className="text-[#c9d1d9] hover:bg-[#30363d]"
            >
              {nft.status === 'listed' ? 'Delist' : 'List for Sale'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleNFTAction('share', nft.id);
              }}
              className="text-[#c9d1d9] hover:bg-[#30363d]"
            >
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#c9d1d9]" />
          </button>
          <h1 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">My NFTs</h1>
          <Button 
            onClick={onCreateNFT}
            size="sm"
            className="bg-[#ff22fb] hover:bg-[#ff22fb]/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#0d1117] rounded-lg flex items-center gap-2 px-3 py-2 flex-1 border border-[#30363d]">
              <Search className="w-4 h-4 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Search your NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[14px] text-[#c9d1d9] placeholder-[#8b949e] flex-1 outline-none"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <div className="flex items-center border border-[#30363d] rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#ff22fb] text-white hover:bg-[#ff22fb]/90' : 'text-[#8b949e] hover:text-[#c9d1d9]'}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-[#ff22fb] text-white hover:bg-[#ff22fb]/90' : 'text-[#8b949e] hover:text-[#c9d1d9]'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'all', label: 'All' },
              { key: 'listed', label: 'Listed' },
              { key: 'unlisted', label: 'Unlisted' },
              { key: 'sold', label: 'Sold' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant="outline"
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className={`${
                  selectedFilter === filter.key
                    ? 'bg-[#ff22fb] border-[#ff22fb] text-white hover:bg-[#ff22fb]/90'
                    : 'border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e]'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="owned" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#0d1117] border border-[#30363d]">
              <TabsTrigger 
                value="owned" 
                className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white"
              >
                Owned ({userNFTs.owned.length})
              </TabsTrigger>
              <TabsTrigger 
                value="created" 
                className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white"
              >
                Created ({userNFTs.created.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="owned" className="mt-6">
              {filteredNFTs(userNFTs.owned).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-[18px] font-semibold text-[#c9d1d9] mb-2">No NFTs found</h3>
                  <p className="text-[#8b949e] mb-4">You don't own any NFTs yet</p>
                  <Button 
                    onClick={onCreateNFT}
                    className="bg-[#ff22fb] hover:bg-[#ff22fb]/90"
                  >
                    Create Your First NFT
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 gap-4' 
                    : 'space-y-3'
                }>
                  {filteredNFTs(userNFTs.owned).map((nft) => 
                    viewMode === 'grid' 
                      ? <NFTCard key={nft.id} nft={nft} />
                      : <NFTListItem key={nft.id} nft={nft} />
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="created" className="mt-6">
              {filteredNFTs(userNFTs.created).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-[18px] font-semibold text-[#c9d1d9] mb-2">No created NFTs</h3>
                  <p className="text-[#8b949e] mb-4">Start creating and selling your music as NFTs</p>
                  <Button 
                    onClick={onCreateNFT}
                    className="bg-[#ff22fb] hover:bg-[#ff22fb]/90"
                  >
                    Create NFT
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 gap-4' 
                    : 'space-y-3'
                }>
                  {filteredNFTs(userNFTs.created).map((nft) => 
                    viewMode === 'grid' 
                      ? <NFTCard key={nft.id} nft={nft} showEarnings />
                      : <NFTListItem key={nft.id} nft={nft} showEarnings />
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}