"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

export default function AddProduct() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    discount: "",
    category: "",
    description: "",
    featured: false,
    bestseller: false,
    new: false,
    seasonal: false,
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
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
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.price ||
        !formData.stock ||
        !formData.category ||
        !formData.description ||
        !image
      ) {
        throw new Error("Please fill all required fields and upload an image")
      }

      // In a real app, this would be an API call to save the product
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to products page
      router.push("/admin/products")
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Bakery",
    "Meat",
    "Seafood",
    "Snacks",
    "Beverages",
    "Organic",
    "Gluten-free",
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <button onClick={() => router.back()} className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
          Cancel
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="discount" className="block text-sm font-medium mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                min="0"
                max="100"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              {imagePreview ? (
                <div className="relative w-full h-64 border rounded-md overflow-hidden">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click or drag to upload image</p>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="image"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Product Tags</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    className="mr-2"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label htmlFor="featured">Featured Product</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bestseller"
                    name="bestseller"
                    className="mr-2"
                    checked={formData.bestseller}
                    onChange={handleChange}
                  />
                  <label htmlFor="bestseller">Bestseller</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="new"
                    name="new"
                    className="mr-2"
                    checked={formData.new}
                    onChange={handleChange}
                  />
                  <label htmlFor="new">New Arrival</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="seasonal"
                    name="seasonal"
                    className="mr-2"
                    checked={formData.seasonal}
                    onChange={handleChange}
                  />
                  <label htmlFor="seasonal">Seasonal</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="w-full p-2 border rounded-md bg-background"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
