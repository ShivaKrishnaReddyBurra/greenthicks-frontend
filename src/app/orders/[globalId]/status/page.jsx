// src/app/orders/[globalId]/status/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orderData = await getOrder(params.globalId);
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Token expired") || err.message.includes("not logged in")) {
          router.push(`/login?redirect=/orders/${params.globalId}/status`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.globalId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
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
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
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
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}