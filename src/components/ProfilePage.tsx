import React, { useState } from 'react';
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

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample user data
  const user = {
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isPremium: true,
    joinDate: 'Joined March 2023',
    level: 12,
    stars: 247
  };

  // Stats data
  const stats: StatItem[] = [
    { label: 'Playlists', value: 12 },
    { label: 'Tracks Played', value: '1.2K' },
    { label: 'Favorites', value: 342 },
    { label: 'Contests', value: 8 }
  ];

  // Recent activity
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
              src={user.avatar} 
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {user.isPremium && (
              <div className="absolute -bottom-1 -right-1 bg-[#FFD700] rounded-full p-1">
                <Star className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-[#8B949E]">{user.username}</p>
            <p className="text-xs text-[#8B949E]">{user.joinDate}</p>
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