"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, X, ArrowLeft, Save } from "lucide-react"
import { createProduct } from "@/lib/api"

export default function AddProduct() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    unit: "",
    featured: false,
    bestseller: false,
    new: false,
    seasonal: false,
    discount: 0,
  })

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      setError("You can upload a maximum of 5 images")
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    const previews = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(previews).then((results) => {
      setImagePreviews([...imagePreviews, ...results])
    })
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (
        !formData.name ||
        !formData.price ||
        !formData.stock ||
        !formData.category ||
        !formData.description ||
        !formData.unit ||
        images.length === 0
      ) {
        throw new Error("Please fill all required fields and upload at least one image")
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : 0,
      }

      await createProduct(productData, images)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
      setError("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["leafy", "fruit", "root", "herbs"]

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link href="/admin/products" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Add New Product</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-muted-foreground mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-muted-foreground mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-muted-foreground mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-muted-foreground mb-1">
                Unit *
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Image Upload and Tags */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Images & Tags</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Product Images (up to 5) <span className="text-red-500">*</span>
            </label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-full h-24 border rounded-md overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
              <Upload size={48} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Click or drag to upload images</p>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="images"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
              >
                Select Images
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm">
                Featured
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bestseller"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="bestseller" className="text-sm">
                Bestseller
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new"
                name="new"
                checked={formData.new}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="new" className="text-sm">
                New Arrival
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="seasonal"
                name="seasonal"
                checked={formData.seasonal}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="seasonal" className="text-sm">
                Seasonal
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 pt-6 border-t flex justify-end gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 border rounded-md hover:bg-muted transition-colors flex items-center"
          >
            <X size={18} className="mr-2" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            <Save size={18} className="mr-2" />
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
