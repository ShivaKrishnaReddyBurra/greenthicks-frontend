"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Leaf, Carrot, Apple, Flower2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CategorySection() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = [
    {
      id: "leafy",
      name: "Leafy Greens",
      description: "Nutrient-rich leafy vegetables",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: "root",
      name: "Root Vegetables",
      description: "Hearty and flavorful root vegetables",
      icon: <Carrot className="h-6 w-6 text-primary" />,
      color: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      id: "fruit",
      name: "Fruit Vegetables",
      description: "Colorful and juicy fruit vegetables",
      icon: <Apple className="h-6 w-6 text-primary" />,
      color: "bg-red-100 dark:bg-red-900/20",
    },
    {
      id: "herbs",
      name: "Herbs & Aromatics",
      description: "Flavorful herbs and aromatics",
      icon: <Flower2 className="h-6 w-6 text-primary" />,
      color: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const allCategories = [
    ...categories,
    {
      id: "seasonal",
      name: "Seasonal Specials",
      description: "Limited-time seasonal vegetables",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: "exotic",
      name: "Exotic Vegetables",
      description: "Rare and unique vegetables",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      color: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      id: "organic",
      name: "100% Organic",
      description: "Certified organic vegetables",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: "bundles",
      name: "Vegetable Bundles",
      description: "Pre-selected vegetable combinations",
      icon: <Leaf className="h-6 w-6 text-primary" />,
      color: "bg-pink-100 dark:bg-pink-900/20",
    },
  ];

  const handleCategoryClick = (categoryId) => {
    router.push(`/products?category=${categoryId}`);
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">
            Browse our wide selection of certified organic vegetables, carefully sorted by category for your
            convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-lg p-6 transition-all hover:shadow-md ${category.color} cursor-pointer`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="bg-background rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {category.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <Button variant="link" className="p-0">
                Browse Products
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                View All Categories
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>All Categories</DialogTitle>
                <DialogDescription>Browse our complete selection of organic vegetables by category</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {allCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`rounded-lg p-4 transition-all hover:shadow-md ${category.color} cursor-pointer`}
                    onClick={() => {
                      handleCategoryClick(category.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-background rounded-full w-10 h-10 flex items-center justify-center">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
