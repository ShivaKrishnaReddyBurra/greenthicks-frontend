"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { addProductReview, getProducts, getProductById } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils";
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Camera,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

// Responsive Skeleton Loader for ProductDetailPage
const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-screen-2xl animate-pulse">
      <div className="mb-4 sm:mb-6 h-5 w-24 sm:h-6 sm:w-32 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-10">
        <div className="space-y-3 sm:space-y-4">
          <div className="relative rounded-xl overflow-hidden border bg-muted aspect-square w-full max-w-[400px] mx-auto"></div>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-md flex-shrink-0"></div>
            ))}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="h-6 sm:h-8 w-3/4 bg-muted rounded"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 sm:h-5 sm:w-5 bg-muted rounded-full"></div>
            ))}
          </div>
          <div className="h-8 sm:h-10 w-1/2 bg-muted rounded"></div>
          <div className="h-3 sm:h-4 w-full bg-muted rounded"></div>
          <div className="h-3 sm:h-4 w-full bg-muted rounded"></div>
          <div className="h-3 sm:h-4 w-2/3 bg-muted rounded"></div>
          <div className="h-10 sm:h-12 w-3/4 bg-muted rounded"></div>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="h-6 sm:h-8 w-1/3 bg-muted rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="relative aspect-square w-full bg-muted rounded-lg"></div>
              <div className="h-4 sm:h-5 w-3/4 bg-muted rounded"></div>
              <div className="h-3 sm:h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [reviewData, setReviewData] = useState({ name: "", rating: 0, review: "", images: [] });
  const [galleryView, setGalleryView] = useState({ open: false, images: [], currentIndex: 0 });
  const fileInputRef = useRef(null);
  const touchStartX = useRef(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!id) {
          throw new Error("Product ID is missing");
        }

        const productId = Number.parseInt(id);
        if (isNaN(productId)) {
          throw new Error("Invalid product ID");
        }

        const foundProduct = await getProductById(productId);
        if (!foundProduct) {
          throw new Error("Product not found");
        }

        // Normalize product
        foundProduct.nutrition = foundProduct.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          badges: [],
        };
        foundProduct.policies = foundProduct.policies || {
          return: "",
          shipping: "",
          availability: "",
        };
        foundProduct.tags = foundProduct.tags || [];
        foundProduct.sku = foundProduct.sku || `PROD-${foundProduct.globalId}`;
        foundProduct.images = Array.isArray(foundProduct.images)
          ? foundProduct.images.map((img) =>
              typeof img === "string" ? img : img?.url || "/placeholder.svg?height=500&width=500"
            )
          : ["/placeholder.svg?height=500&width=500"];
        foundProduct.reviews = Array.isArray(foundProduct.reviews)
          ? foundProduct.reviews.map((review) => ({
              ...review,
              verified: review.verified || false,
              approved: review.approved || false,
              customer: review.customer || { name: review.customerName || "Anonymous" },
            }))
          : [];

        setProduct(foundProduct);

        // Similar Products
        const allProducts = await getProducts();
        if (!Array.isArray(allProducts)) {
          console.warn("getProducts did not return an array");
          setSimilarProducts([]);
          return;
        }

        const similar = allProducts
          .filter((p) => p.category === foundProduct.category && p.globalId !== foundProduct.globalId)
          .slice(0, 4)
          .map((p) => ({
            ...p,
            reviews: Array.isArray(p.reviews)
              ? p.reviews.map((review) => ({
                  ...review,
                  verified: review.verified || false,
                  approved: review.approved || false,
                  customer: review.customer || { name: review.customerName || "Anonymous" },
                }))
              : [],
            images: Array.isArray(p.images)
              ? p.images.map((img) => img?.url || "/placeholder.svg?height=300&width=300")
              : ["/placeholder.svg?height=300&width=300"],
            nutrition: p.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, badges: [] },
            policies: p.policies || { return: "", shipping: "", availability: "" },
            tags: p.tags || [],
            sku: p.sku || `PROD-${p.globalId}`,
          }));

        setSimilarProducts(similar);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      const returnUrl = encodeURIComponent(`/products/${product.globalId}`);
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/login?returnUrl=${returnUrl}`);
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      setTimeout(() => setActionLoading(false), 2000);
      return;
    }

    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleFavorite = async () => {
    const token = getAuthToken();
    if (!token) {
      const returnUrl = encodeURIComponent(`/products/${product.globalId}`);
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/login?returnUrl=${returnUrl}`);
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage your favorites.",
        variant: "destructive",
      });
      setTimeout(() => setActionLoading(false), 2000);
      return;
    }

    setActionLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isFavorite(product.globalId)) {
        removeFromFavorites(product.globalId);
        toast({
          title: "Removed from favorites",
          description: `${product.name} has been removed from your favorites.`,
        });
      } else {
        addToFavorites(product);
        toast({
          title: "Added to favorites",
          description: `${product.name} has been added to your favorites.`,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const maxSize = 3 * 1024 * 1024; // 3MB
      const maxImages = 4;
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (files.length > maxImages) {
        toast({
          title: "Error",
          description: `You can upload up to ${maxImages} images only.`,
          variant: "destructive",
        });
        return;
      }

      const validFiles = Array.from(files).filter((file) => {
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

      Promise.all(
        validFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        })
      ).then((base64Images) => {
        setReviewImages((prev) => [...prev, ...base64Images]);
      });
    }
  };

  const removeImage = (index) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Submit review with verified/approved status based on purchase history
  const submitReview = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!reviewData.rating || !reviewData.review) {
      toast({
        title: "Error",
        description: "Please provide a rating and review text.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      const returnUrl = encodeURIComponent(`/products/${product.globalId}`);
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/login?returnUrl=${returnUrl}`);
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      });
      setTimeout(() => setActionLoading(false), 2000);
      return;
    }

    setActionLoading(true);
    try {
      // Submit review to API; backend determines verified/approved status based on purchase history
      const response = await addProductReview(product.globalId, {
        name: reviewData.name || null,
        rating: reviewData.rating,
        review: reviewData.review,
        images: reviewImages,
      });

      // Notify user based on review status
      toast({
        title: "Review submitted",
        description: response.review.verified
          ? "Thanks for your review! It has been published."
          : "Your review has been submitted and is pending approval by our team.",
      });

      // Reset form and hide it
      setShowReviewForm(false);
      setReviewImages([]);
      setReviewData({ name: "", rating: 0, review: "", images: [] });

      // Refresh product data to include new review
      const updatedProduct = await getProductById(Number.parseInt(id));
      if (updatedProduct) {
        setProduct({
          ...updatedProduct,
          reviews: Array.isArray(updatedProduct.reviews)
            ? updatedProduct.reviews.map((review) => ({
                ...review,
                verified: review.verified || false,
                approved: review.approved || false,
                customer: review.customer || { name: review.customerName || "Anonymous" },
              }))
            : [],
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      let errorMessage = error.message || "Failed to submit review.";
      if (error.response?.errors) {
        errorMessage = error.response.errors.join("; ");
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageSelect = async (index) => {
    setActionLoading(true);
    setSelectedImage(index);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handleFullScreenToggle = async (value) => {
    setActionLoading(true);
    setIsFullScreen(value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = async (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 50) {
      setActionLoading(true);
      if (deltaX > 0 && selectedImage < product.images.length - 1) {
        setSelectedImage(selectedImage + 1);
      } else if (deltaX < 0 && selectedImage > 0) {
        setSelectedImage(selectedImage - 1);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
    touchStartX.current = null;
  };

  const openGalleryView = (images, index) => {
    setGalleryView({ open: true, images, currentIndex: index });
  };

  const closeGalleryView = () => {
    setGalleryView({ open: false, images: [], currentIndex: 0 });
  };

  const navigateGallery = (direction) => {
    setGalleryView((prev) => {
      let newIndex = prev.currentIndex + direction;
      if (newIndex < 0) newIndex = prev.images.length - 1;
      if (newIndex >= prev.images.length) newIndex = 0;
      return { ...prev, currentIndex: newIndex };
    });
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 text-center max-w-screen-2xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
          <Button className="text-sm sm:text-base">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {actionLoading && <LeafLoader />}
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-screen-2xl">
        {isFullScreen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white"
              onClick={() => handleFullScreenToggle(false)}
            >
              <X className="h-5 sm:h-6 w-5 sm:w-6" />
            </Button>
            <Image
              src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              width={800}
              height={800}
              className="object-contain max-h-[90vh] w-auto"
            />
          </div>
        )}

        {galleryView.open && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white"
              onClick={closeGalleryView}
            >
              <X className="h-5 sm:h-6 w-5 sm:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={() => navigateGallery(-1)}
            >
              <ChevronLeft className="h-6 sm:h-8 w-6 sm:w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={() => navigateGallery(1)}
            >
              <ChevronRight className="h-6 sm:h-8 w-6 sm:w-8" />
            </Button>
            <Image
              src={galleryView.images[galleryView.currentIndex] || "/placeholder.svg?height=500&width=500"}
              alt={`Review image ${galleryView.currentIndex + 1}`}
              width={800}
              height={800}
              className="object-contain max-h-[90vh] w-auto"
            />
          </div>
        )}

        <div className="mb-4 sm:mb-6">
          <Link
            href="/products"
            onClick={(e) => handleNavigation(e, "/products")}
            className="inline-flex items-center text-primary hover:underline text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-10">
          <div className="space-y-3 sm:space-y-4">
            <div
              className="relative rounded-xl overflow-hidden border bg-background"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Card className="bg-muted/10 border-muted">
                <CardContent className="aspect-square w-full max-w-[400px] mx-auto p-4 sm:p-6">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-contain h-full w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-background/50 hover:bg-background/80"
                    onClick={() => handleFullScreenToggle(true)}
                  >
                    <ZoomIn className="h-4 sm:h-5 w-4 sm:w-5" />
                  </Button>
                </CardContent>
              </Card>
              {product.discountPercentage > 0 && (
                <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-xs sm:text-sm">
                  -{product.discountPercentage}% OFF
                </Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-background/80 backdrop-blur-sm text-xs sm:text-sm">
                  Only {product.stock} left
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Badge variant="outline" className="bg-background text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <Button
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md border ${
                    selectedImage === index ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
                  } bg-background transition-opacity`}
                  onClick={() => handleImageSelect(index)}
                >
                  <Image
                    src={image || "/placeholder.svg?height=64&width=64"}
                    alt={`${product.name} - view ${index + 1}`}
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-row flex-wrap items-center gap-1.5 mb-3 w-full overflow-x-auto scrollbar-hide">
                <Badge variant="outline" className="text-primary border-primary text-xs sm:text-sm px-2 py-0.5">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Badge>
                {product.organic && (
                  <Badge
                    variant="outline"
                    className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 text-xs sm:text-sm px-2 py-0.5"
                  >
                    100% Organic
                  </Badge>
                )}
                {product.new && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-xs sm:text-sm px-2 py-0.5">
                    New
                  </Badge>
                )}
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs sm:text-sm px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 sm:h-5 w-4 sm:w-5 ${
                        i <
                        Math.round(
                          (product.reviews?.filter((r) => r.approved).reduce((sum, r) => sum + r?.rating || 0, 0) || 0) /
                            (product.reviews?.filter((r) => r.approved).length || 1)
                        )
                          ? "fill-yellow-400 text-yellow-600"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({product.reviews?.filter((r) => r.approved).length || 0} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-lg md:text-xl text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-muted-foreground">/ {product.unit}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="font-medium min-w-[80px] sm:min-w-[100px] md:min-w-[120px] text-xs sm:text-sm md:text-base">SKU:</span>
                <span className="text-xs sm:text-sm md:text-base">{product.sku}</span>
              </div>

              <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base">{product.description}</p>

              <Separator className="my-4 sm:my-6" />

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium min-w-[80px] sm:min-w-[100px] md:min-w-[120px] text-xs sm:text-sm md:text-base">Availability:</span>
                  <span
                    className={`flex items-center gap-1 ${
                      product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    } text-xs sm:text-sm md:text-base`}
                  >
                    {product.stock > 0 ? (
                      <>
                        <Check className="h-4 w-4" /> In Stock ({product.stock} available)
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium min-w-[80px] sm:min-w-[100px] md:min-w-[120px] text-xs sm:text-sm md:text-base">Category:</span>
                  <span className="text-xs sm:text-sm md:text-base">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium min-w-[80px] sm:min-w-[100px] md:min-w-[120px] text-xs sm:text-sm md:text-base">Unit:</span>
                  <span className="text-xs sm:text-sm md:text-base">{product.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center border rounded-md shadow-sm bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 sm:h-12 w-10 sm:w-12 rounded-r-none active:scale-95 active:bg-primary/10"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
              <span className="w-12 sm:w-16 text-center font-medium text-base sm:text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 sm:h-12 w-10 sm:w-12 rounded-l-none active:scale-95 active:bg-primary/10"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
            </div>

            <Button
              className="flex-1 bg-primary hover:bg-primary/90 active:bg-primary/80 h-12 text-lg"
              onClick={() => {
                console.log("Add to Cart clicked (desktop)");
                handleAddToCart();
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-10 sm:h-12 w-10 sm:w-12 ${
                isFavorite(product.globalId) ? "bg-red-50 dark:bg-red-950/30" : ""
              } active:scale-95 active:bg-primary/10`}
              onClick={() => {
                console.log("Favorite button clicked (desktop)");
                toggleFavorite();
              }}
            >
              <Heart
                className={`h-5 sm:h-6 w-5 sm:w-6 ${
                  isFavorite(product.globalId)
                    ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400"
                    : ""
                }`}
              />
            </Button>
          </div>

          <Card className="bg-muted/40 border-muted">
            <CardContent className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 py-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Truck className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">Free delivery starting over ₹200</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">100% organic certified</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RotateCcw className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">6-hours replacement policy</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden p-2 z-40">
          <div className="flex items-center gap-2 max-w-screen-2xl mx-auto">
            <div className="flex items-center border rounded-md shadow-sm bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none active:scale-95 active:bg-primary/10"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-10 text-center font-medium text-sm">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none active:scale-95 active:bg-primary/10"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              className="flex-1 bg-primary hover:bg-primary/90 active:bg-primary/80 h-9 text-sm max-w-[180px]"
              onClick={() => {
                console.log("Add to Cart clicked (mobile)");
                handleAddToCart();
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 ${
                isFavorite(product.globalId) ? "bg-red-50 dark:bg-red-950/30" : ""
              } active:scale-95 active:bg-primary/10`}
              onClick={() => {
                console.log("Favorite button clicked (mobile)");
                toggleFavorite();
              }}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite(product.globalId)
                    ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400"
                    : ""
                }`}
              />
            </Button>
          </div>
        </div>

        <div className="mb-8 sm:mb-12 pb-16 md:pb-0">
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex overflow-x-auto border-b rounded-none bg-transparent h-auto p-0 mb-0 scrollbar-sm-hide">
              <TabsTrigger
                value="description"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 sm:py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 sm:py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base"
              >
                Nutrition Facts
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 sm:py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 sm:py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base"
              >
                Reviews ({product.reviews?.filter((r) => r.approved).length ?? 0})
              </TabsTrigger>
            </TabsList>
            <div className="p-3 sm:p-4 md:p-6 border border-t-0 rounded-b-lg bg-card text-card-foreground">
              <TabsContent value="description" className="mt-0">
                <div className="prose prose-green dark:prose-invert max-w-none text-xs sm:text-sm md:text-base">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Product Description</h3>
                  <p>{product.description}</p>
                  <h4 className="text-sm sm:text-base md:text-lg font-medium mt-4 sm:mt-6 mb-2">Growing Conditions</h4>
                  <p>
                    Our farmers use sustainable farming practices that protect the environment and produce the most
                    flavorful products. No synthetic pesticides or fertilizers are used.
                  </p>
                  <h4 className="text-sm sm:text-base md:text-lg font-medium mt-4 sm:mt-6 mb-2">Harvesting and Delivery</h4>
                  <p>
                    All our products are harvested at peak ripeness and delivered to your door within 24-48 hours,
                    preserving maximum freshness and nutritional value.
                  </p>
                  <h4 className="text-sm sm:text-base md:text-lg font-medium mt-4 sm:mt-6 mb-2">Storage Tips</h4>
                  <p>
                    For optimal freshness, store your {product.name} in the refrigerator. For leafy greens, wrap them
                    loosely in a damp paper towel before refrigerating.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="nutrition" className="mt-0">
                <div className="prose prose-green dark:prose-invert max-w-none text-xs sm:text-sm md:text-base">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Nutrition Information</h3>
                  <p className="mb-4 sm:mb-6">
                    Our {product.name} is not only delicious but also packed with essential nutrients to support your health
                    and wellbeing.
                  </p>
                  <div className="border rounded-lg p-3 sm:p-4 md:p-5 max-w-md shadow-sm bg-muted/40">
                    <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2">Nutrition Facts</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">Serving Size: 100g</p>
                    <Separator />
                    <div className="space-y-2 mt-2 sm:mt-3 text-xs sm:text-sm">
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Calories</span>
                        <span>{product.nutrition.calories} kcal</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Total Fat</span>
                        <span>{product.nutrition.fat}g</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Carbohydrates</span>
                        <span>{product.nutrition.carbs}g</span>
                      </div>
                      <div className="flex justify-between pl-4 py-1">
                        <span className="text-xs sm:text-sm text-muted-foreground">Dietary Fiber</span>
                        <span className="text-xs sm:text-sm">{product.nutrition.fiber}g</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Protein</span>
                        <span>{product.nutrition.protein}g</span>
                      </div>
                      {product.nutrition.vitamins?.length > 0 && (
                        <>
                          <Separator />
                          {product.nutrition.vitamins.map((vitamin, index) => (
                            <div key={index} className="flex justify-between py-1">
                              <span>{vitamin.name}</span>
                              <span>
                                {vitamin.amount} ({vitamin.daily})
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="policies" className="mt-0">
                <div className="prose prose-green dark:prose-invert max-w-none text-xs sm:text-sm md:text-base">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Product Policies</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="text-sm sm:text-base md:text-lg font-medium mb-2">Return Policy</h4>
                      <p>{product.policies?.return || "No return policy specified."}</p>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base md:text-lg font-medium mb-2">Shipping Policy</h4>
                      <p>{product.policies?.shipping || "No shipping policy specified."}</p>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base md:text-lg font-medium mb-2">Availability</h4>
                      <p>{product.policies?.availability || "No availability information specified."}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-semibold">Customer Reviews</h3>
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm"
                    >
                      <Star className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                      Write a Review
                    </Button>
                  </div>
                  {showReviewForm && (
                    <form onSubmit={submitReview} className="space-y-3 sm:space-y-4">
                      <div>
                        <Label htmlFor="reviewName" className="text-xs sm:text-sm">Your Name (Optional)</Label>
                        <Input
                          id="reviewName"
                          value={reviewData.name}
                          onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                          placeholder="Enter your name (optional)"
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm">Rating *</Label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewData({ ...reviewData, rating: star })}
                              className={`p-1 transition-colors ${
                                star <= reviewData.rating ? "text-yellow-400" : "text-muted-foreground"
                              }`}
                            >
                              <Star
                                className={`h-4 sm:h-5 w-4 sm:w-5 ${star <= reviewData.rating ? "fill-yellow-400" : "fill-none"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="reviewText" className="text-xs sm:text-sm">Your Review *</Label>
                        <Textarea
                          id="reviewText"
                          value={reviewData.review}
                          onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                          placeholder="Share your experience with this product"
                          required
                          className="mt-1 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm">Upload Images (Optional, max 3MB each)</Label>
                        <div className="mt-1">
                          <Button type="button" variant="outline" onClick={triggerFileInput} className="text-xs sm:text-sm">
                            <Camera className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
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
                        {reviewImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {reviewImages.map((img, idx) => (
                              <div key={idx} className="relative w-14 h-14 sm:w-16 sm:h-16">
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
                                  className="absolute -top-2 -right-2 bg-background/80 rounded-full h-5 sm:h-6 w-5 sm:w-6"
                                  onClick={() => removeImage(idx)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={actionLoading} className="text-xs sm:text-sm">
                          Submit Review
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                          className="text-xs sm:text-sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                  {product.reviews.filter((r) => r.approved).length > 0 ? (
                    product.reviews
                      .filter((r) => r.approved)
                      .map((review, index) => (
                        <div key={index} className="border-b pb-3 sm:pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 sm:h-4 w-3 sm:w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{review.customer.name}</span>
                            {review.verified && review.approved && (
                              <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm">
                                Verified Buyer
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm">{review.review}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {review.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => openGalleryView(review.images, idx)}
                                  className="relative w-14 h-14 sm:w-16 sm:h-16"
                                >
                                  <Image
                                    src={img}
                                    alt={`Review image ${idx + 1}`}
                                    width={64}
                                    height={64}
                                    className="object-cover rounded-md w-full h-full hover:opacity-90 transition-opacity"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder.svg?height=64&width=64";
                                    }}
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                      No approved reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {similarProducts.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct.globalId}
                  href={`/products/${similarProduct.globalId}`}
                  onClick={(e) => handleNavigation(e, `/products/${similarProduct.globalId}`)}
                  className="group"
                >
                  <Card className="h-full border-muted hover:shadow-lg transition-shadow bg-card">
                    <div className="relative aspect-square">
                      <Image
                        src={similarProduct.images[0] || "/placeholder.svg?height=300&width=300"}
                        alt={similarProduct.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full rounded-t-lg group-hover:opacity-90 transition-opacity"
                        loading="lazy"
                      />
                      {similarProduct.discountPercentage > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-xs sm:text-sm">
                          -{similarProduct.discountPercentage}% OFF
                        </Badge>
                      )}
                      {similarProduct.stock <= 5 && similarProduct.stock > 0 && (
                        <Badge
                          variant="outline"
                          className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs sm:text-sm"
                        >
                          Only {similarProduct.stock} left
                        </Badge>
                      )}
                      {similarProduct.stock === 0 && (
                        <Badge
                          variant="outline"
                          className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs sm:text-sm"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold truncate group-hover:text-primary transition-colors">
                        {similarProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs sm:text-sm md:text-base font-bold text-primary">
                          ₹{similarProduct.price.toFixed(2)}
                        </span>
                        {similarProduct.originalPrice > similarProduct.price && (
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            ₹{similarProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 sm:h-4 w-3 sm:w-4 ${
                              i <
                              Math.round(
                                (similarProduct.reviews?.filter((r) => r.approved).reduce((sum, r) => sum + r?.rating || 0, 0) || 0) /
                                  (similarProduct.reviews?.filter((r) => r.approved).length || 1)
                              )
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          ({similarProduct.reviews?.filter((r) => r.approved).length || 0})
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}