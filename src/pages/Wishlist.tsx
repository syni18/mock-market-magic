
import { useEffect, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const Wishlist = () => {
  const { items, clearWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
    setTimeout(() => setLoading(false), 300);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Spinner className="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <main className="flex-grow container py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-slate-800">
              <Heart className="text-indigo-600" /> My Wishlist
            </h1>
            <p className="text-slate-600">{items.length} items saved</p>
          </div>
          
          {!isMobile && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50"
                onClick={clearWishlist}
                disabled={items.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>

              <Button
                size="sm"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate('/products')}
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
              <Heart className="h-10 w-10 md:h-12 md:w-12 text-indigo-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-slate-800">Your wishlist is empty</h2>
            <p className="text-slate-600 mb-6">Save items you like by clicking the heart icon on products</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className={cn(
            isMobile 
              ? "flex flex-col gap-4" 
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          )}>
            {items.map(product => (
              <div 
                key={product.id}
                className={cn(
                  "bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300",
                  isMobile ? "flex" : "flex flex-col h-full"
                )}
              >
                {isMobile ? (
                  // Mobile layout
                  <>
                    <div className="w-1/3 aspect-square overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onClick={() => navigate(`/products/${product.id}`)}
                      />
                    </div>
                    <div className="w-2/3 p-3 flex flex-col">
                      <div className="cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                        <h3 className="font-medium text-sm line-clamp-1 text-slate-800">
                          {product.name}
                        </h3>
                        
                        {/* Star rating */}
                        <div className="flex items-center my-1">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                width="10" 
                                height="10" 
                                viewBox="0 0 24 24" 
                                fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                                stroke="currentColor"
                                className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
                        </div>
                        
                        <p className="text-base font-bold text-slate-900 mb-2">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          size="sm"
                          className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 text-xs"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 aspect-square p-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Desktop layout
                  <>
                    <div className="aspect-square overflow-hidden relative" onClick={() => navigate(`/products/${product.id}`)}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="mb-2 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                        <h3 className="text-lg font-medium line-clamp-1 hover:text-indigo-600 transition-colors text-slate-800">
                          {product.name}
                        </h3>
                        
                        {/* Star rating */}
                        <div className="flex items-center my-2">
                          <div className="flex items-center text-amber-500 mr-1">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                                stroke="currentColor"
                                className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{product.rating.toFixed(1)}</span>
                        </div>
                        
                        <p className="text-xl font-bold text-slate-900 mb-3">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-auto flex gap-2">
                        <Button 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-sm h-10"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        <Button
                          variant="outline"
                          className="aspect-square p-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 h-10"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {isMobile && items.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate('/products')}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
