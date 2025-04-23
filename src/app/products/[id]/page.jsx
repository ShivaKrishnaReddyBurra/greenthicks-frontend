"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { products } from "@/lib/products";
import { Heart, ShoppingCart, Plus, Minus, Star, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the product by ID
    const productId = Number.parseInt(params.id);
    const foundProduct = products.find((p) => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);

      // Find similar products (same category)
      const similar = products
        .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setSimilarProducts(similar);
    }

    setLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };

  const toggleFavorite = () => {
    if (!product) return;

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500">-{product.discount}% OFF</Badge>
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
            <div className="aspect-square overflow-hidden rounded-md border bg-muted">
              <Image
                src={product.image1 || "/placeholder.svg?height=150&width=150"}
                alt={product.name}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-md border bg-muted">
              <Image
                src={product.image2 || "/placeholder.svg?height=150&width=150"}
                alt={`${product.name} - view 2`}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-md border bg-muted">
              <Image
                src={product.image3 || "/placeholder.svg?height=150&width=150"}
                alt={`${product.name} - view 3`}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-md border bg-muted">
              <Image
                src={product.image4 || "/placeholder.svg?height=150&width=150"}
                alt={`${product.name} - view 4`}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-primary border-primary">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              {product.organic && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  100% Organic
                </Badge>
              )}
              {product.new && <Badge className="bg-blue-500">New</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

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
              <span className="text-3xl font-bold">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Availability:</span>
                <span className={`${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Category:</span>
                <span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Unit:</span>
                <span>{product.unit}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
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

                <Button className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>

                <Button variant="outline" size="icon" className="h-10 w-10" onClick={toggleFavorite}>
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Free delivery over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">100% organic certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description" className="rounded-b-none">
              Description
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="rounded-b-none">
              Nutrition Facts
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-b-none">
              Reviews (24)
            </TabsTrigger>
          </TabsList>
          <div className="p-6 border border-t-0 rounded-b-lg">
            <TabsContent value="description" className="mt-0">
              <div className="prose prose-green dark:prose-invert max-w-none">
                <h3>Product Description</h3>
                <p>
                  {product.description} Our {product.name} is sourced directly from certified organic farms, ensuring
                  you get the freshest, most nutritious produce possible.
                </p>
                <h4>Growing Conditions</h4>
                <p>
                  Our farmers use sustainable farming practices that protect the environment and produce the most
                  flavorful vegetables. No synthetic pesticides or fertilizers are used in the growing process.
                </p>
                <h4>Harvesting and Delivery</h4>
                <p>
                  All our vegetables are harvested at peak ripeness and delivered to your door within 24-48 hours,
                  preserving maximum freshness and nutritional value.
                </p>
                <h4>Storage Tips</h4>
                <p>
                  For optimal freshness, store your {product.name} in the refrigerator. For leafy greens, wrap them
                  loosely in a damp paper towel before refrigerating.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-0">
              <div className="prose prose-green dark:prose-invert max-w-none">
                <h3>Nutrition Information</h3>
                <p>
                  Our {product.name} is not only delicious but also packed with essential nutrients to support your
                  health and wellbeing.
                </p>
                <div className="border rounded-lg p-4 max-w-md">
                  <h4 className="text-lg font-bold mb-2">Nutrition Facts</h4>
                  <p className="text-sm text-muted-foreground mb-2">Serving Size: 100g</p>
                  <Separator />
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span>45 kcal</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Total Fat</span>
                      <span>0.5g</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span className="text-sm text-muted-foreground">Saturated Fat</span>
                      <span className="text-sm">0.1g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Carbohydrates</span>
                      <span>10g</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span className="text-sm text-muted-foreground">Dietary Fiber</span>
                      <span className="text-sm">2g</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span className="text-sm text-muted-foreground">Sugars</span>
                      <span className="text-sm">4g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span>2g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Vitamin A</span>
                      <span>20% DV</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vitamin C</span>
                      <span>35% DV</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calcium</span>
                      <span>4% DV</span>
                    </div>
                    <div className="flex justify-between">
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
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <Button>Write a Review</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
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
                    <p className="text-sm mb-2">
                      Absolutely fresh and delicious! The {product.name} arrived in perfect condition and tasted amazing
                      in my salad. Will definitely order again.
                    </p>
                    <p className="text-xs text-muted-foreground">Posted on March 15, 2025</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
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
                    <p className="text-sm mb-2">
                      Great quality and very fresh. I could really taste the difference compared to supermarket produce.
                      The only reason for 4 stars is that one item was slightly bruised.
                    </p>
                    <p className="text-xs text-muted-foreground">Posted on March 10, 2025</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
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
                    <p className="text-sm mb-2">
                      As a nutritionist, I'm very particular about the quality of produce I recommend. These
                      {product.name} are exceptional - truly organic, fresh, and packed with nutrients.
                    </p>
                    <p className="text-xs text-muted-foreground">Posted on February 28, 2025</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
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
                    <p className="text-sm mb-2">
                      The flavor is outstanding! You can really taste the difference with organic produce. Delivery was
                      prompt and everything was well-packaged.
                    </p>
                    <p className="text-xs text-muted-foreground">Posted on February 22, 2025</p>
                  </div>
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
            <div key={product.id} className="product-card group">
              <Link href={`/products/${product.id}`}>
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-md bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>
                  )}
                </div>
                <div className="pt-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm font-medium">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground line-through">
                          ₹{product.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-red-500">₹{product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span>₹{product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{product.unit}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
