import { useState } from "react";
import { ArrowLeft, Heart, Share2, MoreHorizontal, Clock, TrendingUp, User, MessageCircle, Send, ThumbsUp, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NFTDetailProps {
  nft: {
    id: string;
    title: string;
    artist: string;
    price: number;
    image: string;
    description?: string;
    category: string;
    views: number;
    likes: number;
    isLiked: boolean;
    owner: string;
    creator: string;
    royalties: number;
    blockchain: string;
    tokenId: string;
    auctionEndTime?: Date;
    currentBid?: number;
    isAuction: boolean;
  };
  onBack: () => void;
  onBuy: (nftId: string) => void;
  onBid: (nftId: string, amount: number) => void;
  onLike: (nftId: string) => void;
}

// Comment interface
interface Comment {
  id: string;
  user: {
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  isReplying?: boolean;
}

export default function NFTDetail({ nft, onBack, onBuy, onBid, onLike }: NFTDetailProps) {
  const [bidAmount, setBidAmount] = useState(nft.currentBid ? nft.currentBid + 10 : nft.price);
  const [isLiked, setIsLiked] = useState(nft.isLiked);
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: {
        username: "MixMaster_Pro",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces",
        isVerified: true
      },
      content: "This NFT is absolutely incredible! The production quality is top-notch and the remix potential is huge. Already using these stems in my latest project! 🔥",
      timestamp: "2 hours ago",
      likes: 24,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          user: {
            username: "VinylVibes",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3db?w=150&h=150&fit=crop&crop=faces"
          },
          content: "Totally agree! The stems are so clean and the arrangement is perfect for remixing.",
          timestamp: "1 hour ago",
          likes: 8,
          isLiked: true
        }
      ]
    },
    {
      id: "2", 
      user: {
        username: "AudioCollector",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
      },
      content: "Been following this artist for a while. This drop is definitely worth the Stars! The layering in this track is phenomenal.",
      timestamp: "4 hours ago",
      likes: 15,
      isLiked: false,
      replies: []
    },
    {
      id: "3",
      user: {
        username: "BeatDropper",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
      },
      content: "Quick question - are the MIDI files included with this NFT? Looking to do some serious remixing! 🎹",
      timestamp: "6 hours ago", 
      likes: 7,
      isLiked: false,
      replies: [
        {
          id: "3-1",
          user: {
            username: "DJ MixMaster",
            avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=faces",
            isVerified: true
          },
          content: "Yes! MIDI files, stems, and even the project file are all included. Full creative control! ✨",
          timestamp: "5 hours ago",
          likes: 12,
          isLiked: false
        }
      ]
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(nft.id);
  };

  const handleBid = () => {
    if (bidAmount > (nft.currentBid || 0)) {
      onBid(nft.id, bidAmount);
    }
  };

  // Comment handlers
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          username: "You",
          avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces"
        },
        content: newComment.trim(),
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyText.trim()) {
      const reply: Comment = {
        id: `${parentId}-${Date.now()}`,
        user: {
          username: "You", 
          avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces"
        },
        content: replyText.trim(),
        timestamp: "Just now",
        likes: 0,
        isLiked: false
      };
      
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      }));
      
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(comments.map(comment => {
      if (isReply && parentId === comment.id) {
        return {
          ...comment,
          replies: comment.replies?.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      } else if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const toggleExpandComment = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const activityData = [
    { type: "Listed", user: "Creator", price: nft.price, time: "2 days ago" },
    { type: "Minted", user: nft.creator, price: null, time: "5 days ago" },
  ];

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-md mx-auto bg-[#161b22] rounded-2xl overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#c9d1d9]" />
          </button>
          <h1 className="text-[18px] font-semibold text-[#c9d1d9] font-['Montserrat']">NFT Details</h1>
          <button className="p-1">
            <MoreHorizontal className="w-6 h-6 text-[#c9d1d9]" />
          </button>
        </div>

        <div className="p-6">
          {/* NFT Image */}
          <div className="mb-6">
            <div 
              className="w-full h-80 rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url('${nft.image}')` }}
            />
          </div>

          {/* NFT Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] hover:bg-[#ff22fb]/30">
                {nft.category}
              </Badge>
              <div className="flex items-center gap-2">
                <button onClick={handleLike} className="p-2">
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#ff22fb] text-[#ff22fb]' : 'text-[#8b949e]'}`} />
                </button>
                <button className="p-2">
                  <Share2 className="w-5 h-5 text-[#8b949e]" />
                </button>
              </div>
            </div>
            
            <h2 className="text-[24px] font-bold text-[#c9d1d9] font-['Montserrat'] mb-2">{nft.title}</h2>
            <p className="text-[16px] text-[#8b949e] font-['Montserrat'] mb-4">by {nft.artist}</p>
            
            {nft.description && (
              <p className="text-[14px] text-[#8b949e] font-['Montserrat'] mb-4">{nft.description}</p>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-[#8b949e] text-[14px]">
                <span>👁 {nft.views.toLocaleString()}</span>
                <span>❤️ {nft.likes.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Price and Auction Info */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 mb-6">
            {nft.isAuction ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#ff22fb]" />
                  <span className="text-[14px] font-semibold text-[#ff22fb]">
                    Auction ends in {nft.auctionEndTime ? formatTimeRemaining(nft.auctionEndTime) : '0h 0m'}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-[12px] text-[#8b949e] mb-1">Current Bid</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[24px] font-bold text-[#c9d1d9]">{nft.currentBid || 0}</span>
                    <span className="text-[16px] text-[#d29922]">⭐ Stars</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-[#c9d1d9]"
                    min={(nft.currentBid || 0) + 1}
                  />
                  <Button onClick={handleBid} className="bg-[#ff22fb] hover:bg-[#ff22fb]/90">
                    Place Bid
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[12px] text-[#8b949e] mb-1">Price</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[24px] font-bold text-[#c9d1d9]">{nft.price}</span>
                  <span className="text-[16px] text-[#d29922]">⭐ Stars</span>
                </div>
                <Button onClick={() => onBuy(nft.id)} className="w-full bg-[#ff22fb] hover:bg-[#ff22fb]/90">
                  Buy Now
                </Button>
              </>
            )}
          </div>

          {/* Details Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#0d1117] border border-[#30363d]">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white text-xs">
                Details
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white text-xs">
                History
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white text-xs">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>Comments</span>
                  <Badge variant="secondary" className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs px-1 py-0 h-4">
                    {comments.length}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value="offers" className="data-[state=active]:bg-[#ff22fb] data-[state=active]:text-white text-xs">
                Offers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Owner</span>
                  <span className="text-[#c9d1d9]">{nft.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Creator</span>
                  <span className="text-[#c9d1d9]">{nft.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Royalties</span>
                  <span className="text-[#c9d1d9]">{nft.royalties}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Blockchain</span>
                  <span className="text-[#c9d1d9]">{nft.blockchain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Token ID</span>
                  <span className="text-[#c9d1d9] font-mono text-sm">{nft.tokenId}</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <div className="space-y-3">
                {activityData.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#ff22fb]/20 rounded-full flex items-center justify-center">
                        {activity.type === 'Listed' ? <TrendingUp className="w-4 h-4 text-[#ff22fb]" /> : <User className="w-4 h-4 text-[#ff22fb]" />}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#c9d1d9]">{activity.type}</p>
                        <p className="text-[12px] text-[#8b949e]">by {activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.price && (
                        <p className="text-[14px] font-semibold text-[#c9d1d9]">{activity.price} ⭐</p>
                      )}
                      <p className="text-[12px] text-[#8b949e]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-4">
              {/* New Comment Input */}
              <div className="mb-6 space-y-3">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces" />
                    <AvatarFallback className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this NFT..."
                      className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] placeholder-[#8b949e] resize-none min-h-[80px] focus:border-[#ff22fb]/50"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-[#8b949e]">
                        {newComment.length}/280
                      </span>
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || newComment.length > 280}
                        size="sm"
                        className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-[#8b949e] mx-auto mb-2" />
                    <p className="text-[#8b949e] mb-2">No comments yet</p>
                    <p className="text-sm text-[#8b949e]">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                      {/* Comment Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">
                            {comment.user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#c9d1d9] text-sm">
                              {comment.user.username}
                            </span>
                            {comment.user.isVerified && (
                              <Badge variant="secondary" className="bg-[#2ea043]/20 text-[#2ea043] text-xs px-1 py-0 h-4">
                                ✓
                              </Badge>
                            )}
                            <span className="text-xs text-[#8b949e]">{comment.timestamp}</span>
                          </div>
                          <p className="text-[#c9d1d9] text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                            comment.isLiked 
                              ? 'text-[#ff22fb]' 
                              : 'text-[#8b949e] hover:text-[#c9d1d9]'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 text-xs font-medium text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
                        >
                          <Reply className="w-3 h-3" />
                          Reply
                        </button>
                        {comment.replies && comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleExpandComment(comment.id)}
                            className="flex items-center gap-1 text-xs font-medium text-[#ff22fb] hover:text-[#ff22fb]/80 transition-colors"
                          >
                            {expandedComments.has(comment.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                          </button>
                        )}
                      </div>

                      {/* Reply Input */}
                      {replyingTo === comment.id && (
                        <div className="border-t border-[#30363d] pt-3 mt-3">
                          <div className="flex gap-3">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=faces" />
                              <AvatarFallback className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">You</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Replying to ${comment.user.username}...`}
                                className="bg-[#161b22] border-[#30363d] text-[#c9d1d9] placeholder-[#8b949e] resize-none min-h-[60px] text-sm focus:border-[#ff22fb]/50"
                              />
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-[#8b949e]">
                                  {replyText.length}/280
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] text-xs"
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!replyText.trim() || replyText.length > 280}
                                    size="sm"
                                    className="bg-[#ff22fb] hover:bg-[#ff22fb]/90 disabled:opacity-50 text-xs"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
                        <div className="border-t border-[#30363d] pt-3 mt-3 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <Avatar className="w-6 h-6 flex-shrink-0">
                                <AvatarImage src={reply.user.avatar} />
                                <AvatarFallback className="bg-[#ff22fb]/20 text-[#ff22fb] text-xs">
                                  {reply.user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-[#c9d1d9] text-sm">
                                    {reply.user.username}
                                  </span>
                                  {reply.user.isVerified && (
                                    <Badge variant="secondary" className="bg-[#2ea043]/20 text-[#2ea043] text-xs px-1 py-0 h-4">
                                      ✓
                                    </Badge>
                                  )}
                                  <span className="text-xs text-[#8b949e]">{reply.timestamp}</span>
                                </div>
                                <p className="text-[#c9d1d9] text-sm leading-relaxed mb-2">{reply.content}</p>
                                <button
                                  onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                                    reply.isLiked 
                                      ? 'text-[#ff22fb]' 
                                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                                  }`}
                                >
                                  <ThumbsUp className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                  {reply.likes > 0 && <span>{reply.likes}</span>}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="offers" className="mt-4">
              <div className="text-center py-8">
                <p className="text-[#8b949e]">No offers yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}