
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">ShopWave</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your one-stop destination for quality products that enhance your everyday life. Discover why customers love our selection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-ecommerce-600 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-ecommerce-600 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-ecommerce-600 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=furniture" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/products?category=kitchen" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Kitchen
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Help</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-ecommerce-400 transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-ecommerce-500 mt-0.5" />
                <span>123 Commerce St, Shopping Mall, NY 10001, USA</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-ecommerce-500" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-ecommerce-500" />
                <span>support@shopwave.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ShopWave. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-ecommerce-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-ecommerce-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-ecommerce-400 transition-colors text-sm">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
