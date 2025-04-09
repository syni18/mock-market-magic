
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useIsMobile } from '@/hooks/use-mobile';

export const ProfileCard = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Here you would typically make an API call to update the user profile
    // For now we'll just simulate with a timeout
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
    }, 800);
  };

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://via.placeholder.com/150';
  
  return (
    <Card className="w-full bg-white shadow-sm border-slate-100">
      <CardHeader className="pb-4 relative">
        <div className="absolute right-6 top-6">
          <Button 
            variant="ghost" 
            className="text-slate-500 hover:text-red-500 hover:bg-red-50"
            onClick={signOut}
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!isMobile && "Sign Out"}
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-indigo-100 mb-4">
            <img 
              src={avatarUrl} 
              alt={formData.name || "User"} 
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
          <p className="text-slate-500">{user.email}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-indigo-500" />
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border-indigo-100 focus-visible:ring-indigo-300"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-indigo-500" />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                disabled
                className="border-indigo-100 bg-slate-50"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-indigo-500" />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border-indigo-100 focus-visible:ring-indigo-300"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border-indigo-100 focus-visible:ring-indigo-300"
              />
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <div className="py-3 flex">
              <div className="w-1/3 font-medium text-slate-600 flex items-center">
                <User className="h-4 w-4 mr-2 text-indigo-500" /> Name
              </div>
              <div className="w-2/3 text-slate-800">{formData.name || "Not set"}</div>
            </div>
            
            <div className="py-3 flex">
              <div className="w-1/3 font-medium text-slate-600 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-indigo-500" /> Email
              </div>
              <div className="w-2/3 text-slate-800">{formData.email}</div>
            </div>
            
            <div className="py-3 flex">
              <div className="w-1/3 font-medium text-slate-600 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-indigo-500" /> Phone
              </div>
              <div className="w-2/3 text-slate-800">{formData.phone || "Not set"}</div>
            </div>
            
            <div className="py-3 flex">
              <div className="w-1/3 font-medium text-slate-600 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-indigo-500" /> Address
              </div>
              <div className="w-2/3 text-slate-800">{formData.address || "Not set"}</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end">
        {isEditing ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
