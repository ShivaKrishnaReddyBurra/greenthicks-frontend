"use client";

import { useState, useEffect } from "react";
import { MapPin, Truck, CheckCircle, Clock, AlertTriangle, Package, XCircle } from "lucide-react";
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
        // Fetch delivery orders
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

        // Fetch delivery boys
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
            <Package size={14} className="mr-1" />
            Order Placed
          </span>
        );
      case "assigned":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <Package size={14} className="mr-1" />
            Processing
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
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
      case "cancelled":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            <XCircle size={14} className="mr-1" />
            Cancelled
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

  const getPartnerById = async (id) => {
    if (!id) return null;
    const globalId = parseInt(id.replace("DEL-", ""));
    try {
      const deliveryBoy = await getDeliveryBoyById(globalId);
      return {
        id: `DEL-${deliveryBoy.globalId}`,
        name: deliveryBoy.name,
        location: deliveryBoy.address?.city || "Unknown",
        status: "active",
        ordersDelivered: deliveryBoy.ordersDelivered || 0,
      };
    } catch (error) {
      console.warn(`Failed to fetch partner ${id}:`, error);
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Management</h1>

      {/* Delivery Partners Summary */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Delivery Partners</h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          </div>
        ) : partners.length === 0 ? (
          <p className="text-muted-foreground">No delivery partners available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              partners.reduce((acc, partner) => {
                acc[partner.location] = (acc[partner.location] || 0) + 1;
                return acc;
              }, {})
            ).map(([location, count]) => (
              <div key={location} className="bg-muted/30 rounded-lg p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{location}</p>
                  <p className="text-2xl font-bold">{count} Partners</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg border overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Delivery Orders</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Address</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Delivery Partner</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-muted/30">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.address}</td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4">{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4">
                      {order.assignedTo ? (
                        <div>
                          <p>{partners.find((p) => p.id === order.assignedTo)?.name || "Loading..."}</p>
                          <p className="text-xs text-muted-foreground">{order.assignedTo}</p>
                        </div>
                      ) : (
                        <span className="text-blue-500">Not assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {order.status === "pending" || order.status === "assigned" ? (
                        <Button
                          variant="link"
                          onClick={() => openAssignModal(order)}
                          className="text-primary p-0 h-auto"
                        >
                          {order.assignedTo ? "Reassign" : "Assign"}
                        </Button>
                      ) : (
                        <Link
                          href={`/admin/delivery/orders/${order.id}`}
                          className="text-primary hover:underline"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="p-4 flex justify-between items-center border-t">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Delivery Partners Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Delivery Partners</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No delivery partners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Orders Delivered</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-t hover:bg-muted/30">
                    <td className="py-3 px-4">{partner.id}</td>
                    <td className="py-3 px-4">{partner.name}</td>
                    <td className="py-3 px-4">{partner.location}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4">{partner.ordersDelivered}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/delivery/partners/${partner.id}`}
                        className="text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Delivery Partner Modal */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Assign Delivery Partner</h3>
            <p className="mb-2">
              <span className="font-semibold">Order:</span> {selectedOrder.id}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Customer:</span> {selectedOrder.customer}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Delivery Address:</span> {selectedOrder.address}
            </p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Select a delivery partner:</h4>
              {partners.length === 0 ? (
                <p className="text-muted-foreground">No delivery partners available.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {partners.map((partner) => (
                    <Button
                      key={partner.id}
                      onClick={() => assignDeliveryPartner(partner.id)}
                      variant="outline"
                      className="w-full text-left p-3 flex justify-between items-center h-auto"
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
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={closeAssignModal}
                variant="outline"
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