"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("featured");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: "featured", label: "Featured" },
    { id: "bestsellers", label: "Best Sellers" },
    { id: "new", label: "New Arrivals" },
    { id: "seasonal", label: "Seasonal" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleTabChange = async (tabId) => {
    setIsTabLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActiveTab(tabId);
    setIsTabLoading(false);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsTabLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsTabLoading(false);
  };

  const filteredProducts = products
    .filter((product) => {
      if (activeTab === "featured") return product.featured;
      if (activeTab === "bestsellers") return product.bestseller;
      if (activeTab === "new") return product.new;
      if (activeTab === "seasonal") return product.seasonal;
      return false;
    })
    .slice(0, 8);

  if (loading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <LeafLoader />
        </div>
      </section>
    );
  }

  return (
    <>
      {(isTabLoading) && <LeafLoader />}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Our Products</h2>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.globalId} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found for this category.</p>
            </div>
          )}
          <div className="mt-12 text-center">
            <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}