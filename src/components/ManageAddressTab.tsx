import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Edit2, Trash2, MapPinOff, Navigation, Home, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';

interface Address {
  id: string;
  addressType: 'home' | 'office';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  nearBy: string;
  isDefault: boolean;
}

export function ManageAddressTab() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    addressType: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    nearBy: '',
    isDefault: false
  });
  
  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const saveAddress = () => {
    if (isEditingAddress) {
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === isEditingAddress 
            ? { ...newAddress, id: addr.id }
            : newAddress.isDefault ? { ...addr, isDefault: false } : addr
        )
      );
      setIsEditingAddress(null);
      if (!isMobile) {
        toast({
          title: "Address updated",
          description: "Your address has been updated successfully."
        });
      }
    } else {
      const id = Date.now().toString();
      
      if (addresses.length === 0 || newAddress.isDefault) {
        setAddresses(prev => 
          prev.map(addr => ({ ...addr, isDefault: false }))
        );
      }
      
      setAddresses(prev => [...prev, { ...newAddress, id, isDefault: newAddress.isDefault || prev.length === 0 }]);
      if (!isMobile) {
        toast({
          title: "Address added",
          description: "Your new address has been added successfully."
        });
      }
    }
    
    setIsAddingAddress(false);
    setNewAddress({
      addressType: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      nearBy: '',
      isDefault: false
    });
  };

  const editAddress = (address: Address) => {
    setNewAddress(address);
    setIsEditingAddress(address.id);
    setIsAddingAddress(true);
  };

  const deleteAddress = (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    setAddresses(prev => {
      const filteredAddresses = prev.filter(addr => addr.id !== id);
      
      if (addressToDelete?.isDefault && filteredAddresses.length > 0) {
        return filteredAddresses.map((addr, index) => 
          index === 0 ? { ...addr, isDefault: true } : addr
        );
      }
      
      return filteredAddresses;
    });
    
    if (!isMobile) {
      toast({
        title: "Address deleted",
        description: "Your address has been removed successfully."
      });
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
    if (!isMobile) {
      toast({
        title: "Default address updated",
        description: "Your default address has been updated."
      });
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      if (!isMobile) {
        toast({
          title: "Not supported",
          description: "Geolocation is not supported by your browser.",
          variant: "destructive",
        });
      }
      return;
    }
  
    if (!isMobile) {
      toast({
        title: "Detecting location",
        description: "Please allow location access to auto-fill your address.",
      });
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
  
        if (accuracy > 1000) {
          if (!isMobile) {
            toast({
              title: "Low accuracy location",
              description: "We couldn't get a precise location. Please enter manually.",
              variant: "destructive",
            });
          }
          return;
        }
  
        try {
          const gcpMapKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${gcpMapKey}&language=en`
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch address from Google Maps");
          }
  
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
  
            const getComponent = (type: string) =>
              addressComponents.find((c) => c.types.includes(type))?.long_name || "";
  
            setNewAddress((prev) => ({
              ...prev,
              street: getComponent("locality") || getComponent("sublocality") || "",
              city: getComponent("administrative_area_level_3") || getComponent("administrative_area_level_2") || "",
              state: getComponent("administrative_area_level_1") || "",
              zipCode: getComponent("postal_code") || "",
              country: getComponent("country") || "",
            }));
  
            if (!isMobile) {
              toast({
                title: "Location detected",
                description: "Your address has been auto-filled.",
              });
            }
          } else {
            throw new Error("No address results found");
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          if (!isMobile) {
            toast({
              title: "Could not complete address lookup",
              description: "Got your location, but couldn't convert to an address. Please fill manually.",
              variant: "destructive",
            });
          }
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Could not detect your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += " Location access was denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += " Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += " Location request timed out.";
            break;
        }
        if (!isMobile) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center truncate dark:text-white">
          <MapPin className="min-w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          <span className="truncate">Manage Addresses</span>
        </h2>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm whitespace-nowrap ml-2 px-2 md:px-4"
          onClick={() => {
            setIsAddingAddress(true);
            setIsEditingAddress(null);
            setNewAddress({
              addressType: 'home',
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
              nearBy: '',
              isDefault: false
            });
          }}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Address
        </Button>
      </div>
      
      {addresses.length === 0 && !isAddingAddress && (
        <Card className="bg-white shadow-sm border-slate-100 p-4 md:p-8 text-center dark:bg-slate-800 dark:border-slate-700">
          <div className="text-center py-6 md:py-8">
            <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6 dark:bg-indigo-900">
              <MapPinOff className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 dark:text-white">No addresses saved yet</h3>
            <p className="text-gray-500 mb-6 text-sm md:text-base dark:text-gray-400">Add your first address to make checkout faster</p>
            <Button 
              onClick={() => setIsAddingAddress(true)}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>
        </Card>
      )}
      
      {isAddingAddress ? (
        <Card className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="w-full">
              <CardTitle className="flex items-center flex-wrap dark:text-white">
                <span className="mr-auto">{isEditingAddress ? 'Edit Address' : 'Add New Address'}</span>
                {!isMobile && (
                  <Button 
                    variant="outline" 
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
                    onClick={detectLocation}
                    size="sm"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Detect My Location
                  </Button>
                )}
              </CardTitle>
              {isMobile && (
                <Button 
                  variant="outline" 
                  className="mt-2 w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
                  onClick={detectLocation}
                  size="sm"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Detect My Location
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium dark:text-white">Address Type</Label>
              <RadioGroup
                value={newAddress.addressType}
                onValueChange={(value: 'home' | 'office') => 
                  setNewAddress(prev => ({ ...prev, addressType: value }))
                }
                className="flex flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center gap-1.5 cursor-pointer dark:text-white">
                    <Home className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Home
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label htmlFor="office" className="flex items-center gap-1.5 cursor-pointer dark:text-white">
                    <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Office
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street" className="dark:text-white">Street Address</Label>
              <Input 
                id="street" 
                name="street" 
                value={newAddress.street} 
                onChange={handleAddressChange} 
                placeholder="123 Main St"
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nearBy" className="dark:text-white">Near By</Label>
              <Input 
                id="nearBy" 
                name="nearBy" 
                value={newAddress.nearBy} 
                onChange={handleAddressChange} 
                placeholder="Near Shopping Mall, Landmark, etc."
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="dark:text-white">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={newAddress.city} 
                  onChange={handleAddressChange} 
                  placeholder="New York"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="dark:text-white">State/Province</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={newAddress.state} 
                  onChange={handleAddressChange} 
                  placeholder="NY"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="dark:text-white">ZIP/Postal Code</Label>
                <Input 
                  id="zipCode" 
                  name="zipCode" 
                  value={newAddress.zipCode} 
                  onChange={handleAddressChange} 
                  placeholder="10001"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="dark:text-white">Country</Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={newAddress.country} 
                  onChange={handleAddressChange} 
                  placeholder="USA"
                  className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="default"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700"
                checked={newAddress.isDefault}
                onChange={() => 
                  setNewAddress(prev => ({ ...prev, isDefault: !prev.isDefault }))
                }
              />
              <Label htmlFor="default" className="text-sm font-medium dark:text-white">
                Set as default address
              </Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingAddress(false);
                  setIsEditingAddress(null);
                }}
                className="dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                onClick={saveAddress}
                disabled={!newAddress.street || !newAddress.city || !newAddress.zipCode}
              >
                {isEditingAddress ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <Card key={address.id} className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {address.addressType === 'home' ? (
                        <Home className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-sm md:text-base dark:text-white">
                          {address.addressType === 'home' ? 'Home' : 'Office'}
                        </h3>
                        {address.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mt-1 dark:text-gray-300">{address.street}</p>
                      {address.nearBy && (
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Near: {address.nearBy}</p>
                      )}
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{address.country}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex mt-4 space-x-2 justify-end">
                  {!address.isDefault && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                      className="text-indigo-600 hover:bg-indigo-50 border-indigo-200 text-xs md:text-sm dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => editAddress(address)}
                    className="text-slate-700 hover:bg-slate-50 text-xs md:text-sm dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAddress(address.id)}
                    disabled={address.isDefault}
                    className={`text-xs md:text-sm ${address.isDefault ? 'text-slate-400 dark:text-slate-600' : 'text-red-500 hover:bg-red-50 border-red-200 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/30'}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
