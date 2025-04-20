
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartSubtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Calculate totals
  const subtotal = getCartSubtotal();
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount for sample coupon
  const deliveryFee = subtotal > 4000 ? 0 : 400;
  const total = subtotal - discount + deliveryFee;

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (couponCode.toLowerCase() === "fresh10") {
      setCouponApplied(true);
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 leaf-pattern py-8">
        <div className="container px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Your Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items (2 columns) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Shopping Cart ({cartItems.length} items)
                      </h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((item, index) => {
                        const weightOption = item.product.weightOptions.find(
                          (w) => w.value === item.selectedWeight
                        );
                        const price = item.product.salePrice || weightOption?.price || item.product.price;
                        return (
                          <div key={index} className="py-6 flex flex-col sm:flex-row gap-4">
                            {/* Product Image */}
                            <Link 
                              to={`/product/${item.product.id}`}
                              className="w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0"
                            >
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            </Link>
                            
                            {/* Product Details */}
                            <div className="flex-grow">
                              <div className="flex flex-col sm:flex-row justify-between">
                                <div>
                                  <Link 
                                    to={`/product/${item.product.id}`} 
                                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary transition-colors"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {weightOption?.label || item.product.weightOptions[0].label}
                                  </div>
                                </div>
                                <div className="text-right sm:text-left mt-2 sm:mt-0">
                                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                                    {formatPrice(price)}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatPrice(price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex flex-wrap justify-between items-center mt-4">
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full">
                                  <button
                                    onClick={() => updateQuantity(index, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-primary disabled:text-gray-300 dark:disabled:text-gray-600 transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-10 text-center text-gray-900 dark:text-gray-100">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-primary disabled:text-gray-300 dark:disabled:text-gray-600 transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => handleRemoveItem(index)}
                                  className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Continue Shopping */}
                <Link 
                  to="/shop"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <X className="h-4 w-4 mr-2 rotate-45" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary (1 column) */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
                  
                  {/* Coupon Code */}
                  <form onSubmit={handleApplyCoupon} className="mb-6">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-grow rounded-l-full"
                        disabled={couponApplied}
                      />
                      <Button 
                        type="submit" 
                        variant={couponApplied ? "outline" : "default"} 
                        disabled={couponApplied || !couponCode}
                        className="rounded-r-full"
                      >
                        {couponApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    {couponApplied && (
                      <div className="text-green-600 dark:text-green-400 text-sm mt-2">
                        Coupon "FRESH10" applied: 10% discount
                      </div>
                    )}
                  </form>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      asChild 
                      className="w-full gap-2 rounded-full btn-hover"
                    >
                      <Link to="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                      By proceeding, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild className="rounded-full btn-hover">
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
