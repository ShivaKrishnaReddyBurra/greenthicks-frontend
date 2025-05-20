"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, Trash2, Upload, X, ArrowLeft, ImagePlus, Eye } from "lucide-react"
import { getProductById, updateProduct } from "@/lib/api"

export default function EditProduct({ params }) {
  const router = useRouter()
  const { id } = use(params)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    discount: "",
    category: "",
    description: "",
    unit: "",
    featured: false,
    bestseller: false,
    new: false,
    seasonal: false,
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (id === "[id]") {
      setFormData({
        name: "Sample Product",
        price: "100",
        stock: "50",
        discount: "10",
        category: "Vegetables",
        description: "This is a sample product description for preview mode.",
        unit: "kg",
        featured: true,
        bestseller: false,
        new: true,
        seasonal: false,
      })
      setImagePreviews([{ url: "/placeholder.svg?height=300&width=300", primary: true }])
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const product = await getProductById(id)
        if (!product) {
          throw new Error("Product not found")
        }

        setFormData({
          name: product.name,
          price: product.price.toString(),
          stock: product.stock.toString(),
          discount: product.discount ? product.discount.toString() : "0",
          category: product.category,
          description: product.description || "",
          unit: product.unit || "",
          featured: product.featured || false,
          bestseller: product.bestseller || false,
          new: product.new || false,
          seasonal: product.seasonal || false,
        })

        const formattedImages = product.images.map((img, index) => ({
          url: typeof img === "string" ? img : img.url,
          primary: typeof img === "object" ? img.primary : index === 0,
        }))
        setImagePreviews(formattedImages)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const maxSize = 3 * 1024 * 1024 // 3MB in bytes

    // Check for file size
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setError("⚠ Some images exceed 3MB. Please upload images smaller than 3MB.")
      return
    }

    if (images.length + files.length > 6) {
      setError("You can upload a maximum of 6 images")
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    const previews = files.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve({
          url: reader.result,
          primary: imagePreviews.length === 0 && index === 0,
        })
        reader.readAsDataURL(file)
      })
    })

    Promise.all(previews).then((results) => {
      setImagePreviews([...imagePreviews, ...results])
    })
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    if (imagePreviews[index].primary && newPreviews.length > 0) {
      newPreviews[0].primary = true
    }
    
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSetPrimaryImage = (index) => {
    setImagePreviews(
      imagePreviews.map((img, i) => ({
        ...img,
        primary: i === index,
      }))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      if (
        !formData.name ||
        !formData.price ||
        !formData.stock ||
        !formData.category ||
        !formData.description ||
        !formData.unit
      ) {
        throw new Error("Please fill all required fields")
      }

      if (imagePreviews.length === 0 && images.length === 0) {
        throw new Error("At least one product image is required")
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : 0,
        images: imagePreviews,
      }

      await updateProduct(id, productData, images)
      router.push("/admin/products")
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const categories = ["leafy", "fruit", "root", "herbs", "milk", "pulses", "grains", "spices", "nuts", "oils", "snacks", "beverages"]

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

  if (error && !formData.name) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">{error}</p>
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
          <Button onClick={handleSubmit} disabled={saving}>
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

      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
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
                  <Label htmlFor="name">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">
                    Unit <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Stock Quantity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                   empresa
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Tags</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bestseller"
                        name="bestseller"
                        checked={formData.bestseller}
                        onCheckedChange={(checked) => setFormData({ ...formData, bestseller: checked })}
                      />
                      <Label htmlFor="bestseller">Bestseller</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new"
                        name="new"
                        checked={formData.new}
                        onCheckedChange={(checked) => setFormData({ ...formData, new: checked })}
                      />
                      <Label htmlFor="new">New Arrival</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="seasonal"
                        name="seasonal"
                        checked={formData.seasonal}
                        onCheckedChange={(checked) => setFormData({ ...formData, seasonal: checked })}
                      />
                      <Label htmlFor="seasonal">Seasonal</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Manage the images for your product. The primary image will be displayed first. Maximum file size: 3MB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                      {preview.primary && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="default">Primary</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimaryImage(index)}
                        disabled={preview.primary}
                      >
                        {preview.primary ? "Primary" : "Set as Primary"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
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
                    <p className="text-sm text-muted-foreground mb-4">Upload a new product image (up to 6, max 3MB)</p>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                    >
                      <label htmlFor="images">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}