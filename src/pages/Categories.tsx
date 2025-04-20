
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: "leafy-greens",
    name: "Leafy Greens",
    description: "Spinach, Kale, Lettuce, and more",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D",
    color: "from-green-500/20 to-green-600/20",
    products: 24
  },
  {
    id: "root-vegetables",
    name: "Root Vegetables",
    description: "Carrots, Potatoes, Beets, and more",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2Fycm90fGVufDB8fDB8fHww",
    color: "from-orange-500/20 to-orange-600/20",
    products: 18
  },
  {
    id: "cruciferous",
    name: "Cruciferous",
    description: "Broccoli, Cauliflower, Brussels Sprouts, and more",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvY2NvbGl8ZW58MHx8MHx8fDA%3D",
    color: "from-blue-500/20 to-blue-600/20",
    products: 12
  },
  {
    id: "seasonal",
    name: "Seasonal",
    description: "Currently in-season and at peak freshness",
    image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D",
    color: "from-red-500/20 to-red-600/20",
    products: 15
  },
  {
    id: "beans-peas",
    name: "Beans & Peas",
    description: "Green Beans, Chickpeas, Lentils, and more",
    image: "https://images.unsplash.com/photo-1515471022702-f8817c5dc8b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    color: "from-emerald-500/20 to-emerald-600/20",
    products: 9
  },
  {
    id: "fruits",
    name: "Fruits",
    description: "Apples, Bananas, Oranges, and more",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    color: "from-yellow-500/20 to-yellow-600/20",
    products: 28
  },
  {
    id: "herbs",
    name: "Herbs & Spices",
    description: "Basil, Cilantro, Mint, and more",
    image: "https://images.unsplash.com/photo-1599940732553-df0f88e5a0a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    color: "from-lime-500/20 to-lime-600/20",
    products: 14
  },
  {
    id: "organic",
    name: "Organic Produce",
    description: "Certified Organic Fruits and Vegetables",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    color: "from-purple-500/20 to-purple-600/20",
    products: 31
  }
];

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 leaf-pattern py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Shop by Category</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Explore our wide range of fresh, organic, and locally sourced produce categorized for your convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                to={`/categories/${category.id}`} 
                key={category.id}
                className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{category.products} Products</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    Browse Category
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
