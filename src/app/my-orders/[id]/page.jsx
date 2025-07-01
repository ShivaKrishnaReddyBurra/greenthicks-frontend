"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, RotateCcw, XCircle, Camera, X, Star } from "lucide-react";
import Image from "next/image";
import { getOrder, cancelOrder, addProductReview } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";

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

export default function OrderDetailPage() {
  const [order, setOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(true);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState({});
  const [returnData, setReturnData] = useState({ reason: "", images: [] });
  const [cancelReason, setCancelReason] = useState("");
  const [reviewData, setReviewData] = useState({});
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const actionTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const reviewFileInputRefs = useRef({});

  useEffect(() => {
    if (!getAuthToken()) {
      setActionLoading(true);
      setTimeout(() => {
        router.push("/login");
        setActionLoading(false);
      }, 1000);
      return;
    }

    async function fetchOrder() {
      setActionLoading(true);
      try {
        const fetchedOrder = await getOrder(id);
        setOrder({
          id: fetchedOrder.globalId || fetchedOrder.id,
          date: new Date(fetchedOrder.orderDate).toLocaleDateString("en-IN"),
          status: fetchedOrder.deliveryStatus,
          items: fetchedOrder.items.map((item) => ({
            productId: item.productId || item._id,
            name: item.name,
            image: item.image || "/placeholder.svg?height=64&width=64",
            quantity: item.quantity,
            price: item.price,
          })),
          total: fetchedOrder.total,
          estimatedDelivery: fetchedOrder.deliveryDate
            ? new Date(fetchedOrder.deliveryDate).toLocaleDateString("en-IN")
            : new Date(new Date(fetchedOrder.orderDate).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
          shippingAddress: fetchedOrder.shippingAddress,
          paymentMethod: fetchedOrder.paymentMethod || "Unknown",
          subtotal: fetchedOrder.subtotal || fetchedOrder.total,
          shipping: fetchedOrder.shipping || 0,
          discount: fetchedOrder.discount || 0,
        });
      } catch (error) {
        toast({
          title: "Error fetching order",
          description: error.message || "An error occurred while fetching the order.",
          variant: "destructive",
        });
        if (error.message.includes("Token expired") || error.message.includes("Order not found")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/my-orders");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }
    fetchOrder();
  }, [id, toast, router]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const maxSize = 3 * 1024 * 1024; // 3MB
      const oversizedFiles = Array.from(files).filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        toast({
          title: "Error",
          description: "Some images exceed 3MB. Please upload smaller images.",
          variant: "destructive",
        });
        return;
      }
      const newImages = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        file,
      }));
      setReturnData({ ...returnData, images: [...returnData.images, ...newImages] });
    }
  };

  const removeImage = (id) => {
    setReturnData({ ...returnData, images: returnData.images.filter((img) => img.id !== id) });
  };

  const handleReviewImageUpload = (e, productId) => {
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
          [productId]: {
            ...prev[productId],
            images: [...(prev[productId]?.images || []), ...base64Images],
          },
        }));
      });
    }
  };

  const removeReviewImage = (productId, index) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: prev[productId]?.images.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerReviewFileInput = (productId) => {
    reviewFileInputRefs.current[productId]?.click();
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      });
      return;
    }
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await cancelOrder(id, { reason: cancelReason });
        setOrder((prev) => ({ ...prev, status: "cancelled" }));
        setShowCancelForm(false);
        setCancelReason("");
        toast({
          title: "Order cancelled",
          description: "Your order has been successfully cancelled.",
        });
      } catch (error) {
        toast({
          title: "Error cancelling order",
          description: error.message || "An error occurred while cancelling the order.",
          variant: "destructive",
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleContactSupport = () => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
          title: "Support contacted",
          description: "Our support team will reach out to you soon.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to contact support. Please try again.",
          variant: "destructive",
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleReturnItems = async (e) => {
    e.preventDefault();
    if (!returnData.reason || returnData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a reason and at least one image for the return.",
        variant: "destructive",
      });
      return;
    }
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowReturnForm(false);
        setReturnData({ reason: "", images: [] });
        toast({
          title: "Return initiated",
          description: "Your return request has been submitted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initiate return. Please try again.",
          variant: "destructive",
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleSubmitReview = async (e, productId) => {
    e.preventDefault();
    const data = reviewData[productId] || { name: "", rating: 0, review: "", images: [] };
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
        await addProductReview(productId, {
          name: data.name || null,
          rating: data.rating,
          review: data.review,
          images: data.images || [],
        });
        setShowReviewForm((prev) => ({ ...prev, [productId]: false }));
        setReviewData((prev) => ({
          ...prev,
          [productId]: { name: "", rating: 0, review: "", images: [] },
        }));
        toast({
          title: "Review submitted",
          description: "Thank you for your review",
        });
      } catch (error) {
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

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

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
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Order Placed
          </Badge>
        );
      case "assigned":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Processing
          </Badge>
        );
      case "out-for-delivery":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (actionLoading) {
    return <LeafLoader />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link href="/my-orders" onClick={(e) => handleNavigation(e, "/my-orders")}>
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container leaf-pattern-3 mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/my-orders"
          onClick={(e) => handleNavigation(e, "/my-orders")}
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to my orders
        </Link>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Placed on {order.date}</span>
            {getStatusBadge(order.status)}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href={`/tracking/${order.id}`} onClick={(e) => handleNavigation(e, `/tracking/${order.id}`)}>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Track Order
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Link href={`/products/${item.productId}`}>
                        <Image src={item.image || "/placeholder.svg?height=64&width=64" } 
                        alt={item.name} 
                        fill 
                        className="object-cover" />
                      </Link>
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.status === "delivered" && order.items.map((item, index) => (
                  <div key={index}>
                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => setShowReviewForm((prev) => ({ ...prev, [item.productId]: true }))}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Write Review for {item.name}
                    </Button>
                    {showReviewForm[item.productId] && (
                      <form
                        onSubmit={(e) => handleSubmitReview(e, item.productId)}
                        className="space-y-4 mt-4"
                      >
                        <div>
                          <Label htmlFor={`reviewName-${item.productId}`}>Your Name (Optional)</Label>
                          <Input
                            id={`reviewName-${item.productId}`}
                            value={reviewData[item.productId]?.name || ""}
                            onChange={(e) =>
                              setReviewData((prev) => ({
                                ...prev,
                                [item.productId]: { ...prev[item.productId], name: e.target.value },
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
                                    [item.productId]: { ...prev[item.productId], rating: star },
                                  }))
                                }
                                className={`p-1 transition-colors ${
                                  star <= (reviewData[item.productId]?.rating || 0)
                                    ? "text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    star <= (reviewData[item.productId]?.rating || 0)
                                      ? "fill-yellow-400"
                                      : "fill-none"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`reviewText-${item.productId}`}>Your Review *</Label>
                          <Textarea
                            id={`reviewText-${item.productId}`}
                            value={reviewData[item.productId]?.review || ""}
                            onChange={(e) =>
                              setReviewData((prev) => ({
                                ...prev,
                                [item.productId]: { ...prev[item.productId], review: e.target.value },
                              }))
                            }
                            placeholder="Share your experience with this product"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Upload Images (Optional, max 3MB each)</Label>
                          <div className="mt-1">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => triggerReviewFileInput(item.productId)}
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Add Images
                            </Button>
                            <input
                              type="file"
                              accept="image/jpeg,image/png"
                              multiple
                              ref={(el) => (reviewFileInputRefs.current[item.productId] = el)}
                              onChange={(e) => handleReviewImageUpload(e, item.productId)}
                              className="hidden"
                            />
                          </div>
                          {reviewData[item.productId]?.images?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {reviewData[item.productId].images.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16">
                                  <Image
                                    src={img}
                                    alt={`Review image preview ${idx + 1}`}
                                    width={64}
                                    height={64}
                                    className="object-cover rounded-md w-full h-full"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 bg-background/80 rounded-full h-6 w-6"
                                    onClick={() => removeReviewImage(item.productId, idx)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
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
                              setShowReviewForm((prev) => ({ ...prev, [item.productId]: false }))
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
                <div className="relative pl-8 pb-8">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="relative pl-8 pb-8">
                  <div
                    className={`absolute left-0 w-6 h-6 rounded-full ${
                      order.status === "assigned" ||
                      order.status === "out-for-delivery" ||
                      order.status === "delivered"
                        ? "bg-primary flex items-center justify-center"
                        : "bg-muted flex items-center justify-center"
                    }`}
                  >
                    {order.status === "assigned" ||
                    order.status === "out-for-delivery" ||
                    order.status === "delivered" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Package className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                  </div>
                </div>
                <div className="relative pl-8 pb-8">
                  <div
                    className={`absolute left-0 w-6 h-6 rounded-full ${
                      order.status === "out-for-delivery" || order.status === "delivered"
                        ? "bg-primary flex items-center justify-center"
                        : "bg-muted flex items-center justify-center"
                    }`}
                  >
                    {order.status === "out-for-delivery" || order.status === "delivered" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">Your order is on the way</p>
                  </div>
                </div>
                <div className="relative pl-8">
                  <div
                    className={`absolute left-0 w-6 h-6 rounded-full ${
                      order.status === "delivered" || order.status === "cancelled"
                        ? "bg-primary flex items-center justify-center"
                        : "bg-muted flex items-center justify-center"
                    }`}
                  >
                    {order.status === "delivered" ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : order.status === "cancelled" ? (
                      <XCircle className="h-4 w-4 text-white" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{order.status === "cancelled" ? "Cancelled" : "Delivered"}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "delivered"
                        ? "Your order has been delivered"
                        : order.status === "cancelled"
                        ? "Order was cancelled"
                        : `Estimated delivery: ${order.estimatedDelivery}`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-muted-foreground">
                      {`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-muted-foreground">{order.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary mt-0.5"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleContactSupport}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contact Support
                </Button>
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500"
                    onClick={() => setShowCancelForm(true)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                )}
                {showCancelForm && (
                  <form onSubmit={handleCancelOrder} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="cancelReason">Reason for Cancellation *</Label>
                      <Textarea
                        id="cancelReason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please provide the reason for cancelling the order"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={actionLoading}>
                        Submit Cancellation
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCancelForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
                {order.status === "delivered" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowReturnForm(true)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Return Items
                  </Button>
                )}
                {showReturnForm && (
                  <form onSubmit={handleReturnItems} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="returnReason">Reason for Return *</Label>
                      <Textarea
                        id="returnReason"
                        value={returnData.reason}
                        onChange={(e) => setReturnData({ ...returnData, reason: e.target.value })}
                        placeholder="Please provide the reason for returning the items"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Upload Images (Required, max 3MB each)</Label>
                      <div className="mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerFileInput}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Add Images
                        </Button>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          multiple
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      {returnData.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {returnData.images.map((img) => (
                            <div key={img.id} className="relative w-16 h-16">
                              <Image
                                src={img}
                                alt="Return image preview"
                                width={64}
                                height={64}
                                className="object-cover rounded-md w-full h-full"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -top-2 -right-2 bg-background/80 rounded-full h-6 w-6"
                                onClick={() => removeImage(img.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={actionLoading}>
                        Submit Return
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReturnForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}