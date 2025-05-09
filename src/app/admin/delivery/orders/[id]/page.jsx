"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import { getOrder, assignDeliveryBoy, updateDeliveryStatus, getAllUsers } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useParams } from "next/navigation"; // Import useParams

export default function OrderDetails() {
  const params = useParams(); // Get params using useParams hook
  const { id } = params; // Directly destructure params (plain object)
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignModal, setAssignModal] = useState(false);
  const [partners, setPartners] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Fetch order details
        const orderData = await getOrder(id);
        const mappedOrder = {
          id: orderData.globalId,
          customer: {
            name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
            email: orderData.shippingAddress.email,
            phone: orderData.shippingAddress.phone,
            address: `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.zipCode}`,
          },
          items: orderData.items.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            image: item.image || "/placeholder.svg?height=200&width=200",
          })),
          subtotal: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          discount: orderData.discount || 0,
          deliveryCharge: orderData.shippingFee || 0,
          total: orderData.total,
          status: orderData.deliveryStatus || "pending",
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus || "pending",
          date: new Date(orderData.orderDate).toISOString().split("T")[0],
          deliveryPartner: orderData.deliveryBoyId
            ? {
                id: `DEL-${orderData.deliveryBoyId}`,
                name: "Unknown",
                location: "Unknown",
              }
            : null,
          trackingInfo: orderData.deliveryUpdates.map((update) => ({
            status: update.status,
            timestamp: update.updatedAt,
            message: `Order ${update.status} by ${update.updatedBy}`,
          })),
        };

        // Fetch delivery partners
        const usersData = await getAllUsers();
        const deliveryPartners = usersData.filter((user) => user.isDeliveryBoy).map((user) => ({
          id: `DEL-${user.globalId}`,
          name: user.name,
          location: user.address?.city || "Unknown",
          status: user.isActive ? "active" : "inactive",
          ordersDelivered: user.ordersDelivered || 0,
        }));
        setPartners(deliveryPartners);

        // Update delivery partner info if assigned
        if (mappedOrder.deliveryPartner) {
          const partner = deliveryPartners.find((p) => p.id === mappedOrder.deliveryPartner.id);
          if (partner) {
            mappedOrder.deliveryPartner = {
              ...mappedOrder.deliveryPartner,
              name: partner.name,
              location: partner.location,
            };
          }
        }

        setOrder(mappedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error.message || "Failed to load order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, toast]);

  const assignDeliveryPartner = async (partnerId) => {
    try {
      const deliveryBoyId = parseInt(partnerId.replace("DEL-", ""));
      await assignDeliveryBoy(id, deliveryBoyId);
      const partner = partners.find((p) => p.id === partnerId);
      setOrder({
        ...order,
        deliveryPartner: partner,
        status: "assigned",
        trackingInfo: [
          ...order.trackingInfo,
          {
            status: "assigned",
            timestamp: new Date().toISOString(),
            message: `Order assigned to delivery partner ${partner.name}`,
          },
        ],
      });
      toast({
        title: "Success",
        description: `Delivery partner assigned to order #${id}.`,
      });
      setAssignModal(false);
    } catch (error) {
      console.error("Error assigning delivery partner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign delivery partner.",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      await updateDeliveryStatus(id, status);
      const statusMessages = {
        assigned: "Order has been assigned",
        "out-for-delivery": "Order is out for delivery", // Fixed to use hyphens
        delivered: "Order has been delivered",
      };
      setOrder({
        ...order,
        status,
        trackingInfo: [
          ...order.trackingInfo,
          {
            status,
            timestamp: new Date().toISOString(),
            message: statusMessages[status] || `Order status updated to ${status}`,
          },
        ],
      });
      toast({
        title: "Success",
        description: `Order status updated to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        );
      case "assigned":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <Truck size={14} className="mr-1" />
            Assigned
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            <Truck size={14} className="mr-1" />
            Out for Delivery
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            <AlertTriangle size={14} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error || "Order not found"}</p>
        <Link href="/admin/delivery" className="text-primary hover:underline mt-2 inline-block">
          Back to Delivery Management
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link href="/admin/delivery" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Back to Delivery Management
        </Link>
      </div>

      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{order.date}</span>
            <span className="mx-2">•</span>
            {getStatusBadge(order.status)}
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {!order.deliveryPartner && (
            <button
              onClick={() => setAssignModal(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors"
            >
              <Truck size={18} className="mr-2" />
              Assign Delivery Partner
            </button>
          )}
          <button
            onClick={() => alert("Order details printed")}
            className="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md"
          >
            Print Details
          </button>
        </div>
      </div>

      {/* Order Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Order Items</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.total}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-muted/50">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Delivery Charge</span>
                <span>₹{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-card rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
            {order.trackingInfo.length === 0 ? (
              <p className="text-muted-foreground">No tracking information available yet.</p>
            ) : (
              <div className="relative pl-8 border-l-2 border-muted space-y-6">
                {order.trackingInfo.map((info, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">{info.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(info.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Update Buttons */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Update Delivery Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateOrderStatus("assigned")}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                  disabled={order.status === "assigned"}
                >
                  Assigned
                </button>
                <button
                  onClick={() => updateOrderStatus("out-for-delivery")}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm hover:bg-purple-200"
                  disabled={order.status === "out-for-delivery"}
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() => updateOrderStatus("delivered")}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                  disabled={order.status === "delivered"}
                >
                  Delivered
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="lg:col-span-1">
          {/* Customer Information */}
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <p>{order.customer.phone}</p>
              </div>
              <div className="flex items-start">
                <MapPin size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <p>{order.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.paymentMethod}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Partner Information */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
            {order.deliveryPartner ? (
              <div className="space-y-4">
                <div className="flex items-start">
                  <User size={20} className="mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{order.deliveryPartner.name}</p>
                    <p className="text-sm text-muted-foreground">{order.deliveryPartner.id}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin size={20} className="mr-3 text-muted-foreground mt-0.5" />
                  <p>{order.deliveryPartner.location}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => setAssignModal(true)}
                    className="w-full bg-muted hover:bg-muted/80 py-2 rounded-md"
                  >
                    Reassign Delivery Partner
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Truck size={40} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No delivery partner assigned yet</p>
                <button
                  onClick={() => setAssignModal(true)}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Assign Delivery Partner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Delivery Partner Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Assign Delivery Partner</h3>
            <p className="mb-4">
              <span className="font-semibold">Order:</span> #{order.id}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Delivery Address:</span> {order.customer.address}
            </p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Select a delivery partner:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {partners
                  .filter((partner) => partner.status === "active")
                  .map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => assignDeliveryPartner(partner.id)}
                      className="w-full text-left p-3 border rounded-md hover:bg-muted/50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.id} - {partner.location}
                        </p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {partner.ordersDelivered} orders
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}