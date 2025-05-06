"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, Phone, Clock, CheckCircle, Navigation, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function DeliveryOrderDetailPage({ params }) {
  const { id } = use(params); // ✅ Unwrap the async `params` object
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [qrPaymentGenerated, setQrPaymentGenerated] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    const fetchOrder = () => {
      setLoading(true);
      const mockOrder = {
        id,
        customerName: "Rahul Sharma",
        customerPhone: "+91 98765 43210",
        address: "123 Main St, Green Park, Delhi",
        location: { lat: 28.6139, lng: 77.209 },
        status: "in_transit",
        assignedAt: new Date(Date.now() - 3600000).toLocaleTimeString(),
        items: [
          { id: 1, name: "Organic Spinach", quantity: 2, price: 3.99, image: "/placeholder.svg?height=64&width=64" },
          { id: 2, name: "Fresh Carrots", quantity: 1, price: 2.49, image: "/placeholder.svg?height=64&width=64" },
          { id: 3, name: "Organic Tomatoes", quantity: 3, price: 4.99, image: "/placeholder.svg?height=64&width=64" },
        ],
        subtotal: 25.44,
        deliveryFee: 5.0,
        total: 30.44,
        paymentMethod: "Cash on Delivery",
        specialInstructions: "Please leave the package at the door. Call when you arrive.",
      };
      setOrder(mockOrder);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = (newStatus) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    toast({ title: "Status updated", description: `Order ${id} has been updated to ${newStatus.replace("_", " ")}.` });

    if (newStatus === "delivered") {
      setTimeout(() => router.push("/delivery/dashboard"), 2000);
    }
  };

  const handleCashPaymentDone = () => {
    setPaymentConfirmed(true);
    toast({ title: "Payment Confirmed", description: "Cash payment has been received." });
  };

  const generatePaymentQR = () => {
    // Simulate QR generation
    setQrPaymentGenerated(true);
    setQrImageUrl(`https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=funnygn156@oksbi&am=${order.total}&currency=INR&size=200x200`);
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      assigned: { text: "Assigned", className: "border-blue-500 text-blue-500" },
      picked_up: { text: "Picked Up", className: "border-orange-500 text-orange-500" },
      in_transit: { text: "In Transit", className: "border-purple-500 text-purple-500" },
      delivered: { text: "Delivered", className: "bg-green-500" },
    };
    const badge = badgeMap[status];
    return badge ? <Badge variant="outline" className={badge.className}>{badge.text}</Badge> : <Badge variant="outline">Unknown</Badge>;
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "assigned": return "picked_up";
      case "picked_up": return "in_transit";
      case "in_transit": return "delivered";
      default: return currentStatus;
    }
  };

  const getStatusActionText = (currentStatus) => {
    switch (currentStatus) {
      case "assigned": return "Mark as Picked Up";
      case "picked_up": return "Start Delivery";
      case "in_transit": return "Mark as Delivered";
      default: return "Update Status";
    }
  };

  if (loading) {
    return (
      <DeliveryLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DeliveryLayout>
    );
  }

  if (!order) {
    return (
      <DeliveryLayout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/delivery/dashboard"><Button>Return to Dashboard</Button></Link>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="mb-6">
        <Link href="/delivery/dashboard" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Assigned at {order.assignedAt}</span>
            {getStatusBadge(order.status)}
          </div>
        </div>
        {order.status !== "delivered" && (
          <Button className="mt-4 md:mt-0" onClick={() => handleStatusUpdate(getNextStatus(order.status))}>
            {getStatusActionText(order.status)}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Info */}
          <Card>
            <CardHeader><CardTitle>Delivery Information</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InfoRow icon={<MapPin />} label="Delivery Address" value={order.address} />
                <InfoRow icon={<Phone />} label="Customer Contact" value={`${order.customerName} - ${order.customerPhone}`} />
                {order.specialInstructions && (
                  <InfoRow icon={<InfoIcon />} label="Special Instructions" value={order.specialInstructions} />
                )}
                <InfoRow icon={<PaymentIcon />} label="Payment Method" value={order.paymentMethod} />
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="flex-1" variant="outline" onClick={() => window.open(`tel:${order.customerPhone}`)}>
                  <Phone className="mr-2 h-4 w-4" /> Call Customer
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => window.open(`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`)}
                >
                  <Navigation className="mr-2 h-4 w-4" /> Navigate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <SummaryRow label="Subtotal" value={order.subtotal} />
                <SummaryRow label="Delivery Fee" value={order.deliveryFee} />
                <SummaryRow label="Total" value={order.total} isTotal />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader><CardTitle>Delivery Map</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md relative flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary mb-2" />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Confirmation */}
          {order.status === "in_transit" && (
  <>
    <Card>
      <CardHeader><CardTitle>Delivery Confirmation</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Take a photo at delivery and mark as delivered.
        </p>
        <Button className="w-full" variant="outline">
          <Camera className="mr-2 h-4 w-4" /> Take Delivery Photo
        </Button>
      </CardContent>
    </Card>

    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Payment Verification</h2>

          {/* QR Scanner Trigger */}
          {!showScanner && (
            <Button onClick={() => setShowScanner(true)}>
              Scan Invoice QR Code
            </Button>
          )}

          {/* QR Reader */}
          {showScanner && <div id="qr-reader" className="mt-4" />}

          {/* COD payment options */}
          {order.paymentMethod === "Cash on Delivery" && !paymentConfirmed && (
            <>
              <p className="text-muted-foreground">This is a COD order. Choose how payment was made:</p>
              <div className="flex flex-col md:flex-row gap-4">
                <Button onClick={handleCashPaymentDone}>Cash Payment Received</Button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="secondary" onClick={generatePaymentQR}>
                  Generate QR Code for Customer
                </Button>
              </div>
            </>
          )}

          {/* QR Code Image */}
          {qrPaymentGenerated && (
            <div className="mt-4">
              <p className="mb-2">Customer can scan this to pay ₹{order.total}:</p>
              <img src={qrImageUrl} alt="QR Code" width={200} height={200} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </>
)}


          {/* After Delivered */}
          {order.status === "delivered" && (
            <>
              <Card>
                <CardHeader><CardTitle>Delivery Complete</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">Order successfully delivered!</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      You've earned ₹{Math.floor(50 + Math.random() * 30)} for this delivery.
                    </p>
                    <Link href="/delivery/dashboard">
                      <Button className="w-full">Return to Dashboard</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DeliveryLayout>
  );
}

// Helper Components
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    {icon}
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);

const SummaryRow = ({ label, value, isTotal }) => (
  <div className={`flex justify-between ${isTotal ? "font-medium text-lg pt-2" : ""}`}>
    <span>{label}</span>
    <span>${value.toFixed(2)}</span>
  </div>
);

const InfoIcon = () => (
  <svg className="h-5 w-5 text-primary mt-0.5" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="h-5 w-5 text-primary mt-0.5" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
