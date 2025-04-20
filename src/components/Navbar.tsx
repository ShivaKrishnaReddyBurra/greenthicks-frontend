import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, User, Menu, X, Heart, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { cartItems } = useCart();

  // Ensure cartItems is always an array, default to empty array if undefined
  const cartItemCount = (cartItems || []).reduce((total, item) => total + item.quantity, 0);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm">
      <div className="container px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">GT</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Green Thicks</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex relative w-full max-w-xs mx-4">
          <Input
            type="search"
            placeholder="Search for vegetables..."
            className="pr-8 rounded-full border-gray-300 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Search Icon (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="md:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Wishlist Button */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          {/* Cart Button */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {/* Account Button */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div 
        className={cn(
          "md:hidden overflow-hidden transition-all ease-in-out duration-300",
          isSearchOpen ? "max-h-16 py-2" : "max-h-0"
        )}
      >
        <div className="container px-4">
          <Input
            type="search"
            placeholder="Search for vegetables..."
            className="w-full rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden overflow-hidden transition-all ease-in-out duration-300",
          isMenuOpen ? "max-h-screen" : "max-h-0"
        )}
      >
        <nav className="container px-4 py-4 flex flex-col space-y-4 bg-white dark:bg-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400 transition-colors py-2 border-b border-gray-100 dark:border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="w-full">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
