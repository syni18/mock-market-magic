
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileCard } from '@/components/ProfileCard';
import { OrdersList } from '@/components/OrdersList';
import { UserSettings } from '@/components/UserSettings';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { useWishlist } from '@/context/WishlistContext';

const UserAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/signin');
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistItems.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileCard />;
      case 'orders':
        return <OrdersList />;
      case 'wishlist':
        return <Button onClick={() => navigate('/wishlist')} className="bg-indigo-600 hover:bg-indigo-700">Go to Wishlist</Button>;
      case 'settings':
        return <UserSettings />;
      default:
        return <ProfileCard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <Toaster />

      <div className="container py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar / Tab Navigation */}
          <div className={`w-full ${isMobile ? 'mb-6' : 'lg:w-64 shrink-0'}`}>
            {isMobile ? (
              <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    className={`flex items-center gap-2 shrink-0 ${
                      activeTab === tab.id ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-200"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.badge ? (
                      <span className="ml-1 text-xs bg-white text-indigo-600 rounded-full h-5 w-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    ) : null}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                {tabs.map((tab, index) => (
                  <div key={tab.id}>
                    <Button
                      variant="ghost"
                      className={`flex items-center w-full justify-start rounded-none h-12 px-4 ${
                        activeTab === tab.id
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="h-4 w-4 mr-3" />
                      {tab.label}
                      {tab.badge ? (
                        <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5">
                          {tab.badge}
                        </span>
                      ) : null}
                    </Button>
                    {index < tabs.length - 1 && <div className="h-px bg-slate-100" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccount;
