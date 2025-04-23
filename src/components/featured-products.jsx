"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("featured");

  const tabs = [
    { id: "featured", label: "Featured" },
    { id: "bestsellers", label: "Best Sellers" },
    { id: "new", label: "New Arrivals" },
    { id: "seasonal", label: "Seasonal" },
  ];

  // Filter products based on active tab
  const filteredProducts = products
    .filter((product) => {
      if (activeTab === "featured") return product.featured;
      if (activeTab === "bestsellers") return product.bestseller;
      if (activeTab === "new") return product.new;
      if (activeTab === "seasonal") return product.seasonal;
      return false;
    })
    .slice(0, 8);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Our Products</h2>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products">
            <Button size="lg">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
