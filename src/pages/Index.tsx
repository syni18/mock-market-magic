
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Truck, ShieldCheck, RefreshCcw, Laptop, Home, Shirt, Coffee, Gift, Watch, Smartphone } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { getFeaturedProducts, categories } from '@/data/products';
import { Navbar } from '@/components/Navbar';
import { CategoryDisplay } from '@/components/CategoryDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const categoryIcons = {
  electronics: <Laptop className="h-10 w-10 mb-3 text-ecommerce-600" />,
  furniture: <Home className="h-10 w-10 mb-3 text-ecommerce-600" />,
  clothing: <Shirt className="h-10 w-10 mb-3 text-ecommerce-600" />,
  kitchen: <Coffee className="h-10 w-10 mb-3 text-ecommerce-600" />,
  gifts: <Gift className="h-10 w-10 mb-3 text-ecommerce-600" />,
  accessories: <Watch className="h-10 w-10 mb-3 text-ecommerce-600" />,
  mobile: <Smartphone className="h-10 w-10 mb-3 text-ecommerce-600" />
};

const Index = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 8); // Show 8 products
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Mobile Category Display */}
      {isMobile && <CategoryDisplay />}
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-ecommerce-50 to-blue-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900">
              Shop the Future, <span className="text-ecommerce-600">Today</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover premium products that enhance your lifestyle. From cutting-edge electronics to elegant home essentials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button variant="default" size="lg" className="w-full sm:w-auto bg-ecommerce-600 hover:bg-ecommerce-700 text-white">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Deals
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" 
              alt="Shopping Experience" 
              className="rounded-lg shadow-xl w-full hover-scale"
            />
          </div>
        </div>
      </section>

      {/* Desktop Categories Section */}
      {!isMobile && (
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Shop By Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {categories.filter(c => c.id !== 'all').map((category) => (
                <div 
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="bg-gray-50 rounded-lg p-4 text-center transition-all cursor-pointer
                             hover:shadow-md hover:bg-ecommerce-50 transform hover:-translate-y-1 duration-200 flex flex-col items-center"
                >
                  <div className="flex justify-center">
                    {categoryIcons[category.id] || <Gift className="h-10 w-10 mb-3 text-ecommerce-600" />}
                  </div>
                  <div className="text-base font-medium text-gray-900 break-words w-full">
                    {category.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            {!isMobile && (
              <Link to="/products" className="text-ecommerce-600 hover:text-ecommerce-700 inline-flex items-center">
                View all <ChevronRight size={16} className="ml-1" />
              </Link>
            )}
          </div>
          
          {/* Desktop Carousel */}
          {!isMobile && (
            <div className="hidden md:block">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          )}
          
          {/* Mobile Grid */}
          {isMobile && (
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 text-white">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-ecommerce-50 mb-6 max-w-2xl mx-auto">
                Stay updated with the latest products, exclusive offers, and seasonal discounts. Subscribe now and get 10% off your first order!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 flex-grow rounded-l text-gray-900 outline-none w-full"
              />
              <Button variant="secondary" size="lg" className="bg-white text-ecommerce-600 hover:bg-gray-100 rounded-r whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
