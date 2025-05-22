"use client";

import { DeliveryLayout } from "@/components/delivery-layout";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDeliveryOrders, updateDeliveryStatus } from "@/lib/api";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export default function MyDeliveriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState([]);
  const [actionLoading, setActionLoading] = useState(true); // Renamed from 'loading' to avoid confusion
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const searchTimeout = useRef(null);
  const actionTimeout = useRef(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setActionLoading(true);
      try {
        const data = await getDeliveryOrders(currentPage, 10);
        setDeliveries(data.orders);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch deliveries",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          setActionLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    };
    fetchDeliveries();
  }, [currentPage, router, toast]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Delivered
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Out for Delivery
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Assigned
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-green-500" />;
      case "refund":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleAcceptDelivery = async (globalId) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await updateDeliveryStatus(globalId, "out-for-delivery");
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery.globalId === globalId ? { ...delivery, deliveryStatus: "out-for-delivery" } : delivery
          )
        );
        setNotificationType("success");
        setNotificationMessage("Delivery accepted successfully!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to accept delivery",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleDeclineDelivery = async (globalId) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await updateDeliveryStatus(globalId, "cancelled");
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery.globalId === globalId ? { ...delivery, deliveryStatus: "cancelled" } : delivery
          )
        );
        setNotificationType("info");
        setNotificationMessage("Delivery declined");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to decline delivery",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleCompleteDelivery = async (globalId) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await updateDeliveryStatus(globalId, "delivered");
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery.globalId === globalId
              ? { ...delivery, deliveryStatus: "delivered", updatedAt: new Date().toISOString() }
              : delivery
          )
        );
        setNotificationType("success");
        setNotificationMessage("Delivery marked as completed!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to complete delivery",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      setSearchTerm(e.target.value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }, 500);
  };

  const handleFilterStatusChange = async (e) => {
    setActionLoading(true);
    setFilterStatus(e.target.value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handleFilterTypeChange = async (e) => {
    setActionLoading(true);
    setFilterType(e.target.value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handlePageChange = async (newPage) => {
    setActionLoading(true);
    setCurrentPage(newPage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.shippingAddress.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || delivery.deliveryStatus === filterStatus;
    const matchesType = filterType === "all" || delivery.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (actionLoading) {
    return <LeafLoader />;
  }

  return (
    <DeliveryLayout>
      <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Notification */}
        {showNotification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notificationType === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                : notificationType === "info"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            }`}
          >
            {notificationMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">My Deliveries</h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search deliveries..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
                value={filterStatus}
                onChange={handleFilterStatusChange}
              >
                <option value="all">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
                value={filterType}
                onChange={handleFilterTypeChange}
              >
                <option value="all">All Types</option>
                <option value="order">Orders</option>
                <option value="refund">Refunds</option>
              </select>
            </div>

            <div className="text-right text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
              {filteredDeliveries.length} deliveries found
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          {filteredDeliveries.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No deliveries found matching your filters.</p>
            </div>
          ) : (
            filteredDeliveries.map((delivery) => (
              <div
                key={delivery.globalId}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(delivery.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {delivery.type === "order" ? "Order" : "Refund"} #{delivery.id}
                          </h3>
                          {getStatusBadge(delivery.deliveryStatus)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Delivery ID: {delivery.globalId}</p>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(delivery.total)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Earnings: {formatCurrency(delivery.total * 0.1)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</h4>
                      <p className="text-gray-800 dark:text-white">{`${delivery.shippingAddress.firstName} ${delivery.shippingAddress.lastName}`}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Address</h4>
                      <p className="text-gray-800 dark:text-white flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-1 flex-shrink-0" />
                        <span>{`${delivery.shippingAddress.address}, ${delivery.shippingAddress.city}, ${delivery.shippingAddress.state}, ${delivery.shippingAddress.zipCode}`}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Distance: {delivery.distance || "N/A"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Items</h4>
                    <ul className="text-gray-800 dark:text-white">
                      {delivery.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-6 text-center">{item.quantity}x</span>
                          <span>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {delivery.deliveryStatus === "delivered" ? (
                        <span>Delivered on {formatDate(delivery.updatedAt)}</span>
                      ) : (
                        <span>Expected delivery by {formatDate(delivery.updatedAt)}</span>
                      )}
                    </div>

                    <div className="mt-3 md:mt-0 flex space-x-2">
                      {delivery.deliveryStatus === "assigned" && (
                        <>
                          <Button
                            onClick={() => handleAcceptDelivery(delivery.globalId)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleDeclineDelivery(delivery.globalId)}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      {delivery.deliveryStatus === "out-for-delivery" && (
                        <Button
                          onClick={() => handleCompleteDelivery(delivery.globalId)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Completed
                        </Button>
                      )}
                      <Link
                        href={`/delivery/my_deliveries/${delivery.globalId}`}
                        onClick={(e) => handleNavigation(e, `/delivery/my_deliveries/${delivery.globalId}`)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredDeliveries.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * 10, filteredDeliveries.length)}</span> of{" "}
              <span className="font-medium">{filteredDeliveries.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button
                className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
}