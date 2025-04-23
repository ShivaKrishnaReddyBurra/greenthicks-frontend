"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
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
    const orderId = sessionStorage.getItem("orderId");

    if (!orderId) {
      router.push("/");
      return;
    }

    const orderDate = new Date(sessionStorage.getItem("orderDate") || "");
    const deliveryDate = new Date(sessionStorage.getItem("deliveryDate") || "");
    const orderTotal = parseFloat(sessionStorage.getItem("orderTotal") || "0");
    const orderItems = JSON.parse(sessionStorage.getItem("orderItems") || "[]");
    const shippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress") || "{}");
    const paymentMethod = sessionStorage.getItem("paymentMethod") || "Cash on Delivery";

    setOrderDetails({
      orderId: `GRN-${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: orderDate.toLocaleDateString(),
      deliveryDate: deliveryDate.toLocaleDateString(),
      deliveryTime: "Tomorrow Morning (6 AM - 10 AM)",
      orderTotal,
      orderItems,
      paymentMethod,
      shippingAddress,
    });
  }, [router]);

  if (!orderDetails.orderId) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your vegetables will be delivered tomorrow morning.
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
                {orderDetails.paymentMethod === "upi" ? "UPI" : orderDetails.paymentMethod}
                {orderDetails.paymentMethod === "cash-on-delivery" && " / Cash on Delivery"}
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
  );
}
