
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsByCategory, categories, Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Search, X, Filter } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  
  // New filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPriceInCategory, setMaxPriceInCategory] = useState(1000);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Get the category name for display
  const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'All Products';
  
  // Load products based on category
  useEffect(() => {
    if (!categoryId) return;
    
    const newProducts = getProductsByCategory(categoryId);
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    
    // Find the max price in this category for the price slider
    if (newProducts.length > 0) {
      const maxPrice = Math.max(...newProducts.map(product => product.price));
      setMaxPriceInCategory(Math.ceil(maxPrice / 100) * 100); // Round up to nearest 100
      setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
    }
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
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter, 10);
      result = result.filter(product => Math.floor(product.rating) >= minRating);
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
  }, [products, searchTerm, sortBy, priceRange, ratingFilter]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via useEffect
    if (isMobile) setIsSearchOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('');
    setPriceRange([0, maxPriceInCategory]);
    setRatingFilter('all');
    if (isMobile) setIsFilterSheetOpen(false);
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
                  
                  <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="hidden md:flex">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <form onSubmit={handleSearch} className="flex">
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
                      </form>
                    </PopoverContent>
                  </Popover>
                  
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex justify-between items-center">
                    Filters
                    {(searchTerm || sortBy !== '' || priceRange[0] > 0 || priceRange[1] < maxPriceInCategory || ratingFilter !== 'all') && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-8 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
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
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, maxPriceInCategory]}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={maxPriceInCategory}
                        step={10}
                        className="mb-6"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span>${priceRange[0]}</span>
                        <span>to</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Rating</h3>
                    <RadioGroup value={ratingFilter} onValueChange={setRatingFilter}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <label htmlFor="all" className="text-sm">All Ratings</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="4-plus" />
                        <label htmlFor="4-plus" className="text-sm">4★ & Above</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="3-plus" />
                        <label htmlFor="3-plus" className="text-sm">3★ & Above</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="2-plus" />
                        <label htmlFor="2-plus" className="text-sm">2★ & Above</label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Collapsible 
                      open={isCollapsibleOpen} 
                      onOpenChange={setIsCollapsibleOpen}
                      className="space-y-3"
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="flex w-full justify-between">
                          <span>Search Products</span>
                          <span>{isCollapsibleOpen ? '−' : '+'}</span>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <form onSubmit={handleSearch} className="mt-3">
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
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>
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
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] py-6 px-4">
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    {(searchTerm || sortBy !== '' || priceRange[0] > 0 || priceRange[1] < maxPriceInCategory || ratingFilter !== 'all') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClearFilters}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </div>

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
                  
                  <div className="py-2">
                    <h3 className="font-medium text-lg mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, maxPriceInCategory]}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={maxPriceInCategory}
                        step={10}
                        className="mb-6"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span>${priceRange[0]}</span>
                        <span>to</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Rating</h3>
                    <RadioGroup value={ratingFilter} onValueChange={setRatingFilter}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="m-all" />
                        <label htmlFor="m-all" className="text-sm">All Ratings</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="m-4-plus" />
                        <label htmlFor="m-4-plus" className="text-sm">4★ & Above</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="m-3-plus" />
                        <label htmlFor="m-3-plus" className="text-sm">3★ & Above</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="m-2-plus" />
                        <label htmlFor="m-2-plus" className="text-sm">2★ & Above</label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Search</h3>
                    <form onSubmit={handleSearch} className="flex items-center">
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
                        onClick={() => {
                          if (searchTerm) setIsFilterSheetOpen(false);
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                  
                  <Button 
                    onClick={() => setIsFilterSheetOpen(false)} 
                    className="w-full mt-4"
                  >
                    Apply Filters
                  </Button>
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
