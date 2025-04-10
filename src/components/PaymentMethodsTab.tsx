
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Trash2, Edit2, Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFour: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export function PaymentMethodsTab() {
  const { toast } = useToast();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '4242',
      cardholderName: 'John Doe',
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '5678',
      cardholderName: 'John Doe',
      expiryMonth: '06',
      expiryYear: '24',
      isDefault: false
    }
  ]);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    type: 'visa',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const detectCardType = (cardNumber: string) => {
    // Basic regex patterns for card detection
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type as 'visa' | 'mastercard' | 'amex' | 'discover';
      }
    }
    return 'visa'; // Default to visa
  };

  const saveCard = () => {
    if (newCard.cardNumber.length < 13) {
      toast({
        title: "Invalid card number",
        description: "Please enter a valid card number",
        variant: "destructive"
      });
      return;
    }

    const lastFour = newCard.cardNumber.slice(-4);
    const cardType = detectCardType(newCard.cardNumber);
    
    if (isEditingCard) {
      // Update existing card
      setPaymentMethods(prev => 
        prev.map(card => 
          card.id === isEditingCard 
            ? {
                ...card,
                type: cardType,
                lastFour,
                cardholderName: newCard.cardholderName,
                expiryMonth: newCard.expiryMonth,
                expiryYear: newCard.expiryYear,
                isDefault: newCard.isDefault ? true : card.isDefault
              }
            : newCard.isDefault ? { ...card, isDefault: false } : card
        )
      );
      toast({
        title: "Card updated",
        description: "Your payment method has been updated successfully."
      });
    } else {
      // Add new card
      const id = Date.now().toString();
      
      if (newCard.isDefault) {
        // If this card is default, make all others non-default
        setPaymentMethods(prev => 
          prev.map(card => ({ ...card, isDefault: false }))
        );
      }
      
      setPaymentMethods(prev => [
        ...prev,
        {
          id,
          type: cardType,
          lastFour,
          cardholderName: newCard.cardholderName,
          expiryMonth: newCard.expiryMonth,
          expiryYear: newCard.expiryYear,
          isDefault: newCard.isDefault || prev.length === 0 // First card is default by default
        }
      ]);
      
      toast({
        title: "Card added",
        description: "Your payment method has been added successfully."
      });
    }
    
    // Store in localStorage for persistence
    setTimeout(() => {
      const savedCards = paymentMethods.map(card => ({
        ...card,
        // We don't want to store full card numbers in localStorage
        // Just a safety measure even though we're not storing them anyway in this demo
      }));
      localStorage.setItem('paymentMethods', JSON.stringify(savedCards));
    }, 100);
    
    resetCardForm();
  };

  const editCard = (card: PaymentMethod) => {
    setIsEditingCard(card.id);
    setIsAddingCard(true);
    setNewCard({
      type: card.type,
      cardNumber: `**** **** **** ${card.lastFour}`,
      cardholderName: card.cardholderName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvv: '',
      isDefault: card.isDefault
    });
  };

  const deleteCard = (id: string) => {
    const cardToDelete = paymentMethods.find(card => card.id === id);
    setPaymentMethods(prev => {
      const filteredCards = prev.filter(card => card.id !== id);
      
      // If we're deleting the default card and there are other cards,
      // set the first remaining card as default
      if (cardToDelete?.isDefault && filteredCards.length > 0) {
        return filteredCards.map((card, index) => 
          index === 0 ? { ...card, isDefault: true } : card
        );
      }
      
      return filteredCards;
    });
    
    toast({
      title: "Card removed",
      description: "Your payment method has been removed."
    });
    
    // Update localStorage
    setTimeout(() => {
      const updatedMethods = paymentMethods.filter(card => card.id !== id);
      localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    }, 100);
  };

  const setDefaultCard = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
    
    toast({
      title: "Default payment updated",
      description: "Your default payment method has been updated."
    });
    
    // Update localStorage
    setTimeout(() => {
      const updatedMethods = paymentMethods.map(card => ({
        ...card,
        isDefault: card.id === id
      }));
      localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    }, 100);
  };

  const resetCardForm = () => {
    setIsAddingCard(false);
    setIsEditingCard(null);
    setNewCard({
      type: 'visa',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    });
  };

  // Load payment methods from localStorage on initial render
  useState(() => {
    const savedMethods = localStorage.getItem('paymentMethods');
    if (savedMethods) {
      setPaymentMethods(JSON.parse(savedMethods));
    }
  });

  // Generate years for select options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      years.push(year.toString().substr(-2)); // Get last 2 digits
    }
    return years;
  };

  const getCardLogo = (type: string) => {
    switch (type) {
      case 'visa':
        return <div className="w-10 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">VISA</div>;
      case 'mastercard':
        return <div className="w-10 h-6 bg-red-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">MC</div>;
      case 'amex':
        return <div className="w-10 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">AMEX</div>;
      case 'discover':
        return <div className="w-10 h-6 bg-orange-500 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">DISC</div>;
      default:
        return <CreditCard className="h-5 w-5 mr-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center truncate">
          <CreditCard className="min-w-5 h-5 mr-2 text-indigo-600" />
          <span className='truncate'>Payment Methods</span>
        </h2>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm whitespace-nowrap ml-2 px-2 md:px-4"
          onClick={() => setIsAddingCard(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Payment
        </Button>
      </div>
      
      {paymentMethods.length === 0 && !isAddingCard && (
        <Card className="bg-white shadow-sm border-slate-100 p-4 md:p-8 text-center">
          <div className="text-center py-6 md:py-8">
            <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No payment methods</h3>
            <p className="text-gray-500 mb-6 text-sm md:text-base">Add a payment method to make checkout easier</p>
            <Button 
              onClick={() => setIsAddingCard(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </Card>
      )}
      
      {isAddingCard ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{isEditingCard ? 'Edit Payment Method' : 'Add New Payment Method'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName" className="text-sm">Cardholder Name</Label>
              <Input 
                id="cardholderName" 
                name="cardholderName" 
                value={newCard.cardholderName} 
                onChange={handleInputChange} 
                placeholder="John Doe"
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
              <Input 
                id="cardNumber" 
                name="cardNumber" 
                value={newCard.cardNumber} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                  setNewCard({...newCard, cardNumber: value, type: detectCardType(value)});
                }}
                placeholder="**** **** **** ****"
                disabled={!!isEditingCard}
                className="text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth" className="text-sm">Expiry Month</Label>
                <select 
                  id="expiryMonth"
                  name="expiryMonth"
                  value={newCard.expiryMonth}
                  onChange={handleSelectChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryYear" className="text-sm">Expiry Year</Label>
                <select 
                  id="expiryYear"
                  name="expiryYear"
                  value={newCard.expiryYear}
                  onChange={handleSelectChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">YY</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm">CVV</Label>
                <Input 
                  id="cvv" 
                  name="cvv" 
                  value={newCard.cvv} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                    setNewCard({...newCard, cvv: value});
                  }}
                  placeholder="***"
                  type="password"
                  maxLength={4}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="default"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={newCard.isDefault}
                onChange={() => 
                  setNewCard(prev => ({ ...prev, isDefault: !prev.isDefault }))
                }
              />
              <Label htmlFor="default" className="text-sm font-medium">
                Set as default payment method
              </Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={resetCardForm}
                className="text-xs md:text-sm"
              >
                Cancel
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm"
                onClick={saveCard}
                disabled={!newCard.cardholderName || (!isEditingCard && newCard.cardNumber.length < 13) || !newCard.expiryMonth || !newCard.expiryYear}
              >
                {isEditingCard ? 'Update Card' : 'Save Card'}
              </Button>
            </div>
            
            {!isEditingCard && (
              <div className="text-xs md:text-sm text-gray-500 flex items-center mt-4">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                <p>
                  This is a demo app. No real payment information is stored or processed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map(card => (
            <Card key={card.id} className="bg-white shadow-sm border-slate-100">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-center">
                    {getCardLogo(card.type)}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-sm md:text-base">{card.type.toUpperCase()} •••• {card.lastFour}</p>
                        {card.isDefault && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {card.cardholderName} | Expires {card.expiryMonth}/{card.expiryYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {!card.isDefault && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultCard(card.id)}
                        className="text-indigo-600 hover:bg-indigo-50 border-indigo-200 text-xs"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => editCard(card)}
                      className="text-slate-700 hover:bg-slate-50 text-xs"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCard(card.id)}
                      className="text-red-500 hover:bg-red-50 border-red-200 text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
