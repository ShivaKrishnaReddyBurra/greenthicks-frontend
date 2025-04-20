
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck, CalendarDays, Eye } from "lucide-react";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
  const confettiRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Launch confetti
    if (window.innerWidth > 768) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#22c55e', '#4ade80', '#86efac'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#22c55e', '#4ade80', '#86efac'],
        });
      }, 250);
    }
  }, []);

  // Sample order details - would come from order state in a real app
  const orderDetails = {
    orderId: "ORD-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
    date: new Date().toLocaleDateString(),
    items: 3,
    total: 49.97,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 2 days from now
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 leaf-pattern py-12">
        <div ref={confettiRef} className="relative z-10">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-primary animate-scale-in" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                Thank You for Your Order!
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                Your order has been placed successfully. We'll deliver your farm-fresh organic vegetables soon!
              </p>
              
              <div 
                className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-left animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Confirmation
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Date</span>
                    <span>{orderDetails.date}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Total Items</span>
                    <span>{orderDetails.items}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Order Total</span>
                    <span className="font-semibold text-lg">${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center p-4 bg-primary/10 rounded-lg">
                  <Truck className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Estimated Delivery</h3>
                    <p className="text-gray-600">
                      {orderDetails.estimatedDelivery} <span className="text-sm">(within 48 hours)</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "600ms" }}>
                <Button asChild className="gap-2 btn-hover">
                  <Link to="/account/orders">
                    <Eye className="h-4 w-4" />
                    View Order
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="gap-2 btn-hover">
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: "800ms" }}>
                <p>A confirmation email has been sent to your email address.</p>
                <p className="mt-2">
                  Need help? Contact our <Link to="/contact" className="text-primary hover:underline">customer support</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
