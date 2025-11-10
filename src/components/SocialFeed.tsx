import { useState, useEffect } from "react";
import { 
  User, 
  Music, 
  Heart, 
  Play, 
  MoreHorizontal,
  Users,
  Clock
} from "lucide-react";
import { Button } from "./ui/button-component";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { tuneTONAPI } from "../utils/tuneton-api";
import { JamendoTrack } from "../utils/jamendo-api";

interface SocialActivity {
  id: string;
  user_id: string;
  activity_type: 'play' | 'like' | 'follow' | 'playlist_create';
  target_id?: string;
  target_type?: string;
  content?: string;
  timestamp: string;
  users?: {
    first_name: string;
    username?: string;
    photo_url?: string;
  };
}

interface SocialFeedProps {
  user?: any;
}

export default function SocialFeed({ user }: SocialFeedProps) {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSocialFeed();
      loadFollowing();
    }
  }, [user]);

  const loadSocialFeed = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Fetch real social feed data from the API
      const feedData = await tuneTONAPI.getSocialFeed(user.id);
      
      // Transform the API data to match our SocialActivity interface
      const activities: SocialActivity[] = feedData.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        activity_type: item.activity_type,
        target_id: item.target_id,
        target_type: item.target_type,
        content: item.content,
        timestamp: item.timestamp,
        users: item.users || {
          first_name: 'User',
          username: `user_${item.user_id.substring(0, 8)}`,
          photo_url: ''
        }
      }));
      
      setActivities(activities);
    } catch (error) {
      console.error('Error loading social feed:', error);
      // Fallback to mock data on error
      const mockActivities: SocialActivity[] = [
        {
          id: "1",
          user_id: "user1",
          activity_type: "play",
          target_id: "track1",
          target_type: "track",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          users: {
            first_name: "Alex",
            username: "alex_music",
            photo_url: ""
          }
        },
        {
          id: "2",
          user_id: "user2",
          activity_type: "like",
          target_id: "track2",
          target_type: "track",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          users: {
            first_name: "Taylor",
            username: "taylor_beats",
            photo_url: ""
          }
        },
        {
          id: "3",
          user_id: "user3",
          activity_type: "playlist_create",
          target_id: "playlist1",
          target_type: "playlist",
          content: "Summer Vibes",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          users: {
            first_name: "Jordan",
            username: "jordan_dj",
            photo_url: ""
          }
        }
      ];
      
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowing = async () => {
    if (!user) return;
    
    try {
      const followingData = await tuneTONAPI.getFollowing(user.id);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error loading following:', error);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      const success = await tuneTONAPI.followUser(targetUserId);
      if (success) {
        await loadFollowing();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      const success = await tuneTONAPI.unfollowUser(targetUserId);
      if (success) {
        await loadFollowing();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'play':
        return <Play className="w-4 h-4" />;
      case 'like':
        return <Heart className="w-4 h-4" />;
      case 'follow':
        return <Users className="w-4 h-4" />;
      case 'playlist_create':
        return <Music className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getActivityText = (activity: SocialActivity) => {
    switch (activity.activity_type) {
      case 'play':
        return `is listening to a track`;
      case 'like':
        return `liked a track`;
      case 'follow':
        return `followed a user`;
      case 'playlist_create':
        return `created a playlist: ${activity.content}`;
      default:
        return `did something`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        <h2 className="font-medium">Social Feed</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        {activity.users?.photo_url ? (
                          <AvatarImage src={activity.users.photo_url} />
                        ) : (
                          <AvatarFallback>
                            {activity.users?.first_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {activity.users?.first_name} {activity.users?.username ? `(@${activity.users.username})` : ''}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                {getActivityIcon(activity.activity_type)}
                              </div>
                              <p className="text-sm">
                                {getActivityText(activity)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Activity content preview */}
                        {activity.activity_type === 'play' && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                                <Music className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">Track Title</h4>
                                <p className="text-xs text-muted-foreground">Artist Name</p>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-auto w-8 h-8 p-0">
                                <Play className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {activity.activity_type === 'playlist_create' && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                                <Music className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{activity.content}</h4>
                                <p className="text-xs text-muted-foreground">Playlist • 12 tracks</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No social activity yet</p>
              <p className="text-sm">Follow users to see their activity here</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}