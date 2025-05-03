"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, Trash2, Upload, Star, Check, X, ArrowLeft, ImagePlus, Eye } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockProduct = {
  id: "1",
  name: "Organic Broccoli",
  description: "Fresh organic broccoli grown locally without pesticides.",
  price: 2.99,
  salePrice: 2.49,
  stock: 150,
  sku: "BRC-001",
  category: "vegetables",
  tags: ["organic", "fresh", "local"],
  featured: true,
  published: true,
  images: [
    { id: "img1", url: "/placeholder.svg", primary: true },
    { id: "img2", url: "/placeholder.svg", primary: false },
    { id: "img3", url: "/placeholder.svg", primary: false },
  ],
  nutrition: {
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    fiber: 5.1,
    vitamins: [
      { name: "Vitamin C", amount: "135%", daily: "135%" },
      { name: "Vitamin K", amount: "116%", daily: "116%" },
      { name: "Folate", amount: "14%", daily: "14%" },
    ],
  },
  reviews: [
    { id: "rev1", user: "John D.", rating: 5, comment: "Very fresh and tasty!", approved: true, date: "2023-05-15" },
    {
      id: "rev2",
      user: "Sarah M.",
      rating: 4,
      comment: "Good quality but a bit pricey.",
      approved: true,
      date: "2023-06-02",
    },
    {
      id: "rev3",
      user: "Mike T.",
      rating: 3,
      comment: "Average quality this time.",
      approved: false,
      date: "2023-06-10",
    },
  ],
  policies: {
    return: "Returns accepted within 24 hours if product is damaged or spoiled.",
    shipping: "Same-day delivery available for orders placed before 2 PM.",
    availability: "Available year-round with peak freshness in spring.",
  },
}

export default function ProductEditor({ params }) {
  const router = useRouter()
  const { id } = params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [newTag, setNewTag] = useState("")
  const [newVitamin, setNewVitamin] = useState({ name: "", amount: "", daily: "" })

  // Fetch product data
  useEffect(() => {
    // In a real app, fetch from API
    // For now, use mock data
    setProduct(mockProduct)
    setLoading(false)
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In a real app, save to API
    setSaving(false)
    // Show success message
    alert("Product saved successfully!")
  }

  const handleAddTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct({
        ...product,
        tags: [...product.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setProduct({
      ...product,
      tags: product.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleAddVitamin = () => {
    if (newVitamin.name && newVitamin.amount) {
      setProduct({
        ...product,
        nutrition: {
          ...product.nutrition,
          vitamins: [...product.nutrition.vitamins, { ...newVitamin }],
        },
      })
      setNewVitamin({ name: "", amount: "", daily: "" })
    }
  }

  const handleRemoveVitamin = (index) => {
    const updatedVitamins = [...product.nutrition.vitamins]
    updatedVitamins.splice(index, 1)
    setProduct({
      ...product,
      nutrition: {
        ...product.nutrition,
        vitamins: updatedVitamins,
      },
    })
  }

  const handleSetPrimaryImage = (imageId) => {
    setProduct({
      ...product,
      images: product.images.map((img) => ({
        ...img,
        primary: img.id === imageId,
      })),
    })
  }

  const handleRemoveImage = (imageId) => {
    setProduct({
      ...product,
      images: product.images.filter((img) => img.id !== imageId),
    })
  }

  const handleApproveReview = (reviewId) => {
    setProduct({
      ...product,
      reviews: product.reviews.map((review) => (review.id === reviewId ? { ...review, approved: true } : review)),
    })
  }

  const handleRejectReview = (reviewId) => {
    setProduct({
      ...product,
      reviews: product.reviews.map((review) => (review.id === reviewId ? { ...review, approved: false } : review)),
    })
  }

  const handleDeleteReview = (reviewId) => {
    setProduct({
      ...product,
      reviews: product.reviews.filter((review) => review.id !== reviewId),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading product data...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Make changes to your product information, images, and settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => window.open(`/products/${id}`, "_blank")}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the basic details of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={product.sku}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={product.salePrice}
                    onChange={(e) => setProduct({ ...product, salePrice: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={product.category}
                    onValueChange={(value) => setProduct({ ...product, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="herbs">Herbs</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Control the visibility and featured status of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this product visible on your store.</p>
                </div>
                <Switch
                  id="published"
                  checked={product.published}
                  onCheckedChange={(checked) => setProduct({ ...product, published: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-sm text-muted-foreground">Show this product in featured sections.</p>
                </div>
                <Switch
                  id="featured"
                  checked={product.featured}
                  onCheckedChange={(checked) => setProduct({ ...product, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Manage the images for your product. The primary image will be displayed first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Image src={image.url || "/placeholder.svg"} alt="Product image" fill className="object-cover" />
                      {image.primary && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="default">Primary</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimaryImage(image.id)}
                        disabled={image.primary}
                      >
                        {image.primary ? "Primary" : "Set as Primary"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveImage(image.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Upload new image placeholder */}
                <div className="border border-dashed rounded-lg overflow-hidden">
                  <div className="aspect-square flex flex-col items-center justify-center p-6 text-center">
                    <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Add Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload a new product image</p>
                    <Button variant="secondary" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Facts</CardTitle>
              <CardDescription>Add nutritional information for your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={product.nutrition.calories}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: {
                          ...product.nutrition,
                          calories: Number.parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={product.nutrition.protein}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: {
                          ...product.nutrition,
                          protein: Number.parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={product.nutrition.carbs}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: {
                          ...product.nutrition,
                          carbs: Number.parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={product.nutrition.fat}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: {
                          ...product.nutrition,
                          fat: Number.parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.1"
                  value={product.nutrition.fiber}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      nutrition: {
                        ...product.nutrition,
                        fiber: Number.parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Vitamins & Minerals</Label>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% Daily Value</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.nutrition.vitamins.map((vitamin, index) => (
                      <TableRow key={index}>
                        <TableCell>{vitamin.name}</TableCell>
                        <TableCell>{vitamin.amount}</TableCell>
                        <TableCell>{vitamin.daily}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveVitamin(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vitaminName">Name</Label>
                    <Input
                      id="vitaminName"
                      value={newVitamin.name}
                      onChange={(e) => setNewVitamin({ ...newVitamin, name: e.target.value })}
                      placeholder="e.g., Vitamin C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitaminAmount">Amount</Label>
                    <Input
                      id="vitaminAmount"
                      value={newVitamin.amount}
                      onChange={(e) => setNewVitamin({ ...newVitamin, amount: e.target.value })}
                      placeholder="e.g., 90mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitaminDaily">% Daily Value</Label>
                    <Input
                      id="vitaminDaily"
                      value={newVitamin.daily}
                      onChange={(e) => setNewVitamin({ ...newVitamin, daily: e.target.value })}
                      placeholder="e.g., 100%"
                    />
                  </div>
                </div>
                <Button onClick={handleAddVitamin} size="sm">
                  Add Vitamin/Mineral
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Reviews</CardTitle>
              <CardDescription>Manage customer reviews for this product.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Badge variant={review.approved ? "success" : "secondary"}>
                          {review.approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!review.approved && (
                            <Button variant="outline" size="sm" onClick={() => handleApproveReview(review.id)}>
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          {review.approved && (
                            <Button variant="outline" size="sm" onClick={() => handleRejectReview(review.id)}>
                              <X className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this review? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Policies</CardTitle>
              <CardDescription>Set specific policies for this product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  rows={3}
                  value={product.policies.return}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      policies: {
                        ...product.policies,
                        return: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe the return policy for this product..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                <Textarea
                  id="shippingPolicy"
                  rows={3}
                  value={product.policies.shipping}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      policies: {
                        ...product.policies,
                        shipping: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe the shipping policy for this product..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  rows={3}
                  value={product.policies.availability}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      policies: {
                        ...product.policies,
                        availability: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe the availability of this product..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
