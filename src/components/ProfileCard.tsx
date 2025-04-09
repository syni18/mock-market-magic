
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, LogOut, PenLine, Calendar, Home, Globe } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ProfileCard = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Section editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    city: user?.user_metadata?.city || '',
    state: user?.user_metadata?.state || '',
    zipCode: user?.user_metadata?.zip_code || '',
    country: user?.user_metadata?.country || '',
    dob: user?.user_metadata?.dob || '',
    website: user?.user_metadata?.website || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSection = async (section: string) => {
    setLoading(true);
    // Here you would typically make an API call to update the user profile
    // For now we'll just simulate with a timeout
    setTimeout(() => {
      setLoading(false);
      setEditingSection(null);
    }, 800);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to storage
      // For now we'll just simulate with a timeout
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // In real implementation, you would update the avatar URL
      }, 1000);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://via.placeholder.com/150';
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!formData.name) return "U";
    
    const names = formData.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };
  
  return (
    <Card className="w-full bg-white shadow-sm border-slate-100">
      <CardHeader className="pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-indigo-100">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-indigo-600 text-white text-xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <button 
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md hover:bg-indigo-700 transition-colors"
                onClick={handleAvatarClick}
              >
                <PenLine className="h-3.5 w-3.5" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 md:self-start"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        {/* Personal Information Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-slate-800">Personal Information</h3>
            {editingSection !== 'personal' ? (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-indigo-600 hover:bg-indigo-50"
                onClick={() => setEditingSection('personal')}
              >
                <PenLine className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:bg-slate-50"
                  onClick={() => setEditingSection(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleSaveSection('personal')}
                  disabled={loading}
                >
                  {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                  Save
                </Button>
              </div>
            )}
          </div>
          
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <User className="h-4 w-4 mr-2 text-indigo-500" /> Full Name
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'personal' ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.name || "Not set"}</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <Mail className="h-4 w-4 mr-2 text-indigo-500" /> Email
              </div>
              <div className="w-full md:w-2/3">
                <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.email}</div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <Phone className="h-4 w-4 mr-2 text-indigo-500" /> Phone
              </div>
              <div className="w-full md:w-2/3">
                <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.phone || "Not set"}</div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500" /> Date of Birth
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'personal' ? (
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.dob || "Not set"}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Address Information Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-slate-800">Address Information</h3>
            {editingSection !== 'address' ? (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-indigo-600 hover:bg-indigo-50"
                onClick={() => setEditingSection('address')}
              >
                <PenLine className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:bg-slate-50"
                  onClick={() => setEditingSection(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleSaveSection('address')}
                  disabled={loading}
                >
                  {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                  Save
                </Button>
              </div>
            )}
          </div>
          
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <Home className="h-4 w-4 mr-2 text-indigo-500" /> Street Address
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'address' ? (
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.address || "Not set"}</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <MapPin className="h-4 w-4 mr-2 text-indigo-500" /> City
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'address' ? (
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.city || "Not set"}</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <MapPin className="h-4 w-4 mr-2 text-indigo-500" /> State/Province
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'address' ? (
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.state || "Not set"}</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <MapPin className="h-4 w-4 mr-2 text-indigo-500" /> Zip/Postal Code
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'address' ? (
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.zipCode || "Not set"}</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/3 font-medium text-slate-600 flex items-center mb-1 md:mb-0">
                <Globe className="h-4 w-4 mr-2 text-indigo-500" /> Country
              </div>
              <div className="w-full md:w-2/3">
                {editingSection === 'address' ? (
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border-indigo-100 focus-visible:ring-indigo-300"
                  />
                ) : (
                  <div className="text-slate-800 py-2 px-3 bg-slate-50 rounded-md">{formData.country || "Not set"}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
