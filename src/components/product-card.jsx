"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/auth-utils";

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

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsLoading(false);
  };

  const handleAddToCart = async () => {
    const token = getAuthToken();
    if (!token) {
      const returnUrl = encodeURIComponent(`/products/${product.globalId}`);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/login?returnUrl=${returnUrl}`);
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
    setQuantity(1);
    setIsLoading(false);
  };

  const toggleFavorite = async () => {
    const token = getAuthToken();
    if (!token) {
      const returnUrl = encodeURIComponent(`/products/${product.globalId}`);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/login?returnUrl=${returnUrl}`);
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage your favorites.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (isFavorite(product.globalId)) {
      removeFromFavorites(product.globalId);
    } else {
      addToFavorites(product);
    }
    setIsLoading(false);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      {isLoading && <LeafLoader />}
      <div className="product-card group">
        <div className="relative">
          <Link
            href={`/products/${product.globalId}`}
            onClick={(e) => handleNavigation(e, `/products/${product.globalId}`)}
          >
            <div className="aspect-square overflow-hidden rounded-md bg-muted">
              <Image
                src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite(product.globalId) ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">{isFavorite(product.globalId) ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
          {product.discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="outline" className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm">
              Only {product.stock} left
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
              <Badge variant="outline" className="bg-background">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="pt-4">
          <div className="mb-2 flex items-center justify-between">
            <Link
              href={`/products/${product.globalId}`}
              onClick={(e) => handleNavigation(e, `/products/${product.globalId}`)}
            >
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <div className="text-sm font-medium">
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
                  <span className="text-red-500">₹{product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span>₹{product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">{product.unit}</span>
              <Badge variant="outline" className="text-xs">
                {product.stock} in stock
              </Badge>
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center justify-center border-[1px] rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 border-r-0 rounded-none p-0 m-0 hover:bg-primary/10"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
              <span className="w-5 sm:w-8 text-center text-xs sm:text-sm bg-background px-1">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 border-l-0 rounded-none p-0 m-0 hover:bg-primary/10"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
            <Button
              className="h-7 text-xs px-2 sm:h-8 sm:text-sm sm:px-4 gap-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}