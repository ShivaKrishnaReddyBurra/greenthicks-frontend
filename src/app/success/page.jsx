"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderDate: "",
    deliveryDate: "",
    deliveryTime: "",
    orderTotal: 0,
    orderItems: [],
    paymentMethod: "",
    shippingAddress: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    appliedCoupon: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAfter1PM, setIsAfter1PM] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = sessionStorage.getItem("id");

      if (!orderId) {
        toast({
          title: "No order found",
          description: "Please place an order before accessing this page.",
          variant: "destructive",
        });
        router.push("/cart");
        return;
      }

      try {
        // Fetch order details from backend
        const response = await getOrder(orderId);
        const order = response;
        
        // Calculate delivery date and time based on order time
        const orderDate = new Date(order.orderDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Check if order was placed before 1 PM
        const isBefore1PM = orderDate.getHours() < 13;
        setIsAfter1PM(!isBefore1PM);
        
        const deliveryDate = isBefore1PM ? today : tomorrow;
        const deliveryTime = isBefore1PM 
          ? "Today (Evening Delivery, 6 PM - 10 PM)" 
          : "Tomorrow (Delivery, 6 AM - 6 PM)";

        setOrderDetails({
          orderId: order.id,
          orderDate: orderDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          deliveryDate: deliveryDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          deliveryTime,
          orderTotal: order.total,
          orderItems: order.items,
          paymentMethod: "",
          shippingAddress: order.shippingAddress,
          shipping: order.shipping,
          discount: order.discount,
          appliedCoupon: sessionStorage.getItem("appliedCoupon") || "",
        });

        // Clear session storage
        sessionStorage.removeItem("orderId");
        sessionStorage.removeItem("orderDate");
        sessionStorage.removeItem("deliveryDate");
        sessionStorage.removeItem("orderStatus");
        sessionStorage.removeItem("orderItems");
        sessionStorage.removeItem("orderTotal");
        sessionStorage.removeItem("paymentMethod");
        sessionStorage.removeItem("shippingAddress");
        sessionStorage.removeItem("cartSubtotal");
        sessionStorage.removeItem("cartShipping");
        sessionStorage.removeItem("cartDiscount");
        sessionStorage.removeItem("cartTotal");
        sessionStorage.removeItem("appliedCoupon");
        sessionStorage.removeItem("id");
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        toast({
          title: "Error",
          description: "Failed to load order details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [isLoading, router, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!orderDetails.orderId) {
    return null;
  }

  const subtotal = orderDetails.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      <div className="leaf-pattern">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:max-w-3xl">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Thank you for your order. Your vegetables will be delivered {orderDetails.deliveryTime.toLowerCase()}.
            </p>

            {isAfter1PM && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:bottom-4 sm:right-4 sm:top-auto sm:left-auto sm:translate-x-0 z-50 bg-white border border-red-600 rounded-lg shadow-lg p-4 max-w-sm w-[calc(100%-2rem)] sm:w-full animate-in slide-in-from-top sm:slide-in-from-bottom">
                <h3 className="text-base sm:text-lg font-semibold text-red-600">Delivery Schedule</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Since your order was placed after 1 PM, it will be delivered tomorrow evening.
                </p>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => setIsAfter1PM(false)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9"
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}

            <div className="w-full bg-card border rounded-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center pb-3 sm:pb-4 border-b">
                  <p className="text-gray-500 text-xs sm:text-sm">Order Number</p>
                  <p className="font-bold text-lg sm:text-xl">{orderDetails.orderId}</p>
                </div>

                <div className="text-center pb-3 sm:pb-4 border-b">
                  <p className="text-gray-500 text-xs sm:text-sm">Order Date</p>
                  <p className="font-bold text-sm sm:text-base">{orderDetails.orderDate}</p>
                </div>

                <div className="text-center pb-3 sm:pb-4 border-b">
                  <p className="text-gray-500 text-xs sm:text-sm">Estimated Delivery</p>
                  <p className="font-bold text-sm sm:text-base">{orderDetails.deliveryTime}</p>
                </div>

                <div className="text-center pb-3 sm:pb-4 border-b">
                  <p className="text-gray-500 text-xs sm:text-sm">Payment Method</p>
                  <p className="font-bold text-sm sm:text-base">
                    {orderDetails.paymentMethod === "upi"
                      ? "UPI"
                      : orderDetails.paymentMethod === "credit-card"
                      ? "Credit/Debit Card"
                      : "Cash on Delivery"}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">Shipping Address</p>
                  <p className="font-medium text-sm sm:text-base">
                    {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                  </p>
                  <p className="text-sm sm:text-base">{orderDetails.shippingAddress.address}</p>
                  <p className="text-sm sm:text-base">
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
                    {orderDetails.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full bg-card border rounded-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {orderDetails.orderItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 py-2 sm:py-3 border-b last:border-0">
                    <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-bl-md">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-xs sm:text-sm">{item.name}</h3>
                    </div>
                    <div className="text-xs sm:text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {orderDetails.appliedCoupon && (
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>Discount ({orderDetails.appliedCoupon})</span>
                      <span>-₹{orderDetails.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{orderDetails.shipping}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-base sm:text-lg">
                    <span>Total</span>
                    <span>₹{orderDetails.orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3 sm:space-y-4">
              <Link href="/products">
                <Button className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-12 text-sm sm:text-base">Continue Shopping</Button>
              </Link>
              <Link href="/my-orders">
                <Button variant="outline" className="w-full h-10 sm:h-12 text-sm sm:text-base">View Order History</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}