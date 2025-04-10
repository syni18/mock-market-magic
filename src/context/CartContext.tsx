
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/products';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

// Get cart from localStorage
const getCartFromStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      return [];
    }
  }
  return [];
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(getCartFromStorage);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const isMobile = useIsMobile();

  // Calculate cart total and count whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setCartCount(count);
    
    // Save to localStorage whenever cart changes
    saveCartToStorage(items);
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Product exists in cart, update quantity
        const updatedItems = prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
        if (!isMobile) {
          toast({
            title: "Cart updated",
            description: `${product.name} quantity updated in your cart`,
          });
        }
        return updatedItems;
      } else {
        // Product doesn't exist in cart, add it
        if (!isMobile) {
          toast({
            title: "Added to cart",
            description: `${product.name} added to your cart`,
          });
        }
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      if (itemToRemove && !isMobile) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.product.name} removed from your cart`,
        });
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (!isMobile) {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
