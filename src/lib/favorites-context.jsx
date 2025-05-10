"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getFavorites, apiAddToFavorites, apiRemoveFromFavorites, apiClearFavorites } from "@/lib/api";
import { getAuthToken } from "@/lib/auth-utils"

const FavoritesContext = createContext({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  clearFavorites: () => {},
})

export const useFavorites = () => useContext(FavoritesContext)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const { toast } = useToast()

  // Fetch favorites from backend on mount if user is authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = getAuthToken()
      if (!token) return // Skip fetching if not authenticated

      try {
        const data = await getFavorites()
        setFavorites(data.products || [])
      } catch (error) {
        console.error("Failed to fetch favorites:", error.message)
        toast({
          title: "Error",
          description: error.message || "Failed to fetch your favorites.",
          variant: "destructive",
        })
      }
    }

    fetchFavorites()
  }, [])

  const addToFavorites = async (product) => {
    try {
      await apiAddToFavorites(product.globalId);
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((item) => item.globalId === product.globalId)) {
          return prevFavorites;
        }
        return [...prevFavorites, { ...product, id: product.globalId }];
      });
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    } catch (error) {
      console.error("Failed to add to favorites:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to add to favorites.",
        variant: "destructive",
      });
    }
  };
  
  const removeFromFavorites = async (productId) => {
    try {
      await apiRemoveFromFavorites(productId);
      setFavorites((prevFavorites) => prevFavorites.filter((item) => item.globalId !== productId));
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      });
    } catch (error) {
      console.error("Failed to remove from favorites:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites.",
        variant: "destructive",
      });
    }
  };
  
  const clearFavorites = async () => {
    try {
      await apiClearFavorites();
      setFavorites([]);
      toast({
        title: "Favorites cleared",
        description: "All items have been removed from your favorites list.",
      });
    } catch (error) {
      console.error("Failed to clear favorites:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to clear favorites.",
        variant: "destructive",
      });
    }
  };
  const isFavorite = (productId) => {
    return favorites.some((item) => item.globalId === productId);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}