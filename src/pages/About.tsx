import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sprout, Users, Leaf, Tractor, Truck, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-100 to-green-50 py-16 md:py-24 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10 bg-no-repeat bg-center"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M54.627,2.269c-0.062-0.062-0.125-0.125-0.187-0.187c-3.498-3.498-9.178-3.498-12.676,0L24.792,18.254 c-0.5,0.5-0.5,1.312,0,1.812c0.5,0.5,1.312,0.5,1.812,0L43.576,3.082c2.873-2.873,7.553-2.873,10.425,0 c2.873,2.873,2.873,7.553,0,10.425L37.029,30.468c-2.873,2.873-7.553,2.873-10.425,0c-0.5-0.5-1.312-0.5-1.812,0 c-0.5,0.5-0.5,1.312,0,1.812c3.873,3.873,10.175,3.873,14.048,0l16.972-16.972C59.575,11.447,59.575,7.217,54.627,2.269z' fill='%2322c55e'/%3E%3Cpath d='M36.729,21.628c-3.873-3.873-10.175-3.873-14.048,0L5.71,38.601c-3.873,3.873-3.873,10.175,0,14.048 c0.062,0.062,0.125,0.125,0.187,0.187c3.498,3.498,9.178,3.498,12.676,0l17.073-17.073c0.5-0.5,0.5-1.312,0-1.812 c-0.5-0.5-1.312-0.5-1.812,0L16.76,50.933c-2.873,2.873-7.553,2.873-10.425,0c-2.873-2.873-2.873-7.553,0-10.425l16.972-16.972 c2.873-2.873,7.553-2.873,10.425,0c0.5,0.5,1.312,0.5,1.812,0C37.229,22.94,37.229,22.128,36.729,21.628z' fill='%2322c55e'/%3E%3C/svg%3E\")" 
            }}
          ></div>
          <div className="container px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                Our Story
              </h1>
              <p className="text-lg text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                At Green Thicks, we're passionate about bringing the freshest organic vegetables directly from farms to your table. Our journey started with a simple belief: everyone deserves access to healthy, sustainable produce.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-4">
                  Green Thicks was founded in 2020 with a mission to revolutionize how people access fresh, organic produce. We believe that healthy eating shouldn't be complicated or expensive.
                </p>
                <p className="text-gray-600 mb-4">
                  By connecting local organic farmers directly with consumers, we're able to deliver farm-fresh vegetables to your doorstep within 24 hours of harvest, ensuring maximum nutrition and flavor.
                </p>
                <p className="text-gray-600">
                  Our commitment to sustainability extends beyond just organic farming. We use eco-friendly packaging, optimize delivery routes to reduce carbon emissions, and work closely with farmers to implement regenerative agricultural practices.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1585500134865-2ddc98148352?w=800&auto=format&fit=crop"
                  alt="Organic farming" 
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary rounded-xl p-4 shadow-lg">
                  <p className="text-white font-bold">Since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-gray-600">
                These principles guide everything we do at Green Thicks, from how we source our produce to how we treat our customers and partners.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to environmentally responsible practices throughout our supply chain, from farm to table.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Tractor className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Local Support</h3>
                <p className="text-gray-600">
                  We partner with local farmers and suppliers to strengthen community economies and reduce transportation impacts.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-gray-600">
                  We never compromise on the quality of our products, ensuring only the best reaches your kitchen.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600">
                The passionate people behind Green Thicks who are committed to bringing you the best organic produce.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm text-center">
                <div className="h-64 bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop"
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">Michael Johnson</h3>
                  <p className="text-primary text-sm mb-2">Founder & CEO</p>
                  <p className="text-gray-600 text-sm">
                    Former organic farmer with a passion for sustainable agriculture.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm text-center">
                <div className="h-64 bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop"
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">Sarah Williams</h3>
                  <p className="text-primary text-sm mb-2">Operations Director</p>
                  <p className="text-gray-600 text-sm">
                    Logistics expert ensuring your vegetables arrive fresh and on time.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm text-center">
                <div className="h-64 bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop"
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">Emily Chen</h3>
                  <p className="text-primary text-sm mb-2">Head of Marketing</p>
                  <p className="text-gray-600 text-sm">
                    Digital marketing specialist passionate about organic food.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm text-center">
                <div className="h-64 bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop"
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">Dr. James Rodriguez</h3>
                  <p className="text-primary text-sm mb-2">Nutrition Specialist</p>
                  <p className="text-gray-600 text-sm">
                    PhD in Nutrition helping us select the most nutritious varieties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Farm Partners */}
        <section className="py-16 bg-primary/10 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ 
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}
          ></div>
          <div className="container px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Farm Partners</h2>
              <p className="text-gray-600">
                We work with the best organic farms in the region. Each farm is carefully vetted and certified to ensure they meet our strict standards for quality and sustainability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&auto=format&fit=crop"
                    alt="Sunshine Organic Farm" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sunshine Organic Farm</h3>
                  <p className="text-gray-600 mb-4">
                    A 50-acre certified organic farm specializing in leafy greens and root vegetables, using innovative water conservation techniques.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Certified Organic
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Sustainable Irrigation
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&auto=format&fit=crop"
                    alt="Green Valley Family Farm" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Green Valley Family Farm</h3>
                  <p className="text-gray-600 mb-4">
                    Family-owned for three generations, this 30-acre farm specializes in heirloom tomatoes and seasonal vegetables.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Certified Organic
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Heirloom Varieties
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1585784233468-1765c0f3939a?w=400&auto=format&fit=crop"
                    alt="Riverside Organic Co-op" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Riverside Organic Co-op</h3>
                  <p className="text-gray-600 mb-4">
                    A cooperative of 12 small-scale farmers working together to grow a diverse range of vegetables and herbs.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Certified Organic
                    </div>
                    <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Cooperative
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1535359056830-d4badde79747?w=400&auto=format&fit=crop"
                    alt="Hilltop Hydroponics" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Hilltop Hydroponics</h3>
                  <p className="text-gray-600 mb-4">
                    An innovative hydroponic farm producing leafy greens year-round with 95% less water than traditional farming.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Organic Methods
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Hydroponic
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/20 to-primary/10">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join the Green Thicks Family
              </h2>
              <p className="text-gray-700 text-lg mb-8">
                Experience the difference of truly fresh organic vegetables delivered straight from farms to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full btn-hover">
                  <Link to="/shop">
                    <Sprout className="h-5 w-5 mr-2" />
                    Shop Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full btn-hover">
                  <Link to="/contact">
                    <Users className="h-5 w-5 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
