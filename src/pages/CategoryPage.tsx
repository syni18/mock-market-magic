
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsByCategory, categories, Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  // Get the category name for display
  const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'All Products';
  
  // Load products based on category
  useEffect(() => {
    if (!categoryId) return;
    
    const newProducts = getProductsByCategory(categoryId);
    setProducts(newProducts);
    setFilteredProducts(newProducts);
  }, [categoryId]);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, sortBy]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via useEffect
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">{categoryName}</h1>
                <p className="text-gray-600">{filteredProducts.length} products available</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  className="md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Most Relevant</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`md:w-64 flex-shrink-0 ${!isFiltersVisible && 'hidden md:block'}`}>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="font-medium text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={categoryId === category.id ? "default" : "ghost"}
                      className="justify-start w-full"
                      asChild
                    >
                      <a href={`/category/${category.id}`}>
                        {category.name}
                      </a>
                    </Button>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium text-lg mb-4">Search</h3>
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-r-none focus:outline-none"
                      />
                      <Button 
                        type="submit" 
                        variant="default"
                        size="icon"
                        className="rounded-l-none"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="flex-grow">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold mb-2">No products found</h2>
                  <p className="text-gray-600 mb-6">Try changing your filters or search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
