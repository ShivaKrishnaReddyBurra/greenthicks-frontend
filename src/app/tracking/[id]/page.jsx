"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck, CheckCircle, Home, Clock, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { getOrder } from "@/lib/api";

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    orderDate: "",
    deliveryDate: "",
    orderTotal: 0,
    orderItems: [],
    orderStatus: "",
    shippingAddress: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });
  const [currentStatus, setCurrentStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const order = await getOrder(params.id);
        const orderDate = new Date(order.orderDate);
        const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000); // Fallback: 2 days after order

        setOrderDetails({
          orderId: order.id,
          orderDate: orderDate.toLocaleDateString("en-IN"),
          deliveryDate: deliveryDate.toLocaleDateString("en-IN"),
          orderTotal: order.total,
          orderItems: order.items.map((item) => ({
            id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image || "/placeholder.svg?height=64&width=64",
          })),
          orderStatus: order.deliveryStatus,
          shippingAddress: {
            firstName: order.shippingAddress.firstName,
            lastName: order.shippingAddress.lastName,
            address: order.shippingAddress.address,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zipCode: order.shippingAddress.zipCode,
          },
        });

        setCurrentStatus(order.deliveryStatus);

        // Generate status history based on deliveryStatus
        const history = [
          {
            status: "Order Placed",
            date: orderDate.toLocaleString("en-IN"),
            description: "Your order has been received and is being processed.",
          },
        ];

        if (["assigned", "out-for-delivery", "delivered", "cancelled"].includes(order.deliveryStatus)) {
          const processingDate = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after order
          history.push({
            status: "Processing",
            date: processingDate.toLocaleString("en-IN"),
            description: "Your order is being prepared for shipping.",
          });
        }

        if (["out-for-delivery", "delivered"].includes(order.deliveryStatus)) {
          const shippedDate = new Date(orderDate.getTime() + 8 * 60 * 60 * 1000); // 8 hours after order
          history.push({
            status: "Shipped",
            date: shippedDate.toLocaleString("en-IN"),
            description: "Your order has been shipped and is on its way.",
          });
        }

        if (order.deliveryStatus === "out-for-delivery") {
          const outForDeliveryDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after order
          history.push({
            status: "Out for Delivery",
            date: outForDeliveryDate.toLocaleString("en-IN"),
            description: "Your order is out for delivery and will arrive soon.",
          });
        }

        if (order.deliveryStatus === "delivered") {
          const deliveredDate = order.updatedAt ? new Date(order.updatedAt) : new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000); // Use updatedAt or fallback
          history.push({
            status: "Delivered",
            date: deliveredDate.toLocaleString("en-IN"),
            description: "Your order has been delivered successfully.",
          });
        }

        if (order.deliveryStatus === "cancelled") {
          const cancelledDate = order.updatedAt ? new Date(order.updatedAt) : new Date(orderDate.getTime() + 2 * 60 * 60 * 1000);
          history.push({
            status: "Cancelled",
            date: cancelledDate.toLocaleString("en-IN"),
            description: "Your order has been cancelled.",
          });
        }

        setStatusHistory(history);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch order details",
          variant: "destructive",
        });
        if (error.message.includes("Token expired") || error.message.includes("Order not found")) {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id, router, toast]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status step (0-4)
  const getStatusStep = () => {
    switch (currentStatus) {
      case "pending":
        return 0;
      case "assigned":
        return 1;
      case "out-for-delivery":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return 3; // Treat cancelled as final step for progress bar
      default:
        return 0;
    }
  };

  const statusStep = getStatusStep();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails.orderId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
        <div className="bg-card rounded-lg border overflow-hidden mb-8">
          <div className="bg-primary/10 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold mb-1">Track Your Order</h1>
                <p className="text-muted-foreground">Order #{orderDetails.orderId}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Ordered on {orderDetails.orderDate}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="relative">
                {/* Progress bar */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(statusStep / 3) * 100}%` }}
                  />
                </div>
                {/* Status steps */}
                <div className="grid grid-cols-4 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        statusStep >= 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                    </div>
                    <p className="text-sm mt-2 font-medium">Order Placed</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        statusStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                    </div>
                    <p className="text-sm mt-2 font-medium">Processing</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        statusStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Truck className="h-4 w-4" />
                    </div>
                    <p className="text-sm mt-2 font-medium">Out for Delivery</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        statusStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStatus === "cancelled" ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <p className="text-sm mt-2 font-medium">
                      {currentStatus === "cancelled" ? "Cancelled" : "Delivered"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-2">
                <h3 className="font-medium mb-3">Status Updates</h3>
                <div className="space-y-4">
                  {statusHistory.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                        {item.status === "Order Placed" && <Package className="h-4 w-4 text-primary" />}
                        {item.status === "Processing" && <Package className="h-4 w-4 text-primary" />}
                        {item.status === "Shipped" && <Package className="h-4 w-4 text-primary" />}
                        {item.status === "Out for Delivery" && <Truck className="h-4 w-4 text-primary" />}
                        {item.status === "Delivered" && <CheckCircle className="h-4 w-4 text-primary" />}
                        {item.status === "Cancelled" && <XCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.status}</p>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Delivery Information</h3>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Delivery Address</p>
                      <p className="text-xs text-muted-foreground">
                        {`${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}`}
                        <br />
                        {orderDetails.shippingAddress.address}
                        <br />
                        {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-xs text-muted-foreground">{orderDetails.deliveryDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="mb-6" />
            <div>
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(orderDetails.orderTotal)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(orderDetails.orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}