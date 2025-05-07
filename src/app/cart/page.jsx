"use client";
import React from "react";
import { useState } from "react";
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

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const { toast } = useToast();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast({
        title: "No coupon code",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await validateCoupon(couponCode, subtotal);
      setDiscount(response.discount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast({
        title: "Coupon applied!",
        description: `Coupon ${couponCode.toUpperCase()} applied successfully.`,
      });
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      toast({
        title: "Invalid coupon",
        description: error.message || "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Store order information in session storage for checkout
    sessionStorage.setItem("cartDiscount", discount.toString());
    sessionStorage.setItem("cartSubtotal", subtotal.toString());
    sessionStorage.setItem("cartShipping", shipping.toString());
    sessionStorage.setItem("cartTotal", total.toString());
    sessionStorage.setItem("appliedCoupon", appliedCoupon);

    router.push("/checkout");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any vegetables to your cart yet.</p>
          <Link href="/products">
            <Button className="px-8">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="leaf-pattern-3">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="p-4 bg-muted/50">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6 font-medium">Product</div>
                  <div className="col-span-2 font-medium text-center">Price</div>
                  <div className="col-span-2 font-medium text-center">Quantity</div>
                  <div className="col-span-2 font-medium text-right">Total</div>
                </div>
              </div>

              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.productId} className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="flex items-center gap-3">
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
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">₹{item.price.toFixed(2)}</div>

                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-8 px-3 flex items-center justify-center border-y">{item.quantity}</div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-2 text-right flex items-center justify-end gap-2">
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/products">
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

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>

                <div className="bg-primary/10 rounded-md p-3 text-sm flex items-start gap-2">
                  <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p>Free shipping on orders over $50. Orders placed before 3 PM are shipped same day!</p>
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
  );
}