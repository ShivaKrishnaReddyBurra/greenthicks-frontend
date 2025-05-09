"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { fetchWithAuth, createOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Truck, ShieldCheck, LockIcon, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();

  const [paymentMethod] = useState("cash-on-delivery"); // Fixed to cash on delivery
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    appliedCoupon: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(null);

  // Form state for address
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    useCurrentLocation: false,
    currentLocation: null,
  });

  // Check for empty cart and redirect
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      toast({
        title: "Cart is empty",
        description: "Your cart is empty. Please add items to proceed with checkout.",
        variant: "destructive",
      });
      setShouldRedirect("/cart");
    }
  }, [cart, toast, isProcessing]);

  // Handle navigation
  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  // Fetch user profile and addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, addressData] = await Promise.all([
          fetchWithAuth('/api/auth/profile'),
          fetchWithAuth('/api/addresses'),
        ]);
        setAddresses(addressData);
        const primaryAddress = addressData.find((addr) => addr.isPrimary) || addressData[0];
        if (primaryAddress) {
          setSelectedAddressId(primaryAddress.addressId);
          setFormData({
            firstName: primaryAddress.firstName || "",
            lastName: primaryAddress.lastName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            address: primaryAddress.address || "",
            city: primaryAddress.city || "",
            state: primaryAddress.state || "",
            zipCode: primaryAddress.zipCode || "",
            useCurrentLocation: false,
            currentLocation: primaryAddress.location || null,
          });
          // Check service availability for primary address
          checkServiceAvailability(primaryAddress.zipCode);
        } else {
          setIsAddingAddress(true); // Show address form if no addresses
        }

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
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile or addresses.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  // Check service availability
  const checkServiceAvailability = async (pincode) => {
    try {
      const response = await fetchWithAuth(`/api/service-areas/check?pincode=${pincode}`);
      setIsServiceAvailable(true);
      toast({
        title: "Service Available",
        description: `Delivery is available in ${response.serviceArea.city}, ${response.serviceArea.state}.`,
      });
    } catch (error) {
      setIsServiceAvailable(false);
      toast({
        title: "Service Unavailable",
        description: error.message || "Delivery is not available in this area.",
        variant: "destructive",
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check service availability when zipCode changes
    if (name === "zipCode" && value.match(/^\d{5,6}$/)) {
      checkServiceAvailability(value);
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    const selectedAddress = addresses.find((addr) => addr.addressId === addressId);
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      setFormData({
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        email: selectedAddress.email,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        useCurrentLocation: false,
        currentLocation: selectedAddress.location || null,
      });
      checkServiceAvailability(selectedAddress.zipCode);
      setIsAddingAddress(false);
    }
  };

  // Save new address
  const handleSaveAddress = async () => {
    const { firstName, lastName, email, phone, address, city, state, zipCode, useCurrentLocation, currentLocation } = formData;

    // Validate form
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required address fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\+\d{10,12}$/.test(phone)) {
      toast({
        title: "Invalid Phone",
        description: "Phone number must be in international format (e.g., +12345678901).",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{5,6}$/.test(zipCode)) {
      toast({
        title: "Invalid ZIP Code",
        description: "ZIP code must be 5 or 6 digits.",
        variant: "destructive",
      });
      return;
    }

    if (!isServiceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Please select a valid pincode where service is available.",
        variant: "destructive",
      });
      return;
    }

    try {
      const addressData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        isPrimary: true, // Set as primary since it's the first address
        location: useCurrentLocation && currentLocation ? currentLocation : undefined,
      };

      const response = await fetchWithAuth('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData),
      });

      setAddresses([...addresses, response.address]);
      setSelectedAddressId(response.address.addressId);
      setIsAddingAddress(false);
      toast({
        title: "Address Added",
        description: "Your address has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save address:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save address.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast({
        title: "No address selected",
        description: "Please select or add a shipping address.",
        variant: "destructive",
      });
      return;
    }

    if (!isServiceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Delivery is not available for the selected address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        paymentMethod,
        addressId: selectedAddressId,
        couponCode: orderSummary.appliedCoupon,
      };

      const response = await createOrder(orderData);

      // Store order information
      sessionStorage.setItem("orderId", response.order.id);
      sessionStorage.setItem("id", response.order.globalId);
      sessionStorage.setItem("orderDate", response.order.orderDate);
      sessionStorage.setItem("deliveryDate", response.order.deliveryDate);
      sessionStorage.setItem("orderStatus", response.order.status);
      sessionStorage.setItem("orderItems", JSON.stringify(response.order.items));
      sessionStorage.setItem("orderTotal", response.order.total.toString());
      sessionStorage.setItem("paymentMethod", response.order.paymentMethod);
      sessionStorage.setItem("shippingAddress", JSON.stringify(response.order.shippingAddress));
      sessionStorage.setItem("appliedCoupon", orderSummary.appliedCoupon || "");

      toast({
        title: "Order placed successfully",
        description: `Your order ${response.order.id} has been placed.`,
      });

      await clearCart();
      setShouldRedirect("/success");
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (shouldRedirect) {
    return null;
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

              <div className="mb-4">
                <Label className="text-lg">Select Address</Label>
                {addresses.length === 0 && !isAddingAddress ? (
                  <p className="text-muted-foreground">No addresses found. Please add an address below.</p>
                ) : (
                  <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
                    {addresses.map((addr) => (
                      <div key={addr.addressId} className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value={addr.addressId} id={`address-${addr.addressId}`} />
                        <Label htmlFor={`address-${addr.addressId}`} className="flex-1">
                          <p className="font-medium">
                            {addr.firstName} {addr.lastName}
                            {addr.isPrimary && <span className="ml-2 text-primary">(Primary)</span>}
                          </p>
                          <p>{addr.address}</p>
                          <p>
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mb-4"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
              >
                {isAddingAddress ? "Cancel" : "Add New Address"}
              </Button>

              {isAddingAddress && (
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
        placeholder="+12345678901"
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

    <Button type="button" onClick={handleSaveAddress} className="md:col-span-2">
      Save Address
    </Button>
  </div>
)}
            </div>

            <div className="bg-card rounded-lg border p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <LockIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <div className="bg-primary/5 p-4 rounded-md mb-6 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Pay when your order is delivered.
                  </p>
                </div>
              </div>
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

              <Button type="submit" size="lg" disabled={isProcessing || !selectedAddressId || !isServiceAvailable}>
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