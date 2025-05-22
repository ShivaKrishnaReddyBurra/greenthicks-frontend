
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUserProfile, getOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LeafLoader from "@/components/LeafLoader";

export default function OrderVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState(true);
  const [error, setError] = useState(null);
  const actionTimeout = useRef(null);

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      setActionLoading(true);
      const globalId = searchParams.get("globalId");

      if (!globalId) {
        setError("Invalid order ID");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile();
        const order = await getOrder(globalId);

        if (!order) {
          setError("Order not found");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setActionLoading(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (userProfile.isAdmin || userProfile.isDeliveryBoy) {
          router.push(`/delivery/orders/${globalId}`);
        } else {
          router.push(`/orders/${globalId}/status`);
        }
      } catch (err) {
        if (err.message.includes("Token expired") || err.message.includes("not logged in")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push(`/login?redirect=/orders/verify?globalId=${globalId}`);
        } else {
          setError(err.message);
          toast({
            title: "Error",
            description: err.message || "Failed to verify order.",
            variant: "destructive",
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setActionLoading(false);
        }
      }
    };

    redirectBasedOnRole();
  }, [searchParams, router, toast]);

  const handleNavigation = async (e) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/");
    }, 500);
  };

  if (actionLoading) {
    return <LeafLoader />;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button
          onClick={handleNavigation}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return null; // The component redirects, so no UI is needed
}