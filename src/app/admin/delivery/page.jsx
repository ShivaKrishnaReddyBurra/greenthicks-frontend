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
          <span className="flex items-center px-1.5 py-0.5 rounded-full text-3xs sm:text-xs bg-amber-100 text-amber-800">
            <Package size={10} className="mr-0.5" />
            Pending
          </span>
        );
      case "assigned":
        return (
          <span className="flex items-center px-1.5 py-0.5 rounded-full text-3xs sm:text-xs bg-blue-100 text-blue-800">
            <Truck size={10} className="mr-0.5" />
            Assigned
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="flex items-center px-1.5 py-0.5 rounded-full text-3xs sm:text-xs bg-purple-100 text-purple-800">
            <Truck size={10} className="mr-0.5" />
            In Transit
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center px-1.5 py-0.5 rounded-full text-3xs sm:text-xs bg-green-100 text-green-800">
            <CheckCircle size={10} className="mr-0.5" />
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center px-1.5 py-0.5 rounded-full text-3xs sm:text-xs bg-red-100 text-red-800">
            <XCircle size={10} className="mr-0.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center px-1.5 py-0.5 rounded-full text-3xs sm:text-xs bg-gray-100 text-gray-800">
            <AlertTriangle size={10} className="mr-0.5" />
            Unknown
          </span>
        );
    }
  };

  const getPartnersCountByLocation = () => {
    const counts = {};
    partners.forEach((partner) => {
      if (partner.status === "active") {
        counts[partner.location] = (counts[partner.location] || 0) + 1;
      }
    });
    return counts;
  };

  const locationCounts = getPartnersCountByLocation();

  return (
    <div className="container mx-auto px-1 sm:px-4 py-2 sm:py-6">
      <h1 className="text-lg sm:text-3xl font-bold mb-2 sm:mb-6">Delivery Management</h1>

      {/* Delivery Partners Summary */}
      <div className="bg-card rounded-lg shadow-md p-2 sm:p-6 mb-2 sm:mb-6">
        <h2 className="text-sm sm:text-xl font-bold mb-2 sm:mb-4">Delivery Partners</h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ) : partners.length === 0 ? (
          <p className="text-muted-foreground text-3xs sm:text-sm">No delivery partners available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {Object.entries(locationCounts).map(([location, count]) => (
              <div key={location} className="bg-muted/50 rounded-lg p-2 sm:p-4 flex items-center">
                <div className="bg-primary/10 p-1.5 sm:p-3 rounded-full mr-1.5 sm:mr-4">
                  <MapPin size={12} className="text-primary w-3 h-3 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-3xs sm:text-sm text-muted-foreground">{location}</p>
                  <p className="text-base sm:text-2xl font-bold">{count} Partners</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden mb-2 sm:mb-6">
        <div className="p-2 sm:p-6 border-b">
          <h2 className="text-sm sm:text-xl font-bold">Delivery Orders</h2>
        </div>

        {loading ? (
          <div className="p-3 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 sm:mt-4 text-3xs sm:text-sm">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-3 sm:p-8 text-center">
            <p className="text-3xs sm:text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted/50 z-10">
                <tr>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[60px]">Order ID</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[80px]">Customer</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[100px] hidden sm:table-cell">Address</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">Items</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">Total</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[60px]">Status</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">Delivery Partner</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[60px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-muted/50">
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs">{order.id}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs break-words">{order.customer}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs break-words hidden sm:table-cell">{order.address}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">{order.items}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">{formatCurrency(order.total)}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs">{getStatusBadge(order.status)}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">
                      {order.assignedTo ? (
                        <div>
                          <p className="text-3xs sm:text-xs">{partners.find((p) => p.id === order.assignedTo)?.name || "Loading..."}</p>
                          <p className="text-3xs text-muted-foreground">{order.assignedTo}</p>
                        </div>
                      ) : (
                        <span className="text-amber-500 text-3xs sm:text-xs">Not assigned</span>
                      )}
                    </td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs">
                      {order.status === "pending" || order.status === "assigned" ? (
                        <Button
                          variant="link"
                          onClick={() => openAssignModal(order)}
                          className="text-primary p-0 h-auto text-3xs sm:text-xs hover:underline min-h-[40px] min-w-[40px]"
                        >
                          {order.assignedTo ? "Reassign" : "Assign"}
                        </Button>
                      ) : (
                        <Link
                          href={`/admin/delivery/orders/${order.id}`}
                          className="text-primary hover:underline text-3xs sm:text-xs min-h-[40px] min-w-[40px] inline-block"
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
          <div className="p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center border-t gap-1.5 sm:gap-3">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2 text-3xs sm:text-xs min-h-[40px]"
            >
              Previous
            </Button>
            <span className="text-3xs sm:text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2 text-3xs sm:text-xs min-h-[40px]"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Delivery Partners Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="p-2 sm:p-6 border-b">
          <h2 className="text-sm sm:text-xl font-bold">Delivery Partners</h2>
        </div>

        {loading ? (
          <div className="p-3 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 sm:mt-4 text-3xs sm:text-sm">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-3 sm:p-8 text-center">
            <p className="text-3xs sm:text-sm">No partners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted/50 z-10">
                <tr>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[60px]">ID</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[80px]">Name</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">Location</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[60px]">Status</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">Orders Delivered</th>
                  <th className="text-left py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs min-w-[60px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-t hover:bg-muted/50">
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs">{partner.id}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs break-words">{partner.name}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">{partner.location}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs">
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-3xs ${
                          partner.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {partner.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs hidden sm:table-cell">{partner.ordersDelivered}</td>
                    <td className="py-0.5 px-0.5 sm:py-3 sm:px-4 text-3xs sm:text-xs">
                      <Link
                        href={`/admin/delivery/partners/${partner.id}`}
                        className="text-primary hover:underline text-3xs sm:text-xs min-h-[40px] min-w-[40px] inline-block"
                      >
                        View
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-1 sm:p-4">
          <div className="bg-card rounded-lg shadow-lg p-2 sm:p-6 w-full max-w-[92vw] max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-4">Assign Delivery Partner</h3>
            <p className="mb-1.5 sm:mb-2 text-3xs sm:text-sm">
              <span className="font-semibold">Order:</span> {selectedOrder.id}
            </p>
            <p className="mb-1.5 sm:mb-2 text-3xs sm:text-sm">
              <span className="font-semibold">Customer:</span> {selectedOrder.customer}
            </p>
            <p className="mb-2 sm:mb-4 text-3xs sm:text-sm">
              <span className="font-semibold">Address:</span>{" "}
              <span className="inline-block max-w-[90%] break-words">{selectedOrder.address}</span>
            </p>

            <div className="mb-2 sm:mb-4">
              <h4 className="font-semibold mb-1.5 sm:mb-2 text-3xs sm:text-sm">Select a delivery partner:</h4>
              {partners.length === 0 ? (
                <p className="text-muted-foreground text-3xs sm:text-sm">No delivery partners available.</p>
              ) : (
                <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
                  {partners
                    .filter((partner) => partner.status === "active")
                    .map((partner) => (
                      <Button
                        key={partner.id}
                        onClick={() => assignDeliveryPartner(partner.id)}
                        variant="outline"
                        className="w-full text-left p-1.5 sm:p-3 flex justify-between items-center h-auto text-3xs sm:text-sm hover:bg-muted/50 min-h-[40px] min-w-[40px]"
                      >
                        <div>
                          <p className="font-medium">{partner.name}</p>
                          <p className="text-3xs text-muted-foreground">
                            {partner.id} - {partner.location}
                          </p>
                        </div>
                        <span className="text-3xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
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
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-3xs sm:text-sm min-h-[40px] min-w-[40px]"
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