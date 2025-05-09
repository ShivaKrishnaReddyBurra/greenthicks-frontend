"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, Phone, Clock, CheckCircle, Navigation, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrder, getAllUsers, getUserProfile, assignDeliveryBoy, updateDeliveryStatus } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";

export default function DeliveryOrderDetailPage() {
  const params = useParams();
  const { id } = params; // Get globalId from URL
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [qrPaymentGenerated, setQrPaymentGenerated] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      setLoading(true);
      try {
        // Fetch order details
        const orderData = await getOrder(id);
        setOrder(orderData);

        // Fetch user profile to check if admin
        const profileData = await getUserProfile();
        setIsAdmin(profileData.isAdmin);

        // Fetch delivery boys if admin
        if (profileData.isAdmin) {
          const usersData = await getAllUsers();
          const deliveryBoys = usersData.filter((user) => user.isDeliveryBoy && user.activeStatus);
          setDeliveryBoys(deliveryBoys);
        }
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        if (error.message.includes("Token expired")) router.push("/delivery/login");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndUser();
  }, [id, router, toast]);

  const handleAssignDeliveryBoy = async () => {
    if (!selectedDeliveryBoy) {
      toast({ title: "Error", description: "Please select a delivery boy", variant: "destructive" });
      return;
    }
    try {
      const updatedOrder = await assignDeliveryBoy(id, parseInt(selectedDeliveryBoy));
      setOrder(updatedOrder.order);
      toast({ title: "Success", description: "Delivery boy assigned successfully" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedOrder = await updateDeliveryStatus(id, newStatus);
      setOrder(updatedOrder.order);
      toast({
        title: "Status updated",
        description: `Order ${id} has been updated to ${newStatus}.`,
      });
      if (newStatus === "delivered") {
        setTimeout(() => router.push("/delivery/dashboard"), 2000);
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCashPaymentDone = () => {
    setPaymentConfirmed(true);
    toast({ title: "Payment Confirmed", description: "Cash payment has been received." });
  };

  const generatePaymentQR = () => {
    setQrPaymentGenerated(true);
    setQrImageUrl(
      `https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=funnygn156@oksbi&am=${order.total}&cu=INR&size=200x200`
    );
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      pending: { text: "Pending", className: "border-gray-500 text-gray-500" },
      assigned: { text: "Assigned", className: "border-blue-500 text-blue-500" },
      "out-for-delivery": { text: "Out for Delivery", className: "border-purple-500 text-purple-500" },
      delivered: { text: "Delivered", className: "bg-green-500" },
    };
    const badge = badgeMap[status];
    return badge ? (
      <Badge variant="outline" className={badge.className}>
        {badge.text}
      </Badge>
    ) : (
      <Badge variant="outline">Unknown</Badge>
    );
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "assigned":
        return "out-for-delivery";
      case "out-for-delivery":
        return "delivered";
      default:
        return currentStatus;
    }
  };

  const getStatusActionText = (currentStatus) => {
    switch (currentStatus) {
      case "assigned":
        return "Start Delivery";
      case "out-for-delivery":
        return "Mark as Delivered";
      default:
        return "Update Status";
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
          <Link href="/delivery/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
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
            <span className="text-sm text-muted-foreground">
              Ordered at {new Date(order.orderDate).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {getStatusBadge(order.deliveryStatus)}
          </div>
        </div>
        {order.deliveryStatus !== "delivered" && order.deliveryStatus !== "pending" && (
          <Button
            className="mt-4 md:mt-0"
            onClick={() => handleStatusUpdate(getNextStatus(order.deliveryStatus))}
          >
            {getStatusActionText(order.deliveryStatus)}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Assign Delivery Boy (Admin Only) */}
          {isAdmin && order.deliveryStatus === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Assign Delivery Boy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select value={selectedDeliveryBoy} onValueChange={setSelectedDeliveryBoy}>
                    <SelectTrigger className="w-full md:w-1/2">
                      <SelectValue placeholder="Select a delivery boy" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryBoys.map((boy) => (
                        <SelectItem key={boy.globalId} value={boy.globalId.toString()}>
                          {boy.name} ({boy.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssignDeliveryBoy}>Assign</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InfoRow
                  icon={<MapPin />}
                  label="Delivery Address"
                  value={`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipCode}`}
                />
                <InfoRow
                  icon={<Phone />}
                  label="Customer Contact"
                  value={`${order.shippingAddress.firstName} ${order.shippingAddress.lastName} - ${order.shippingAddress.phone}`}
                />
                <InfoRow icon={<PaymentIcon />} label="Payment Method" value={order.paymentMethod} />
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => window.open(`tel:${order.shippingAddress.phone}`)}
                >
                  <Phone className="mr-2 h-4 w-4" /> Call Customer
                </Button>
                {order.shippingAddress.location?.latitude && (
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${order.shippingAddress.location.latitude},${order.shippingAddress.location.longitude}`
                      )
                    }
                  >
                    <Navigation className="mr-2 h-4 w-4" /> Navigate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg?height=64&width=64"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right font-medium">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <SummaryRow label="Subtotal" value={order.subtotal} />
                <SummaryRow label="Delivery Fee" value={order.shipping} />
                {order.discount > 0 && <SummaryRow label="Discount" value={-order.discount} />}
                <SummaryRow label="Total" value={order.total} isTotal />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md relative flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary mb-2" />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Confirmation */}
          {order.deliveryStatus === "out-for-delivery" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Confirmation</CardTitle>
                </CardHeader>
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
                  <div className="space-y-4">
                    {/* QR Scanner Trigger */}
                    {!showScanner && (
                      <Button onClick={() => setShowScanner(true)}>Scan Invoice QR Code</Button>
                    )}

                    {/* QR Reader */}
                    {showScanner && <div id="qr-reader" className="mt-4" />}

                    {/* COD payment options */}
                    {order.paymentMethod === "cash-on-delivery" && !paymentConfirmed && (
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
                        <p className="mb-2">Customer can scan this to pay {formatCurrency(order.total)}:</p>
                        <img src={qrImageUrl} alt="QR Code" width={200} height={200} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* After Delivered */}
          {order.deliveryStatus === "delivered" && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Order successfully delivered!</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You've earned {formatCurrency(order.total * 0.1)} for this delivery.
                  </p>
                  <Link href="/delivery/dashboard">
                    <Button className="w-full">Return to Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
    <span>{value < 0 ? `- ${formatCurrency(-value)}` : formatCurrency(value)}</span>
  </div>
);

const InfoIcon = () => (
  <svg className="h-5 w-5 text-primary mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="h-5 w-5 text-primary mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);