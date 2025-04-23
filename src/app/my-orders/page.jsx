"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's an order in session storage
    const orderId = sessionStorage.getItem("orderId");

    // Generate mock orders
    const mockOrders = [];

    // Add the real order from session storage if it exists
    if (orderId) {
      const orderDate = new Date(sessionStorage.getItem("orderDate") || "");
      const deliveryDate = new Date(sessionStorage.getItem("deliveryDate") || "");
      const orderItems = JSON.parse(sessionStorage.getItem("orderItems") || "[]");
      const orderTotal = Number.parseFloat(sessionStorage.getItem("orderTotal") || "0");
      const orderStatus = sessionStorage.getItem("orderStatus") || "processing";

      mockOrders.push({
        id: orderId,
        date: orderDate.toLocaleDateString(),
        status: orderStatus,
        items: orderItems,
        total: orderTotal,
        estimatedDelivery: deliveryDate.toLocaleDateString(),
      });
    }

    // Add some additional mock orders
    const statuses = ["processing", "shipped", "delivered", "cancelled"];

    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 5);

      const deliveryDate = new Date(date);
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      mockOrders.push({
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        date: date.toLocaleDateString(),
        status,
        items: [
          {
            id: Math.floor(Math.random() * 16) + 1,
            name: ["Organic Spinach", "Fresh Carrots", "Organic Tomatoes", "Fresh Cucumber"][
              Math.floor(Math.random() * 4)
            ],
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 5 + 1).toFixed(2),
            image: "/placeholder.svg?height=64&width=64",
          },
          {
            id: Math.floor(Math.random() * 16) + 1,
            name: ["Organic Kale", "Bell Peppers", "Organic Potatoes", "Fresh Broccoli"][Math.floor(Math.random() * 4)],
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 5 + 1).toFixed(2),
            image: "/placeholder.svg?height=64&width=64",
          },
        ],
        total: (Math.random() * 50 + 20).toFixed(2),
        estimatedDelivery: deliveryDate.toLocaleDateString(),
      });
    }

    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Shipped
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) || order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/products">
            <Button className="px-8">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Placed on {order.date}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <Link href={`/orders/tracking/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    </Link>
                    <Link href={`/my-orders/${order.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Link href={`/products/${item.id}`}>
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </Link>
                          </div>
                          <div className="flex-1">
                            <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">+ {order.items.length - 2} more items</p>
                      )}
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden md:block" />

                  <div className="md:w-64">
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-medium">₹{order.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="text-sm capitalize">{order.status}</span>
                        </span>
                      </div>
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Delivery</span>
                          <span>{order.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
