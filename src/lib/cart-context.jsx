"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, removeFromCart, clearCart } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getUserId } from "@/lib/auth-utils";

const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { toast } = useToast();

  // Fetch cart from backend on initial render
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = getUserId();
        if (userId) {
          const data = await getCart();
          setCart(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast({
          title: "Error",
          description: "Failed to load cart. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchCart();
  }, []);

  const addToCartHandler = async (product, quantity = 1) => {
    try {
      const response = await addToCart(product.globalId, quantity);
      setCart(response.cart.items || []);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const removeFromCartHandler = async (productId) => {
    try {
      const response = await removeFromCart(productId);
      setCart(response.cart.items || []);
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      // Since the backend doesn't have an update quantity endpoint, we remove and re-add
      await removeFromCart(productId);
      if (quantity > 0) {
        await addToCart(productId, quantity);
      }
      const data = await getCart();
      setCart(data.items || []);
      toast({
        title: "Quantity updated",
        description: "Cart quantity has been updated.",
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity.",
        variant: "destructive",
      });
    }
  };

  const clearCartHandler = async () => {
    try {
      await clearCart();
      setCart([]);
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart.",
        variant: "destructive",
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addToCartHandler,
        removeFromCart: removeFromCartHandler,
        updateQuantity,
        clearCart: clearCartHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}