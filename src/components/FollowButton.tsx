import { useState, useEffect } from "react";
import { Button } from "./ui/button-component";
import { tuneTONAPI } from "../utils/tuneton-api";
import { UserPlus, UserCheck } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  userId?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
}

export default function FollowButton({ 
  targetUserId, 
  userId,
  variant = "default",
  size = "default"
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && targetUserId) {
      checkFollowStatus();
    }
  }, [userId, targetUserId]);

  const checkFollowStatus = async () => {
    try {
      const following = await tuneTONAPI.isFollowing(targetUserId);
      setIsFollowing(following);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const success = await tuneTONAPI.followUser(targetUserId);
      if (success) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const success = await tuneTONAPI.unfollowUser(targetUserId);
      if (success) {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId || userId === targetUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "secondary" : variant}
      size={size}
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  );
}