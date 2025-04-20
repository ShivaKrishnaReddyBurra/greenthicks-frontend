
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { X, Trash2 } from "lucide-react";

export function NavbarCart() {
  const { cartItems, removeFromCart, getCartSubtotal } = useCart();
  // Ensure cartItems is always an array even if undefined
  const items = cartItems || [];
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getCartSubtotal();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <SheetTitle>Your Cart ({cartCount})</SheetTitle>
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-auto">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item, index) => {
                  const weightOption = item.product.weightOptions.find(
                    (w) => w.value === item.selectedWeight
                  );
                  const price = item.product.salePrice || weightOption?.price || item.product.price;
                  
                  return (
                    <li key={index} className="flex gap-4 p-4">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {weightOption?.label} • Qty: {item.quantity}
                        </p>
                        <div className="mt-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatPrice(price * item.quantity)}
                          </span>
                          <button 
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <SheetFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      asChild
                      className="w-full"
                    >
                      <Link to="/cart">View Cart</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button 
                      asChild
                      className="w-full"
                    >
                      <Link to="/checkout">Checkout</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
              <ShoppingCart className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <SheetClose asChild>
              <Button 
                asChild
                className="rounded-full"
              >
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
