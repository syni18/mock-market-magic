
import { useEffect } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { items, clearWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="text-ecommerce-600" /> My Wishlist
            </h1>
            <p className="text-gray-600">{items.length} items saved</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={clearWishlist}
              disabled={items.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>

            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate('/products')}
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center p-4 bg-gray-100 rounded-full mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you like by clicking the heart icon on products</p>
            <Button onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
