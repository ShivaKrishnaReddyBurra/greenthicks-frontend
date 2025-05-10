"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { getProductById, getProducts } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils";
import { Heart, ShoppingCart, Plus, Minus, Star, ArrowLeft, Truck, Shield, RotateCcw, Check, Camera, X } from "lucide-react";

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = Number.parseInt(params.id);
        const foundProduct = await getProductById(productId);

        if (foundProduct) {
          setProduct(foundProduct);
          const allProducts = await getProducts();
          const similar = allProducts
            .filter((p) => p.category === foundProduct.category && p.globalId !== foundProduct.globalId)
            .slice(0, 4);
          setSimilarProducts(similar);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      const token = getAuthToken();
      if (!token) {
        const returnUrl = encodeURIComponent(`/products/${product.globalId}`);
        router.push(`/login?returnUrl=${returnUrl}`);
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to your cart.",
          variant: "destructive",
        });
        return;
      }
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const toggleFavorite = () => {
    if (!product) return;

    if (isFavorite(product.globalId)) {
      removeFromFavorites(product.globalId);
    } else {
      addToFavorites(product);
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
      const newImages = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        file: file,
      }));
      setReviewImages([...reviewImages, ...newImages]);
    }
  };

  const removeImage = (id) => {
    setReviewImages(reviewImages.filter((img) => img.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const submitReview = (e) => {
    e.preventDefault();
    toast({
      title: "Review submitted",
      description: "Thank you for your review! It will be published after moderation.",
    });
    setShowReviewForm(false);
    setReviewImages([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                -{product.discount}% OFF
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

          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md border bg-muted">
                <Image
                  src={image || "/placeholder.svg?height=150&width=150"}
                  alt={`${product.name} - view ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="text-primary border-primary">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              {product.new && <Badge className="bg-blue-500">New</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(24 reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-medium min-w-[120px]">Availability:</span>
                <span
                  className={`flex items-center gap-1 ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
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
                <span className="font-medium min-w-[120px]">Category:</span>
                <span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium min-w-[120px]">Unit:</span>
                <span>{product.unit}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border rounded-md shadow-sm bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>

                <Button variant="outline" size="icon" className="h-10 w-10" onClick={toggleFavorite}>
                  <Heart className={`h-5 w-5 ${isFavorite(product.globalId) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <Card className="mb-6 bg-muted/40 border-muted">
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 py-1">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm">Free delivery over ₹500</span>
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
                      <span className="text-sm">30-day return policy</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-0">
            <TabsTrigger
              value="description"
              className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
            >
              Nutrition Facts
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
            >
              Reviews (24)
            </TabsTrigger>
          </TabsList>
          <div className="p-6 border border-t-0 rounded-b-lg bg-card text-card-foreground">
            <TabsContent value="description" className="mt-0">
              <div className="prose prose-green dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p>
                  {product.description} Our {product.name} is sourced directly from certified organic farms, ensuring
                  you get the freshest, most nutritious produce possible.
                </p>
                <h4 className="text-lg font-medium mt-6 mb-2">Growing Conditions</h4>
                <p>
                  Our farmers use sustainable farming practices that protect the environment and produce the most
                  flavorful vegetables. No synthetic pesticides or fertilizers are used in the growing process.
                </p>
                <h4 className="text-lg font-medium mt-6 mb-2">Harvesting and Delivery</h4>
                <p>
                  All our vegetables are harvested at peak ripeness and delivered to your door within 24-48 hours,
                  preserving maximum freshness and nutritional value.
                </p>
                <h4 className="text-lg font-medium mt-6 mb-2">Storage Tips</h4>
                <p>
                  For optimal freshness, store your {product.name} in the refrigerator. For leafy greens, wrap them
                  loosely in a damp paper towel before refrigerating.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-0">
              <div className="prose prose-green dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4">Nutrition Information</h3>
                <p className="mb-6">
                  Our {product.name} is not only delicious but also packed with essential nutrients to support your
                  health and wellbeing.
                </p>
                <div className="border rounded-lg p-5 max-w-md shadow-sm bg-muted/40">
                  <h4 className="text-lg font-bold mb-2">Nutrition Facts</h4>
                  <p className="text-sm text-muted-foreground mb-2">Serving Size: 100g</p>
                  <Separator />
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Calories</span>
                      <span>45 kcal</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Total Fat</span>
                      <span>0.5g</span>
                    </div>
                    <div className="flex justify-between pl-4 py-1">
                      <span className="text-sm text-muted-foreground">Saturated Fat</span>
                      <span className="text-sm">0.1g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Carbohydrates</span>
                      <span>10g</span>
                    </div>
                    <div className="flex justify-between pl-4 py-1">
                      <span className="text-sm text-muted-foreground">Dietary Fiber</span>
                      <span className="text-sm">2g</span>
                    </div>
                    <div className="flex justify-between pl-4 py-1">
                      <span className="text-sm text-muted-foreground">Sugars</span>
                      <span className="text-sm">4g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Protein</span>
                      <span>2g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between py-1">
                      <span>Vitamin A</span>
                      <span>20% DV</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Vitamin C</span>
                      <span>35% DV</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Calcium</span>
                      <span>4% DV</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Iron</span>
                      <span>6% DV</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowReviewForm(!showReviewForm)}>
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </Button>
                </div>

                {showReviewForm && (
                  <Card className="mb-6">
                    <CardContent className="p-5 space-y-4">
                      <h4 className="font-medium text-lg">Write Your Review</h4>
                      <form onSubmit={submitReview} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" placeholder="Enter your name" required />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="rating">Rating</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button key={rating} type="button" className="focus:outline-none">
                                <Star className="h-6 w-6 fill-muted text-muted hover:fill-yellow-400 hover:text-yellow-400" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="review">Your Review</Label>
                          <Textarea
                            id="review"
                            placeholder="Share your experience with this product..."
                            className="min-h-[120px]"
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Add Photos (Optional)</Label>
                          <div className="flex flex-wrap gap-3">
                            {reviewImages.map((img) => (
                              <div
                                key={img.id}
                                className="relative w-20 h-20 border rounded-md overflow-hidden bg-background"
                              >
                                <Image src={img.url || "/placeholder.svg"} alt="Review" fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(img.id)}
                                  className="absolute top-0 right-0 bg-background/80 p-1 rounded-bl-md"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={triggerFileInput}
                              className="w-20 h-20 border border-dashed rounded-md flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                            >
                              <Camera className="h-6 w-6" />
                              <span className="text-xs">Add Photo</span>
                            </button>

                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                          Submit Review
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-card">
                    <CardContent className="p-5">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Priya Sharma</h4>
                          <p className="text-sm text-muted-foreground">Verified Purchase</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        Absolutely fresh and delicious! The {product.name} arrived in perfect condition and tasted
                        amazing in my salad. Will definitely order again.
                      </p>
                      <div className="flex gap-2 mb-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="User review image"
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="User review image"
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Posted on March 15, 2025</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card">
                    <CardContent className="p-5">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Rahul Patel</h4>
                          <p className="text-sm text-muted-foreground">Verified Purchase</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        Great quality and very fresh. I could really taste the difference compared to supermarket
                        produce. The only reason for 4 stars is that one item was slightly bruised.
                      </p>
                      <div className="flex gap-2 mb-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="User review image"
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Posted on March 10, 2025</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card">
                    <CardContent className="p-5">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Anita Desai</h4>
                          <p className="text-sm text-muted-foreground">Verified Purchase</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        As a nutritionist, I'm very particular about the quality of produce I recommend. These
                        {product.name} are exceptional - truly organic, fresh, and packed with nutrients.
                      </p>
                      <p className="text-xs text-muted-foreground">Posted on February 28, 2025</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card">
                    <CardContent className="p-5">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Vikram Singh</h4>
                          <p className="text-sm text-muted-foreground">Verified Purchase</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        The flavor is outstanding! You can really taste the difference with organic produce. Delivery
                        was prompt and everything was well-packaged.
                      </p>
                      <div className="flex gap-2 mb-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="User review image"
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="User review image"
                            width={64}
                            height={64}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Posted on February 22, 2025</p>
                    </CardContent>
                  </Card>
                </div>

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <Card key={product.globalId} className="product-card group">
              <Link href={`/products/${product.globalId}`}>
                <div className="relative">
                  <div className="aspect-square overflow-hidden bg-background">
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 dark:bg-red-600">-{product.discount}%</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm font-medium">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through">
                            ₹{product.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-red-500 dark:text-red-400">₹{product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-primary">₹{product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{product.unit}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}