
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const categoryInfo = {
  "leafy-greens": {
    title: "Leafy Greens",
    description: "Fresh and nutritious leafy vegetables like spinach, kale, and lettuce.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D"
  },
  "root-vegetables": {
    title: "Root Vegetables",
    description: "Nutritious and hearty root vegetables like carrots, potatoes, and beets.",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2Fycm90fGVufDB8fDB8fHww"
  },
  "cruciferous": {
    title: "Cruciferous Vegetables",
    description: "Nutrient-dense vegetables like broccoli, cauliflower, and brussels sprouts.",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvY2NvbGl8ZW58MHx8MHx8fDA%3D"
  },
  "seasonal": {
    title: "Seasonal Vegetables",
    description: "The freshest in-season vegetables at their peak flavor and nutritional value.",
    image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D"
  }
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryProducts, setCategoryProducts] = useState<typeof products>([]);
  
  useEffect(() => {
    if (categoryId === "seasonal") {
      setCategoryProducts(products.filter(product => product.isSeasonal));
    } else if (categoryId === "leafy-greens") {
      setCategoryProducts(products.filter(product => product.category === "Leafy Greens"));
    } else if (categoryId === "root-vegetables") {
      setCategoryProducts(products.filter(product => product.category === "Root Vegetables"));
    } else if (categoryId === "cruciferous") {
      setCategoryProducts(products.filter(product => product.category === "Cruciferous Vegetables"));
    } else {
      setCategoryProducts([]);
    }
  }, [categoryId]);
  
  // If category doesn't exist, show not found
  if (!categoryId || !categoryInfo[categoryId as keyof typeof categoryInfo]) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow py-12 container px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Category Not Found</h1>
            <p className="mb-6 dark:text-gray-300">The category you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = categoryInfo[categoryId as keyof typeof categoryInfo];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 leaf-pattern">
        {/* Category Header */}
        <div 
          className="relative bg-gray-800 text-white py-16"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${category.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container px-4">
            <Link 
              to="/shop" 
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.title}</h1>
            <p className="max-w-2xl text-gray-200">{category.description}</p>
          </div>
        </div>
        
        <div className="container px-4 py-8">
          {/* Products Grid */}
          {categoryProducts.length > 0 ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Showing {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl text-center shadow-sm">
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We don't have any products in this category at the moment.
              </p>
              <Button 
                asChild
                className="mt-4"
              >
                <Link to="/shop">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
