
import { Link } from 'react-router-dom';
import { Smartphone, Home, Utensils, Laptop, Shirt, Gift } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the categories with their icons and paths
const categories = [
  { name: "Electronics", icon: Smartphone, path: "/products?category=electronics" },
  { name: "Home", icon: Home, path: "/products?category=home" },
  { name: "Kitchen", icon: Utensils, path: "/products?category=kitchen" },
  { name: "Computers", icon: Laptop, path: "/products?category=computers" },
  { name: "Fashion", icon: Shirt, path: "/products?category=fashion" },
  { name: "Gifts", icon: Gift, path: "/products?category=gifts" },
];

export function CategoryDisplay() {
  const isMobile = useIsMobile();

  return (
    <div className="py-4 bg-gradient-to-r from-gray-50 to-slate-50 sticky top-16 z-10 shadow-sm">
      <div className="container">
        <div className="flex overflow-x-auto gap-4 pb-2 justify-between">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={category.path}
              className="flex flex-col items-center justify-center text-center p-2 min-w-[60px] hover:text-ecommerce-600 transition-colors"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mb-1 flex items-center justify-center">
                <category.icon size={isMobile ? 20 : 24} className="text-ecommerce-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
