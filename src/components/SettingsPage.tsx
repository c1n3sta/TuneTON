import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, Palette, Info, Database, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button-component";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { tuneTONAPI } from "../utils/tuneton-api";

interface SettingsPageProps {
  onBack: () => void;
  onNavigate: (page: string, tab?: string) => void;
  user: any;
}

export default function SettingsPage({ onBack, onNavigate, user }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [isFixingRLS, setIsFixingRLS] = useState(false);
  const [rlsStatus, setRlsStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFixRLS = async () => {
    setIsFixingRLS(true);
    setRlsStatus('idle');
    
    try {
      const result = await tuneTONAPI.fixRLS();
      console.log('RLS Fix Result:', result);
      
      if ('success' in result && result.success) {
        setRlsStatus('success');
      } else {
        setRlsStatus('error');
      }
    } catch (error) {
      console.error('RLS Fix Error:', error);
      setRlsStatus('error');
    } finally {
      setIsFixingRLS(false);
    }
  };

  const settingsOptions = [
    {
      icon: User,
      title: "Account",
      description: "Manage your profile and account settings",
      action: () => onNavigate("Profile", "profile")
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Control notification preferences",
      toggle: { value: notifications, onChange: setNotifications }
    },
    {
      icon: Shield,
      title: "Privacy",
      description: "Privacy and security settings"
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize the app's look and feel"
    }
  ];

  const audioSettings = [
    {
      title: "Auto-play next track",
      description: "Automatically play the next song in queue",
      toggle: { value: autoPlay, onChange: setAutoPlay }
    },
    {
      title: "High quality audio",
      description: "Stream in higher quality (uses more data)",
      toggle: { value: highQuality, onChange: setHighQuality }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsOptions.map((option, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <option.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                {option.toggle ? (
                  <Switch
                    checked={option.toggle.value}
                    onCheckedChange={option.toggle.onChange}
                  />
                ) : (
                  <Button variant="ghost" size="sm" onClick={option.action}>
                    View
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Audio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {audioSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{setting.title}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={setting.toggle.value}
                  onCheckedChange={setting.toggle.onChange}
                />
              </div>
            ))}
          </CardContent>
        </Card>


        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">TuneTON Music Platform</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="text-sm text-muted-foreground">
                Built on TON Blockchain with Telegram integration
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}