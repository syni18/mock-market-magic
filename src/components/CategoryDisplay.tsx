
import { Link } from 'react-router-dom';
import { Smartphone, Home, Utensils, Laptop, Shirt, Gift } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the categories with their icons and paths
const categories = [
  { name: "Electronics", icon: Smartphone, path: "/products?category=electronics" },
  { name: "Home Decor", icon: Home, path: "/products?category=home" },
  { name: "Kitchen", icon: Utensils, path: "/products?category=kitchen" },
  { name: "Computers", icon: Laptop, path: "/products?category=computers" },
  { name: "Fashion", icon: Shirt, path: "/products?category=fashion" },
  { name: "Gifts", icon: Gift, path: "/products?category=gifts" },
];

export function CategoryDisplay() {
  const isMobile = useIsMobile();
  
  // For mobile, only show first 4 categories
  const displayCategories = isMobile ? categories.slice(0, 4) : categories;

  return (
    <div className="py-3 bg-gradient-to-r from-gray-50 to-slate-50 z-10 shadow-sm overflow-x-auto">
      <div className="container">
        <div className="flex gap-3 pb-1 justify-start md:justify-between">
          {displayCategories.map((category) => (
            <Link 
              key={category.name}
              to={category.path}
              className="flex flex-col items-center justify-center text-center p-1 min-w-[60px] hover:text-ecommerce-600 transition-colors flex-shrink-0"
            >
              <div className="bg-white p-2 rounded-full shadow-sm mb-1 flex items-center justify-center">
                <category.icon size={isMobile ? 18 : 22} className="text-ecommerce-600" />
              </div>
              <span className="text-xs font-medium text-gray-700 truncate w-full">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
