"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, LockIcon, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createOrder, getUserProfile } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    appliedCoupon: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    useCurrentLocation: false,
    currentLocation: null,
  });

  // Fetch user profile to pre-fill shipping details
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setFormData((prev) => ({
          ...prev,
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address?.address || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zipCode: profile.address?.zipCode || "",
        }));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();

    // Load order summary from session storage
    const subtotal = parseFloat(sessionStorage.getItem("cartSubtotal") || "0");
    const shipping = parseFloat(sessionStorage.getItem("cartShipping") || "0");
    const discount = parseFloat(sessionStorage.getItem("cartDiscount") || "0");
    const total = parseFloat(sessionStorage.getItem("cartTotal") || "0");
    const appliedCoupon = sessionStorage.getItem("appliedCoupon") || "";

    setOrderSummary({
      subtotal,
      shipping,
      discount,
      total,
      appliedCoupon,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "credit-card") {
      const paymentFields = ["cardNumber", "cardName", "expiryDate", "cvv"];
      const missingPaymentFields = paymentFields.filter((field) => !formData[field]);

      if (missingPaymentFields.length > 0) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all payment details.",
          variant: "destructive",
        });
        return;
      }

      // Validate card number format (simple check)
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cardNumber)) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return;
      }

      // Validate expiry date format (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date in MM/YY format.",
          variant: "destructive",
        });
        return;
      }

      // Validate CVV format
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3 or 4 digit CVV code.",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!formData.upiId) {
        toast({
          title: "Missing UPI ID",
          description: "Please enter your UPI ID.",
          variant: "destructive",
        });
        return;
      }

      // Validate UPI ID format
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(formData.upiId)) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., name@upi).",
          variant: "destructive",
        });
        return;
      }
    }

    // Process order
    setIsProcessing(true);

    try {
      const orderData = {
        paymentMethod,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        couponCode: orderSummary.appliedCoupon,
      };

      const response = await createOrder(orderData);

      // Store order information in session storage
      sessionStorage.setItem("orderId", response.order.id);
      sessionStorage.setItem("orderDate", response.order.orderDate);
      sessionStorage.setItem("deliveryDate", response.order.deliveryDate);
      sessionStorage.setItem("orderStatus", response.order.status);
      sessionStorage.setItem("orderItems", JSON.stringify(response.order.items));
      sessionStorage.setItem("orderTotal", response.order.total.toString());
      sessionStorage.setItem("paymentMethod", response.order.paymentMethod);
      sessionStorage.setItem("shippingAddress", JSON.stringify(response.order.shippingAddress));

      toast({
        title: "Order placed successfully",
        description: `Your order ${response.order.id} has been placed.`,
      });

      // Clear cart and redirect to success page
      clearCart();
      router.push("/success");
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-card rounded-lg border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="address">Address *</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="useCurrentLocation"
                        checked={formData.useCurrentLocation}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Get current location
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setFormData({
                                    ...formData,
                                    useCurrentLocation: true,
                                    currentLocation: {
                                      latitude: position.coords.latitude,
                                      longitude: position.coords.longitude,
                                    },
                                  });
                                  toast({
                                    title: "Location shared",
                                    description: "Your current location has been added to help with delivery.",
                                  });
                                },
                                (error) => {
                                  toast({
                                    title: "Location error",
                                    description: "Could not get your current location. Please check permissions.",
                                    variant: "destructive",
                                  });
                                }
                              );
                            }
                          } else {
                            setFormData({
                              ...formData,
                              useCurrentLocation: false,
                              currentLocation: null,
                            });
                          }
                        }}
                      />
                      <Label htmlFor="useCurrentLocation" className="text-sm flex items-center">
                        <MapPin className="h-3.5 w-3.5 text-primary mr-1" />
                        Share location for precise delivery
                      </Label>
                    </div>
                  </div>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.useCurrentLocation && formData.currentLocation && (
                    <div className="bg-primary/10 p-2 rounded-md text-sm flex items-center">
                      <MapPin className="h-4 w-4 text-primary inline mr-2 flex-shrink-0" />
                      <span>Location shared for precise delivery</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <LockIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Secure Payment</h2>
              </div>

              <div className="bg-primary/5 p-4 rounded-md mb-6 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Safe & Secure Payments</p>
                  <p className="text-xs text-muted-foreground">
                    All payment information is encrypted and securely processed. We do not store your card details.
                  </p>
                </div>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                <div className="flex items-center space-x-2 mb-2 p-3 border rounded-md bg-background/50">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center flex-1">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                      VISA
                    </div>
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                      MC
                    </div>
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                      AMEX
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2 p-3 border rounded-md bg-background/50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center flex-1">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L1 6V18L12 24L23 18V6L12 0Z" fill="#3A3A3A" />
                      <path d="M12 0L1 6V18L12 24V0Z" fill="#3A3A3A" />
                      <path d="M12 0V24L23 18V6L12 0Z" fill="#7B7B7B" />
                      <path d="M5.5 9.5L12 13.5L18.5 9.5" stroke="white" strokeWidth="1.5" />
                    </svg>
                    UPI Payment
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                      UPI
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-md bg-background/50">
                  <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                  <Label htmlFor="cash-on-delivery" className="flex-1">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "credit-card" && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID *</Label>
                    <Input
                      id="upiId"
                      name="upiId"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <OrderSummary cart={cart} orderSummary={orderSummary} />
            </div>

            <div className="flex justify-between mt-6">
              <Link href="/cart">
                <Button variant="outline" type="button">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Cart
                </Button>
              </Link>

              <Button type="submit" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Complete Order"}
              </Button>
            </div>
          </form>
        </div>

        <div className="hidden md:block">
          <OrderSummary cart={cart} orderSummary={orderSummary} />
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ cart, orderSummary }) {
  return (
    <div className="bg-card rounded-lg border p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="max-h-80 overflow-y-auto mb-4">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 py-3 border-b last:border-0">
            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg?height=64&width=64"}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-bl-md">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
            </div>
            <div className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{orderSummary.subtotal.toFixed(2)}</span>
        </div>

        {orderSummary.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount {orderSummary.appliedCoupon && `(${orderSummary.appliedCoupon})`}</span>
            <span>-₹{orderSummary.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{orderSummary.shipping === 0 ? "Free" : `₹${orderSummary.shipping.toFixed(2)}`}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>₹{orderSummary.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-primary/10 rounded-md p-3 text-sm flex items-start gap-2">
        <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p>Your order will be delivered within 24-48 hours after payment confirmation.</p>
      </div>
    </div>
  );
}