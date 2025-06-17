"use client";

import { DeliveryLayout } from "@/components/delivery-layout";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  MessageSquare,
  Camera,
  IndianRupeeIcon,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code"; // Verify this import
import { getOrder, updateDeliveryStatus, fetchWithAuthFormData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

console.log("QRCode import:", QRCode); // Debug import

const SkeletonLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default function DeliveryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState(null);
  const [actionLoading, setActionLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [selectedImage, setSelectedImage] = useState(null);
  const [deliveryPhotos, setDeliveryPhotos] = useState([]);
  const [orderIdInput, setOrderIdInput] = useState("");
  const [showOrderIdForm, setShowOrderIdForm] = useState(false);
  const actionTimeout = useRef(null);
  const noteTimeout = useRef(null);
  const imageTimeout = useRef(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      setActionLoading(true);
      try {
        const data = await getOrder(params.id);
        setDelivery({
          ...data,
          type: "order",
          earnings: data.total * 0.1,
          distance: data.distance || "N/A",
          customer: {
            name: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
            phone: data.shippingAddress.phone,
            address: `${data.shippingAddress.address}, ${data.shippingAddress.city}, ${data.shippingAddress.state}, ${data.shippingAddress.zipCode}`,
            location: data.shippingAddress.location,
          },
          items: data.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          notes: data.notes || "",
          timeline: [
            { status: "Assigned", time: data.orderDate, description: "Delivery assigned to you" },
            ...(data.deliveryStatus === "out-for-delivery" || data.deliveryStatus === "delivered"
              ? [{ status: "Out for Delivery", time: data.updatedAt, description: "Delivery accepted by you" }]
              : []),
            ...(data.deliveryStatus === "delivered"
              ? [{ status: "Delivered", time: data.updatedAt, description: "Delivery completed successfully" }]
              : []),
          ],
          paymentMethod: data.paymentMethod || "Online Payment (Completed)",
          photos: data.photos || [],
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch delivery details",
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
    };
    fetchDelivery();
  }, [params.id, toast, router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Delivered
          </span>
        );
      case "out-for-delivery":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Out for Delivery
          </span>
        );
      case "assigned":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Assigned
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
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

  const handleAcceptDelivery = () => {
    setConfirmationAction("accept");
    setShowConfirmation(true);
  };

  const handleDeclineDelivery = () => {
    setConfirmationAction("decline");
    setShowConfirmation(true);
  };

  const handleCompleteDelivery = () => {
    if (delivery.type === "order" && deliveryPhotos.length === 0) {
      setNotificationType("error");
      setNotificationMessage("Please add at least one photo as proof of delivery");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    if (delivery.paymentMethod === "cash-on-delivery") {
      setShowConfirmation(true);
      setConfirmationAction("complete");
    } else {
      setShowOrderIdForm(true);
    }
  };

  const handleCashPayment = async () => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      setProcessingAction(true);
      try {
        const updatedOrder = await updateDeliveryStatus(delivery.globalId, "delivered");
        const updatedDelivery = {
          ...delivery,
          deliveryStatus: "delivered",
          updatedAt: new Date().toISOString(),
          photos: deliveryPhotos,
          timeline: [
            ...delivery.timeline,
            {
              status: "Delivered",
              time: new Date().toISOString(),
              description: deliveryNote
                ? `Delivery completed. Note: ${deliveryNote}`
                : "Delivery completed successfully (Cash Payment)",
            },
          ],
        };
        setDelivery(updatedDelivery);
        setNotificationType("success");
        setNotificationMessage("Delivery marked as completed with cash payment!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setDeliveryNote("");
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to process cash payment",
          variant: "destructive",
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
        setProcessingAction(false);
      }
    }, 500);
  };

  const handleOrderIdSubmit = async () => {
    if (orderIdInput !== delivery.id) {
      toast({
        title: "Error",
        description: "Invalid Order ID",
        variant: "destructive",
      });
      return;
    }

    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      setProcessingAction(true);
      try {
        const formData = new FormData();
        for (const photo of deliveryPhotos) {
          const response = await fetch(photo);
          const blob = await response.blob();
          formData.append("photos", blob, `photo-${Date.now()}.jpg`);
        }
        formData.append("note", deliveryNote);
        await fetchWithAuthFormData(`/api/delivery/${delivery.globalId}/photos`, formData, "POST");

        const updatedOrder = await updateDeliveryStatus(delivery.globalId, "delivered");
        const updatedDelivery = {
          ...delivery,
          deliveryStatus: "delivered",
          updatedAt: new Date().toISOString(),
          photos: [...deliveryPhotos],
          timeline: [
            ...delivery.timeline,
            {
              status: "Delivered",
              time: new Date().toISOString(),
              description: deliveryNote
                ? `Delivery completed. Note: ${deliveryNote}`
                : "Delivery completed successfully",
            },
          ],
        };
        setDelivery(updatedDelivery);
        setShowOrderIdForm(false);
        setOrderIdInput("");
        setNotificationType("success");
        setNotificationMessage("Delivery marked as completed!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setDeliveryNote("");
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to process action",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
        setProcessingAction(false);
      }
    }, 500);
  };

  const confirmAction = async () => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      setProcessingAction(true);
      setShowConfirmation(false);
      try {
        let newStatus;
        if (confirmationAction === "accept") {
          newStatus = "out-for-delivery";
        } else if (confirmationAction === "decline") {
          newStatus = "cancelled";
        } else if (confirmationAction === "complete") {
          newStatus = "delivered";
        }

        if (confirmationAction === "complete" && deliveryPhotos.length > 0) {
          const formData = new FormData();
          for (const photo of deliveryPhotos) {
            const response = await fetch(photo);
            const blob = await response.blob();
            formData.append("photos", blob, `photo-${Date.now()}.jpg`);
          }
          formData.append("note", deliveryNote);
          await fetchWithAuthFormData(`/api/delivery/${delivery.globalId}/photos`, formData, "POST");
        }

        const updatedOrder = await updateDeliveryStatus(delivery.globalId, newStatus);
        const updatedDelivery = {
          ...delivery,
          deliveryStatus: newStatus,
          updatedAt: new Date().toISOString(),
          photos: confirmationAction === "complete" ? [...deliveryPhotos] : delivery.photos,
          timeline: [
            ...delivery.timeline,
            {
              status: newStatus === "out-for-delivery" ? "Out for Delivery" : newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
              time: new Date().toISOString(),
              description:
                confirmationAction === "accept"
                  ? "Delivery accepted by you"
                  : confirmationAction === "decline"
                  ? "Delivery declined by you"
                  : deliveryNote
                  ? `Delivery completed. Note: ${deliveryNote}`
                  : "Delivery completed successfully",
            },
          ],
        };

        setDelivery(updatedDelivery);
        setNotificationType(confirmationAction === "decline" ? "info" : "success");
        setNotificationMessage(
          confirmationAction === "accept"
            ? "Delivery accepted successfully!"
            : confirmationAction === "decline"
            ? "Delivery declined"
            : "Delivery marked as completed!"
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setDeliveryNote("");
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to process action",
          variant: "destructive",
        });
        if (error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
        setProcessingAction(false);
      }
    }, 500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      clearTimeout(imageTimeout.current);
      imageTimeout.current = setTimeout(async () => {
        setActionLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          setDeliveryPhotos([...deliveryPhotos, event.target.result]);
        };
        reader.readAsDataURL(file);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }, 500);
    }
  };

  const removeImage = (index) => {
    setActionLoading(true);
    setTimeout(() => {
      const updatedPhotos = [...deliveryPhotos];
      updatedPhotos.splice(index, 1);
      setDeliveryPhotos(updatedPhotos);
      setActionLoading(false);
    }, 1000);
  };

  const handleDeliveryNoteChange = (e) => {
    clearTimeout(noteTimeout.current);
    noteTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      setDeliveryNote(e.target.value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }, 500);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  if (actionLoading) {
    return <SkeletonLoader />;
  }

  if (!delivery) {
    return (
      <DeliveryLayout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Delivery Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The delivery you are looking for does not exist or has been removed.
            </p>
            <Link
              href="/delivery/my-deliveries"
              onClick={(e) => handleNavigation(e, "/delivery/my-deliveries")}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Deliveries
            </Link>
          </div>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
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

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link
                href="/delivery/my-deliveries"
                onClick={(e) => handleNavigation(e, "/delivery/my-deliveries")}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(delivery.type)}
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {delivery.type === "order" ? "Order" : "Refund"} #{delivery.id}
                  </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Delivery ID: {delivery.globalId}</p>
              </div>
            </div>
            <div>{getStatusBadge(delivery.deliveryStatus)}</div>
          </div>

          {/* Action Buttons */}
          {delivery.deliveryStatus === "assigned" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAcceptDelivery}
                  disabled={processingAction}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Delivery
                </Button>
                <Button
                  onClick={handleDeclineDelivery}
                  disabled={processingAction}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Delivery
                </Button>
              </div>
            </div>
          )}

          {/* Complete Delivery Section */}
          {delivery.deliveryStatus === "out-for-delivery" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Complete Delivery</h2>

              {delivery.type === "order" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Proof of Delivery
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {deliveryPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Delivery proof ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg cursor-pointer"
                          onClick={() => setSelectedImage(photo)}
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                    {deliveryPhotos.length < 4 && (
                      <div className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                        <label className="cursor-pointer flex flex-col items-center">
                          <Camera className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {delivery.paymentMethod === "cash-on-delivery" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Options
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scan to pay with UPI</p>
                      <QRCode
                        value={`upi://pay?pa=funnygn156@oksbi&pn=Greenthicks&am=${delivery.total}&cu=INR&tn=Order-${delivery.id}`}
                        size={150}
                        className="mx-auto p-4 justify-center bg-white rounded-xl shadow-md"
                      />
                    </div>
                    <Button
                      onClick={handleCashPayment}
                      disabled={processingAction}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <IndianRupeeIcon className="h-4 w-4 mr-2" />
                      Confirm Cash Payment
                    </Button>
                  </div>
                </div>
              )}

              {delivery.paymentMethod !== "cash-on-delivery" && showOrderIdForm && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verify Order ID
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="Enter Order ID"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleOrderIdSubmit}
                      disabled={processingAction || !orderIdInput}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify & Complete
                    </Button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="deliveryNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Note (Optional)
                </label>
                <textarea
                  id="deliveryNote"
                  value={deliveryNote}
                  onChange={handleDeliveryNoteChange}
                  placeholder="Add any notes about the delivery"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCompleteDelivery}
                  disabled={processingAction}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{delivery.customer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{delivery.customer.phone}</h3>
                    <a
                      href={`tel:${delivery.customer.phone}`}
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      Call Customer
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-12 w-12 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"/>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{delivery.customer.address}</h3>
                    <div className="flex space-x-2 mt-1">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${delivery.customer.location.latitude},${delivery.customer.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Open in Maps
                      </a>
                      <Link
                        href="/delivery/map"
                        onClick={(e) => handleNavigation(e, "/delivery/map")}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View in App Map
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Assigned At:</span>
                  <span className="font-medium text-gray-800 dark:text-white flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    {formatDate(delivery.orderDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Expected Delivery:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {formatDate(delivery.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{delivery.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{delivery.paymentMethod}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800 dark:text-white">Order Amount:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(delivery.total)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-semibold text-gray-800 dark:text-white">Your Earnings:</span>
                    <span className="font-bold text-green-600">{formatCurrency(delivery.earnings)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {delivery.type === "order" ? "Order Items" : "Refund Details"}
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {delivery.items.map((item, index) => (
                <div key={index} className="p-6 flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium text-gray-800 dark:text-white">
                        {item.name} {item.quantity > 1 ? `(${item.quantity}x)` : ""}
                      </h3>
                      {item.price && (
                        <p className="ml-4 text-base font-medium text-gray-800 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Notes */}
          {delivery.notes && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Delivery Notes
                </h2>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300">{delivery.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Photos - Only show for completed deliveries */}
          {delivery.deliveryStatus === "delivered" && delivery.photos && delivery.photos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Delivery Photos
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {delivery.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                      onClick={() => setSelectedImage(photo)}
                    >
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Delivery photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Delivery Timeline</h2>
            </div>
            <div className="p-6">
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                {delivery.timeline.map((event, index) => (
                  <li key={index} className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                      {event.status === "Assigned" && (
                        <Package className="w-3 h-3 text-green-800 dark:text-green-300" />
                      )}
                      {event.status === "Out for Delivery" && (
                        <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                      )}
                      {event.status === "Delivered" && (
                        <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                      )}
                      {event.status === "Cancelled" && (
                        <XCircle className="w-3 h-3 text-red-800 dark:text-red-300" />
                      )}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-800 dark:text-white">
                      {event.status}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                      {formatDate(event.time)}
                    </time>
                    <p className="text-base font-normal text-gray-600 dark:text-gray-400">{event.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img src={selectedImage} alt="Selected Image" className="max-w-full max-h-full" />
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
}