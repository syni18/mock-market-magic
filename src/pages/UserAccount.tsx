
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProfileCard } from '@/components/ProfileCard';
import { OrdersList } from '@/components/OrdersList';
import { UserSettings } from '@/components/UserSettings';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Package, Heart, Settings, MapPin, MessageSquare, Percent, CreditCard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { useWishlist } from '@/context/WishlistContext';
import { WishlistTab } from '@/components/WishlistTab';
import { ManageAddressTab } from '@/components/ManageAddressTab';
import { ReviewsRatingTab } from '@/components/ReviewsRatingTab';
import { CouponsOffersTab } from '@/components/CouponsOffersTab';
import { PaymentMethodsTab } from '@/components/PaymentMethodsTab';

const UserAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { items: wishlistItems } = useWishlist();
  
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/account?tab=${tabId}`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistItems.length },
    { id: 'reviews', label: 'Reviews & Ratings', icon: MessageSquare },
    { id: 'coupons', label: 'Coupons & Offers', icon: Percent },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileCard />;
      case 'addresses':
        return <ManageAddressTab />;
      case 'orders':
        return <OrdersList />;
      case 'wishlist':
        return <WishlistTab />;
      case 'reviews':
        return <ReviewsRatingTab />;
      case 'coupons':
        return <CouponsOffersTab />;
      case 'payments':
        return <PaymentMethodsTab />;
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
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-slate-800">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {!isMobile && (
            <div className="lg:w-64 shrink-0">
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
                      onClick={() => handleTabChange(tab.id)}
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
            </div>
          )}
          
          {isMobile && (
            <div className="mb-4">
              <div className="flex overflow-x-auto pb-2 gap-1 no-scrollbar">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    className={`flex items-center gap-1 shrink-0 px-2.5 py-1 text-xs ${
                      activeTab === tab.id ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-200"
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <tab.icon className="h-3 w-3" />
                    <span className="text-xs truncate">{tab.label}</span>
                    {tab.badge ? (
                      <span className="ml-0.5 text-xs bg-white text-indigo-600 rounded-full h-4 w-4 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    ) : null}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
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
