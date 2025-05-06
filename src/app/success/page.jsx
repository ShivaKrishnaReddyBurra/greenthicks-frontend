"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderDate: "",
    deliveryDate: "",
    deliveryTime: "Tomorrow Morning (6 AM - 10 AM)",
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
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = sessionStorage.getItem("orderId");

      if (!orderId) {
        router.push("/cart");
        return;
      }

      try {
        // Fetch order details from backend
        const response = await getOrder(orderId);
        const order = response.order;

        // Format delivery time (assuming backend doesn't provide specific time slot)
        const deliveryDate = new Date(order.deliveryDate);
        const deliveryTime = deliveryDate.getDate() === new Date().getDate() + 1
          ? "Tomorrow Morning (6 AM - 10 AM)"
          : deliveryDate.toLocaleDateString();

        setOrderDetails({
          orderId: order.id,
          orderDate: new Date(order.orderDate).toLocaleDateString(),
          deliveryDate: new Date(order.deliveryDate).toLocaleDateString(),
          deliveryTime,
          orderTotal: order.total,
          orderItems: order.items,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
        });

        // Clear session storage after successful fetch
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
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Using cached information.",
          variant: "destructive",
        });

        // Fallback to session storage
        const orderDate = new Date(sessionStorage.getItem("orderDate") || "");
        const deliveryDate = new Date(sessionStorage.getItem("deliveryDate") || "");
        const orderTotal = parseFloat(sessionStorage.getItem("orderTotal") || "0");
        const orderItems = JSON.parse(sessionStorage.getItem("orderItems") || "[]");
        const shippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress") || "{}");
        const paymentMethod = sessionStorage.getItem("paymentMethod") || "cash-on-delivery";

        setOrderDetails({
          orderId,
          orderDate: orderDate.toLocaleDateString(),
          deliveryDate: deliveryDate.toLocaleDateString(),
          deliveryTime: "Tomorrow Morning (6 AM - 10 AM)",
          orderTotal,
          orderItems,
          paymentMethod,
          shippingAddress,
        });
      }
    };

    fetchOrderDetails();
  }, [router, toast]);

  if (!orderDetails.orderId) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="leaf-pattern-3">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your vegetables will be delivered {orderDetails.deliveryTime.toLowerCase()}.
          </p>

          <div className="w-full border rounded-lg p-6 mb-6">
            <div className="space-y-6">
              <div className="text-center pb-4 border-b">
                <p className="text-gray-500 text-sm">Order Number</p>
                <p className="font-bold text-xl">{orderDetails.orderId}</p>
              </div>

              <div className="text-center pb-4 border-b">
                <p className="text-gray-500 text-sm">Delivery Date</p>
                <p className="font-bold">{orderDetails.deliveryTime}</p>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm">Payment Method</p>
                <p className="font-bold">
                  {orderDetails.paymentMethod === "upi"
                    ? "UPI"
                    : orderDetails.paymentMethod === "credit-card"
                    ? "Credit/Debit Card"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <Link href="/products">
              <Button className="w-full bg-green-600 hover:bg-green-700">Continue Shopping</Button>
            </Link>

            <Link href="/my-orders">
              <Button variant="outline" className="w-full">
                View Order History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}