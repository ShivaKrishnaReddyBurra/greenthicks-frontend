"use client";
import React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  Heart,
  User,
  Truck,
  Package,
  Home,
  Info,
  Phone,
  LogIn,
  Sun,
  Moon,
  Laptop,
  ShoppingBag,
  HelpCircle,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import logo from "@/public/logo.png";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5 mr-3" /> },
    { href: "/products", label: "Products", icon: <Package className="h-5 w-5 mr-3" /> },
    { href: "/about", label: "About", icon: <Info className="h-5 w-5 mr-3" /> },
    { href: "/contact", label: "Contact", icon: <Phone className="h-5 w-5 mr-3" /> },
  ];

  const moreLinks = [
    { href: "/faq", label: "FAQ", icon: <HelpCircle className="h-5 w-5 mr-3" /> },
    { href: "/shipping", label: "Shipping", icon: <Truck className="h-5 w-5 mr-3" /> },
    { href: "/returns", label: "Returns", icon: <ShoppingBag className="h-5 w-5 mr-3" /> },
    { href: "/privacy", label: "Privacy Policy", icon: <FileText className="h-5 w-5 mr-3" /> },
    { href: "/terms", label: "Terms & Conditions", icon: <FileText className="h-5 w-5 mr-3" /> },
  ];

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-6 w-6" />;
    if (theme === "light") return <Sun className="h-6 w-6" />;
    return <Laptop className="h-6 w-6" />;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <div className="px-2 py-6">
                  <Link href="/" className="flex items-center mb-6">
                    <Image src={logo} alt="Green Thicks Logo" width={120} height={60} className="h-10 w-auto" />
                  </Link>

                  <div className="flex items-center justify-between mb-6 px-2">
                    <span className="text-base font-medium">Theme</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          {getThemeIcon()}
                          <span className="capitalize">{theme}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                          <Laptop className="h-4 w-4" />
                          System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground px-2 py-2">Main Navigation</h3>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-2 py-2 text-base flex items-center rounded-md ${
                          pathname === link.href
                            ? "font-medium text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}

                    <Link
                      href="/favorites"
                      className={`px-2 py-2 text-base flex items-center rounded-md ${
                        pathname === "/favorites"
                          ? "font-medium text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      Favorites
                      {favorites.length > 0 && (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/cart"
                      className={`px-2 py-2 text-base flex items-center rounded-md ${
                        pathname === "/cart"
                          ? "font-medium text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      Cart
                      {totalItems > 0 && (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>

                      {
                        /*
                          temparary disabled
                          
                          <Link
                      href="/my-orders"
                      className={`px-2 py-2 text-base flex items-center rounded-md ${
                        pathname === "/my-orders"
                          ? "font-medium text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Package className="h-5 w-5 mr-3" />
                      My Orders
                    </Link>

                        */
                      }

                    <Link
                      href="/my-orders"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("To see your orders, you must be logged in.");
                      }}
                      className={`px-2 py-2 text-base flex items-center rounded-md cursor-not-allowed ${
                        pathname === "/my-orders"
                          ? "font-medium text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Package className="h-5 w-5 mr-3" />
                      My Orders
                    </Link>


                    <h3 className="font-semibold text-sm uppercase text-muted-foreground px-2 py-2 mt-4">Account</h3>
                    <Link
                      href="/login"
                      className="px-2 py-2 text-base flex items-center rounded-md text-foreground hover:bg-muted"
                    >
                      <LogIn className="h-5 w-5 mr-3" />
                      Login / Register
                    </Link>

                    <h3 className="font-semibold text-sm uppercase text-muted-foreground px-2 py-2 mt-4">
                      More Information
                    </h3>
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-2 py-2 text-base flex items-center rounded-md text-foreground hover:bg-muted"
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="ml-4 lg:ml-0 flex items-center">
              <Image src= {logo} alt="Green Thicks Logo" width={120} height={60} className="h-10 w-auto" />
            </Link>

            <nav className="hidden lg:flex ml-8 space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex">
              <ModeToggle />
            </div>

            <div className="hidden lg:block">
              <Link href="/favorites" className="relative inline-flex items-center justify-center p-2">
                <Heart className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
                <span className="sr-only">Favorites</span>
              </Link>
            </div>

            <div className="hidden lg:block">
              {
                /*
                    temparally hidden
                    
                     <Link href="/my-orders" className="relative inline-flex items-center justify-center p-2">
                <Package className="h-6 w-6" />
                <span className="sr-only">My Orders</span>
              </Link>

                */
              }
              <Link href="/my-orders"  onClick={(e) => {
                        e.preventDefault();
                        alert("To see your orders, please login first.");
                      }}
                      className="w-full flex items-center cursor-not-allowed">
                <Package className="h-6 w-6" />
                <span className="sr-only">My Orders</span>
              </Link>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/login" className="w-full flex">
                    Login / Register
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {
                    /*
                      temparally hidden

                    <Link href="/my-orders" className="w-full flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                    */
                  }
                  <Link
                      href="/my-orders"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("To see your orders, please login first.");
                      }}
                      className="w-full flex items-center cursor-not-allowed"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                  </Link>

                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/favorites" className="w-full flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only ">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
