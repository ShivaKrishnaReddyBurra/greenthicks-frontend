"use client"
import React from "react"
import { useState } from "react"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddAllToCart = () => {
    favorites.forEach((product) => {
      addToCart(product, 1)
    })

    toast({
      title: "Added to cart",
      description: `${favorites.length} items have been added to your cart.`,
    })
  }

  if (favorites.length === 0) {
    return (
      <div className="leaf-pattern-3">
          <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Your favorites list is empty</h1>
          <p className="text-muted-foreground mb-8">
            Save your favorite items to find them easily later.
          </p>
          <Link href="/products">
            <Button className="px-8">Browse Products</Button>
          </Link>
        </div>
      </div>
      </div>
    )
  }

  return (
    <div className="leaf-pattern-3">
        <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? "item" : "items"} in your favorites list
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleAddAllToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove all items from your favorites list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    clearFavorites()
                    toast({
                      title: "Favorites cleared",
                      description: "All items have been removed from your favorites list.",
                    })
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>
  )
}
