import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Heart, 
  Music, 
  Trophy, 
  Calendar, 
  BarChart3, 
  Share2, 
  Edit3,
  LogOut,
  Shield,
  HelpCircle,
  Moon,
  Bell,
  Lock,
  Palette,
  Download,
  Star,
  Clock
} from 'lucide-react';
import { useTelegramAuth } from './TelegramAuthProvider';
import { supabase } from '../utils/telegramAuth';

interface StatItem {
  label: string;
  value: string | number;
}

interface ActivityItem {
  id: string;
  action: string;
  target: string;
  time: string;
}

interface UserData {
  id: string;
  telegram_id: number;
  username: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  is_premium: boolean;
  bio: string;
  is_verified: boolean;
  is_artist: boolean;
  created_at: string;
}

interface UserStats {
  playlists: number;
  tracks_played: number;
  favorites: number;
  contests: number;
}

interface UserLevel {
  level: number;
  experience_points: number;
}

interface UserBalance {
  stars: number;
  toncoin: number;
  ethereum: number;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: telegramUser } = useTelegramAuth();

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_id', telegramUser?.id)
          .single();

        if (userError) {
          throw new Error(`Failed to fetch user data: ${userError.message}`);
        }

        setUserData(userData);

        // Get user stats
        const { count: playlistsCount } = await supabase
          .from('playlists')
          .select('*', { count: 'exact' })
          .eq('user_id', userData.id);

        const { count: likedTracksCount } = await supabase
          .from('liked_tracks')
          .select('*', { count: 'exact' })
          .eq('user_id', userData.id);

        setUserStats({
          playlists: playlistsCount || 0,
          tracks_played: 0, // This would need to be implemented
          favorites: likedTracksCount || 0,
          contests: 0 // This would need to be implemented
        });

        // Get user level
        const { data: levelData, error: levelError } = await supabase
          .from('user_levels')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        if (!levelError && levelData) {
          setUserLevel(levelData);
        }

        // Get user balance
        const { data: balanceData, error: balanceError } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        if (!balanceError && balanceData) {
          setUserBalance(balanceData);
        }
        
        // Fetch recent activity would go here
        // For now, we'll keep the sample data
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (telegramUser?.id) {
      fetchUserData();
    }
  }, [telegramUser]);

  // Format user data for display
  const displayName = userData?.first_name + (userData?.last_name ? ` ${userData.last_name}` : '');
  const username = userData?.username ? `@${userData.username}` : '';
  const avatarUrl = userData?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=0D1117&color=E6EDF3`;
  const joinDate = userData?.created_at ? `Joined ${new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : '';
  const level = userLevel?.level || 1;
  const stars = userBalance?.stars || 0;
  const isPremium = userData?.is_premium || false;

  // Stats data
  const stats: StatItem[] = [
    { label: 'Playlists', value: userStats?.playlists || 0 },
    { label: 'Tracks Played', value: userStats?.tracks_played || 0 },
    { label: 'Favorites', value: userStats?.favorites || 0 },
    { label: 'Contests', value: userStats?.contests || 0 }
  ];

  // Recent activity (this would need to be fetched from the database)
  const recentActivity: ActivityItem[] = [
    { id: '1', action: 'Created', target: 'Chill Vibes Playlist', time: '2 hours ago' },
    { id: '2', action: 'Liked', target: 'Midnight Groove', time: '5 hours ago' },
    { id: '3', action: 'Joined', target: 'Remix Rumble Contest', time: '1 day ago' },
    { id: '4', action: 'Played', target: 'Focus Beats', time: '2 days ago' }
  ];

  // Menu items
  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications') },
    { icon: Palette, label: 'Appearance', action: () => console.log('Appearance') },
    { icon: Download, label: 'Offline Mode', action: () => console.log('Offline Mode') },
    { icon: Shield, label: 'Privacy', action: () => console.log('Privacy') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help & Support') },
    { icon: LogOut, label: 'Log Out', action: () => console.log('Log Out') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">Error Loading Profile</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">👤</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">User Not Found</h2>
            <p className="text-sm text-muted-foreground max-w-sm">Unable to load your profile data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-[#30363D]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button className="p-2 rounded-full hover:bg-[#21262D]">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Profile Info */}
      <div className="p-4 border-b border-[#30363D]">
        <div className="flex items-center mb-4">
          <div className="relative">
            <img 
              src={avatarUrl} 
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 bg-[#FFD700] rounded-full p-1">
                <Star className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-semibold">{displayName}</h2>
            <p className="text-sm text-[#8B949E]">{username}</p>
            <p className="text-xs text-[#8B949E]">{joinDate}</p>
          </div>
          <button className="p-2 rounded-full hover:bg-[#21262D]">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
        
        {/* User Stats */}
        <div className="flex justify-between py-2">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-[#8B949E]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#30363D]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === 'overview' 
              ? 'text-[#58A6FF] border-b-2 border-[#58A6FF]' 
              : 'text-[#8B949E]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === 'activity' 
              ? 'text-[#58A6FF] border-b-2 border-[#58A6FF]' 
              : 'text-[#8B949E]'
          }`}
        >
          Activity
        </button>
      </div>
      
      {/* Tab Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'overview' ? (
          <div className="p-4 space-y-6">
            {/* Recent Activity */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center p-3 bg-[#161B22] rounded-lg">
                    <div className="bg-[#21262D] rounded-full p-2 mr-3">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span> {activity.target}
                      </p>
                      <p className="text-xs text-[#8B949E]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Achievements */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#161B22] rounded-lg p-3 text-center">
                  <Trophy className="w-6 h-6 text-[#FFD700] mx-auto mb-1" />
                  <p className="text-xs">Top Listener</p>
                </div>
                <div className="bg-[#161B22] rounded-lg p-3 text-center">
                  <Star className="w-6 h-6 text-[#58A6FF] mx-auto mb-1" />
                  <p className="text-xs">Contest Winner</p>
                </div>
                <div className="bg-[#161B22] rounded-lg p-3 text-center">
                  <Heart className="w-6 h-6 text-[#FF6B6B] mx-auto mb-1" />
                  <p className="text-xs">Super Fan</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">Activity Feed</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 bg-[#161B22] rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{activity.action} {activity.target}</p>
                      <p className="text-sm text-[#8B949E]">{activity.time}</p>
                    </div>
                    <button className="text-[#8B949E] hover:text-[#E6EDF3]">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Menu */}
        <div className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex items-center w-full p-3 rounded-lg hover:bg-[#161B22] transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3 text-[#8B949E]" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;