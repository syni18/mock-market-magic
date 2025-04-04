
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByCategory, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { MinusCircle, PlusCircle, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  
  useEffect(() => {
    if (id) {
      const productId = parseInt(id, 10);
      const foundProduct = getProductById(productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get related products from the same category
        const related = getProductsByCategory(foundProduct.category)
          .filter(p => p.id !== foundProduct.id)
          .slice(0, 4);
          
        setRelatedProducts(related);
      }
      
      // Reset quantity when product changes
      setQuantity(1);
    }
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 mb-8 text-sm">
            <Link to="/" className="text-gray-500 hover:text-ecommerce-600">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-ecommerce-600">
              Products
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-amber-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                      className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-gray-500">
                  {product.rating.toFixed(1)} rating
                </span>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${product.price.toFixed(2)}
              </div>
              
              <p className="text-gray-700 mb-6">
                {product.description}
              </p>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="text-green-600 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    <span>
                      {product.stock > 5 
                        ? 'In Stock' 
                        : `Only ${product.stock} left in stock - order soon`
                      }
                    </span>
                  </div>
                ) : (
                  <div className="text-red-600 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-2"></span>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-gray-700 font-medium block mb-2">Quantity</label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || product.stock === 0}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 font-medium w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6 bg-white border rounded-b-lg">
                <h3 className="text-lg font-medium mb-4">Product Description</h3>
                <p className="text-gray-700">
                  {product.description}
                </p>
                <p className="text-gray-700 mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, 
                  vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, 
                  ac blandit elit tincidunt id.
                </p>
              </TabsContent>
              
              <TabsContent value="specs" className="p-6 bg-white border rounded-b-lg">
                <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Category</td>
                      <td className="py-2 capitalize">{product.category}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Brand</td>
                      <td className="py-2">ShopWave</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Material</td>
                      <td className="py-2">Premium quality</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Warranty</td>
                      <td className="py-2">1 Year</td>
                    </tr>
                  </tbody>
                </table>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6 bg-white border rounded-b-lg">
                <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                <div className="flex items-center mb-6">
                  <div className="flex items-center text-amber-500 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-gray-900 font-medium">
                    {product.rating.toFixed(1)} out of 5
                  </span>
                </div>
                <p className="text-gray-600 italic">
                  No reviews yet. Be the first to write a review.
                </p>
                <Button className="mt-4">Write a Review</Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
