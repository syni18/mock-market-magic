
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Bell, Shield, CreditCard, Edit2, Sun, Moon, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const UserSettings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
    storePaymentInfo: true,
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
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Settings className="mr-2 text-indigo-600" /> Settings
        </h2>
      </div>
      
      {/* Appearance Settings */}
      <Card className="bg-white shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            {isDarkMode ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Dark Mode</span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Responsive Mode</span>
            </div>
            <Switch checked={true} disabled />
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Settings */}
      <Card className="bg-white shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Order Updates</span>
              </div>
              <Switch
                checked={notificationSettings.orderUpdates}
                onCheckedChange={() => updateNotificationSetting('orderUpdates')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Promotions & Discounts</span>
              </div>
              <Switch
                checked={notificationSettings.promotions}
                onCheckedChange={() => updateNotificationSetting('promotions')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Product Restock</span>
              </div>
              <Switch
                checked={notificationSettings.productRestock}
                onCheckedChange={() => updateNotificationSetting('productRestock')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>New Offers</span>
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
      <Card className="bg-white shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Share Usage Data</span>
              </div>
              <Switch
                checked={privacySettings.shareUsageData}
                onCheckedChange={() => updatePrivacySetting('shareUsageData')}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-700`}>Store Payment Information</span>
              </div>
              <Switch
                checked={privacySettings.storePaymentInfo}
                onCheckedChange={() => updatePrivacySetting('storePaymentInfo')}
              />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button variant="outline" className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Actions */}
      <Card className="bg-white shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-4 w-4 mr-2" /> 
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            <div className="flex items-center">
              <div className="w-10 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Expires 12/25</p>
              </div>
            </div>
          </div>
          <div className="pt-3">
            <Button variant="outline" className="flex items-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200">
              <Edit2 className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Mobile App */}
      <Card className="bg-white shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-2">
            <p className="text-slate-600 mb-4">Get our mobile app for a better shopping experience</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                className="border-slate-200 bg-slate-50 hover:bg-slate-100"
              >
                <img src="https://via.placeholder.com/20" alt="App Store" className="w-5 h-5 mr-2" />
                App Store
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 bg-slate-50 hover:bg-slate-100"
              >
                <img src="https://via.placeholder.com/20" alt="Google Play" className="w-5 h-5 mr-2" />
                Google Play
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
