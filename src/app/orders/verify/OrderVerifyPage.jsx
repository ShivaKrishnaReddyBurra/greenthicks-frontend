"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUserProfile, getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function OrderVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      setLoading(true);
      const globalId = searchParams.get("globalId");

      if (!globalId) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile to determine role
        const userProfile = await getUserProfile();
        const order = await getOrder(globalId);

        if (!order) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        if (userProfile.isAdmin || userProfile.isDeliveryBoy) {
          // Redirect admins and delivery boys to the order details page
          router.push(`/delivery/orders/${globalId}`);
        } else {
          // Redirect general users to the order status page
          router.push(`/orders/${globalId}/status`);
        }
      } catch (err) {
        if (err.message.includes("Token expired") || err.message.includes("not logged in")) {
          // If not authenticated, redirect to login with a return URL
          router.push(`/login?redirect=/orders/verify?globalId=${globalId}`);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    redirectBasedOnRole();
  }, [searchParams, router]);

  // Move toast to useEffect to avoid calling during render
  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return null; // The component redirects, so no UI is needed
}