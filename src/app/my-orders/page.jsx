"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Search, ShoppingBag, XCircle, Star, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getUserOrders, addProductReview } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState({});
  const [reviewData, setReviewData] = useState({});
  const { toast } = useToast();
  const router = useRouter();
  const actionTimeout = useRef(null);
  const searchTimeoutRef = useRef(null);
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (!getAuthToken()) {
      setActionLoading(true);
      setTimeout(() => {
        router.push("/login");
        setActionLoading(false);
      }, 1000);
      return;
    }

    async function fetchOrders() {
      setActionLoading(true);
      try {
        const response = await getUserOrders(currentPage);
        const fetchedOrders = response?.orders || [];

        const enrichedOrders = fetchedOrders.map((order) => {
          if (!order || !order.items) {
            console.warn(`Invalid order data:`, order);
            return null;
          }
          return {
            id: order.globalId || order.id || `order-${Math.random().toString(36).substring(7)}`,
            date: order.orderDate
              ? new Date(order.orderDate).toLocaleDateString("en-IN")
              : new Date().toLocaleDateString("en-IN"),
            status: order.deliveryStatus || "pending",
            items: order.items.map((item) => ({
              productId: item.productId || item._id || `item-${Math.random().toString(36).substring(7)}`,
              name: item.name || "Unknown Product",
              image: item.image?.url || item.image || "/placeholder.svg?height=64&width=64",
              price: item.price || 0,
              quantity: item.quantity || 1,
            })),
            total: order.total || 0,
            estimatedDelivery: order.deliveryDate
              ? new Date(order.deliveryDate).toLocaleDateString("en-IN")
              : new Date(new Date(order.orderDate || Date.now()).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
                  "en-IN"
                ),
          };
        }).filter((order) => order !== null);

        setOrders(enrichedOrders);
        setTotalPages(response?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        if (error.message.includes("Unauthorized")) {
          toast({
            title: "Session expired",
            description: "Please log in again to view your orders.",
            variant: "destructive",
          });
          router.push("/login");
        } else {
          toast({
            title: "Error fetching orders",
            description: error.message || "Failed to load your orders. Please try again.",
            variant: "destructive",
          });
        }
        setOrders([]);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }
    fetchOrders();
  }, [toast, router, currentPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Order Placed</Badge>;
      case "assigned":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processing</Badge>;
      case "out-for-delivery":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Out for Delivery</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "assigned":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "out-for-delivery":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const handleSearchQuery = (value) => {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setActionLoading(true);
      setTimeout(() => {
        setSearchQuery(value);
        setActionLoading(false);
      }, 1000);
    }, 500);
  };

  const handleTabChange = (value) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(() => {
      setActionLoading(true);
      setTimeout(() => {
        setActiveTab(value);
        setActionLoading(false);
      }, 1000);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(() => {
      setActionLoading(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setActionLoading(false);
      }, 1000);
    }, 500);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  const triggerFileInput = (key) => {
    fileInputRefs.current[key]?.click();
  };

  const handleImageChange = (e, key) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 3 * 1024 * 1024; // 3MB
    const maxImages = 4;

    if (files.length > maxImages) {
      toast({
        title: "Error",
        description: `You can upload up to ${maxImages} images only.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: `${file.name} is not a valid image type (JPEG/PNG only).`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: `${file.name} exceeds 3MB size limit.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      Promise.all(
        validFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        })
      ).then((base64Images) => {
        setReviewData((prev) => ({
          ...prev,
          [key]: { ...prev[key], images: [...(prev[key]?.images || []), ...base64Images] },
        }));
      });
    }
  };

  const removeImage = (key, index) => {
    setReviewData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        images: prev[key].images.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmitReview = async (e, productId, orderId) => {
    e.preventDefault();
    const key = `${orderId}-${productId}`;
    const data = reviewData[key] || { rating: 0, review: "", images: [], name: "" };
    if (!data.rating || !data.review) {
      toast({
        title: "Error",
        description: "Please provide a rating and review.",
        variant: "destructive",
      });
      return;
    }
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        const response = await addProductReview(productId, {
          name: data.name || null,
          rating: data.rating,
          review: data.review,
          images: data.images,
        });
        setShowReviewForm((prev) => ({ ...prev, [key]: false }));
        setReviewData((prev) => ({
          ...prev,
          [key]: { name: "", rating: 0, review: "", images: [] },
        }));
        toast({
          title: "Review submitted",
          description: response.message,
        });
      } catch (error) {
        console.error("Error submitting review:", error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to submit review.",
          variant: "destructive",
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Order Placed" },
    { value: "assigned", label: "Processing" },
    { value: "out-for-delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (actionLoading) {
    return <LeafLoader />;
  }

  if (orders.length === 0 && !actionLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 flex mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
            <Button type="button" className="px-8">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="hidden md:flex w-full md:w-auto">
          <div className="flex w-full border rounded-md overflow-hidden">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleTabChange(option.value)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="md:hidden w-full">
          <select
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => handleSearchQuery(e.target.value)}
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
                    <Link
                      href={`/tracking/${order.id}`}
                      onClick={(e) => handleNavigation(e, `/tracking/${order.id}`)}
                    >
                      <Button type="button" variant="outline" size="sm">
                        Track Order
                      </Button>
                    </Link>
                    <Link
                      href={`/my-orders/${order.id}`}
                      onClick={(e) => handleNavigation(e, `/my-orders/${order.id}`)}
                    >
                      <Button type="button" size="sm">View Details</Button>
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
                        <div key={index} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <Link href={`/products/${item.productId}`}>
                                <Image
                                  src={item.image || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </Link>
                            </div>
                            <div className="flex-1">
                              <Link
                                href={`/products/${item.productId}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x {formatCurrency(item.price)}
                              </p>
                              {order.status === "delivered" && (
                                <Button
                                  type="button"
                                  size="sm"
                                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                                  onClick={() => setShowReviewForm((prev) => ({ ...prev, [`${order.id}-${item.productId}`]: true }))}
                                >
                                  <Star className="mr-1 h-3 w-3" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                          {showReviewForm[`${order.id}-${item.productId}`] && (
                            <form
                              onSubmit={(e) => handleSubmitReview(e, item.productId, order.id)}
                              className="space-y-4 pl-20"
                            >
                              <div>
                                <Label htmlFor={`reviewName-${order.id}-${item.productId}`}>Your Name</Label>
                                <Input
                                  id={`reviewName-${order.id}-${item.productId}`}
                                  value={reviewData[`${order.id}-${item.productId}`]?.name || ""}
                                  onChange={(e) =>
                                    setReviewData((prev) => ({
                                      ...prev,
                                      [`${order.id}-${item.productId}`]: { ...prev[`${order.id}-${item.productId}`], name: e.target.value },
                                    }))
                                  }
                                  placeholder="Enter your name (optional)"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Rating *</Label>
                                <div className="flex gap-1 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() =>
                                        setReviewData((prev) => ({
                                          ...prev,
                                          [`${order.id}-${item.productId}`]: { ...prev[`${order.id}-${item.productId}`], rating: star },
                                        }))
                                      }
                                      className={`p-1 transition-colors ${
                                        star <= (reviewData[`${order.id}-${item.productId}`]?.rating || 0)
                                          ? "text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      <Star
                                        className={`h-5 w-5 ${
                                          star <= (reviewData[`${order.id}-${item.productId}`]?.rating || 0)
                                            ? "fill-yellow-400"
                                            : "fill-none"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`reviewText-${order.id}-${item.productId}`}>Your Review *</Label>
                                <Textarea
                                  id={`reviewText-${order.id}-${item.productId}`}
                                  value={reviewData[`${order.id}-${item.productId}`]?.review || ""}
                                  onChange={(e) =>
                                    setReviewData((prev) => ({
                                      ...prev,
                                      [`${order.id}-${item.productId}`]: { ...prev[`${order.id}-${item.productId}`], review: e.target.value },
                                    }))
                                  }
                                  placeholder="Share your experience with this product"
                                  required
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`reviewImages-${order.id}-${item.productId}`}>Upload Images (Optional, max 3MB each)</Label>
                                <div className="mt-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => triggerFileInput(`${order.id}-${item.productId}`)}
                                  >
                                    <Camera className="mr-2 h-4 w-4" />
                                    Add Images
                                  </Button>
                                  <input
                                    id={`reviewImages-${order.id}-${item.productId}`}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    multiple
                                    ref={(el) => (fileInputRefs.current[`${order.id}-${item.productId}`] = el)}
                                    onChange={(e) => handleImageChange(e, `${order.id}-${item.productId}`)}
                                    className="hidden"
                                  />
                                </div>
                                {reviewData[`${order.id}-${item.productId}`]?.images?.length > 0 && (
                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    {reviewData[`${order.id}-${item.productId}`].images.map((img, idx) => (
                                      <div key={idx} className="relative h-20 w-20 rounded-md overflow-hidden">
                                        <Image
                                          src={img}
                                          alt={`Preview ${idx + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                        <button
                                          type="button"
                                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                                          onClick={() => removeImage(`${order.id}-${item.productId}`, idx)}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" disabled={actionLoading}>
                                  Submit Review
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    setShowReviewForm((prev) => ({ ...prev, [`${order.id}-${item.productId}`]: false }))
                                  }
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          + {order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="hidden md:block" />
                  <div className="md:w-64">
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-medium">{formatCurrency(order.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="text-sm capitalize">
                            {order.status === "pending"
                              ? "Order Placed"
                              : order.status === "assigned"
                              ? "Processing"
                              : order.status === "out-for-delivery"
                              ? "Out for Delivery"
                              : order.status}
                          </span>
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
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            variant="outline"
          >
            Previous
          </Button>
          <span className="flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}