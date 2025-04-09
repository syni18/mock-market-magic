
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WishlistTab() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAddToCart = (productId: number) => {
    const product = items.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-center py-8">
          <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
            <span className="text-indigo-600 text-4xl">☹️</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you like by clicking the heart icon on products</p>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Start Shopping
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Wishlist</h2>
        {!isMobile && items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => items.forEach(item => removeFromWishlist(item.id))}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" /> Clear All
          </Button>
        )}
      </div>

      <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-2 lg:grid-cols-3 gap-4"}>
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            {isMobile ? (
              <div className="flex">
                <div 
                  className="w-1/3 cursor-pointer"
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-3">
                  <div className="cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                          className={i < Math.floor(item.rating) ? "text-amber-500" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <p className="font-bold text-base">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex mt-2 gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAddToCart(item.id)}
                      className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 text-xs"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="h-8 aspect-square p-0 border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div 
                  className="aspect-square relative cursor-pointer"
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <h3 
                      className="font-medium text-lg mb-2 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                      onClick={() => navigate(`/products/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                          className={i < Math.floor(item.rating) ? "text-amber-500" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <p className="font-bold text-xl mb-3">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(item.id)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item.id)}
                      className="aspect-square p-0 border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
