"use client";

import { useState, useEffect } from "react";
import { MapPin, Truck, CheckCircle, AlertTriangle, Package, XCircle } from "lucide-react";
import { getDeliveryOrders, assignDeliveryBoy, getDeliveryBoys, getDeliveryBoyById } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DeliveryManagement() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!getAuthToken()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersData = await getDeliveryOrders(currentPage, 10);
        const mappedOrders = await Promise.all(
          ordersData.orders.map(async (order) => {
            let assignedTo = null;
            if (order.deliveryBoyId) {
              try {
                const deliveryBoy = await getDeliveryBoyById(order.deliveryBoyId);
                assignedTo = `DEL-${deliveryBoy.globalId}`;
              } catch (error) {
                console.warn(`Failed to fetch delivery boy ${order.deliveryBoyId}:`, error);
              }
            }
            return {
              id: order.globalId || order.id,
              customer: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
              address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}`,
              items: order.items.reduce((sum, item) => sum + item.quantity, 0),
              total: order.total,
              status: order.deliveryStatus || "pending",
              date: new Date(order.orderDate).toLocaleDateString("en-IN"),
              assignedTo,
            };
          })
        );
        setOrders(mappedOrders);
        setTotalPages(ordersData.totalPages || 1);

        const deliveryBoys = await getDeliveryBoys();
        const mappedPartners = deliveryBoys.map((user) => ({
          id: `DEL-${user.globalId}`,
          name: user.name,
          location: user.address?.city || "Unknown",
          status: "active",
          ordersDelivered: user.ordersDelivered || 0,
        }));
        setPartners(mappedPartners);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load delivery data.",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, toast, router]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedOrder(null);
  };

  const assignDeliveryPartner = async (partnerId) => {
    if (!selectedOrder) return;

    try {
      const globalId = selectedOrder.id;
      const deliveryBoyId = parseInt(partnerId.replace("DEL-", ""));
      await assignDeliveryBoy(globalId, deliveryBoyId);

      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, assignedTo: partnerId, status: "assigned" }
            : order
        )
      );
      toast({
        title: "Success",
        description: `Order ${selectedOrder.id} assigned to delivery partner.`,
      });
      closeAssignModal();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign delivery partner.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <Package size={12} className="mr-1" />
            Order Placed
          </span>
        );
      case "assigned":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <Package size={12} className="mr-1" />
            Processing
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
            <Truck size={12} className="mr-1" />
            Out for Delivery
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            <AlertTriangle size={12} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-3 py-4 max-w-3xl">
      <h1 className="text-xl font-bold mb-4">Delivery Management</h1>

      {/* Delivery Partners Summary */}
      <div className="bg-card rounded-lg border p-3 mb-4">
        <h2 className="text-base font-bold mb-3">Delivery Partners</h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ) : partners.length === 0 ? (
          <p className="text-muted-foreground text-xs">No delivery partners available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(
              partners.reduce((acc, partner) => {
                acc[partner.location] = (acc[partner.location] || 0) + 1;
                return acc;
              }, {})
            ).map(([location, count]) => (
              <div key={location} className="bg-muted/30 rounded-lg p-3 flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{location}</p>
                  <p className="text-lg font-bold">{count} Partners</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-card rounded-lg border mb-4">
        <div className="p-3 border-b">
          <h2 className="text-base font-bold">Delivery Orders</h2>
        </div>

        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 text-muted-foreground text-xs">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground text-xs">No orders found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold">Order ID</p>
                    <p className="text-sm">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">Status</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold">Customer</p>
                  <p className="text-sm">{order.customer}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">Address</p>
                  <p className="text-sm truncate">{order.address}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs font-semibold">Items</p>
                    <p className="text-sm">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">Total</p>
                    <p className="text-sm">{formatCurrency(order.total)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold">Delivery Partner</p>
                  {order.assignedTo ? (
                    <div>
                      <p className="text-sm">{partners.find((p) => p.id === order.assignedTo)?.name || "Loading..."}</p>
                      <p className="text-xs text-muted-foreground">{order.assignedTo}</p>
                    </div>
                  ) : (
                    <span className="text-blue-500 text-sm">Not assigned</span>
                  )}
                </div>
                <div className="pt-2">
                  {order.status === "pending" || order.status === "assigned" ? (
                    <Button
                      variant="link"
                      onClick={() => openAssignModal(order)}
                      className="text-primary p-0 h-auto text-sm"
                    >
                      {order.assignedTo ? "Reassign" : "Assign"}
                    </Button>
                  ) : (
                    <Link
                      href={`/admin/delivery/orders/${order.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="p-3 flex flex-col gap-3 border-t">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="text-xs px-3 py-1"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="text-xs px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Partners List */}
      <div className="bg-card rounded-lg border">
        <div className="p-3 border-b">
          <h2 className="text-base font-bold">Delivery Partners</h2>
        </div>

        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 text-muted-foreground text-xs">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground text-xs">No delivery partners found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {partners.map((partner) => (
              <div key={partner.id} className="p-3 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs font-semibold">ID</p>
                    <p className="text-sm">{partner.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">Status</p>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold">Name</p>
                  <p className="text-sm">{partner.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">Location</p>
                  <p className="text-sm">{partner.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">Orders Delivered</p>
                  <p className="text-sm">{partner.ordersDelivered}</p>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/admin/delivery/partners/${partner.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Delivery Partner Modal */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-card rounded-lg border p-3 w-full max-w-[90vw] max-h-[75vh] overflow-y-auto">
            <h3 className="text-base font-bold mb-3">Assign Delivery Partner</h3>
            <p className="mb-2 text-xs">
              <span className="font-semibold">Order:</span> {selectedOrder.id}
            </p>
            <p className="mb-2 text-xs">
              <span className="font-semibold">Customer:</span> {selectedOrder.customer}
            </p>
            <p className="mb-3 text-xs">
              <span className="font-semibold">Delivery Address:</span>{" "}
              <span className="inline-block max-w-[80%]">{selectedOrder.address}</span>
            </p>

            <div className="mb-3">
              <h4 className="font-semibold mb-2 text-xs">Select a delivery partner:</h4>
              {partners.length === 0 ? (
                <p className="text-muted-foreground text-xs">No delivery partners available.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {partners.map((partner) => (
                    <Button
                      key={partner.id}
                      onClick={() => assignDeliveryPartner(partner.id)}
                      variant="outline"
                      className="w-full text-left p-2 flex justify-between items-center h-auto text-xs"
                    >
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {partner.id} - {partner.location}
                        </p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {partner.ordersDelivered} orders
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={closeAssignModal}
                variant="outline"
                className="text-xs px-3 py-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}