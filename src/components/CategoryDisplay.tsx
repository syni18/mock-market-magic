
import { Link } from 'react-router-dom';
import { Smartphone, Home, Utensils, Laptop, Shirt, Baby } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the categories with their icons and paths
const categories = [
  { name: "Electronics", icon: Smartphone, path: "/products?category=electronics" },
  { name: "Home", icon: Home, path: "/products?category=home" },
  { name: "Kitchen", icon: Utensils, path: "/products?category=kitchen" },
  { name: "Computers", icon: Laptop, path: "/products?category=computers" },
  { name: "Fashion", icon: Shirt, path: "/products?category=fashion" },
  { name: "Kids", icon: Baby, path: "/products?category=kids" },
];

export function CategoryDisplay() {
  const isMobile = useIsMobile();

  return (
    <div className="py-6 bg-gradient-to-r from-gray-50 to-slate-50">
      <div className="container">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={category.path}
              className="flex flex-col items-center justify-center text-center p-3 hover-scale"
            >
              <div className="bg-white p-4 rounded-full shadow-sm mb-2">
                <category.icon size={isMobile ? 24 : 32} className="text-ecommerce-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
