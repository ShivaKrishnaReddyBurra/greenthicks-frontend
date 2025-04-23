"use client";
import React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck, CheckCircle, Home, Clock, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function OrderTrackingPage({ params }) {
  const router = useRouter();
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

  // Redirect to home if accessed directly without order
  useEffect(() => {
    const orderId = sessionStorage.getItem("orderId");

    if (!orderId || orderId !== params.id) {
      router.push("/");
      return;
    }

    // Get order details from session storage
    const orderDate = new Date(sessionStorage.getItem("orderDate") || "");
    const deliveryDate = new Date(sessionStorage.getItem("deliveryDate") || "");
    const orderTotal = Number.parseFloat(sessionStorage.getItem("orderTotal") || "0");
    const orderItems = JSON.parse(sessionStorage.getItem("orderItems") || "[]");
    const orderStatus = sessionStorage.getItem("orderStatus") || "processing";
    const shippingAddress = JSON.parse(sessionStorage.getItem("shippingAddress") || "{}");

    setOrderDetails({
      orderId,
      orderDate: orderDate.toLocaleDateString(),
      deliveryDate: deliveryDate.toLocaleDateString(),
      orderTotal,
      orderItems,
      orderStatus,
      shippingAddress,
    });

    // Set current status and generate status history
    setCurrentStatus(orderStatus);

    // Generate mock status history
    const now = new Date();
    const orderPlacedDate = new Date(orderDate);

    const history = [
      {
        status: "Order Placed",
        date: orderPlacedDate.toLocaleString(),
        description: "Your order has been received and is being processed.",
      },
    ];

    // If status is at least "processing"
    if (["processing", "shipped", "out_for_delivery", "delivered"].includes(orderStatus)) {
      const processingDate = new Date(orderPlacedDate);
      processingDate.setHours(processingDate.getHours() + 2);
      history.push({
        status: "Processing",
        date: processingDate.toLocaleString(),
        description: "Your order is being prepared for shipping.",
      });
    }

    // If status is at least "shipped"
    if (["shipped", "out_for_delivery", "delivered"].includes(orderStatus)) {
      const shippedDate = new Date(orderPlacedDate);
      shippedDate.setHours(shippedDate.getHours() + 8);
      history.push({
        status: "Shipped",
        date: shippedDate.toLocaleString(),
        description: "Your order has been shipped and is on its way.",
      });
    }

    // If status is at least "out_for_delivery"
    if (["out_for_delivery", "delivered"].includes(orderStatus)) {
      const outForDeliveryDate = new Date(orderPlacedDate);
      outForDeliveryDate.setDate(outForDeliveryDate.getDate() + 1);
      history.push({
        status: "Out for Delivery",
        date: outForDeliveryDate.toLocaleString(),
        description: "Your order is out for delivery and will arrive soon.",
      });
    }

    // If status is "delivered"
    if (orderStatus === "delivered") {
      const deliveredDate = new Date(orderPlacedDate);
      deliveredDate.setDate(deliveredDate.getDate() + 2);
      history.push({
        status: "Delivered",
        date: deliveredDate.toLocaleString(),
        description: "Your order has been delivered successfully.",
      });
    }

    setStatusHistory(history);

    // Simulate order status progression
    const timer = setTimeout(() => {
      let newStatus = orderStatus;

      if (orderStatus === "processing") {
        newStatus = "shipped";
      } else if (orderStatus === "shipped") {
        newStatus = "out_for_delivery";
      } else if (orderStatus === "out_for_delivery") {
        newStatus = "delivered";
      }

      if (newStatus !== orderStatus) {
        sessionStorage.setItem("orderStatus", newStatus);
        setCurrentStatus(newStatus);
      }
    }, 30000); // Update every 30 seconds for demo purposes

    return () => clearTimeout(timer);
  }, [params.id, router]);

  if (!orderDetails.orderId) {
    return null; // Will redirect in useEffect
  }

  // Get status step (0-3)
  const getStatusStep = () => {
    switch (currentStatus) {
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "out_for_delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const statusStep = getStatusStep();

  return React.createElement("div", { className: "container mx-auto px-4 py-12" },
    React.createElement("div", { className: "max-w-4xl mx-auto" },
      React.createElement("div", { className: "mb-6" },
        React.createElement(Link, { href: "/", className: "inline-flex items-center text-primary hover:underline" },
          React.createElement(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Back to home"
        )
      ),
      React.createElement("div", { className: "bg-card rounded-lg border overflow-hidden mb-8" },
        React.createElement("div", { className: "bg-primary/10 p-6" },
          React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center" },
            React.createElement("div", null,
              React.createElement("h1", { className: "text-2xl font-bold mb-1" }, "Track Your Order"),
              React.createElement("p", { className: "text-muted-foreground" }, `Order #${orderDetails.orderId}`)
            ),
            React.createElement("div", { className: "mt-4 md:mt-0 flex items-center gap-2" },
              React.createElement(Clock, { className: "h-4 w-4 text-muted-foreground" }),
              React.createElement("span", { className: "text-sm" }, `Ordered on ${orderDetails.orderDate}`)
            )
          )
        ),
        React.createElement("div", { className: "p-6" },
          React.createElement("div", { className: "mb-8" },
            React.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Order Status"),
            React.createElement("div", { className: "relative" },
              // Progress bar
              React.createElement("div", { className: "absolute top-4 left-0 right-0 h-1 bg-muted" },
                React.createElement("div", {
                  className: "h-full bg-primary transition-all duration-500",
                  style: { width: `${(statusStep / 4) * 100}%` }
                })
              ),
              // Status steps
              React.createElement("div", { className: "grid grid-cols-4 relative" },
                React.createElement("div", { className: "flex flex-col items-center" },
                  React.createElement("div", {
                    className: `w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      statusStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`
                  },
                    React.createElement(Package, { className: "h-4 w-4" })
                  ),
                  React.createElement("p", { className: "text-sm mt-2 font-medium" }, "Processing")
                ),
                React.createElement("div", { className: "flex flex-col items-center" },
                  React.createElement("div", {
                    className: `w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      statusStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`
                  },
                    React.createElement(Package, { className: "h-4 w-4" })
                  ),
                  React.createElement("p", { className: "text-sm mt-2 font-medium" }, "Shipped")
                ),
                React.createElement("div", { className: "flex flex-col items-center" },
                  React.createElement("div", {
                    className: `w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      statusStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`
                  },
                    React.createElement(Truck, { className: "h-4 w-4" })
                  ),
                  React.createElement("p", { className: "text-sm mt-2 font-medium" }, "Out for Delivery")
                ),
                React.createElement("div", { className: "flex flex-col items-center" },
                  React.createElement("div", {
                    className: `w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      statusStep >= 4 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`
                  },
                    React.createElement(CheckCircle, { className: "h-4 w-4" })
                  ),
                  React.createElement("p", { className: "text-sm mt-2 font-medium" }, "Delivered")
                )
              )
            )
          ),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
            React.createElement("div", { className: "col-span-2" },
              React.createElement("h3", { className: "font-medium mb-3" }, "Status Updates"),
              React.createElement("div", { className: "space-y-4" },
                statusHistory.map((item, index) => (
                  React.createElement("div", { key: index, className: "flex gap-4" },
                    React.createElement("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center" },
                      item.status === "Order Placed" && React.createElement(Package, { className: "h-4 w-4 text-primary" }),
                      item.status === "Processing" && React.createElement(Package, { className: "h-4 w-4 text-primary" }),
                      item.status === "Shipped" && React.createElement(Package, { className: "h-4 w-4 text-primary" }),
                      item.status === "Out for Delivery" && React.createElement(Truck, { className: "h-4 w-4 text-primary" }),
                      item.status === "Delivered" && React.createElement(CheckCircle, { className: "h-4 w-4 text-primary" })
                    ),
                    React.createElement("div", null,
                      React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("p", { className: "font-medium" }, item.status),
                        React.createElement("span", { className: "text-xs text-muted-foreground" }, item.date)
                      ),
                      React.createElement("p", { className: "text-sm text-muted-foreground" }, item.description)
                    )
                  )
                ))
              )
            ),
            React.createElement("div", null,
              React.createElement("h3", { className: "font-medium mb-3" }, "Delivery Information"),
              React.createElement("div", { className: "bg-muted/30 p-4 rounded-md" },
                React.createElement("div", { className: "flex items-start gap-3 mb-3" },
                  React.createElement(MapPin, { className: "h-4 w-4 text-primary mt-0.5" }),
                  React.createElement("div", null,
                    React.createElement("p", { className: "text-sm font-medium" }, "Delivery Address"),
                    React.createElement("p", { className: "text-xs text-muted-foreground" },
                      `${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}`,
                      React.createElement("br", null),
                      orderDetails.shippingAddress.address,
                      React.createElement("br", null),
                      `${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}`
                    )
                  )
                ),
                React.createElement("div", { className: "flex items-start gap-3" },
                  React.createElement(Clock, { className: "h-4 w-4 text-primary mt-0.5" }),
                  React.createElement("div", null,
                    React.createElement("p", { className: "text-sm font-medium" }, "Estimated Delivery"),
                    React.createElement("p", { className: "text-xs text-muted-foreground" }, orderDetails.deliveryDate)
                  )
                )
              )
            )
          ),
          React.createElement(Separator, { className: "mb-6" }),
          React.createElement("div", null,
            React.createElement("h3", { className: "font-medium mb-4" }, "Order Items"),
            React.createElement("div", { className: "space-y-4" },
              orderDetails.orderItems.map((item) => (
                React.createElement("div", { key: item.id, className: "flex items-center gap-4" },
                  React.createElement("div", { className: "relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0" },
                    React.createElement(Image, {
                      src: item.image || "/placeholder.svg?height=64&width=64",
                      alt: item.name,
                      fill: true,
                      className: "object-cover"
                    })
                  ),
                  React.createElement("div", { className: "flex-1" },
                    React.createElement("h4", { className: "font-medium" }, item.name),
                    React.createElement("p", { className: "text-sm text-muted-foreground" },
                      `${item.quantity} x ₹${item.price.toFixed(2)}`
                    )
                  ),
                  React.createElement("div", { className: "text-right" },
                    React.createElement("p", { className: "font-medium" }, `₹${(item.price * item.quantity).toFixed(2)}`)
                  )
                )
              ))
            ),
            React.createElement("div", { className: "mt-6 pt-6 border-t" },
              React.createElement("div", { className: "flex justify-between mb-2" },
                React.createElement("span", { className: "text-muted-foreground" }, "Subtotal"),
                React.createElement("span", null, `$${orderDetails.orderTotal.toFixed(2)}`)
              ),
              React.createElement("div", { className: "flex justify-between font-medium" },
                React.createElement("span", null, "Total"),
                React.createElement("span", null, `$${orderDetails.orderTotal.toFixed(2)}`)
              )
            )
          )
        )
      ),
      React.createElement("div", { className: "flex justify-center" },
        React.createElement(Link, { href: "/" },
          React.createElement(Button, null,
            React.createElement(Home, { className: "mr-2 h-4 w-4" }),
            "Return to Home"
          )
        )
      )
    )
  );
}
