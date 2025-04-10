
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Bell, Shield, Sun, Moon, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Create a new ThemeContext to manage dark mode state
export const UserSettings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Check initial dark mode preference 
  const getInitialDarkMode = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  
  // Apply dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    productRestock: true,
    newOffers: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareUsageData: true,
  });
  
  const updateNotificationSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Settings updated",
      description: `${setting} notifications ${notificationSettings[setting] ? 'disabled' : 'enabled'}.`,
    });
  };
  
  const updatePrivacySetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Privacy setting updated",
      description: `${setting} setting ${privacySettings[setting] ? 'disabled' : 'enabled'}.`,
    });
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    toast({
      title: "Theme changed",
      description: `${isDarkMode ? 'Light' : 'Dark'} mode enabled.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center">
          <Settings className="mr-2 text-indigo-600" /> Settings
        </h2>
      </div>
      
      {/* Appearance Settings */}
      <Card className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center">
            {isDarkMode ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">Dark Mode</span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Settings */}
      <Card className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">Order Updates</span>
              </div>
              <Switch
                checked={notificationSettings.orderUpdates}
                onCheckedChange={() => updateNotificationSetting('orderUpdates')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">Promotions & Discounts</span>
              </div>
              <Switch
                checked={notificationSettings.promotions}
                onCheckedChange={() => updateNotificationSetting('promotions')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">Product Restock</span>
              </div>
              <Switch
                checked={notificationSettings.productRestock}
                onCheckedChange={() => updateNotificationSetting('productRestock')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">New Offers</span>
              </div>
              <Switch
                checked={notificationSettings.newOffers}
                onCheckedChange={() => updateNotificationSetting('newOffers')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">Share Usage Data</span>
              </div>
              <Switch
                checked={privacySettings.shareUsageData}
                onCheckedChange={() => updatePrivacySetting('shareUsageData')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Mobile App */}
      <Card className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-2">
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-xs md:text-sm">Get our mobile app for a better shopping experience</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                className="border-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 text-xs md:text-sm"
              >
                <img src="https://via.placeholder.com/20" alt="App Store" className="w-4 h-4 mr-2" />
                App Store
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 text-xs md:text-sm"
              >
                <img src="https://via.placeholder.com/20" alt="Google Play" className="w-4 h-4 mr-2" />
                Google Play
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
