
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-100 to-green-50 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 bg-no-repeat bg-center"
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M54.627,2.269c-0.062-0.062-0.125-0.125-0.187-0.187c-3.498-3.498-9.178-3.498-12.676,0L24.792,18.254 c-0.5,0.5-0.5,1.312,0,1.812c0.5,0.5,1.312,0.5,1.812,0L43.576,3.082c2.873-2.873,7.553-2.873,10.425,0 c2.873,2.873,2.873,7.553,0,10.425L37.029,30.468c-2.873,2.873-7.553,2.873-10.425,0c-0.5-0.5-1.312-0.5-1.812,0 c-0.5,0.5-0.5,1.312,0,1.812c3.873,3.873,10.175,3.873,14.048,0l16.972-16.972C59.575,11.447,59.575,7.217,54.627,2.269z' fill='%2322c55e'/%3E%3Cpath d='M36.729,21.628c-3.873-3.873-10.175-3.873-14.048,0L5.71,38.601c-3.873,3.873-3.873,10.175,0,14.048 c0.062,0.062,0.125,0.125,0.187,0.187c3.498,3.498,9.178,3.498,12.676,0l17.073-17.073c0.5-0.5,0.5-1.312,0-1.812 c-0.5-0.5-1.312-0.5-1.812,0L16.76,50.933c-2.873,2.873-7.553,2.873-10.425,0c-2.873-2.873-2.873-7.553,0-10.425l16.972-16.972 c2.873-2.873,7.553-2.873,10.425,0c0.5,0.5,1.312,0.5,1.812,0C37.229,22.94,37.229,22.128,36.729,21.628z' fill='%2322c55e'/%3E%3C/svg%3E\")" 
        }}
      ></div>
      <div className="container px-4 py-16 md:py-20 lg:py-24 md:flex items-center justify-between z-10 relative">
        <div className="md:w-1/2 space-y-6 mb-8 md:mb-0 animate-fade-in">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            100% Organic Certified
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Fresh Organic <span className="text-primary">Vegetables</span> Delivered to Your Door
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Farm to table goodness. Sustainably grown, locally sourced, and delivered fresh for your health and wellness.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full btn-hover">
              <Link to="/shop">
                Shop Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full btn-hover">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Happy Customers</div>
              <div className="text-xs text-gray-500">Trusted by 10,000+ customers</div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end animate-scale-in">
          <div className="relative">
            <div className="absolute -top-6 -left-6 bg-yellow-400 rounded-full h-12 w-12 flex items-center justify-center shadow-lg animate-pulse">
              <span className="font-bold text-sm">100%</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary rounded-full h-16 w-16 flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-sm">Organic</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop"
              alt="Fresh organic vegetables" 
              className="rounded-3xl w-full max-w-md object-cover shadow-xl"
              style={{ height: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
