"use client";

import { Suspense } from 'react';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  QrCode,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";

function DeliveryVerificationContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Get order ID from URL parameters
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");
  const paymentMethod = searchParams.get("paymentMethod");

  useEffect(() => {
    // In a real app, you would fetch the order details from your API
    // For this demo, we'll simulate an API call with the data from URL params
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!orderId) {
          throw new Error("Order ID is missing");
        }

        // Mock order data based on URL params
        const mockOrder = {
          id: orderId,
          date: new Date().toISOString(),
          status: "out-for-delivery",
          paymentMethod: paymentMethod || "Cash on Delivery",
          total: Number.parseFloat(total || "0") || 1250,
          subtotal: Number.parseFloat(total || "0") * 0.9 || 1150,
          deliveryCharge: 100,
          discount: 0,
          customer: {
            name: "Priya Sharma",
            address: "Flat 302, Sunshine Apartments, 15 Marine Drive, Mumbai, Maharashtra - 400001",
            phone: "+91 98765 43210",
            email: "priya.sharma@example.com",
          },
          items: [
            {
              name: "Organic Spinach",
              quantity: 2,
              price: 35,
              total: 70,
            },
          ],
        };

        setOrder(mockOrder);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, total, paymentMethod]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate UPI payment QR code
  const generateUpiQR = (amount) => {
    const upiUrl = `upi://pay?pa=your_upi_id@upi&pn=Green+Thicks&mc=123456&tid=${order.id}&tr=${order.id}&tn=Payment+for+order&am=${amount}&cu=INR`;
    return upiUrl;
  };

  // Handle cash payment confirmation
  const confirmCashPayment = () => {
    setPaymentConfirmed(true);
    // In a real app, you would send this confirmation to your backend
  };

  // Toggle payment QR code display
  const togglePaymentQR = () => {
    setShowPaymentQR(!showPaymentQR);
  };

  // Toggle QR scanner
  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  // Simulate QR scan result
  const simulateScan = () => {
    setScanResult("Payment confirmed via UPI: txn_123456789");
    setPaymentConfirmed(true);
    setShowScanner(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
        <h1 className="text-xl font-semibold">Loading order details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <X className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container max-w-md mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => window.history.back()}>
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
              <CardDescription>{formatDate(order.date)}</CardDescription>
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
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer Details</h3>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Delivery Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{order.customer.address}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Summary</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                    </div>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

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
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}
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

            {scanResult && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Verified</p>
                    <p>{scanResult}</p>
                  </div>
                </div>
              </div>
            )}
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
          ) : order.paymentMethod === "Cash on Delivery" && paymentConfirmed ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p>Cash payment confirmed</p>
              </div>
            </div>
          ) : !paymentConfirmed ? (
            <Button className="w-full" variant="outline" onClick={toggleScanner}>
              <QrCode className="h-4 w-4 mr-2" />
              Scan Payment Confirmation
            </Button>
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
          <Button className="w-full" variant={paymentConfirmed ? "default" : "secondary"} disabled={!paymentConfirmed}>
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

      {/* QR Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Payment QR</DialogTitle>
            <DialogDescription>Scan the customer's payment confirmation QR code</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
            <div className="w-full aspect-square relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
              {/* This would be a real QR scanner component in a production app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 border-2 border-white/50 rounded-lg"></div>
              </div>
              <p className="text-white text-center z-10 px-4">Camera preview would appear here</p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowScanner(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
            {/* This button simulates a successful scan */}
            <Button onClick={simulateScan} className="sm:w-auto w-full">
              Simulate Successful Scan
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
