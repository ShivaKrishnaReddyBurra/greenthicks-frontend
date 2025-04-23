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

export default function OrderDetailPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is the order from session storage
    const sessionOrderId = sessionStorage.getItem("orderId");

    if (sessionOrderId === params.id) {
      const orderDate = new Date(sessionStorage.getItem("orderDate") || "");
      const deliveryDate = new Date(sessionStorage.getItem("deliveryDate") || "");
      const orderItems = JSON.parse(sessionStorage.getItem("orderItems") || "[]");
      const orderTotal = Number.parseFloat(sessionStorage.getItem("orderTotal") || "0");
      const orderStatus = sessionStorage.getItem("orderStatus") || "processing";
      const shippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress") || "{}");

      setOrder({
        id: sessionOrderId,
        date: orderDate.toLocaleDateString(),
        status: orderStatus,
        items: orderItems,
        total: orderTotal,
        estimatedDelivery: deliveryDate.toLocaleDateString(),
        shippingAddress,
        paymentMethod: "Credit Card",
        subtotal: orderTotal - 5.99,
        shipping: 5.99,
        discount: 0,
      });
    } else {
      // Generate a mock order
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      const deliveryDate = new Date(date);
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      const statuses = ["processing", "shipped", "delivered", "cancelled"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const items = [];
      const numItems = Math.floor(Math.random() * 4) + 1;

      for (let i = 0; i < numItems; i++) {
        items.push({
          id: Math.floor(Math.random() * 16) + 1,
          name: [
            "Organic Spinach",
            "Fresh Carrots",
            "Organic Tomatoes",
            "Fresh Cucumber",
            "Organic Kale",
            "Bell Peppers",
          ][Math.floor(Math.random() * 6)],
          quantity: Math.floor(Math.random() * 3) + 1,
          price: (Math.random() * 5 + 1).toFixed(2),
          image: "/placeholder.svg?height=64&width=64",
        });
      }

      const subtotal = items.reduce((total, item) => total + item.quantity * Number.parseFloat(item.price), 0);
      const shipping = 5.99;
      const discount = Math.random() > 0.7 ? (subtotal * 0.1).toFixed(2) : 0;
      const total = (subtotal + shipping - discount).toFixed(2);

      setOrder({
        id: params.id,
        date: date.toLocaleDateString(),
        status,
        items,
        subtotal: subtotal.toFixed(2),
        shipping,
        discount,
        total,
        estimatedDelivery: deliveryDate.toLocaleDateString(),
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
        },
        paymentMethod: Math.random() > 0.5 ? "Credit Card" : "Cash on Delivery",
      });
    }

    setLoading(false);
  }, [params.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return React.createElement(Badge, { variant: "outline", className: "border-blue-500 text-blue-500" }, "Processing");
      case "shipped":
        return React.createElement(Badge, { variant: "outline", className: "border-orange-500 text-orange-500" }, "Shipped");
      case "delivered":
        return React.createElement(Badge, { className: "bg-green-500" }, "Delivered");
      case "cancelled":
        return React.createElement(Badge, { variant: "outline", className: "border-red-500 text-red-500" }, "Cancelled");
      default:
        return React.createElement(Badge, { variant: "outline" }, "Unknown");
    }
  };

  if (loading) {
    return React.createElement("div", { className: "container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]" },
      React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" })
    );
  }

  if (!order) {
    return React.createElement("div", { className: "container mx-auto px-4 py-8 text-center" },
      React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Order Not Found"),
      React.createElement("p", { className: "text-muted-foreground mb-6" }, "The order you're looking for doesn't exist or has been removed."),
      React.createElement(Link, { href: "/my-orders" },
        React.createElement(Button, null, "View All Orders")
      )
    );
  }

  return React.createElement("div", { className: "container mx-auto px-4 py-8" },
    React.createElement("div", { className: "mb-6" },
      React.createElement(Link, { href: "/my-orders", className: "inline-flex items-center text-primary hover:underline" },
        React.createElement(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        "Back to my orders"
      )
    ),
    React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6" },
      React.createElement("div", null,
        React.createElement("h1", { className: "text-2xl font-bold mb-1" }, `Order #${order.id}`),
        React.createElement("div", { className: "flex items-center gap-2" },
          React.createElement(Clock, { className: "h-4 w-4 text-muted-foreground" }),
          React.createElement("span", { className: "text-sm text-muted-foreground" }, `Placed on ${order.date}`),
          getStatusBadge(order.status)
        )
      ),
      React.createElement("div", { className: "mt-4 md:mt-0" },
        React.createElement(Link, { href: `/orders/tracking/${order.id}` },
          React.createElement(Button, null,
            React.createElement(Truck, { className: "mr-2 h-4 w-4" }),
            "Track Order"
          )
        )
      )
    ),
    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
      React.createElement("div", { className: "md:col-span-2 space-y-6" },
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Order Items")
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-6" },
              order.items.map((item, index) => (
                React.createElement("div", { key: index, className: "flex items-center gap-4" },
                  React.createElement("div", { className: "relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0" },
                    React.createElement(Link, { href: `/products/${item.id}` },
                      React.createElement(Image, { src: item.image || "/placeholder.svg", alt: item.name, fill: true, className: "object-cover" })
                    )
                  ),
                  React.createElement("div", { className: "flex-1" },
                    React.createElement(Link, { href: `/products/${item.id}`, className: "font-medium hover:text-primary" }, item.name),
                    React.createElement("p", { className: "text-sm text-muted-foreground" }, `${item.quantity} x $${item.price}`)
                  ),
                  React.createElement("div", { className: "text-right" },
                    React.createElement("p", { className: "font-medium" }, `$${(item.quantity * Number.parseFloat(item.price)).toFixed(2)}`),
                    order.status === "delivered" && (
                      React.createElement(Button, { variant: "ghost", size: "sm", className: "text-xs" }, "Write Review")
                    )
                  )
                )
              ))
            ),
            React.createElement(Separator, { className: "my-6" }),
            React.createElement("div", { className: "space-y-2" },
              React.createElement("div", { className: "flex justify-between" },
                React.createElement("span", { className: "text-muted-foreground" }, "Subtotal"),
                React.createElement("span", null, `$${order.subtotal}`)
              ),
              React.createElement("div", { className: "flex justify-between" },
                React.createElement("span", { className: "text-muted-foreground" }, "Shipping"),
                React.createElement("span", null, `$${order.shipping.toFixed(2)}`)
              ),
              Number.parseFloat(order.discount) > 0 && (
                React.createElement("div", { className: "flex justify-between text-green-600" },
                  React.createElement("span", null, "Discount"),
                  React.createElement("span", null, `-$${order.discount}`)
                )
              ),
              React.createElement(Separator, null),
              React.createElement("div", { className: "flex justify-between font-medium text-lg pt-2" },
                React.createElement("span", null, "Total"),
                React.createElement("span", null, `$${order.total}`)
              )
            )
          )
        ),
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Order Status")
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "relative" },
              React.createElement("div", { className: "absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" }),
              React.createElement("div", { className: "relative pl-8 pb-8" },
                React.createElement("div", { className: "absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center" },
                  React.createElement(CheckCircle, { className: "h-4 w-4 text-white" })
                ),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Order Placed"),
                  React.createElement("p", { className: "text-sm text-muted-foreground" }, order.date)
                )
              ),
              React.createElement("div", { className: "relative pl-8 pb-8" },
                React.createElement("div", {
                  className: `absolute left-0 w-6 h-6 rounded-full ${
                    order.status !== "cancelled" &&
                    (order.status === "processing" || order.status === "shipped" || order.status === "delivered")
                      ? "bg-primary flex items-center justify-center"
                      : "bg-muted flex items-center justify-center"
                  }`
                },
                  order.status !== "cancelled" &&
                  (order.status === "processing" || order.status === "shipped" || order.status === "delivered") ? (
                    React.createElement(CheckCircle, { className: "h-4 w-4 text-white" })
                  ) : (
                    React.createElement(Package, { className: "h-4 w-4 text-muted-foreground" })
                  )
                ),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Processing"),
                  React.createElement("p", { className: "text-sm text-muted-foreground" }, "Your order is being prepared")
                )
              ),
              React.createElement("div", { className: "relative pl-8 pb-8" },
                React.createElement("div", {
                  className: `absolute left-0 w-6 h-6 rounded-full ${
                    order.status !== "cancelled" && (order.status === "shipped" || order.status === "delivered")
                      ? "bg-primary flex items-center justify-center"
                      : "bg-muted flex items-center justify-center"
                  }`
                },
                  order.status !== "cancelled" && (order.status === "shipped" || order.status === "delivered") ? (
                    React.createElement(CheckCircle, { className: "h-4 w-4 text-white" })
                  ) : (
                    React.createElement(Truck, { className: "h-4 w-4 text-muted-foreground" })
                  )
                ),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Shipped"),
                  React.createElement("p", { className: "text-sm text-muted-foreground" }, "Your order is on the way")
                )
              ),
              React.createElement("div", { className: "relative pl-8" },
                React.createElement("div", {
                  className: `absolute left-0 w-6 h-6 rounded-full ${
                    order.status === "delivered"
                      ? "bg-primary flex items-center justify-center"
                      : "bg-muted flex items-center justify-center"
                  }`
                },
                  order.status === "delivered" ? (
                    React.createElement(CheckCircle, { className: "h-4 w-4 text-white" })
                  ) : (
                    React.createElement(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })
                  )
                ),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Delivered"),
                  React.createElement("p", { className: "text-sm text-muted-foreground" },
                    order.status === "delivered"
                      ? "Your order has been delivered"
                      : order.status === "cancelled"
                        ? "Order was cancelled"
                        : `Estimated delivery: ${order.estimatedDelivery}`
                  )
                )
              )
            )
          )
        )
      ),
      React.createElement("div", { className: "space-y-6" },
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Shipping Information")
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-4" },
              React.createElement("div", { className: "flex items-start gap-3" },
                React.createElement(MapPin, { className: "h-5 w-5 text-primary mt-0.5" }),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Delivery Address"),
                  React.createElement("p", { className: "text-muted-foreground" },
                    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
                    React.createElement("br", null),
                    order.shippingAddress.address,
                    React.createElement("br", null),
                    `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
                  )
                )
              ),
              React.createElement("div", { className: "flex items-start gap-3" },
                React.createElement(Clock, { className: "h-5 w-5 text-primary mt-0.5" }),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Estimated Delivery"),
                  React.createElement("p", { className: "text-muted-foreground" }, order.estimatedDelivery)
                )
              ),
              React.createElement("div", { className: "flex items-start gap-3" },
                React.createElement("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-5 w-5 text-primary mt-0.5"
                },
                React.createElement("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
                ),
                React.createElement("div", null,
                  React.createElement("p", { className: "font-medium" }, "Payment Method"),
                  React.createElement("p", { className: "text-muted-foreground" }, order.paymentMethod)
                )
              )
            )
          )
        ),
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Need Help?")
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-4" },
              React.createElement(Button, { variant: "outline", className: "w-full justify-start" },
                React.createElement("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "mr-2 h-4 w-4"
                },
                React.createElement("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
                ),
                "Contact Support"
              ),
              order.status !== "cancelled" && order.status !== "delivered" && (
                React.createElement(Button, { variant: "outline", className: "w-full justify-start text-red-500" },
                  React.createElement("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "mr-2 h-4 w-4"
                  },
                  React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                  React.createElement("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
                  React.createElement("line", { x1: "9", y1: "9", x2: "15", y2: "15" })
                  ),
                  "Cancel Order"
                )
              ),
              order.status === "delivered" && (
                React.createElement(Button, { variant: "outline", className: "w-full justify-start" },
                  React.createElement(RotateCcw, { className: "mr-2 h-4 w-4" }),
                  "Return Items"
                )
              )
            )
          )
        )
      )
    )
  );
}
