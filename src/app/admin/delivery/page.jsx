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
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Package size={14} className="mr-1" />
            Pending
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Truck size={14} className="mr-1" />
            Assigned
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <Truck size={14} className="mr-1" />
            In Transit
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={14} className="mr-1" />
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle size={14} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            <AlertTriangle size={14} className="mr-1" />
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">Delivery Management</h1>
      </div>

      {/* Delivery Partners Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-bold mb-3 text-gray-800 dark:text-white">Delivery Partners</h2>
        {partners.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No delivery partners available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(locationCounts).map(([location, count]) => (
              <div key={location} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-2 sm:mr-3">
                  <MapPin size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{location}</p>
                  <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">{count} Partners</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">Delivery Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No orders found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Delivery Partner
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 dark:textgray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {order.customer}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {order.address}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {order.items}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-3 sm:px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {order.assignedTo ? (
                          <div>
                            <p className="text-xs">{partners.find((p) => p.id === order.assignedTo)?.name || "Loading..."}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.assignedTo}</p>
                          </div>
                        ) : (
                          <span className="text-yellow-500 dark:text-yellow-400 text-xs">Not assigned</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-medium">
                        {order.status === "pending" || order.status === "assigned" ? (
                          <Button
                            variant="link"
                            onClick={() => openAssignModal(order)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-0"
                          >
                            {order.assignedTo ? "Reassign" : "Assign"}
                          </Button>
                        ) : (
                          <Link
                            href={`/admin/delivery/orders/${order.id}`}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
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
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Customer: {order.customer}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Address: {order.address}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Items: {order.items}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Total: {formatCurrency(order.total)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      Delivery Partner: {order.assignedTo ? partners.find((p) => p.id === order.assignedTo)?.name || "Loading..." : "Not assigned"}
                    </div>
                    <div className="flex justify-end">
                      {order.status === "pending" || order.status === "assigned" ? (
                        <Button
                          variant="link"
                          onClick={() => openAssignModal(order)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-0 text-xs"
                        >
                          {order.assignedTo ? "Reassign" : "Assign"}
                        </Button>
                      ) : (
                        <Link
                          href={`/admin/delivery/orders/${order.id}`}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="px-3 py-1 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="px-3 py-1 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delivery Partners Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">Delivery Partners</h2>
        </div>
        {partners.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No partners found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Orders Delivered
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {partners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">
                        {partner.id}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {partner.name}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {partner.location}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            partner.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {partner.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                        {partner.ordersDelivered}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-medium">
                        <Link
                          href={`/admin/delivery/partners/${partner.id}`}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-3">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{partner.name}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          partner.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {partner.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">ID: {partner.id}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Location: {partner.location}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">Orders Delivered: {partner.ordersDelivered}</div>
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/delivery/partners/${partner.id}`}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Assign Delivery Partner Modal */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p четырех w-full max-w-[95vw] max-h-[75vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-bold mb-3 text-gray-800 dark:text-white">Assign Delivery Partner</h3>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Order:</span> {selectedOrder.id}
            </p>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Customer:</span> {selectedOrder.customer}
            </p>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Address:</span>{" "}
              <span className="inline-block max-w-[85%] break-words">{selectedOrder.address}</span>
            </p>

            <div className="mb-3">
              <h4 className="font-semibold mb-2 text-xs text-gray-800 dark:text-white">Select a delivery partner:</h4>
              {partners.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">No delivery partners available.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {partners
                    .filter((partner) => partner.status === "active")
                    .map((partner) => (
                      <Button
                        key={partner.id}
                        onClick={() => assignDeliveryPartner(partner.id)}
                        variant="outline"
                        className="w-full text-left p-2 flex justify-between items-center text-xs hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{partner.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {partner.id} - {partner.location}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full">
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
                className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
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