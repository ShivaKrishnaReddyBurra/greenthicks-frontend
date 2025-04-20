
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { 
    id, 
    name, 
    price, 
    salePrice, 
    image, 
    category, 
    rating, 
    reviewCount,
    isOrganic,
    isSeasonal 
  } = product;
  
  const { addToCart } = useCart();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.weightOptions[0].value);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToWishlist(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAddingToWishlist(false);
      toast.success(`${name} added to your wishlist`);
    }, 500);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in card-hover">
      {/* Sale Badge */}
      {salePrice && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-red-500">Sale</Badge>
        </div>
      )}
      
      {/* Seasonal Badge */}
      {isSeasonal && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="outline" className="border-primary text-primary bg-white dark:bg-gray-800">Seasonal</Badge>
        </div>
      )}
      
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      
      {/* Wishlist Button */}
      <button 
        onClick={handleAddToWishlist}
        className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Add to wishlist"
        disabled={isAddingToWishlist}
      >
        <Heart className={`h-4 w-4 ${isAddingToWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-red-500 hover:fill-red-500 transition-colors'}`} />
      </button>
      
      {/* Product Details */}
      <div className="p-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{category}</span>
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-1 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="mt-2 flex items-center">
          {salePrice ? (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(price)}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 ml-2">{formatPrice(salePrice)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatPrice(price)}</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          className="w-full mt-3 btn-hover"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
