
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/products';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const { user } = useAuth();

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          setItems(parsedWishlist);
          setWishlistCount(parsedWishlist.length);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    } else {
      // Clear wishlist when user logs out
      setItems([]);
      setWishlistCount(0);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  const addToWishlist = (product: Product) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist.",
      });
      return;
    }

    setItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      
      if (exists) {
        toast({
          title: "Already in wishlist",
          description: `${product.name} is already in your wishlist`,
        });
        return prevItems;
      } else {
        toast({
          title: "Added to wishlist",
          description: `${product.name} added to your wishlist`,
        });
        const newItems = [...prevItems, product];
        setWishlistCount(newItems.length);
        return newItems;
      }
    });
  };

  const removeFromWishlist = (productId: number) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Removed from wishlist",
          description: `${itemToRemove.name} removed from your wishlist`,
        });
      }
      const newItems = prevItems.filter(item => item.id !== productId);
      setWishlistCount(newItems.length);
      return newItems;
    });
  };

  const isInWishlist = (productId: number): boolean => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    setWishlistCount(0);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  return (
    <WishlistContext.Provider value={{ 
      items, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      clearWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
