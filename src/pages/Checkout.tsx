
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, CreditCard, Tag } from 'lucide-react';

// Define interfaces
interface Address {
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  cardType: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  isDefault: boolean;
}

interface Coupon {
  code: string;
  discount: number; // Percentage discount
  description: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  // Sample addresses and payment methods (in real app, these would come from a database)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      isDefault: true
    },
    {
      id: '2',
      name: 'Work',
      street: '456 Market St',
      city: 'Business City',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isDefault: false
    }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardType: 'Visa',
      cardNumber: '**** **** **** 1234',
      cardName: 'John Doe',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      cardType: 'Mastercard',
      cardNumber: '**** **** **** 5678',
      cardName: 'John Doe',
      expiry: '09/26',
      isDefault: false
    }
  ]);
  
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>(
    {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    }
  );
  
  const [newPayment, setNewPayment] = useState({
    cardType: 'Visa',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    isDefault: false
  });

  // Available coupons (in a real app, these would be fetched from a database)
  const availableCoupons: Coupon[] = [
    { code: 'WELCOME10', discount: 10, description: 'Welcome discount - 10% off' },
    { code: 'SPRING25', discount: 25, description: 'Spring sale - 25% off' },
    { code: 'FREESHIP', discount: 5, description: 'Free shipping - $5 off' }
  ];
  
  // Set default selected address and payment on component mount
  useEffect(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    } else if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
    
    const defaultPayment = paymentMethods.find(pay => pay.isDefault);
    if (defaultPayment) {
      setSelectedPaymentId(defaultPayment.id);
    } else if (paymentMethods.length > 0) {
      setSelectedPaymentId(paymentMethods[0].id);
    }
  }, [addresses, paymentMethods]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddressId) {
      toast({
        title: "Address required",
        description: "Please select a delivery address",
      });
      return;
    }
    
    if (!selectedPaymentId) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      clearCart();
      navigate('/');
    }, 2000);
  };
  
  const addNewAddress = () => {
    const id = `address-${Date.now()}`;
    const address = { ...newAddress, id };
    
    // If this is the first address or it's marked as default, update other addresses
    if (newAddress.isDefault || addresses.length === 0) {
      setAddresses(prevAddresses => 
        prevAddresses.map(addr => ({ ...addr, isDefault: false }))
      );
    }
    
    setAddresses(prevAddresses => [...prevAddresses, address]);
    setSelectedAddressId(id);
    setIsAddingAddress(false);
    
    toast({
      title: "Address Added",
      description: `${newAddress.name} address has been added.`,
    });
    
    // Reset form
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
  
  const addNewPayment = () => {
    // Basic validation
    if (!newPayment.cardNumber || !newPayment.cardName || !newPayment.expiry || !newPayment.cvv) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all payment details",
      });
      return;
    }
    
    const id = `payment-${Date.now()}`;
    const maskedCardNumber = `**** **** **** ${newPayment.cardNumber.slice(-4)}`;
    
    const payment = {
      id,
      cardType: newPayment.cardType,
      cardNumber: maskedCardNumber,
      cardName: newPayment.cardName,
      expiry: newPayment.expiry,
      isDefault: newPayment.isDefault
    };
    
    // If this is the first payment method or it's marked as default, update other methods
    if (newPayment.isDefault || paymentMethods.length === 0) {
      setPaymentMethods(prevMethods => 
        prevMethods.map(method => ({ ...method, isDefault: false }))
      );
    }
    
    setPaymentMethods(prevMethods => [...prevMethods, payment]);
    setSelectedPaymentId(id);
    setIsAddingPayment(false);
    
    toast({
      title: "Payment Method Added",
      description: `${newPayment.cardType} ending in ${newPayment.cardNumber.slice(-4)} has been added.`,
    });
    
    // Reset form
    setNewPayment({
      cardType: 'Visa',
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      isDefault: false
    });
  };
  
  const applyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid",
      });
      return;
    }
    
    setAppliedCoupon(coupon);
    toast({
      title: "Coupon Applied",
      description: `${coupon.description} has been applied to your order.`,
    });
    
    setCouponCode('');
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    });
  };
  
  // Calculate order totals
  const subtotal = cartTotal;
  const tax = subtotal * 0.07; // 7% tax
  const shipping = 0; // Free shipping
  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.discount / 100)) : 0;
  const total = subtotal + tax + shipping - discountAmount;
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don't have any items in your cart to checkout.
          </p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 dark:text-white">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Delivery Address */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-ecommerce-600 dark:text-ecommerce-400" />
                    <h2 className="text-lg md:text-xl font-bold dark:text-white">Delivery Address</h2>
                  </div>
                  
                  {addresses.length > 0 && (
                    <div className="mb-4">
                      <RadioGroup 
                        value={selectedAddressId || ''} 
                        onValueChange={setSelectedAddressId}
                        className="space-y-3"
                      >
                        {addresses.map((address) => (
                          <div key={address.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={address.id || ''} id={`address-${address.id}`} />
                            <Label 
                              htmlFor={`address-${address.id}`}
                              className="flex-1 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium dark:text-white">{address.name}</span>
                                {address.isDefault && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                  
                  {!isAddingAddress ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddingAddress(true)}
                      className="text-sm w-full mt-2 dark:border-gray-600 dark:text-gray-200"
                    >
                      + Add New Address
                    </Button>
                  ) : (
                    <div className="border p-4 rounded-md mt-4 dark:border-gray-700">
                      <h3 className="font-medium mb-3 text-sm dark:text-white">Add New Address</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="addressName" className="text-sm dark:text-gray-300">Address Name</Label>
                            <Input 
                              id="addressName" 
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm dark:text-gray-300">Country</Label>
                            <Input 
                              id="country" 
                              value={newAddress.country}
                              onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="street" className="text-sm dark:text-gray-300">Street Address</Label>
                          <Input 
                            id="street" 
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm dark:text-gray-300">City</Label>
                            <Input 
                              id="city" 
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm dark:text-gray-300">State/Province</Label>
                            <Input 
                              id="state" 
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="zipCode" className="text-sm dark:text-gray-300">Zip/Postal Code</Label>
                            <Input 
                              id="zipCode" 
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div className="flex items-center pt-7">
                            <input
                              type="checkbox"
                              id="defaultAddress"
                              checked={newAddress.isDefault}
                              onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                              className="mr-2"
                            />
                            <Label htmlFor="defaultAddress" className="text-sm dark:text-gray-300">
                              Set as default
                            </Label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddingAddress(false)}
                            className="text-xs dark:border-gray-600 dark:text-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="button" 
                            onClick={addNewAddress}
                            className="text-xs"
                            disabled={!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country}
                          >
                            Save Address
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Payment Method */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-5 w-5 mr-2 text-ecommerce-600 dark:text-ecommerce-400" />
                    <h2 className="text-lg md:text-xl font-bold dark:text-white">Payment Method</h2>
                  </div>
                  
                  {paymentMethods.length > 0 && (
                    <div className="mb-4">
                      <RadioGroup 
                        value={selectedPaymentId || ''} 
                        onValueChange={setSelectedPaymentId}
                        className="space-y-3"
                      >
                        {paymentMethods.map((payment) => (
                          <div key={payment.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={payment.id} id={`payment-${payment.id}`} />
                            <Label 
                              htmlFor={`payment-${payment.id}`}
                              className="flex-1 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium dark:text-white">{payment.cardType}</span>
                                {payment.isDefault && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {payment.cardNumber} • Expires {payment.expiry}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {payment.cardName}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                  
                  {!isAddingPayment ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddingPayment(true)}
                      className="text-sm w-full mt-2 dark:border-gray-600 dark:text-gray-200"
                    >
                      + Add New Payment Method
                    </Button>
                  ) : (
                    <div className="border p-4 rounded-md mt-4 dark:border-gray-700">
                      <h3 className="font-medium mb-3 text-sm dark:text-white">Add New Payment Method</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="cardType" className="text-sm dark:text-gray-300">Card Type</Label>
                          <Select
                            value={newPayment.cardType}
                            onValueChange={(value) => setNewPayment({...newPayment, cardType: value})}
                          >
                            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Visa">Visa</SelectItem>
                              <SelectItem value="Mastercard">Mastercard</SelectItem>
                              <SelectItem value="American Express">American Express</SelectItem>
                              <SelectItem value="Discover">Discover</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-sm dark:text-gray-300">Card Number</Label>
                          <Input 
                            id="cardNumber" 
                            value={newPayment.cardNumber}
                            onChange={(e) => setNewPayment({...newPayment, cardNumber: e.target.value})}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            maxLength={16}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-sm dark:text-gray-300">Name on Card</Label>
                          <Input 
                            id="cardName" 
                            value={newPayment.cardName}
                            onChange={(e) => setNewPayment({...newPayment, cardName: e.target.value})}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-sm dark:text-gray-300">Expiration Date (MM/YY)</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY"
                              value={newPayment.expiry}
                              onChange={(e) => setNewPayment({...newPayment, expiry: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv" className="text-sm dark:text-gray-300">CVV</Label>
                            <Input 
                              id="cvv" 
                              value={newPayment.cvv}
                              onChange={(e) => setNewPayment({...newPayment, cvv: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              maxLength={4}
                              type="password"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="defaultPayment"
                            checked={newPayment.isDefault}
                            onChange={(e) => setNewPayment({...newPayment, isDefault: e.target.checked})}
                            className="mr-2"
                          />
                          <Label htmlFor="defaultPayment" className="text-sm dark:text-gray-300">
                            Set as default
                          </Label>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddingPayment(false)}
                            className="text-xs dark:border-gray-600 dark:text-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="button" 
                            onClick={addNewPayment}
                            className="text-xs"
                          >
                            Save Payment Method
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Coupons & Discounts */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <div className="flex items-center mb-4">
                    <Tag className="h-5 w-5 mr-2 text-ecommerce-600 dark:text-ecommerce-400" />
                    <h2 className="text-lg md:text-xl font-bold dark:text-white">Coupons & Discounts</h2>
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-md">
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-300">{appliedCoupon.code}</h4>
                        <p className="text-sm text-green-700 dark:text-green-400">{appliedCoupon.description}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={removeCoupon}
                        className="text-xs h-8 dark:border-green-700 dark:text-green-400"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Enter coupon code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <Button 
                        type="button" 
                        onClick={applyCoupon}
                        disabled={!couponCode}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="coupons">
                      <AccordionTrigger className="text-sm dark:text-gray-300">View Available Coupons</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          {availableCoupons.map((coupon) => (
                            <div 
                              key={coupon.code} 
                              className="p-2 border rounded-md flex justify-between items-center dark:border-gray-700"
                            >
                              <div>
                                <div className="font-medium dark:text-white">{coupon.code}</div>
                                <div className="text-gray-600 dark:text-gray-400 text-xs">{coupon.description}</div>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                  setCouponCode(coupon.code);
                                  applyCoupon();
                                }}
                                className="text-xs h-7 dark:border-gray-600 dark:text-gray-300"
                                disabled={appliedCoupon?.code === coupon.code}
                              >
                                {appliedCoupon?.code === coupon.code ? 'Applied' : 'Apply'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isProcessing || !selectedAddressId || !selectedPaymentId}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 shadow-sm sticky top-20">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded border dark:border-gray-700 overflow-hidden flex-shrink-0 mr-2">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-white">{item.product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t dark:border-gray-700 py-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="dark:text-gray-300">Subtotal</p>
                    <p className="dark:text-white">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="dark:text-gray-300">Shipping</p>
                    <p className="dark:text-white">$0.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="dark:text-gray-300">Tax</p>
                    <p className="dark:text-white">${tax.toFixed(2)}</p>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <p>Discount ({appliedCoupon.discount}%)</p>
                      <p>- ${discountAmount.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <div className="border-t dark:border-gray-700 py-4">
                  <div className="flex justify-between text-lg font-bold">
                    <p className="dark:text-white">Total</p>
                    <p className="dark:text-white">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
