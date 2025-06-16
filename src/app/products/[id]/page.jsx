"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { addProductReview, getProducts, getProductById } from "@/lib/fetch-without-auth"
import { getAuthToken } from "@/lib/auth-utils"
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
} from "lucide-react"

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
  )
}

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = React.use(paramsPromise)
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewImages, setReviewImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [reviewData, setReviewData] = useState({ name: "", rating: 0, review: "" })
  const fileInputRef = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const productId = Number.parseInt(params.id)
        const foundProduct = await getProductById(productId)

        if (foundProduct) {
          foundProduct.nutrition = foundProduct.nutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            vitamins: [],
          }
          foundProduct.policies = foundProduct.policies || {
            return: "",
            shipping: "",
            availability: "",
          }
          foundProduct.tags = foundProduct.tags || []
          foundProduct.sku = foundProduct.sku || `PROD-${foundProduct.globalId}`
          foundProduct.images = Array.isArray(foundProduct.images)
            ? foundProduct.images.map((img) => img?.url || img)
            : []
          // Fix: Ensure reviews is always an array
          foundProduct.reviews = Array.isArray(foundProduct.reviews) ? foundProduct.reviews : []
          setProduct(foundProduct)

          const allProducts = await getProducts()
          const similar = allProducts
            .filter((p) => p.category === foundProduct.category && p.globalId !== foundProduct.globalId)
            .slice(0, 4)
            // Fix: Ensure reviews is an array for each similar product
            .map((p) => ({
              ...p,
              reviews: Array.isArray(p.reviews) ? p.reviews : [],
              images: Array.isArray(p.images) ? p.images.map((img) => img?.url || img) : [],
              nutrition: p.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, vitamins: [] },
              policies: p.policies || { return: "", shipping: "", availability: "" },
              tags: p.tags || [],
              sku: p.sku || `PROD-${p.globalId}`,
            }))
          setSimilarProducts(similar)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleNavigation = async (e, href) => {
    e.preventDefault()
    setActionLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(href)
    setActionLoading(false)
  }

  const handleAddToCart = async () => {
    if (product) {
      const token = getAuthToken()
      if (!token) {
        const returnUrl = encodeURIComponent(`/products/${product.globalId}`)
        setActionLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push(`/login?returnUrl=${returnUrl}`)
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to your cart.",
          variant: "destructive",
        })
        setActionLoading(false)
        return
      }
      setActionLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addToCart(product, quantity)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
      setActionLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!product) return
    setActionLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (isFavorite(product.globalId)) {
      removeFromFavorites(product.globalId)
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      })
    } else {
      addToFavorites(product)
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      })
    }
    setActionLoading(false)
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const maxSize = 3 * 1024 * 1024 // 3MB
      const oversizedFiles = Array.from(files).filter((file) => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        toast({
          title: "Error",
          description: "Some images exceed 3MB. Please upload smaller images.",
          variant: "destructive",
        })
        return
      }
      const newImages = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        file,
      }))
      setReviewImages([...reviewImages, ...newImages])
    }
  }

  const removeImage = (id) => {
    setReviewImages(reviewImages.filter((img) => img.id !== id))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!reviewData.name || !reviewData.rating || !reviewData.review) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    setActionLoading(true)
    try {
      await addProductReview(product.globalId, reviewData)
      toast({
        title: "Review submitted",
        description: "Thank you for your review! It will be published after moderation.",
      })
      setShowReviewForm(false)
      setReviewImages([])
      setReviewData({ name: "", rating: 0, review: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleImageSelect = async (index) => {
    setActionLoading(true)
    setSelectedImage(index)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setActionLoading(false)
  }

  const handleFullScreenToggle = async (value) => {
    setActionLoading(true)
    setIsFullScreen(value)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setActionLoading(false)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = async (e) => {
    if (!touchStartX.current) return
    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchStartX.current - touchEndX

    if (Math.abs(deltaX) > 50) {
      setActionLoading(true)
      if (deltaX > 0 && selectedImage < product.images.length - 1) {
        setSelectedImage(selectedImage + 1)
      } else if (deltaX < 0 && selectedImage > 0) {
        setSelectedImage(selectedImage - 1)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setActionLoading(false)
    }
    touchStartX.current = null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <LeafLoader />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {(actionLoading || loading) && <LeafLoader />}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {isFullScreen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white"
              onClick={() => handleFullScreenToggle(false)}
            >
              <X className="h-6 w-6" />
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

        <div className="mb-6">
          <Link
            href="/products"
            onClick={(e) => handleNavigation(e, "/products")}
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <div
              className="relative rounded-xl overflow-hidden border bg-background"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="aspect-square w-full max-w-[400px] mx-auto">
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
                  className="absolute top-4 right-4 bg-background/50 hover:bg-background/80"
                  onClick={() => handleFullScreenToggle(true)}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </div>
              {product.discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                  -{product.discountPercentage}% OFF
                </Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm">
                  Only {product.stock} left
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Badge variant="outline" className="bg-background text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 rounded-md border ${
                    selectedImage === index ? "ring-2 ring-primary ring-offset-2" : "opacity-70 active:opacity-100"
                  } bg-background transition-opacity`}
                  onClick={() => handleImageSelect(index)}
                >
                  <Image
                    src={image || "/placeholder.svg?height=64&width=64"}
                    alt={`${product.name} - view ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <div className="flex flex-row flex-wrap items-center gap-1.5 mb-3 w-full max-w-full overflow-x-auto scrollbar-hide">
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

              <h1 className="text-2xl sm:text-3xl font-bold mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <
                        Math.round(
                          (product.reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0) /
                            (product.reviews?.length || 1)
                        )
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews?.length ?? 0} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">/ {product.unit}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-medium min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">SKU:</span>
                <span className="text-sm sm:text-base">{product.sku}</span>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">{product.description}</p>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">Availability:</span>
                  <span
                    className={`flex items-center gap-1 ${
                      product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    } text-sm sm:text-base`}
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

                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">Category:</span>
                  <span className="text-sm sm:text-base">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">Unit:</span>
                  <span className="text-sm sm:text-base">{product.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden p-2 z-40 max-w-screen">
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <div className="flex items-center border rounded-md shadow-sm bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-r-none active:scale-95 active:bg-primary/10"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium text-base">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-l-none active:scale-95 active:bg-primary/10"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="flex-1 bg-primary hover:bg-primary/90 active:bg-primary/80 h-10 text-base max-w-[200px]"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-10 w-10 ${isFavorite(product.globalId) ? "bg-red-50 dark:bg-red-950/30" : ""} active:scale-95 active:bg-primary/10`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite(product.globalId) ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div className="hidden md:block space-y-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center border rounded-md shadow-sm bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-r-none active:scale-95 active:bg-primary/10"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="w-16 text-center font-medium text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-l-none active:scale-95 active:bg-primary/10"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <Button
              className="flex-1 bg-primary hover:bg-primary/90 active:bg-primary/80 h-12 text-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 ${isFavorite(product.globalId) ? "bg-red-50 dark:bg-red-950/30" : ""} active:scale-95 active:bg-primary/10`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-6 w-6 ${isFavorite(product.globalId) ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" : ""}`}
              />
            </Button>
          </div>

          <Card className="bg-muted/40 border-muted">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 py-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">Free delivery over ₹200</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">100% organic certified</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">6-hours replacement policy</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex overflow-x-auto border-b rounded-none bg-transparent h-auto p-0 mb-0 scrollbar-sm-hide">
              <TabsTrigger
                value="description"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 sm:px-6 text-sm sm:text-base"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 sm:px-6 text-sm sm:text-base"
              >
                Nutrition Facts
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 sm:px-6 text-sm sm:text-base"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-shrink-0 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 sm:px-6 text-sm sm:text-base"
              >
                Reviews ({product.reviews?.length ?? 0})
              </TabsTrigger>
            </TabsList>
            <div className="p-4 sm:p-6 border border-t-0 rounded-b-lg bg-card text-card-foreground">
              <TabsContent value="description" className="mt-0">
                <div className="prose prose-green dark:prose-invert max-w-none text-sm sm:text-base">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Product Description</h3>
                  <p>{product.description}</p>
                  <h4 className="text-base sm:text-lg font-medium mt-6 mb-2">Growing Conditions</h4>
                  <p>
                    Our farmers use sustainable farming practices that protect the environment and produce the most
                    flavorful products. No synthetic pesticides or fertilizers are used.
                  </p>
                  <h4 className="text-base sm:text-lg font-medium mt-6 mb-2">Harvesting and Delivery</h4>
                  <p>
                    All our products are harvested at peak ripeness and delivered to your door within 24-48 hours,
                    preserving maximum freshness and nutritional value.
                  </p>
                  <h4 className="text-base sm:text-lg font-medium mt-6 mb-2">Storage Tips</h4>
                  <p>
                    For optimal freshness, store your {product.name} in the refrigerator. For leafy greens, wrap them
                    loosely in a damp paper towel before refrigerating.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="nutrition" className="mt-0">
                <div className="prose prose-green dark:prose-invert max-w-none text-sm sm:text-base">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Nutrition Information</h3>
                  <p className="mb-6">
                    Our {product.name} is not only delicious but also packed with essential nutrients to support your
                    health and wellbeing.
                  </p>
                  <div className="border rounded-lg p-4 sm:p-5 max-w-md shadow-sm bg-muted/40">
                    <h4 className="text-base sm:text-lg font-bold mb-2">Nutrition Facts</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">Serving Size: 100g</p>
                    <Separator />
                    <div className="space-y-2 mt-3 text-xs sm:text-sm">
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
                      {product.nutrition.vitamins.length > 0 && (
                        <>
                          <Separator />
                          {product.nutrition.vitamins.map((vitamin, index) => (
                            <div key={index} className="flex justify-between py-1">
                              <span>{vitamin.name}</span>
                              <span>{vitamin.daily || vitamin.amount}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="policies" className="mt-0">
                <div className="prose prose-green dark:prose-invert max-w-none text-sm sm:text-base">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Product Policies</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-medium mb-2">Return Policy</h4>
                      <p>{product.policies.return || "No return policy specified."}</p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium mb-2">Shipping Policy</h4>
                      <p>{product.policies.shipping || "No shipping policy specified."}</p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium mb-2">Availability</h4>
                      <p>{product.policies.availability || "No availability information specified."}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold">Customer Reviews</h3>
                    <Button
                      className="bg-primary hover:bg-primary/90 h-10 sm:h-12 text-sm sm:text-base"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? "Cancel" : "Write a Review"}
                    </Button>
                  </div>

                  {showReviewForm && (
                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <form onSubmit={submitReview} className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-sm sm:text-base">
                              Your Name *
                            </Label>
                            <Input
                              id="name"
                              value={reviewData.name}
                              onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                              placeholder="Enter your name"
                              required
                              className="mt-1 h-10 sm:h-12 text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <Label className="text-sm sm:text-base">Rating *</Label>
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
                                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                      star <= reviewData.rating ? "fill-yellow-400" : "fill-none"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="review" className="text-sm sm:text-base">
                              Your Review *
                            </Label>
                            <Textarea
                              id="review"
                              value={reviewData.review}
                              onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                              placeholder="Share your experience with this product"
                              required
                              className="mt-1 h-24 sm:h-32 text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <Label className="text-sm sm:text-base">Upload Images (Optional, max 3MB each)</Label>
                            <div className="mt-1">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={triggerFileInput}
                                className="h-10 sm:h-12 text-sm sm:text-base"
                              >
                                <Camera className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
                                {reviewImages.map((img) => (
                                  <div key={img.id} className="relative w-16 h-16 sm:w-20 sm:h-20">
                                    <Image
                                      src={img.url || "/placeholder.svg"}
                                      alt="Review image preview"
                                      width={80}
                                      height={80}
                                      className="object-cover rounded-md w-full h-full"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute -top-2 -right-2 bg-background/80 rounded-full h-6 w-6 sm:h-7 sm:w-7"
                                      onClick={() => removeImage(img.id)}
                                    >
                                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 h-10 sm:h-12 text-sm sm:text-base"
                            disabled={actionLoading}
                          >
                            Submit Review
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {(product.reviews?.length ?? 0) === 0 ? (
                    <p className="text-muted-foreground text-sm sm:text-base">
                      No reviews yet. Be the first to share your experience!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {product.reviews
                        .filter((review) => review.approved)
                        .map((review) => (
                          <Card key={review._id} className="bg-muted/40 border-muted">
                            <CardContent className="p-4 sm:p-5">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "fill-muted text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm sm:text-base font-medium">{review.customer.name}</span>
                              </div>
                              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm sm:text-base">{review.review}</p>
                              {review.images && review.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {review.images.map((img, index) => (
                                    <Image
                                      key={index}
                                      src={img.url || "/placeholder.svg"}
                                      alt={`Review image ${index + 1}`}
                                      width={80}
                                      height={80}
                                      className="object-cover rounded-md w-16 h-16 sm:w-20 sm:h-20"
                                    />
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {similarProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
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
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold truncate group-hover:text-primary transition-colors">
                        {similarProduct.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm sm:text-base font-bold text-primary">
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
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              i <
                              Math.round(
                                (similarProduct.reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0) /
                                  (similarProduct.reviews?.length || 1)
                              )
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          ({similarProduct.reviews?.length ?? 0})
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
  )
}