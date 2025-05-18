"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin } from "lucide-react";
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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = sessionStorage.getItem("id");
      const displayOrderId = sessionStorage.getItem("orderId");

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
        // Calculate delivery time
        const deliveryDate = new Date(order.deliveryDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        let deliveryTime = "Morning (6 pm - 10 pm)";
        if (deliveryDate.toDateString() === today.toDateString()) {
          deliveryTime = "Today (Evening Delivery)";
        } else if (deliveryDate.toDateString() === tomorrow.toDateString()) {
          deliveryTime = "Tomorrow Evening (6 pm - 10 pm)";
        }

        setOrderDetails({
          orderId: order.id,
          orderDate: new Date(order.orderDate).toLocaleDateString("en-US", {
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
          paymentMethod: order.paymentMethod,
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
          description: "Failed to load order details. Using cached information.",
          variant: "destructive",
        });

        // Fallback to session storage
        // const orderDate = new Date(sessionStorage.getItem("orderDate") || "");
        // const deliveryDate = new Date(sessionStorage.getItem("deliveryDate") || "");
        // const orderTotal = parseFloat(sessionStorage.getItem("orderTotal") || "0");
        // const orderItems = JSON.parse(sessionStorage.getItem("orderItems") || "[]");
        // const shippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress") || "{}");
        // const paymentMethod = sessionStorage.getItem("paymentMethod") || "cash-on-delivery";
        // const appliedCoupon = sessionStorage.getItem("appliedCoupon") || "";
        // const today = new Date();
        // const tomorrow = new Date(today);
        // tomorrow.setDate(today.getDate() + 1);
        // let deliveryTime = "Tomorrow Morning (6 AM - 10 AM)";
        // if (deliveryDate.toDateString() === today.toDateString()) {
        //   deliveryTime = "Today (Evening Delivery)";
        // }

        // setOrderDetails({
        //   orderId,
        //   orderDate: orderDate.toLocaleDateString("en-US", {
        //     weekday: "long",
        //     year: "numeric",
        //     month: "long",
        //     day: "numeric",
        //   }),
        //   deliveryDate: deliveryDate.toLocaleDateString("en-US", {
        //     weekday: "long",
        //     year: "numeric",
        //     month: "long",
        //     day: "numeric",
        //   }),
        //   deliveryTime,
        //   orderTotal,
        //   orderItems,
        //   paymentMethod,
        //   shippingAddress,
        //   appliedCoupon,
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderDetails.orderId) {
    return null;
  }

  const subtotal = orderDetails.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);


  return (
    <div className="leaf-pattern-3">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your vegetables will be delivered {orderDetails.deliveryTime.toLowerCase()}.
          </p>

          <div className="w-full bg-card border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-6">
              <div className="text-center pb-4 border-b">
                <p className="text-gray-500 text-sm">Order Number</p>
                <p className="font-bold text-xl">{orderDetails.orderId}</p>
              </div>

              <div className="text-center pb-4 border-b">
                <p className="text-gray-500 text-sm">Order Date</p>
                <p className="font-bold">{orderDetails.orderDate}</p>
              </div>

              <div className="text-center pb-4 border-b">
                <p className="text-gray-500 text-sm">Estimated Delivery</p>
                <p className="font-bold">{orderDetails.deliveryTime}</p>
              </div>

              <div className="text-center pb-4 border-b">
                <p className="text-gray-500 text-sm">Payment Method</p>
                <p className="font-bold">
                  {orderDetails.paymentMethod === "upi"
                    ? "UPI"
                    : orderDetails.paymentMethod === "credit-card"
                    ? "Credit/Debit Card"
                    : "Cash on Delivery"}
                </p>
              </div>

              <div className="text-left">
                <p className="text-gray-500 text-sm mb-2">Shipping Address</p>
                <p className="font-medium">
                  {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                </p>
                <p>{orderDetails.shippingAddress.address}</p>
                <p>
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
                  {orderDetails.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full bg-card border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {orderDetails.orderItems.map((item) => (
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
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {orderDetails.appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({orderDetails.appliedCoupon})</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{orderDetails.shipping}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{orderDetails.orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <Link href="/products">
              <Button className="w-full bg-green-600 hover:bg-green-700">Continue Shopping</Button>
            </Link>
            <Link href="/my-orders">
              <Button variant="outline" className="w-full">View Order History</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}