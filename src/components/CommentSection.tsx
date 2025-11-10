import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Send, 
  MoreHorizontal, 
  Heart, 
  Reply,
  User
} from "lucide-react";
import { Button } from "./ui/button-component";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { tuneTONAPI } from "../utils/tuneton-api";
import { toast } from "sonner";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string;
  users?: {
    first_name: string;
    username?: string;
    photo_url?: string;
  };
}

interface CommentSectionProps {
  entityType: string;
  entityId: string;
  user?: any;
}

export default function CommentSection({ entityType, entityId, user }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [entityType, entityId]);

  const loadComments = async () => {
    try {
      const commentData: any[] = await tuneTONAPI.getEntityComments(entityType, entityId);
      setComments(commentData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setLoading(true);
      const success = await tuneTONAPI.addComment(entityType, entityId, newComment);
      
      if (success) {
        setNewComment("");
        await loadComments();
        toast.success('Comment added successfully');
      } else {
        toast.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!replyContent.trim() || !user) return;

    try {
      setLoading(true);
      const success = await tuneTONAPI.addComment(entityType, entityId, replyContent, parentCommentId);
      
      if (success) {
        setReplyContent("");
        setReplyingTo(null);
        await loadComments();
        toast.success('Reply added successfully');
      } else {
        toast.error('Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group comments and replies
  const topLevelComments = comments.filter(comment => !comment.parent_comment_id);
  const replies = comments.filter(comment => comment.parent_comment_id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-medium">Comments</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      {/* Add Comment Form */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                {user.photo_url ? (
                  <AvatarImage src={user.photo_url} />
                ) : (
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                  rows={2}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={loading || !newComment.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.map((comment) => {
          const commentReplies = replies.filter(reply => reply.parent_comment_id === comment.id);
          
          return (
            <div key={comment.id} className="space-y-4">
              {/* Top Level Comment */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      {comment.users?.photo_url ? (
                        <AvatarImage src={comment.users.photo_url} />
                      ) : (
                        <AvatarFallback>
                          {comment.users?.first_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.users?.first_name} {comment.users?.username ? `(@${comment.users.username})` : ''}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                          <Heart className="w-3 h-3 mr-1" />
                          Like
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-6 px-2"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 pl-4 border-l-2 border-border">
                          <div className="flex gap-2">
                            <Avatar className="w-6 h-6">
                              {user?.photo_url ? (
                                <AvatarImage src={user.photo_url} />
                              ) : (
                                <AvatarFallback className="text-xs">
                                  <User className="w-3 h-3" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="mb-2 text-xs"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  className="h-6 text-xs"
                                  onClick={() => setReplyingTo(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="h-6 text-xs"
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={loading || !replyContent.trim()}
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Replies */}
              {commentReplies.length > 0 && (
                <div className="pl-8 space-y-3">
                  {commentReplies.map((reply) => (
                    <Card key={reply.id}>
                      <CardContent className="p-3">
                        <div className="flex gap-2">
                          <Avatar className="w-6 h-6">
                            {reply.users?.photo_url ? (
                              <AvatarImage src={reply.users.photo_url} />
                            ) : (
                              <AvatarFallback className="text-xs">
                                {reply.users?.first_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">
                                {reply.users?.first_name} {reply.users?.username ? `(@${reply.users.username})` : ''}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.created_at)}
                              </span>
                            </div>
                            <p className="text-xs mb-1">{reply.content}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-xs h-5 px-1">
                                <Heart className="w-2 h-2 mr-1" />
                                Like
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-5 px-1"
                                onClick={() => {
                                  setReplyingTo(reply.id);
                                  setReplyContent(`@${reply.users?.username || reply.users?.first_name} `);
                                }}
                              >
                                <Reply className="w-2 h-2 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No comments yet</p>
          <p className="text-sm">Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}