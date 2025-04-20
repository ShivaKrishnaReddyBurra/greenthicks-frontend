
import { Leaf, Truck, Shield, RotateCcw } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All our vegetables are certified organic, grown without harmful pesticides or chemicals.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get fresh vegetables delivered to your doorstep within 24 hours of harvesting.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "We stand behind the quality of our products with a 100% satisfaction guarantee.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? We offer hassle-free returns and full refunds, no questions asked.",
  },
];

const FeatureHighlights = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why Choose Green Thicks?
          </h2>
          <p className="text-gray-600">
            We're committed to providing the highest quality organic vegetables with exceptional service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
