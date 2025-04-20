
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, AlertCircle } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock wishlist items using products from the data file
const initialWishlistItems = [
  products[0],
  products[2],
  products[4]
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.success("Product removed from wishlist");
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1, product.weightOptions[0].value);
    toast.success(`${product.name} added to cart`);
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
    toast.success("Wishlist cleared");
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow py-12 container px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight dark:text-white">Wishlist</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearWishlist}
                className="text-sm"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlistItems.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex space-x-4 animate-fade-in"
                >
                  <Link 
                    to={`/product/${product.id}`}
                    className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/product/${product.id}`}
                      className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {product.category}
                    </p>
                    
                    <div className="mt-2">
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(product.salePrice)}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="text-xs"
                      >
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                        Add to Cart
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Heart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Add items to your wishlist so you can easily find them later. Items in your wishlist will be saved for 30 days.
              </p>
              <Button asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}
          
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 p-4 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-amber-800 dark:text-amber-300">
                <p className="font-medium mb-1">Please note:</p>
                <p>Items in your wishlist are not reserved and may go out of stock. Add to cart to ensure availability.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
