
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Bell, Shield, Sun, Moon, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';

// Create a new ThemeContext to manage dark mode state
export const UserSettings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
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
  
  const handleThemeToggle = () => {
    toggleTheme();
    toast({
      title: "Theme changed",
      description: `${isDarkMode ? 'Light' : 'Dark'} mode enabled.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <Settings className="mr-2 text-indigo-600 dark:text-indigo-400" /> Settings
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
              onCheckedChange={handleThemeToggle}
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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.2 6.75C14.58 6.75 16.55 8.72 16.55 11.1H7.85C7.85 8.72 9.82 6.75 12.2 6.75Z" fill="currentColor"/>
                  <path d="M16.55 12.65V19.6C16.55 21.03 15.38 22.2 13.95 22.2H10.45C9.02 22.2 7.85 21.03 7.85 19.6V12.65H16.55Z" fill="currentColor"/>
                  <path d="M15.3 3.95L13.05 1.7C12.72 1.37 12.18 1.37 11.85 1.7L9.6 3.95C9.28 4.28 9.28 4.81 9.6 5.14C9.93 5.47 10.46 5.47 10.79 5.14L11.8 4.13V5.8C11.8 6.24 12.16 6.6 12.6 6.6C13.04 6.6 13.4 6.24 13.4 5.8V4.13L14.41 5.14C14.57 5.3 14.78 5.38 14.99 5.38C15.2 5.38 15.41 5.3 15.57 5.14C15.72 4.81 15.62 4.28 15.3 3.95Z" fill="currentColor"/>
                </svg>
                App Store
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 text-xs md:text-sm"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.77 10.32L6.22 4.06C5.94 3.9 5.6 3.91 5.33 4.07C5.05 4.23 4.88 4.52 4.88 4.84V19.17C4.88 19.49 5.05 19.77 5.33 19.93C5.46 20 5.61 20.03 5.76 20.03C5.89 20.03 6.03 20 6.16 19.94L17.77 13.68C18.04 13.53 18.21 13.25 18.21 12.95C18.21 12.65 18.04 12.37 17.77 12.22V10.32Z" fill="currentColor"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
