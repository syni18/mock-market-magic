
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { cartCount } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isSignInPage = location.pathname === "/signin";

  // Handle click outside search to reset focus state
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-ecommerce-600">ShopWave</span>
        </Link>

        {/* Search and Authentication for desktop */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-4">
            <div 
              className={cn(
                "relative transition-all duration-300 ease-in-out", 
                isSearchFocused ? "w-96" : "w-64"
              )}
            >
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                ref={searchInputRef}
                placeholder="Search products..." 
                className="pl-8"
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/signin">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Sign In</span>
              </Link>
            </Button>
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-ecommerce-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/signin">
            <Button variant="outline" size="icon" className="relative h-8 w-8">
              <UserCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-ecommerce-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          {/* Hamburger menu removed */}
        </div>
      </nav>

      {/* Mobile Search Bar - Only show if not on sign-in page */}
      {isMobile && !isSignInPage && (
        <div className="md:hidden px-4 py-2 border-t">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-8 w-full"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300",
        isMenuOpen ? "max-h-64" : "max-h-0"
      )}>
        <div className="container py-4 space-y-4">
          {/* Additional mobile menu items can go here if needed */}
        </div>
      </div>
    </header>
  );
}
