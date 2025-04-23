"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
    setQuantity(1); // Reset quantity after adding to cart
  };

  const toggleFavorite = () => {
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
    <div className="product-card group">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden rounded-md bg-muted">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
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
          <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
          <span className="sr-only">{isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}</span>
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
          <Link href={`/products/${product.id}`}>
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

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none p-0"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none p-0"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button size="sm" className="h-8 gap-1" onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
