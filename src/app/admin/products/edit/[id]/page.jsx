"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

import { getProductById, updateProduct } from "@/lib/api"
import { use } from "react" // Import React's use


export default function EditProduct({ params }) {
  const router = useRouter()
  const { id } = use(params) // Unwrap params with React.use()

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

  useEffect(() => {
    // Check if we're in preview mode with the literal [id] parameter
    if (id === "[id]") {
      // Use a default product for preview
      setFormData({
        name: "Sample Product",
        price: "100",
        stock: "50",
        discount: "10",
        category: "Vegetables",
        description: "This is a sample product description for preview mode.",
        featured: true,
        bestseller: false,
        new: true,
        seasonal: false,
      })
      setImagePreview("/placeholder.svg?height=300&width=300")
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

        setImagePreviews(product.images || [])
      } catch (error) {
        console.error("Error fetching product:", error)
        setErrorotiation
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
    setSaving(true)
    setError("")

    try {
      // Validate form
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

  const categories = ["leafy", "fruit", "root", "herbs"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
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
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="unit" className="block text-sm font-medium mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Product Images (up to 5) <span className="text-red-500">*</span>
              </label>

              {imagePreviews.length > 0 ? (
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
              ) : null}
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
                <Upload size={48} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click or drag to upload new images</p>
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
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}