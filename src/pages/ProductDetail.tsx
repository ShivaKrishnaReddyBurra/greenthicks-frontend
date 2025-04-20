
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, ChevronLeft, ChevronRight, Star, Leaf } from "lucide-react";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext"; 
import { formatPrice } from "@/utils/formatPrice";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((p) => p.id === productId);
  const [selectedWeight, setSelectedWeight] = useState(product?.weightOptions[0]?.value || "");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const { addToCart } = useCart();
  
  // Related products (same category, excluding current product)
  const relatedProducts = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-12">
          <div className="container px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Product Not Found</h1>
              <p className="mb-6 dark:text-gray-300">The product you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/shop">Back to Shop</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
  };

  const handleAddToWishlist = () => {
    setIsAddingToWishlist(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAddingToWishlist(false);
      toast.success(`${product.name} added to your wishlist`);
    }, 500);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const selectedWeightOption = product.weightOptions.find(option => option.value === selectedWeight);
  const currentPrice = selectedWeightOption?.price || product.price;
  const currentSalePrice = product.salePrice ? (selectedWeightOption?.price || product.salePrice) : undefined;

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 leaf-pattern">
        <div className="container px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary">Home</Link>
              </li>
              <span>/</span>
              <li>
                <Link to="/shop" className="hover:text-primary">Shop</Link>
              </li>
              <span>/</span>
              <li>
                <Link to={`/categories/${product.category}`} className="hover:text-primary">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              </li>
              <span>/</span>
              <li className="text-gray-900 dark:text-gray-200 font-medium truncate">{product.name}</li>
            </ol>
          </nav>

          {/* Back to Shop Link */}
          <Link 
            to="/shop" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
              {/* Product Images - Takes 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  {product.isOrganic && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
                        <Leaf className="h-3 w-3" />
                        100% Organic
                      </Badge>
                    </div>
                  )}
                  {product.salePrice && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">
                        Sale
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Thumbnails */}
                <div className="flex justify-center gap-2">
                  {[...Array(3)].map((_, index) => (
                    <button 
                      key={index}
                      className={cn(
                        "w-16 h-16 rounded-md overflow-hidden border-2",
                        index === activeImageIndex ? "border-primary" : "border-transparent"
                      )}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={product.image} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info - Takes 3 columns on large screens */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  {product.isSeasonal && (
                    <Badge variant="outline" className="mb-2">Seasonal</Badge>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
                  
                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          className="h-4 w-4" 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div>
                  {currentSalePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(currentSalePrice)}</span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">{formatPrice(currentPrice)}</span>
                      <Badge variant="destructive" className="ml-2">
                        {(((currentPrice - currentSalePrice) / currentPrice) * 100).toFixed(0)}% OFF
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(currentPrice)}</span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                
                {/* Weight Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Weight Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.weightOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedWeight === option.value ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setSelectedWeight(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Quantity</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="rounded-full h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center dark:text-gray-100">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="rounded-full h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {product.stock} available
                    </span>
                  </div>
                </div>
                
                {/* Add to Cart & Wishlist */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 gap-2 btn-hover"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleAddToWishlist}
                    className={`flex-1 gap-2 btn-hover ${isAddingToWishlist ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                    disabled={isAddingToWishlist}
                  >
                    <Heart className={`h-5 w-5 ${isAddingToWishlist ? 'text-red-500 fill-red-500' : ''}`} />
                    Add to Wishlist
                  </Button>
                </div>
                
                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Free Delivery</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">For orders over ₹4,000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Quality Guarantee</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">100% satisfaction guaranteed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">100% Organic</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Certified organic produce</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <RotateCcw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Easy Returns</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <Tabs defaultValue="description">
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="nutritional">Nutritional Info</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="text-gray-600 dark:text-gray-300">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      {product.description}
                    </p>
                    <p>
                      Our {product.name.toLowerCase()} is grown using sustainable farming practices, 
                      without harmful pesticides or chemicals. We harvest at peak ripeness 
                      to ensure maximum flavor and nutritional value.
                    </p>
                    <p>
                      Store in a cool, dry place or refrigerate for longer shelf life. 
                      Wash thoroughly before consumption.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="nutritional">
                  <div className="max-w-md">
                    <h3 className="font-medium mb-3 dark:text-gray-100">Nutritional Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="dark:text-gray-300">Calories</span>
                        <span className="font-medium dark:text-gray-100">{product.nutritionalInfo.calories} kcal</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="dark:text-gray-300">Protein</span>
                        <span className="font-medium dark:text-gray-100">{product.nutritionalInfo.protein}g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="dark:text-gray-300">Carbohydrates</span>
                        <span className="font-medium dark:text-gray-100">{product.nutritionalInfo.carbs}g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="dark:text-gray-300">Fat</span>
                        <span className="font-medium dark:text-gray-100">{product.nutritionalInfo.fat}g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="dark:text-gray-300">Fiber</span>
                        <span className="font-medium dark:text-gray-100">{product.nutritionalInfo.fiber}g</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      *Values are approximate and based on standard serving sizes.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="reviews">
                  <div className="space-y-4">
                    {/* This would be dynamically generated from real reviews */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                          <span className="font-medium dark:text-gray-100">Jane Smith</span>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              fill={i < 5 ? "currentColor" : "none"}
                              className="h-4 w-4" 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        The quality is excellent! Very fresh and tastes amazing. 
                        Will definitely order again.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Posted 3 days ago</p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                          <span className="font-medium dark:text-gray-100">John Doe</span>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              fill={i < 4 ? "currentColor" : "none"}
                              className="h-4 w-4" 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Great organic vegetables, delivered on time and well-packaged.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Posted 1 week ago</p>
                    </div>
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link 
                    key={relatedProduct.id} 
                    to={`/product/${relatedProduct.id}`}
                    className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{relatedProduct.category}</p>
                      <div className="mt-2">
                        {relatedProduct.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(relatedProduct.salePrice)}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(relatedProduct.price)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(relatedProduct.price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
