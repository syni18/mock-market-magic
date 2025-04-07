
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, UserCircle, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";

    const fullName = user.user_metadata.full_name as string;
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
  };

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
                className="pl-8 focus:outline-none"
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="h-8 w-8 border border-ecommerce-200">
                      {user.user_metadata?.avatar_url ? (
                        <AvatarImage src={user.user_metadata.avatar_url} />
                      ) : (
                        <AvatarFallback className="bg-ecommerce-100 text-ecommerce-600">
                          {getUserInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer w-full">
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer w-full">
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin">
                <Button variant="outline" size="icon" className="relative">
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">Sign In</span>
                </Button>
              </Link>
            )}

            {user && (
              <Link to="/wishlist">
                <Button variant="outline" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative h-8 w-8">
                  <Avatar className="h-7 w-7 border border-ecommerce-200">
                    {user.user_metadata?.avatar_url ? (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-ecommerce-100 text-ecommerce-600">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="cursor-pointer w-full">
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="cursor-pointer w-full">
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin">
              <Button variant="outline" size="icon" className="relative">
                <UserCircle className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {user && (
            <Link to="/wishlist" className="relative">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

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
        </div>
      </nav>

      {/* Mobile Search Bar - Only show if not on sign-in page */}
      {isMobile && !isSignInPage && (
        <div className="md:hidden px-4 py-2 border-t">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 w-full focus:outline-none"
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
