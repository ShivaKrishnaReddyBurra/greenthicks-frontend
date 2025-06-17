"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getProducts } from "@/lib/fetch-without-auth";

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const searchQueryParam = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState(searchQueryParam || "");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const debounceTimeout = useRef(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        // Sort products: in-stock (stock > 0) first, then out-of-stock
        const sortedProducts = data.sort((a, b) => {
          const aInStock = a.stock > 0;
          const bInStock = b.stock > 0;
          if (aInStock && !bInStock) return -1;
          if (!aInStock && bInStock) return 1;
          return 0;
        });
        console.log("Fetched and sorted products:", sortedProducts.map(p => ({ name: p.name, stock: p.stock })));
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchQueryParam) {
      setSearchQuery(searchQueryParam);
    }
  }, [categoryParam, searchQueryParam]);

  const categories = [
    { id: "all", name: "All Vegetables" },
    { id: "milk", name: "Milk" },
    { id: "leafy", name: "Leafy Greens" },
    { id: "root", name: "Root Vegetables" },
    { id: "fruit", name: "Fruit Vegetables" },
    { id: "herbs", name: "Herbs & Aromatics" },
    { id: "pulses", name: "Pulses" },
    { id: "grains", name: "Grains" },
    { id: "spices", name: "Spices" },
    { id: "nuts", name: "Nuts & Seeds" },
    { id: "oils", name: "Oils & Fats" },
    { id: "snacks", name: "Snacks & Sweets" },
    { id: "beverages", name: "Beverages" },
  ];

  const handleCategoryChange = (categoryId) => {
    setActionLoading(true);
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(searchParams);
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/products?${params.toString()}`);
    setTimeout(() => setActionLoading(false), 1000);
  };

  const handlePriceRangeChange = (value) => {
    setActionLoading(true);
    setPriceRange(value);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setActionLoading(false);
    }, 1000);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setActionLoading(true);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/products?${params.toString()}`);
      setActionLoading(false);
    }, 1000);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const aInStock = a.stock > 0;
      const bInStock = b.stock > 0;
      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;
      return 0;
    });

  useEffect(() => {
    console.log("Filtered and sorted products:", filteredProducts.map(p => ({ name: p.name, stock: p.stock })));
  }, [filteredProducts]);

  return (
    <>
      {actionLoading && <SkeletonLoader />}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {selectedCategory !== "all"
                ? categories.find((c) => c.id === selectedCategory)?.name || "Organic Vegetables"
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Organic Vegetables"}
            </h1>
            <p className="text-muted-foreground">
              Fresh, certified organic produce delivered to your doorstep
            </p>
          </div>

          <div className="w-full md:w-auto flex gap-2">
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search vegetables..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 border-primary/30 focus:border-primary focus-visible:ring-primary/30"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down your vegetable search</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${category.id}`}
                          checked={selectedCategory === category.id}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label htmlFor={`mobile-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-medium mt-6 mb-2">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 1000]}
                      max={1000}
                      step={1}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      className="my-6"
                    />
                    <div className="flex justify-between">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategory === category.id}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <Label htmlFor={category.id}>{category.name}</Label>
                    </div>
                  ))}
                </div>

                <h3 className="font-medium mt-6 mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={1}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="my-6"
                  />
                  <div className="flex justify-between">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-2 overflow-x-auto pb-4 md:hidden">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`category-button whitespace-nowrap ${
                    selectedCategory === category.id ? "bg-primary text-white hover:bg-primary/90" : ""
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {loading ? (
              <SkeletonLoader />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.globalId} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                <a href="/products" onClick={(e) => handleNavigation(e, "/products")}>
                  <Button>Browse Products</Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}