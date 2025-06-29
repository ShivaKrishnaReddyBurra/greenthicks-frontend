"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { validateCoupon } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag, ArrowRight, Truck, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  useEffect(() => {
  // Reset free shipping when coming back to Cart
  sessionStorage.setItem("isFreeShipping", "false");
}, []);

  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();
  const debounceTimeout = useRef(null);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal - discount;

const handleApplyCoupon = async () => {
  if (!couponCode) {
    toast({
      title: "No Coupon Code Entered",
      description: "Please enter a coupon code to apply.",
      variant: "destructive",
    });
    return;
  }

  setActionLoading(true);

  try {
    const response = await validateCoupon(couponCode, subtotal);

    let discountAmount = 0;
    if (response.discountType === "percentage") {
      discountAmount = (subtotal * response.discountValue) / 100;
    } else if (response.discountType === "fixed") {
      discountAmount = response.discountValue;
    }

    const freeShipping = response.isFreeDelivery === true;

    // ✅ Save correct values to sessionStorage
    sessionStorage.setItem("cartDiscount", discountAmount.toString());
    sessionStorage.setItem("appliedCoupon", couponCode);
    sessionStorage.setItem("isFreeShipping", freeShipping.toString());

    // ✅ Update state
    setDiscount(discountAmount);
    setIsFreeShipping(freeShipping);
    setAppliedCoupon(couponCode.toUpperCase());

    toast({
      title: "Coupon Applied Successfully!",
      description: `Coupon ${couponCode.toUpperCase()} applied.${freeShipping ? " Free delivery activated!" : ""}`,
    });

  } catch (error) {
    toast({
      title: "Invalid Coupon",
      description: error?.message || "This coupon is not valid.",
      variant: "destructive",
    });
  } finally {
    setActionLoading(false);
  }
};

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    sessionStorage.setItem("cartDiscount", discount.toString());
    sessionStorage.setItem("cartSubtotal", subtotal.toString());
    sessionStorage.setItem("cartTotal", total.toString());
    sessionStorage.setItem("appliedCoupon", appliedCoupon);
    sessionStorage.setItem("isFreeShipping", isFreeShipping.toString());

    router.push("/checkout");
    setActionLoading(false);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setActionLoading(true);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      updateQuantity(productId, newQuantity);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }, 500);
  };

  const handleRemoveFromCart = async (productId) => {
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
      duration: 5000,
    });
    setActionLoading(false);
  };

  const handleClearCart = async () => {
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      duration: 5000,
    });
    setActionLoading(false);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  if (cart.length === 0) {
    return (
      <>
        {actionLoading && <LeafLoader />}
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any vegetables to your cart yet.</p>
            <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
              <Button className="px-8">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {actionLoading && <LeafLoader />}
      <div className="leaf-pattern-3">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-4 bg-muted/50">
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4">
                    <div className="col-span-6 font-medium">Product</div>
                    <div className="col-span-2 font-medium text-center">Price</div>
                    <div className="col-span-2 font-medium text-center">Quantity</div>
                    <div className="col-span-2 font-medium text-right">Total</div>
                  </div>
                </div>

                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.productId} className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-12 sm:items-center">
                        <div className="sm:col-span-6">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={item.image || "/placeholder.svg?height=64&width=64"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <div className="text-sm text-muted-foreground sm:hidden">
                                Price: ₹{item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:block sm:col-span-2 text-center">₹{item.price.toFixed(2)}</div>

                        <div className="flex justify-between items-center sm:col-span-2 sm:justify-center">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-r-none"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="h-9 w-12 flex items-center justify-center border-y text-center">
                              {item.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-l-none"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:col-span-2 sm:justify-end gap-4 sm:gap-3">
                          <span className="text-base font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveFromCart(item.productId)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleClearCart}>
                  Clear Cart
                </Button>
                <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>

            <div>
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount {appliedCoupon && `(${appliedCoupon})`}</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="border p-2 rounded"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>

                  {/* ✅ Free Delivery Message */}
                  {typeof window !== "undefined" && sessionStorage.getItem("isFreeShipping") === "true" && (
                    <div className="text-green-600 text-sm border border-green-300 rounded p-2 bg-green-50 mt-2">
                      ✅ You’ve activated <strong>Free Delivery</strong> with your coupon!
                    </div>
                  )}

                  <div className="bg-primary/10 rounded-md p-3 text-sm flex items-start gap-2">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p>{sessionStorage.getItem("isFreeShipping") === "true" ? "Free delivery activated!" : "Delivery charges applied at checkout"}</p>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}