"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, ShoppingBag } from "lucide-react";
import { getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import SuccessAnimation from "./success-animation";

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
  const audioRef = useRef(null);

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
        const response = await getOrder(orderId);
        const order = response;

        const orderDate = new Date(order.orderDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const isBefore1PM = orderDate.getHours() < 13;
        setIsAfter1PM(!isBefore1PM);

        const deliveryDate = isBefore1PM ? today : tomorrow;
        const deliveryTime = isBefore1PM
          ? "Today (Evening Delivery, 6 PM - 10 PM)"
          : "Tomorrow (Evening Delivery, 6 PM - 10 PM)";

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
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          shipping: order.shipping,
          discount: order.discount,
          appliedCoupon: sessionStorage.getItem("appliedCoupon") || "",
        });

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [router, toast]);

  useEffect(() => {
    if (audioRef.current && !isLoading) {
      const playAudio = () => {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
          toast({
            title: "Audio Playback Error",
            description: "Unable to play success sound.",
            variant: "destructive",
          });
        });
      };
      const timer = setTimeout(playAudio, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 dark:border-green-400"></div>
      </div>
    );
  }

  if (!orderDetails.orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffef4] dark:bg-black flex flex-col items-center justify-center p-4 sm:p-6">
      <style jsx global>{`
        @keyframes particle {
          0% {
            transform: rotate(var(--angle)) translateY(-16px);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateY(-40px);
            opacity: 0;
          }
        }
        .animate-particle {
          --angle: 0deg;
          animation: particle 0.8s ease-out forwards;
        }
      `}</style>

      <Card className="w-full max-w-md sm:max-w-lg md:max-w-screen-md border-green-200 dark:border-green-700 shadow-lg bg-[#fffef4] dark:bg-black box-border">
        <CardHeader className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="mx-auto mb-4 w-20 sm:w-24">
            <SuccessAnimation />
            <audio ref={audioRef}>
              <source src="/sounds/success.mp3" type="audio/mpeg" />
              <source src="/sounds/success.ogg" type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
            Order Successful!
            <p className="text-sm sm:text-base md:text-lg font-normal mt-2 text-green-700 dark:text-green-300">
              Thank you for choosing nature's way!
              <br />
              By picking organic, you're cultivating a world free from pesticides.
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-4 text-gray-600 dark:text-gray-200 text-sm sm:text-base">
          <div className="text-center">
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <p className="mt-2">
              Order #: <span className="font-medium">{orderDetails?.orderId}</span>
            </p>
            <p className="mt-2">
              Your vegetables will be delivered{" "}
              {orderDetails?.deliveryTime?.toLowerCase()}.
            </p>
          </div>

          {isAfter1PM && (
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 mt-4">
              <AlertTitle className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-amber-500 dark:text-amber-400">⏰</span> Next Day Delivery
              </AlertTitle>
              <AlertDescription className="text-sm sm:text-base">
                Since your order was placed after 1 PM, it will be delivered tomorrow evening.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            asChild
            className="w-full sm:w-auto min-h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
          >
            <Link href="/my-orders">
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              View Order
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto min-h-12 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700"
          >
            <Link href="/products">
              <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}