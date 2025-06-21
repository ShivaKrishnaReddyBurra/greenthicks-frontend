"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getAuthToken } from "@/lib/auth-utils"
import { addProductReview, getProductReviews } from "@/lib/api"
import { Star, Camera, X } from "lucide-react"
import Image from "next/image"

export default function ProductReviews({ productId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({ name: "", rating: 0, review: "" })
  const [reviewImages, setReviewImages] = useState([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await getProductReviews(productId)
      setReviews(response.reviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const maxSize = 3 * 1024 * 1024 // 3MB
      const maxImages = 4

      if (reviewImages.length + files.length > maxImages) {
        toast({
          title: "Error",
          description: `You can upload up to ${maxImages} images only.`,
          variant: "destructive",
        })
        return
      }

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

  const submitReview = async (e) => {
    e.preventDefault()

    if (!getAuthToken()) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (!reviewData.name || !reviewData.rating || !reviewData.review) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await addProductReview(productId, {
        ...reviewData,
        images: reviewImages,
        verified: false, // Will be determined by backend based on purchase history
      })

      toast({
        title: "Review submitted",
        description: "Thank you for your review! It will be published after moderation.",
      })

      setShowReviewForm(false)
      setReviewImages([])
      setReviewData({ name: "", rating: 0, review: "" })

      // Refresh reviews
      await fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold">Customer Reviews ({reviews.length})</h3>
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
                <Label className="text-sm sm:text-base">Upload Images (Optional, max 4 images, 3MB each)</Label>
                <div className="mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("review-images")?.click()}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  >
                    <Camera className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Add Images
                  </Button>
                  <input
                    id="review-images"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
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
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm sm:text-base">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id} className="bg-muted/40 border-muted">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm sm:text-base font-medium">
                    {review.customerName || review.customer?.name || "Anonymous"}
                  </span>
                  {review.verified && <Badge className="bg-green-500 text-xs sm:text-sm">Verified Buyer</Badge>}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-2">{formatDate(review.createdAt)}</p>
                <p className="text-sm sm:text-base">{review.review}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img || "/placeholder.svg"}
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
  )
}
