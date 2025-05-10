"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  QrCode,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

function DeliveryVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [order, setOrder] = useState(null);

  // Get order details from URL parameters
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");
  const paymentMethod = searchParams.get("paymentMethod");

  // Check if user is a delivery partner or admin
  useEffect(() => {
    const checkAuthorization = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !["delivery-partner", "admin"].includes(user.role)) {
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);

        // Fetch order details
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const orderData = await response.json();
        setOrder({
          id: orderId,
          total: Number.parseFloat(total),
          paymentMethod: paymentMethod,
          status: orderData.status || "out-for-delivery",
          date: new Date().toISOString(),
          subtotal: Number.parseFloat(total) * 0.9,
          deliveryCharge: Number.parseFloat(total) * 0.1,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [orderId, total, paymentMethod, toast]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Generate UPI payment QR code
  const generateUpiQR = (amount) => {
    return `upi://pay?pa=funnygn156@&oksbi&mc=123456&tid=${orderId}&tr=${orderId}&tn=Payment+for+order&am=${amount}&cu=INR`;
  };

  // Handle cash payment confirmation
  const confirmCashPayment = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/orders/${orderId}/confirm-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethod: "Cash on Delivery" }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm payment");
      }

      setPaymentConfirmed(true);
      toast({
        title: "Success",
        description: "Cash payment confirmed",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to confirm payment",
        variant: "destructive",
      });
    }
  };

  // Confirm delivery
  const confirmDelivery = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/orders/${orderId}/confirm-delivery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to confirm delivery");
      }

      toast({
        title: "Success",
        description: "Delivery confirmed successfully",
      });
      router.push("/delivery/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to confirm delivery",
        variant: "destructive",
      });
    }
  };

  // Toggle payment QR code display
  const togglePaymentQR = () => {
    setShowPaymentQR(!showPaymentQR);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h1>
        <p className="text-center text-green-700 mb-6">
          Thanks for ordering from Green Thicks! Your order #{orderId} is being processed.
        </p>
        <Button onClick={() => router.push("/")} variant="outline">
          Back to Home
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-semibold">Order Not Found</h1>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/delivery/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/delivery/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Delivery Verification</h1>
        </div>
        <Badge variant={paymentConfirmed ? "success" : "secondary"} className="text-xs">
          {paymentConfirmed ? "Payment Confirmed" : "Payment Pending"}
        </Badge>
      </div>

      {/* Order Details Card */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order.id}</CardTitle>
            </div>
            <Badge
              variant={
                order.status === "delivered" ? "success" : order.status === "out-for-delivery" ? "warning" : "secondary"
              }
            >
              {order.status === "out-for-delivery" ? "Out for Delivery" : order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <Separator />
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Card */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Verify payment information</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Payment Method</span>
              </div>
              <Badge variant="outline">{order.paymentMethod}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Amount Due</span>
              </div>
              <span className="font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          {order.paymentMethod === "Cash on Delivery" && !paymentConfirmed ? (
            <>
              <Button className="w-full" onClick={confirmCashPayment} variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Cash Payment
              </Button>
              <Button className="w-full" variant="outline" onClick={togglePaymentQR}>
                <QrCode className="h-4 w-4 mr-2" />
                Generate Payment QR
              </Button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p>Payment confirmed via {order.paymentMethod}</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Delivery Confirmation Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Delivery Confirmation</CardTitle>
          <CardDescription>Complete the delivery process</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <p className="text-sm">Please confirm that you have:</p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Verified the order items</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Collected payment (if applicable)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Handed over the package to the customer</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button className="w-full" variant={paymentConfirmed ? "default" : "secondary"} disabled={!paymentConfirmed} onClick={confirmDelivery}>
            <Truck className="h-4 w-4 mr-2" />
            Confirm Delivery
          </Button>
        </CardFooter>
      </Card>

      {/* Payment QR Code Dialog */}
      <Dialog open={showPaymentQR} onOpenChange={setShowPaymentQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment QR Code</DialogTitle>
            <DialogDescription>Ask the customer to scan this QR code to make the payment</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <div className="border-2 border-gray-200 p-4 rounded-lg">
              <QRCode value={generateUpiQR(order.total)} size={200} />
            </div>
          </div>
          <div className="text-center">
            <p className="font-medium">Amount: {formatCurrency(order.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">The payment will be processed through UPI</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPaymentQR(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPaymentConfirmed(true);
                setShowPaymentQR(false);
              }}
              className="sm:w-auto w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Payment Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DeliveryVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeliveryVerificationContent />
    </Suspense>
  );
}