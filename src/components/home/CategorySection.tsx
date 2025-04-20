
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "leafy-greens",
    name: "Leafy Greens",
    description: "Spinach, Kale, Lettuce, and more",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D",
    color: "from-green-500/20 to-green-600/20",
  },
  {
    id: "root-vegetables",
    name: "Root Vegetables",
    description: "Carrots, Potatoes, Beets, and more",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2Fycm90fGVufDB8fDB8fHww",
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    id: "cruciferous",
    name: "Cruciferous",
    description: "Broccoli, Cauliflower, Brussels Sprouts, and more",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJvY2NvbGl8ZW58MHx8MHx8fDA%3D",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    id: "seasonal",
    name: "Seasonal",
    description: "Currently in-season and at peak freshness",
    image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D",
    color: "from-red-500/20 to-red-600/20",
  },
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Explore our wide range of organic vegetables categorized for your convenience. 
            From leafy greens to root vegetables, we have everything you need for a healthy lifestyle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/categories/${category.id}`} 
              key={category.id}
              className="group rounded-2xl overflow-hidden card-hover"
            >
              <div className={`relative bg-gradient-to-br ${category.color} h-60 p-6 flex flex-col justify-between`}>
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-700 mt-1">{category.description}</p>
                </div>
                <Button 
                  variant="secondary" 
                  className="relative z-10 self-start mt-4 bg-white/70 backdrop-blur-sm group-hover:bg-white transition-colors btn-hover"
                >
                  View All
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
