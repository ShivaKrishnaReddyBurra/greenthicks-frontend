"use client";

import { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Truck, ShieldCheck, LockIcon, MapPin, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CheckoutMapComponent from "@/components/checkout-map-component";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();

  const [paymentMethod] = useState("cash-on-delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
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
  const [showServiceUnavailableModal, setShowServiceUnavailableModal] = useState(false);
  const debounceTimeout = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    lat: null,
    lng: null,
    useCurrentLocation: false,
    currentLocation: null,
    mapLocation: null,
  });

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

  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    const fetchData = async () => {
      setActionLoading(true);
      try {
        const [profile, addressData] = await Promise.all([
          fetchWithAuth("/api/auth/profile"),
          fetchWithAuth("/api/addresses"),
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
            lat: primaryAddress.lat || null,
            lng: primaryAddress.lng || null,
            useCurrentLocation: false,
            currentLocation: primaryAddress.location || null,
            mapLocation: primaryAddress.mapLocation || null,
          });
          await checkServiceAvailability(primaryAddress.zipCode, primaryAddress.mapLocation);
        } else {
          setIsAddingAddress(true);
        }

        const subtotal = Number.parseFloat(sessionStorage.getItem("cartSubtotal") || "0");
        const shipping = Number.parseFloat(sessionStorage.getItem("cartShipping") || "0");
        const discount = Number.parseFloat(sessionStorage.getItem("cartDiscount") || "0");
        const total = Number.parseFloat(sessionStorage.getItem("cartTotal") || "0");
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
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    };
    fetchData();
  }, []);

  const checkServiceAvailability = async (pincode, mapLocation = null) => {
    setActionLoading(true);
    try {
      if (!mapLocation || !mapLocation.lat || !mapLocation.lng) {
        console.warn("Invalid mapLocation:", mapLocation);
        throw new Error("Please select a valid location on the map.");
      }

      console.log("Checking service availability for:", { pincode, mapLocation });

      const response = await fetchWithAuth("/api/service-areas/check-location", {
        method: "POST",
        body: JSON.stringify({
          location: {
            lat: parseFloat(mapLocation.lat),
            lng: parseFloat(mapLocation.lng),
          },
        }),
      });

      console.log("Service availability response:", response);

      if (response.isValid) {
        setIsServiceAvailable(true);
        toast({
          title: "Service Available",
          description: `Delivery is available in ${response.serviceArea.city}, ${response.serviceArea.state}.`,
        });
      } else {
        throw new Error(response.message || "Delivery is not available in this area.");
      }
    } catch (error) {
      console.error("Service availability check failed:", error);
      setIsServiceAvailable(false);
      setShowServiceUnavailableModal(true);
      toast({
        title: "Service Unavailable",
        description: error.message || "Delivery is not available in this area.",
        variant: "destructive",
      });
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "zipCode" && value.match(/^\d{5,6}$/)) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        checkServiceAvailability(value, formData.mapLocation);
      }, 500);
    }
  };

  const handleAddressSelect = async (addressId) => {
    setActionLoading(true);
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
        lat: selectedAddress.lat || null,
        lng: selectedAddress.lng || null,
        useCurrentLocation: false,
        currentLocation: selectedAddress.location || null,
        mapLocation: selectedAddress.mapLocation || null,
      });
      await checkServiceAvailability(selectedAddress.zipCode, selectedAddress.mapLocation);
      setIsAddingAddress(false);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handleMapLocationSelect = (location, address) => {
    if (!location || !location.lat || !location.lng) {
      console.error("Invalid location selected:", location);
      toast({
        title: "Invalid Location",
        description: "Please select a valid location on the map.",
        variant: "destructive",
      });
      return;
    }

    console.log("Map location selected:", { location, address });

    setFormData((prev) => ({
      ...prev,
      mapLocation: location,
      address: address,
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng),
    }));

    let extractedZipCode = formData.zipCode;
    const addressParts = address.split(", ");
    if (addressParts.length >= 3) {
      const zipMatch = addressParts[addressParts.length - 1].match(/\d{5,6}/);
      if (zipMatch) {
        extractedZipCode = zipMatch[0];
        setFormData((prev) => ({
          ...prev,
          zipCode: extractedZipCode,
        }));
      }
      setFormData((prev) => ({
        ...prev,
        city: addressParts[addressParts.length - 3] || prev.city,
        state: addressParts[addressParts.length - 2] || prev.state,
      }));
    }

    checkServiceAvailability(extractedZipCode || "", location);

    toast({
      title: "Location Selected",
      description: "Your delivery location has been updated.",
    });
  };

  const handleSaveAddress = async () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      lat,
      lng,
      useCurrentLocation,
      currentLocation,
      mapLocation,
    } = formData;

    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required address fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/^(\+91[-\s]?)?[6-9]\d{9}$/.test(phone)) {
      toast({
        title: "Invalid Phone",
        description: "Phone number must be in Indian format (e.g., +91 9234567890).",
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
        description: "Please select a valid location where service is available.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);

    const addressData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      isPrimary: true,
      location: useCurrentLocation && currentLocation ? currentLocation : undefined,
      mapLocation: mapLocation || undefined,
    };

    try {
      console.log("Sending address data to /api/addresses:", addressData);

      const response = await fetchWithAuth("/api/addresses", {
        method: "POST",
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
      console.error("Failed to save address:", error.message, { addressData });
      toast({
        title: "Error",
        description: error.message || "Failed to save address.",
        variant: "destructive",
      });
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
  };

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
    setActionLoading(true);
    try {
      const orderData = {
        paymentMethod,
        addressId: selectedAddressId,
        couponCode: orderSummary.appliedCoupon,
      };

      const response = await createOrder(orderData);

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
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
      setIsProcessing(false);
    }
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  if (shouldRedirect) {
    return null;
  }

  return (
    <>
      {actionLoading && <LeafLoader />}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center text-primary hover:underline text-sm sm:text-base"
            onClick={(e) => handleNavigation(e, "/cart")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-card rounded-lg border p-4 sm:p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-semibold">Shipping Information</h2>
                </div>

                <div className="mb-6">
                  <Label className="text-base sm:text-lg font-medium">Select Address</Label>
                  {addresses.length === 0 && !isAddingAddress ? (
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">No addresses found. Please add an address below.</p>
                  ) : (
                    <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect} className="mt-3 space-y-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.addressId}
                          className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <RadioGroupItem value={addr.addressId} id={`address-${addr.addressId}`} className="mt-1" />
                          <Label
                            htmlFor={`address-${addr.addressId}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="font-semibold text-sm sm:text-base">
                                {addr.firstName} {addr.lastName}
                                {addr.isPrimary && (
                                  <span className="ml-2 text-xs sm:text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    Primary
                                  </span>
                                )}
                              </p>
                              {addr.mapLocation && (
                                <span className="text-green-600 flex items-center text-xs sm:text-sm">
                                  <MapPin className="h-4 w-4 mr-1" /> Map Location
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addr.address}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  className="mb-6 w-full sm:w-auto bg-white dark:bg-gray-800 border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm sm:text-base"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                >
                  {isAddingAddress ? "Cancel" : "Add New Address"}
                </Button>

                {isAddingAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4  rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9234567890"
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                          Address <span className="text-red-500">*</span>
                        </Label>
                      </div>

                      <CheckoutMapComponent
                        onLocationSelect={handleMapLocationSelect}
                        initialLocation={formData.mapLocation}
                        initialAddress={formData.address}
                      />

                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary min-h-[100px] w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-sm font-medium">
                          ZIP Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary w-full"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleSaveAddress}
                      className="md:col-span-2 w-full bg-primary text-white hover:bg-primary-dark transition-colors text-sm sm:text-base"
                    >
                      Save Address
                    </Button>
                  </div>
                )}

                {isServiceAvailable === false && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-4 mt-6">
                    <div className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700 dark:text-red-400 font-medium text-sm sm:text-base">
                        Delivery is not available in this area. Please select a different location.
                      </span>
                    </div>
                  </div>
                )}

                {isServiceAvailable === true && (
                  <div className="bg-primary/5 border border-green-200 dark:border-green-800 rounded-md p-4 mt-6">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-700 dark:text-green-400 font-medium text-sm sm:text-base">
                        Delivery available in this area
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-lg border p-4 sm:p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <LockIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-semibold">Payment Method</h2>
                </div>

                <div className="bg-primary/5 p-4 rounded-md mb-6 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when your order is delivered.</p>
                  </div>
                </div>
              </div>

              <div className="md:hidden mb-6">
                <OrderSummary cart={cart} orderSummary={orderSummary} />
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                <Link href="/cart" onClick={(e) => handleNavigation(e, "/cart")}>
                  <Button variant="outline" type="button" className="w-full sm:w-auto text-sm sm:text-base">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Cart
                  </Button>
                </Link>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing || !selectedAddressId || !isServiceAvailable}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  {isProcessing ? "Processing..." : "Complete Order"}
                </Button>
              </div>
            </form>
          </div>

          <div className="hidden md:block">
            <OrderSummary cart={cart} orderSummary={orderSummary} />
          </div>
        </div>

        <Dialog open={showServiceUnavailableModal} onOpenChange={setShowServiceUnavailableModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Service Not Available
              </DialogTitle>
              <DialogDescription>
                We're sorry, but delivery is not available at the selected location.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">
                  The location you selected is outside our delivery area. Please choose a different location or check
                  our service areas.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowServiceUnavailableModal(false)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Try Different Location
                </Button>
                <Button
                  onClick={() => {
                    setShowServiceUnavailableModal(false);
                    router.push("/service-areas-view");
                  }}
                  className="flex-1 text-sm sm:text-base"
                >
                  View Service Areas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function OrderSummary({ cart, orderSummary }) {
  return (
    <div className="bg-card rounded-lg border p-4 sm:p-6 sticky top-20 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>

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
              <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
            </div>
            <div className="text-sm sm:text-base font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{orderSummary.subtotal.toFixed(2)}</span>
        </div>

        {orderSummary.discount > 0 && (
          <div className="flex justify-between text-green-600 text-sm sm:text-base">
            <span>Discount {orderSummary.appliedCoupon && `(${orderSummary.appliedCoupon})`}</span>
            <span>-₹{orderSummary.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-muted-foreground">Shipping</span>
          <span>{orderSummary.shipping === 0 ? "Free" : `₹${orderSummary.shipping.toFixed(2)}`}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-base sm:text-lg">
          <span>Total</span>
          <span>₹{orderSummary.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-primary/10 rounded-md p-3 text-sm flex items-start gap-2">
        <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p>Your order will be delivered within 12-24 hours after Order confirmation.</p>
      </div>
    </div>
  );
}