
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Percent, Gift, AlertCircle, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  validUntil: string;
  minPurchase: string;
  conditions: string[];
}

interface Offer {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  image: string;
}

export function CouponsOffersTab() {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Sample data for coupons
  const [coupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME20',
      discount: '20% off',
      validUntil: '2025-12-31',
      minPurchase: '$50',
      conditions: [
        'Valid for first-time customers only',
        'Cannot be combined with other offers',
        'Excludes sale items'
      ]
    },
    {
      id: '2',
      code: 'SUMMER15',
      discount: '15% off',
      validUntil: '2025-06-30',
      minPurchase: '$30',
      conditions: [
        'Valid on summer collection items only',
        'One use per customer'
      ]
    },
    {
      id: '3',
      code: 'FREESHIP',
      discount: 'Free Shipping',
      validUntil: '2025-12-31',
      minPurchase: '$75',
      conditions: [
        'Valid for domestic shipping only',
        'Excludes oversized items'
      ]
    }
  ]);

  // Sample data for offers
  const [offers] = useState<Offer[]>([
    {
      id: '1',
      title: 'Buy One Get One Free',
      description: 'Purchase any item from our new collection and get another item of equal or lesser value for free!',
      validUntil: '2025-05-31',
      image: 'https://via.placeholder.com/300x150'
    },
    {
      id: '2',
      title: 'Flash Sale: 30% Off Electronics',
      description: 'Limited time offer! Get 30% off on all electronics this weekend only.',
      validUntil: '2025-04-30',
      image: 'https://via.placeholder.com/300x150'
    }
  ]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copied!",
      description: "The coupon code has been copied to your clipboard."
    });
    
    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (dateString: string) => {
    return new Date() > new Date(dateString);
  };

  return (
    <div className="space-y-8">
      {/* Coupons Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <Percent className="mr-2 text-indigo-600" />
          My Coupons
        </h2>
        
        <div className="space-y-4">
          {coupons.length === 0 ? (
            <Card className="bg-white shadow-sm border-slate-100 p-8 text-center">
              <div className="text-center py-8">
                <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
                  <Percent className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No coupons available</h3>
                <p className="text-gray-500 mb-6">Check back later for available coupons and discounts.</p>
              </div>
            </Card>
          ) : (
            coupons.map(coupon => (
              <Card 
                key={coupon.id} 
                className={`bg-white shadow-sm ${isExpired(coupon.validUntil) ? 'border-red-100 opacity-60' : 'border-slate-100'}`}
              >
                <div className="relative overflow-hidden">
                  {isExpired(coupon.validUntil) && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold">
                      EXPIRED
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-indigo-700">{coupon.discount}</h3>
                        <p className="text-sm text-gray-600 mt-1">Min. purchase: {coupon.minPurchase}</p>
                        <p className="text-sm text-gray-500">
                          Valid until: {formatDate(coupon.validUntil)}
                        </p>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-100 rounded-md px-4 py-2 font-mono font-medium text-slate-800">
                            {coupon.code}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isExpired(coupon.validUntil)}
                            className={isExpired(coupon.validUntil) ? 'opacity-50' : 'text-indigo-600 hover:bg-indigo-50 border-indigo-200'}
                            onClick={() => handleCopyCode(coupon.code)}
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible className="mt-4 border-t pt-2">
                      <AccordionItem value="conditions">
                        <AccordionTrigger className="text-sm text-indigo-600">
                          Terms & Conditions
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            {coupon.conditions.map((condition, idx) => (
                              <li key={idx}>{condition}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Special Offers Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
          <Gift className="mr-2 text-indigo-600" />
          Special Offers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.length === 0 ? (
            <Card className="bg-white shadow-sm border-slate-100 p-8 text-center col-span-full">
              <div className="text-center py-8">
                <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
                  <Gift className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">No special offers available</h3>
                <p className="text-gray-500 mb-6">Check back later for exclusive deals and promotions.</p>
              </div>
            </Card>
          ) : (
            offers.map(offer => (
              <Card 
                key={offer.id} 
                className={`bg-white shadow-sm ${isExpired(offer.validUntil) ? 'border-red-100 opacity-60' : 'border-slate-100'}`}
              >
                <div className="relative overflow-hidden">
                  {isExpired(offer.validUntil) && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold">
                      EXPIRED
                    </div>
                  )}
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-40 object-cover"
                  />
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                    <p className="text-sm text-gray-700 mb-3">{offer.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Valid until: {formatDate(offer.validUntil)}
                      </p>
                      {!isExpired(offer.validUntil) && (
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Shop Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
