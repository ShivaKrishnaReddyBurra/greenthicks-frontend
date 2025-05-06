"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Package, Tag, BarChart } from "lucide-react"
import { getProductById, deleteProduct } from "@/lib/api"
import { use } from "react" // Import React's use

export default function AdminProductDetail({ params }) {
  const router = useRouter()
  const { id } = use(params) // Unwrap params with React.use()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id)
        if (!productData) {
          throw new Error("Product not found")
        }
        setProduct(productData)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteProduct(id)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete product. Please try again.")
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error || "Product not found"}</p>
        <Link href="/admin/products" className="text-primary hover:underline mt-2 inline-block">
          Back to Products
        </Link>
      </div>
    )
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

      {/* Product Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{product.name}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/admin/products/edit/${product.globalId}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors"
          >
            <Edit size={18} className="mr-2" />
            Edit Product
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-4">
            <div className="aspect-square relative rounded-md overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href={`/admin/products/edit/${product.globalId}`}
                className="w-full bg-muted hover:bg-muted/80 text-center py-2 rounded-md block"
              >
                Change Images
              </Link>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Product Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Product ID</p>
                    <p className="font-medium">{product.globalId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">₹{product.price.toFixed(2)}</p>
                  </div>
                  {product.discount > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Discount</p>
                      <p className="font-medium">{product.discount}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <div className="flex items-center">
                      <p className="font-medium">
                        {product.stock} {product.unit}
                      </p>
                      {product.stock <= 10 && (
                        <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unit</p>
                    <p className="font-medium">{product.unit}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h2 className="text-lg font-semibold mb-4">Product Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.featured && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Featured</span>
                )}
                {product.bestseller && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Bestseller</span>
                )}
                {product.new && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">New Arrival</span>
                )}
                {product.seasonal && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Seasonal</span>
                )}
                {product.discount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {product.discount}% Off
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href={`/admin/products/edit/${product.globalId}`}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center flex flex-col items-center"
              >
                <Edit size={24} className="mb-2" />
                <span>Edit Product</span>
              </Link>
              <Link
                href={`/products/${product.globalId}`}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center flex flex-col items-center"
              >
                <Package size={24} className="mb-2" />
                <span>View in Store</span>
              </Link>
              <button
                onClick={() => alert("Inventory updated")}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center flex flex-col items-center"
              >
                <Tag size={24} className="mb-2" />
                <span>Update Stock</span>
              </button>
              <Link
                href={`/admin/analytics/products/${product.globalId}`}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center flex flex-col items-center"
              >
                <BarChart size={24} className="mb-2" />
                <span>View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Product</h3>
            <p className="mb-6">
              Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}