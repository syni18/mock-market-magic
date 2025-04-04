
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Truck, ShieldCheck, RefreshCcw, Laptop, Home, Shirt, Coffee, Gift, Watch, Smartphone } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { getFeaturedProducts, categories } from '@/data/products';
import { Navbar } from '@/components/Navbar';

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
  const featuredProducts = getFeaturedProducts();
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
                <Button size="lg" className="animate-fade-in">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
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

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.filter(c => c.id !== 'all').map((category) => (
              <div 
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-gray-50 rounded-lg p-6 text-center transition-all cursor-pointer
                           hover:shadow-md hover:bg-ecommerce-50 transform hover:-translate-y-1 duration-200"
              >
                <div className="flex justify-center">
                  {categoryIcons[category.id] || <Gift className="h-10 w-10 mb-3 text-ecommerce-600" />}
                </div>
                <div className="text-xl font-medium text-gray-900 mb-2">
                  {category.name}
                </div>
                <span className="text-ecommerce-600 inline-flex items-center">
                  Shop now <ChevronRight size={16} className="ml-1" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-ecommerce-600 hover:text-ecommerce-700 inline-flex items-center">
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover-scale">
              <div className="bg-ecommerce-100 rounded-full p-4 inline-flex mb-4">
                <Truck className="h-8 w-8 text-ecommerce-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your products delivered to your doorstep quickly and efficiently.
              </p>
            </div>
            <div className="text-center p-6 hover-scale">
              <div className="bg-ecommerce-100 rounded-full p-4 inline-flex mb-4">
                <ShieldCheck className="h-8 w-8 text-ecommerce-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                All our products go through rigorous quality checks before they reach you.
              </p>
            </div>
            <div className="text-center p-6 hover-scale">
              <div className="bg-ecommerce-100 rounded-full p-4 inline-flex mb-4">
                <RefreshCcw className="h-8 w-8 text-ecommerce-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">
                Not satisfied with your purchase? Return it within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-ecommerce-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-ecommerce-50 mb-6">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 flex-grow rounded-l text-gray-900 outline-none"
              />
              <Button variant="secondary" size="lg" className="bg-white text-ecommerce-600 hover:bg-gray-100 rounded-r">
                Subscribe
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
