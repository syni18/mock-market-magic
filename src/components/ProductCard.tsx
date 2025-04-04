
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-lg line-clamp-1 hover:text-ecommerce-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
          
          {product.stock === 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center text-amber-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {product.rating.toFixed(1)}
          </span>
        </div>
        
        <div className="mb-3">
          <p className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <Button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          disabled={product.stock === 0}
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
