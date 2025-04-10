
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Edit2, Trash2, MapPinOff, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export function ManageAddressTab() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  
  // Load addresses from localStorage on component mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);
  
  // Save addresses to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };
  
  const saveAddress = () => {
    if (isEditingAddress) {
      // Update existing address
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === isEditingAddress 
            ? { ...newAddress, id: addr.id }
            : newAddress.isDefault ? { ...addr, isDefault: false } : addr
        )
      );
      setIsEditingAddress(null);
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully."
      });
    } else {
      // Create new address
      const id = Date.now().toString();
      
      // If this is the first address or is set as default
      if (addresses.length === 0 || newAddress.isDefault) {
        setAddresses(prev => 
          prev.map(addr => ({ ...addr, isDefault: false }))
        );
      }
      
      setAddresses(prev => [...prev, { ...newAddress, id, isDefault: newAddress.isDefault || prev.length === 0 }]);
      toast({
        title: "Address added",
        description: "Your new address has been added successfully."
      });
    }
    
    setIsAddingAddress(false);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
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
      
      // If we're deleting the default address and there are other addresses,
      // set the first remaining address as default
      if (addressToDelete?.isDefault && filteredAddresses.length > 0) {
        return filteredAddresses.map((addr, index) => 
          index === 0 ? { ...addr, isDefault: true } : addr
        );
      }
      
      return filteredAddresses;
    });
    
    toast({
      title: "Address deleted",
      description: "Your address has been removed successfully."
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
    toast({
      title: "Default address updated",
      description: "Your default address has been updated."
    });
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Detecting location",
        description: "Please allow location access to auto-fill your address."
      });
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding API to get the address from coordinates
            const { latitude, longitude } = position.coords;
            
            // Use a more reliable geocoding service
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=7d8554a463424f5e81a9b3279a0e9d54`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch address information');
            }
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const properties = data.features[0].properties;
              
              // Update the form with the geocoded information
              setNewAddress(prev => ({
                ...prev,
                street: properties.street || properties.road || '',
                city: properties.city || properties.town || properties.village || '',
                state: properties.state || properties.county || '',
                zipCode: properties.postcode || '',
                country: properties.country || '',
              }));
              
              toast({
                title: "Location detected",
                description: "Your address has been auto-filled based on your location."
              });
            } else {
              throw new Error('No address details found');
            }
          } catch (error) {
            console.error("Error getting address from coordinates:", error);
            toast({
              title: "Could not complete address lookup",
              description: "Got your location, but couldn't convert to an address. Please fill in manually.",
              variant: "destructive"
            });
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
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive"
          });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center truncate">
          <MapPin className="min-w-5 h-5 mr-2 text-indigo-600" />
          <span className="truncate">Manage Addresses</span>
        </h2>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm whitespace-nowrap ml-2 px-2 md:px-4"
          onClick={() => {
            setIsAddingAddress(true);
            setIsEditingAddress(null);
            setNewAddress({
              name: '',
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
              isDefault: false
            });
          }}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Address
        </Button>
      </div>
      
      {addresses.length === 0 && !isAddingAddress && (
        <Card className="bg-white shadow-sm border-slate-100 p-4 md:p-8 text-center">
          <div className="text-center py-6 md:py-8">
            <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
              <MapPinOff className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No addresses saved yet</h3>
            <p className="text-gray-500 mb-6 text-sm md:text-base">Add your first address to make checkout faster</p>
            <Button 
              onClick={() => setIsAddingAddress(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>
        </Card>
      )}
      
      {isAddingAddress ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>{isEditingAddress ? 'Edit Address' : 'Add New Address'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Address Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newAddress.name} 
                  onChange={handleAddressChange} 
                  placeholder="Home, Work, etc."
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button 
                  variant="outline" 
                  className="mb-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  onClick={detectLocation}
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Detect My Location
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input 
                id="street" 
                name="street" 
                value={newAddress.street} 
                onChange={handleAddressChange} 
                placeholder="123 Main St"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={newAddress.city} 
                  onChange={handleAddressChange} 
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={newAddress.state} 
                  onChange={handleAddressChange} 
                  placeholder="NY"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input 
                  id="zipCode" 
                  name="zipCode" 
                  value={newAddress.zipCode} 
                  onChange={handleAddressChange} 
                  placeholder="10001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={newAddress.country} 
                  onChange={handleAddressChange} 
                  placeholder="USA"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="default"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={newAddress.isDefault}
                onChange={() => 
                  setNewAddress(prev => ({ ...prev, isDefault: !prev.isDefault }))
                }
              />
              <Label htmlFor="default" className="text-sm font-medium">
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
              >
                Cancel
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
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
            <Card key={address.id} className="bg-white shadow-sm border-slate-100">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-sm md:text-base">{address.name}</h3>
                        {address.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">{address.street}</p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">{address.country}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex mt-4 space-x-2 justify-end">
                  {!address.isDefault && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                      className="text-indigo-600 hover:bg-indigo-50 border-indigo-200 text-xs md:text-sm"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => editAddress(address)}
                    className="text-slate-700 hover:bg-slate-50 text-xs md:text-sm"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAddress(address.id)}
                    disabled={address.isDefault}
                    className={`text-xs md:text-sm ${address.isDefault ? 'text-slate-400' : 'text-red-500 hover:bg-red-50 border-red-200'}`}
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
