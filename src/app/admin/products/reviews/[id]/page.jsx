"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Star, X, ArrowLeft, Trash2, Check, XCircle } from "lucide-react"
import { getProductById, deleteReview, updateReviewStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// SkeletonLoader component - displays loading skeleton while fetching data
const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-64 bg-gray-200 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
)

// ProductReviews component - main component to manage and display product reviews
export default function ProductReviews({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedReviewImage, setSelectedReviewImage] = useState(null)

  // fetchProductDetails function - fetch product data with reviews when component mounts or ID changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const data = await getProductById(Number(id))
        setProduct({
          ...data,
          reviews: data.reviews || [],
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProductDetails()
  }, [id, toast])

  // approveReview function - approve a review and update the product state
  const approveReview = async (reviewId) => {
    try {
      // Check if the review exists first
      const reviewExists = product.reviews.find((review) => review._id === reviewId)
      if (!reviewExists) {
        toast({
          title: "Error",
          description: "Review not found",
          variant: "destructive",
        })
        return
      }

      // Try to update the review status
      await updateReviewStatus(Number(id), reviewId, true)

      // Update local state - mark as approved instead of removing
      setProduct({
        ...product,
        reviews: product.reviews.map((review) => (review._id === reviewId ? { ...review, approved: true } : review)),
      })

      toast({
        title: "Success",
        description: "Review approved successfully",
      })
    } catch (error) {
      console.error("Error approving review:", error)

      // Handle 404 errors specifically
      if (error.status === 404) {
        toast({
          title: "Feature Not Available",
          description: "Review approval feature is not currently available. Please contact support.",
          variant: "destructive",
        })
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || "An unknown error occurred"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  // rejectReview function - reject a review and update the product state
  const rejectReview = async (reviewId) => {
    try {
      // Check if the review exists first
      const reviewExists = product.reviews.find((review) => review._id === reviewId)
      if (!reviewExists) {
        toast({
          title: "Error",
          description: "Review not found",
          variant: "destructive",
        })
        return
      }

      // Try to update the review status
      await updateReviewStatus(Number(id), reviewId, false)

      // Update local state - mark as rejected
      setProduct({
        ...product,
        reviews: product.reviews.map((review) => (review._id === reviewId ? { ...review, approved: false } : review)),
      })

      toast({
        title: "Success",
        description: "Review rejected successfully",
      })
    } catch (error) {
      console.error("Error rejecting review:", error)

      // Handle 404 errors specifically
      if (error.status === 404) {
        toast({
          title: "Feature Not Available",
          description: "Review rejection feature is not currently available. Please contact support.",
          variant: "destructive",
        })
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || "An unknown error occurred"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  // removeReview function - delete a review and update the product state
  const removeReview = async (reviewId) => {
    try {
      await deleteReview(Number(id), reviewId)
      setProduct({
        ...product,
        reviews: product.reviews.filter((review) => review._id !== reviewId),
      })
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
    } catch (error) {
      // Handle 404 errors specifically
      if (error.status === 404) {
        toast({
          title: "Feature Not Available",
          description: "Review deletion feature is not currently available. Please contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to delete review.",
          variant: "destructive",
        })
      }
    }
  }

  // formatDate function - format a date string into a readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Render loading skeleton while data is being fetched
  if (loading) return <SkeletonLoader />

  // Render message if product is not found
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  // Render the product reviews UI
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{product.name} Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews for this product.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {product.reviews.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">No reviews available for this product.</p>
        ) : (
          product.reviews.map((review) => (
            <Card key={review._id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{review.customer?.name || "Anonymous"}</CardTitle>
                  <Badge variant={review.approved ? "default" : "secondary"}>
                    {review.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <CardDescription>Customer ID: {review.customer?._id || "N/A"}</CardDescription>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400" : "fill-muted text-muted"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{review.review}</p>
                {Array.isArray(review.images) && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.images
                      .filter((img) => typeof img === "string" && img.trim() !== "")
                      .map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedReviewImage({ reviewId: review._id, index: idx })}
                          className="w-16 h-16 rounded-md overflow-hidden border"
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`Review image ${idx + 1}`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => approveReview(review._id)}
                    disabled={review.approved}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rejectReview(review._id)}
                    disabled={!review.approved}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the review.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeReview(review._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedReviewImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedReviewImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <Image
            src={
              product.reviews.find((r) => r._id === selectedReviewImage.reviewId)?.images[selectedReviewImage.index] ||
              "/placeholder.svg?height=800&width=800" ||
              "/placeholder.svg"
            }
            alt="Review image"
            width={800}
            height={800}
            className="object-contain max-h-[90vh] w-auto"
          />
          <div className="absolute bottom-4 flex gap-2">
            {product.reviews
              .find((r) => r._id === selectedReviewImage.reviewId)
              ?.images.map((_, idx) => (
                <Button
                  key={idx}
                  variant={selectedReviewImage.index === idx ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedReviewImage({ reviewId: selectedReviewImage.reviewId, index: idx })}
                >
                  {idx + 1}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
