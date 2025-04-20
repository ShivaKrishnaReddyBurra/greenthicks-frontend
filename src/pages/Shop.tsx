import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, SlidersHorizontal, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const categoryFilters = [
  { id: "all", name: "All Products" },
  { id: "leafy-greens", name: "Leafy Greens" },
  { id: "root-vegetables", name: "Root Vegetables" },
  { id: "cruciferous", name: "Cruciferous" },
  { id: "seasonal", name: "Seasonal" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<{
    category: string;
    priceRange: [number, number];
    isOrganic: boolean;
    isSeasonal: boolean;
    searchQuery: string;
  }>({
    category: searchParams.get("category") || "all",
    priceRange: [0, 50],
    isOrganic: Boolean(searchParams.get("organic")),
    isSeasonal: Boolean(searchParams.get("seasonal")),
    searchQuery: searchParams.get("q") || "",
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (activeFilters.category !== "all" && product.category !== activeFilters.category) {
      return false;
    }

    // Price range filter
    if (
      product.price < activeFilters.priceRange[0] ||
      product.price > activeFilters.priceRange[1]
    ) {
      return false;
    }

    // Organic filter
    if (activeFilters.isOrganic && !product.isOrganic) {
      return false;
    }

    // Seasonal filter
    if (activeFilters.isSeasonal && !product.isSeasonal) {
      return false;
    }

    // Search query
    if (
      activeFilters.searchQuery &&
      !product.name.toLowerCase().includes(activeFilters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-desc":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "rating":
        return b.rating - a.rating;
      default:
        return a.id.localeCompare(b.id); // Default sorting (featured)
    }
  });

  const updateFilters = (newFilters: Partial<typeof activeFilters>) => {
    const updatedFilters = { ...activeFilters, ...newFilters };
    setActiveFilters(updatedFilters);

    // Update URL params
    const newParams = new URLSearchParams();
    if (updatedFilters.category !== "all") newParams.set("category", updatedFilters.category);
    if (sortBy !== "featured") newParams.set("sort", sortBy);
    if (updatedFilters.isOrganic) newParams.set("organic", "true");
    if (updatedFilters.isSeasonal) newParams.set("seasonal", "true");
    if (updatedFilters.searchQuery) newParams.set("q", updatedFilters.searchQuery);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: "all",
      priceRange: [0, 50],
      isOrganic: false,
      isSeasonal: false,
      searchQuery: "",
    });
    setSortBy("featured");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 leaf-pattern">
        {/* Shop Header */}
        <div className="bg-primary/10 py-8">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shop Fresh Organic Vegetables
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Browse our wide selection of farm-fresh, organic vegetables sourced directly from local farmers.
            </p>
            
            {/* Search and Filter Bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="w-full sm:max-w-md relative">
                <Input 
                  type="search"
                  placeholder="Search vegetables..."
                  value={activeFilters.searchQuery}
                  onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                  className="pr-10 rounded-full"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-2 self-end">
                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden flex items-center gap-2 rounded-full">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="py-6 h-full overflow-auto">
                      <h3 className="text-lg font-semibold mb-4">Filters</h3>
                      {/* Mobile Filter Content */}
                      <div className="space-y-6">
                        {/* Categories */}
                        <div>
                          <h4 className="font-medium mb-2">Categories</h4>
                          <div className="space-y-2">
                            {categoryFilters.map((category) => (
                              <div key={category.id} className="flex items-center">
                                <Checkbox
                                  id={`mobile-${category.id}`}
                                  checked={activeFilters.category === category.id}
                                  onCheckedChange={() => updateFilters({ category: category.id })}
                                />
                                <Label htmlFor={`mobile-${category.id}`} className="ml-2">
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price Range */}
                        <div>
                          <h4 className="font-medium mb-2">Price Range</h4>
                          <div className="px-2">
                            <Slider
                              defaultValue={[0, 50]}
                              max={50}
                              step={1}
                              value={activeFilters.priceRange}
                              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                              className="my-6"
                            />
                            <div className="flex justify-between">
                              <span>${activeFilters.priceRange[0]}</span>
                              <span>${activeFilters.priceRange[1]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Other Filters */}
                        <div className="space-y-2">
                          <h4 className="font-medium mb-2">Other Filters</h4>
                          <div className="flex items-center">
                            <Checkbox
                              id="mobile-organic"
                              checked={activeFilters.isOrganic}
                              onCheckedChange={(checked) => updateFilters({ isOrganic: !!checked })}
                            />
                            <Label htmlFor="mobile-organic" className="ml-2">
                              Organic Only
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              id="mobile-seasonal"
                              checked={activeFilters.isSeasonal}
                              onCheckedChange={(checked) => updateFilters({ isSeasonal: !!checked })}
                            />
                            <Label htmlFor="mobile-seasonal" className="ml-2">
                              Seasonal Only
                            </Label>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button variant="outline" onClick={clearAllFilters} className="w-full">
                            Clear All Filters
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    searchParams.set("sort", e.target.value);
                    setSearchParams(searchParams);
                  }}
                  className="rounded-full px-3 py-2 bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Active Filters */}
            {(activeFilters.category !== "all" || 
              activeFilters.isOrganic || 
              activeFilters.isSeasonal || 
              activeFilters.searchQuery) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {activeFilters.category !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {categoryFilters.find(c => c.id === activeFilters.category)?.name}
                    <button 
                      onClick={() => updateFilters({ category: "all" })}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {activeFilters.isOrganic && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Organic Only
                    <button 
                      onClick={() => updateFilters({ isOrganic: false })}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {activeFilters.isSeasonal && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Seasonal Only
                    <button 
                      onClick={() => updateFilters({ isSeasonal: false })}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {activeFilters.searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{activeFilters.searchQuery}"
                    <button 
                      onClick={() => updateFilters({ searchQuery: "" })}
                      className="ml-1 hover:text-gray-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold mb-6">Filters</h3>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-900">Categories</h4>
                  <div className="space-y-2">
                    {categoryFilters.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={category.id}
                          checked={activeFilters.category === category.id}
                          onCheckedChange={() => updateFilters({ category: category.id })}
                        />
                        <Label htmlFor={category.id} className="ml-2">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-900">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 50]}
                      max={50}
                      step={1}
                      value={activeFilters.priceRange}
                      onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${activeFilters.priceRange[0]}</span>
                      <span>${activeFilters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Other Filters */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-medium mb-2 text-gray-900">Other Filters</h4>
                  <div className="flex items-center">
                    <Checkbox
                      id="organic"
                      checked={activeFilters.isOrganic}
                      onCheckedChange={(checked) => updateFilters({ isOrganic: !!checked })}
                    />
                    <Label htmlFor="organic" className="ml-2">
                      Organic Only
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="seasonal"
                      checked={activeFilters.isSeasonal}
                      onCheckedChange={(checked) => updateFilters({ isSeasonal: !!checked })}
                    />
                    <Label htmlFor="seasonal" className="ml-2">
                      Seasonal Only
                    </Label>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters} 
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </aside>
            
            {/* Product Grid */}
            <div className="flex-1">
              {/* Category Tabs (Desktop) */}
              <div className="mb-6 hidden md:block">
                <Tabs 
                  defaultValue={activeFilters.category} 
                  value={activeFilters.category}
                  onValueChange={(value) => updateFilters({ category: value })}
                >
                  <TabsList className="bg-white">
                    {categoryFilters.map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Results Count */}
              <p className="text-gray-600 mb-6">
                Showing {sortedProducts.length} result{sortedProducts.length !== 1 ? 's' : ''}
              </p>
              
              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl text-center shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <Button 
                    onClick={clearAllFilters}
                    className="mt-4"
                  >
                    Clear All Filters
                  </Button>
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

export default Shop;
