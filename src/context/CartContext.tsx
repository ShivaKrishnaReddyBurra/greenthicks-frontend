
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedWeight: string) => void;
  removeFromCart: (itemIndex: number) => void;
  updateQuantity: (itemIndex: number, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartCount: () => number;
}

// Create a default context with empty arrays and no-op functions
const defaultCartContext: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartSubtotal: () => 0,
  getCartCount: () => 0
};

const CartContext = createContext<CartContextType>(defaultCartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number, selectedWeight: string) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
    );

    if (existingItemIndex !== -1) {
      // Product exists, update quantity
      const updatedItems = [...cartItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity <= product.stock) {
        updatedItems[existingItemIndex].quantity = newQuantity;
        setCartItems(updatedItems);
        toast.success(`${product.name} quantity updated in cart`);
      } else {
        toast.error(`Cannot add more units. Maximum stock reached.`);
      }
    } else {
      // Product doesn't exist, add new item
      setCartItems([...cartItems, { product, quantity, selectedWeight }]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const removeFromCart = (itemIndex: number) => {
    const updatedItems = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(updatedItems);
    toast.success("Item removed from cart");
  };

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const item = cartItems[itemIndex];
    if (newQuantity > item.product.stock) {
      toast.error(`Cannot add more units. Maximum stock reached.`);
      return;
    }
    
    const updatedItems = [...cartItems];
    updatedItems[itemIndex].quantity = newQuantity;
    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const weightOption = item.product.weightOptions.find(
        (w) => w.value === item.selectedWeight
      );
      const price = item.product.salePrice || weightOption?.price || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    // Apply shipping logic - free shipping over ₹4000, otherwise ₹400
    const shippingFee = subtotal > 4000 ? 0 : 400;
    return subtotal + shippingFee;
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartSubtotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error("useCart must be used within a CartProvider");
    return defaultCartContext; // Return default context instead of throwing an error
  }
  return context;
}
