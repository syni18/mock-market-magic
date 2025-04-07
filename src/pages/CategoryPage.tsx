
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsByCategory, categories, Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-4 md:py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{categoryName}</h1>
                <p className="text-gray-600 text-sm md:text-base">{filteredProducts.length} products available</p>
              </div>
              
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                    className="hidden md:flex"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-relevant">Most Relevant</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container py-4 md:py-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* Filters Sidebar (for desktop) */}
            <div className={`md:w-64 flex-shrink-0 ${!isFiltersVisible && 'hidden md:block'}`}>
              <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
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
                
                <div className="mt-6 md:mt-8">
                  <h3 className="font-medium text-lg mb-4">Search</h3>
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                
                {(searchTerm || sortBy) && (
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleClearFilters}
                      size="sm"
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="flex-grow">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 md:py-16">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">No products found</h2>
                  <p className="text-gray-600 mb-6">Try changing your filters or search term</p>
                  <Button onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile filters/sort sticky bottom bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-2 px-4 z-50">
          <div className="flex justify-between items-center">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 mr-2">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] py-6 px-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          variant={categoryId === category.id ? "default" : "ghost"}
                          className="justify-start w-full"
                          onClick={() => {
                            setIsFilterSheetOpen(false);
                            window.location.href = `/category/${category.id}`;
                          }}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Search</h3>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button 
                        variant="default"
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => {
                          if (searchTerm) setIsFilterSheetOpen(false);
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {(searchTerm || sortBy) && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleClearFilters();
                        setIsFilterSheetOpen(false);
                      }}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-relevant">Most Relevant</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {/* Add bottom padding on mobile to account for the sticky filter bar */}
      {isMobile && <div className="h-16"></div>}
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
