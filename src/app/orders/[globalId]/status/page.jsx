"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";

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

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(true);
  const [error, setError] = useState(null);
  const actionTimeout = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setActionLoading(true);
      try {
        const orderData = await getOrder(params.globalId);
        setOrder({
          id: orderData.globalId || orderData.id,
          status: orderData.status,
          deliveryDate: orderData.deliveryDate,
        });
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Token expired") || err.message.includes("not logged in")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push(`/login?redirect=/orders/${params.globalId}/status`);
        } else {
          toast({
            title: "Error",
            description: err.message || "Failed to fetch order status.",
            variant: "destructive",
          });
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    };

    fetchOrder();
  }, [params.globalId, router, toast]);

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(href);
      setActionLoading(false);
    }, 500);
  };

  if (actionLoading) {
    return <LeafLoader />;
  }

  if (error || !order) {
    return (
      <div className="p-4 text-center">
        <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {error || "Order not found"}
        </h2>
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/")}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 leaf-pattern-2 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="text-center">
        {order.status === "delivered" ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Order #{order.id} Successfully Delivered
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your order was delivered on{" "}
              {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}.
            </p>
          </>
        ) : (
          <>
            <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Order #{order.id} Status
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Current Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>
          </>
        )}
        <Link
          href="/my-orders"
          onClick={(e) => handleNavigation(e, "/my-orders")}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}