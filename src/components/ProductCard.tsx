
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
      });
      navigate('/signin');
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="block overflow-hidden relative">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Wishlist button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <Heart 
            className={cn(
              "h-4 w-4 md:h-5 md:w-5", 
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
            )} 
          />
        </button>
      </Link>
      
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-lg'} line-clamp-1 hover:text-ecommerce-600 transition-colors`}>
              {product.name}
            </h3>
          </Link>
          
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap">
              Low Stock
            </span>
          )}
          
          {isOutOfStock && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap">
              Out of Stock
            </span>
          )}
        </div>
        
        <div className="flex items-center mb-1 md:mb-3">
          <div className="flex items-center text-amber-500 mr-1 md:mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={isMobile ? 10 : 14}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
              />
            ))}
          </div>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {product.rating.toFixed(1)}
          </span>
        </div>
        
        <div className="mb-2 md:mb-3">
          <p className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-gray-900`}>
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className="mt-auto">
          <Button 
            onClick={(e) => {
              e.preventDefault();
              if (isOutOfStock) {
                return;
              }
              
              if (!isAuthenticated) {
                toast({
                  title: "Authentication required",
                  description: "Please sign in to add items to your cart",
                });
                navigate('/signin');
                return;
              }
              
              addToCart(product);
            }}
            disabled={isOutOfStock}
            className="w-full text-xs md:text-sm h-8 md:h-10"
            size={isMobile ? "sm" : "default"}
            variant={isOutOfStock ? "outline" : "default"}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1 md:mr-2`} />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
