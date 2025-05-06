"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, RotateCcw } from "lucide-react";
import Image from "next/image";
import { getOrder, cancelOrder, getProductById } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function OrderDetailPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!getAuthToken()) {
      router.push("/login");
      return;
    }

    async function fetchOrder() {
      try {
        const fetchedOrder = await getOrder(params.id);
        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(
          fetchedOrder.items.map(async (item) => {
            try {
              const product = await getProductById(item.productId);
              return {
                ...item,
                name: product.name,
                image: product.images[0]?.url || "/placeholder.svg",
              };
            } catch (error) {
              return {
                ...item,
                name: "Unknown Product",
                image: "/placeholder.svg",
              };
            }
          })
        );
        setOrder({
          id: fetchedOrder.id,
          date: new Date(fetchedOrder.orderDate).toLocaleDateString(),
          status: fetchedOrder.status,
          items: itemsWithDetails,
          total: fetchedOrder.total,
          estimatedDelivery: new Date(fetchedOrder.deliveryDate).toLocaleDateString(),
          shippingAddress: fetchedOrder.shippingAddress,
          paymentMethod: fetchedOrder.paymentMethod,
          subtotal: fetchedOrder.subtotal,
          shipping: fetchedOrder.shipping,
          discount: fetchedOrder.discount,
        });
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error fetching order",
          description: error.message || "An error occurred while fetching the order.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id, toast, router]);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(params.id);
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
      toast({
        title: "Order cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error cancelling order",
        description: error.message || "An error occurred while cancelling the order.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link href="/my-orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/my-orders" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to my orders
        </Link>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Placed on {order.date}</span>
            {getStatusBadge(order.status)}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href={`/orders/tracking/${order.id}`}>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Track Order
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Link href={`/products/${item.productId}`}>
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </Link>
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                      {order.status === "delivered" && (
                        <Button variant="ghost" size="sm" className="text-xs">Write Review</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{order.shipping.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
                <div className="relative pl-8 pb-8">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="relative pl-8 pb-8">
                  <div
                    className={`absolute left-0 w-6 h-6 rounded-full ${
                      order.status !== "cancelled" &&
                      (order.status === "processing" || order.status === "shipped" || order.status === "delivered")
                        ? "bg-primary flex items-center justify-center"
                        : "bg-muted flex items-center justify-center"
                    }`}
                  >
                    {order.status !== "cancelled" &&
                    (order.status === "processing" || order.status === "shipped" || order.status === "delivered") ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Package className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                  </div>
                </div>
                <div className="relative pl-8 pb-8">
                  <div
                    className={`absolute left-0 w-6 h-6 rounded-full ${
                      order.status !== "cancelled" && (order.status === "shipped" || order.status === "delivered")
                        ? "bg-primary flex items-center justify-center"
                        : "bg-muted flex items-center justify-center"
                    }`}
                  >
                    {order.status !== "cancelled" && (order.status === "shipped" || order.status === "delivered") ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-sm text-muted-foreground">Your order is on the way</p>
                  </div>
                </div>
                <div className="relative pl-8">
                  <div
                    className={`absolute left-0 w-6 h-6 rounded-full ${
                      order.status === "delivered"
                        ? "bg-primary flex items-center justify-center"
                        : "bg-muted flex items-center justify-center"
                    }`}
                  >
                    {order.status === "delivered" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "delivered"
                        ? "Your order has been delivered"
                        : order.status === "cancelled"
                          ? "Order was cancelled"
                          : `Estimated delivery: ${order.estimatedDelivery}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-muted-foreground">
                      {`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-muted-foreground">{order.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary mt-0.5"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contact Support
                </Button>
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500"
                    onClick={handleCancelOrder}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Cancel Order
                  </Button>
                )}
                {order.status === "delivered" && (
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Return Items
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}