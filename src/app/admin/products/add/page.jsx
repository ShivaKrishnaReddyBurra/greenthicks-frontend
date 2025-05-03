"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X } from "lucide-react"

export default function AddProduct() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    unit: "kg",
    featured: false,
    bestseller: false,
    new: false,
    seasonal: false,
    discount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to products page
      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
      setError("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
                <option value="vegetables">Vegetables</option>
                <option value="fruit">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="leafy">Leafy Greens</option>
                <option value="root">Root Vegetables</option>
                <option value="herbs">Herbs</option>
                <option value="organic">Organic Products</option>
                <option value="seasonal">Seasonal Items</option>
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

            <div className="grid grid-cols-2 gap-4">
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
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="piece">Piece</option>
                  <option value="bundle">Bundle</option>
                  <option value="dozen">Dozen</option>
                  <option value="liter">Liter</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tags */}
        <div className="mt-6 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Product Tags</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                Featured Product
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

        {/* Image Upload - Placeholder */}
        <div className="mt-6 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <p className="text-muted-foreground">Drag and drop an image here, or click to select a file</p>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md"
              onClick={() => alert("Image upload functionality would be implemented here")}
            >
              Select Image
            </button>
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
