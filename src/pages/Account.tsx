
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag, User, Heart, MapPin, CreditCard, LogOut } from "lucide-react";

const Account = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { name: "Profile", path: "/account/profile", icon: User },
    { name: "Orders", path: "/account/orders", icon: ShoppingBag },
    { name: "Wishlist", path: "/account/wishlist", icon: Heart },
    { name: "Addresses", path: "/account/addresses", icon: MapPin },
    { name: "Payment Methods", path: "/account/payment", icon: CreditCard },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 leaf-pattern">
        <div className="container px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-6">
              <Button 
                variant="outline" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex justify-between"
              >
                <span>Account Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("h-5 w-5 transition-transform", isMenuOpen ? "rotate-180" : "")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>
            
            {/* Sidebar */}
            <aside 
              className={cn(
                "lg:col-span-3 lg:block",
                isMenuOpen ? "block" : "hidden"
              )}
            >
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-1 sticky top-24">
                <div className="pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      JD
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-sm text-gray-500">john@example.com</p>
                    </div>
                  </div>
                </div>
                
                <nav>
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left mb-1 transition-colors",
                        isActive(item.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left mt-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 justify-start font-normal"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                  </Button>
                </nav>
              </div>
            </aside>
            
            {/* Content Area */}
            <div className="lg:col-span-9 mt-6 lg:mt-0">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
