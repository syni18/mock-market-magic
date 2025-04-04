
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopWave</h3>
            <p className="text-gray-600 mb-4">
              Quality products for your everyday needs. Discover why customers love our selection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-ecommerce-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ecommerce-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-ecommerce-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=furniture" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/products?category=kitchen" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  Kitchen
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-ecommerce-600 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Newsletter</h4>
            <p className="text-gray-600 mb-4">
              Subscribe to get special offers, free giveaways, and new product announcements.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 border border-gray-300 rounded-l outline-none focus:border-ecommerce-600"
              />
              <button className="bg-ecommerce-600 text-white px-4 py-2 rounded-r hover:bg-ecommerce-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} ShopWave. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-ecommerce-600 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-ecommerce-600 transition-colors text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
