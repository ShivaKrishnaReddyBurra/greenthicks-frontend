"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function SellerDetails({ params }) {
  const { id } = params
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("products")

  useEffect(() => {
    // Simulate fetching seller details
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample seller data
        const sellerData = {
          id: id,
          name: "Organic Farms Ltd",
          owner: "Rahul Sharma",
          email: "rahul@organicfarms.com",
          phone: "+91 9876543210",
          location: "Hyderabad",
          productsListed: 24,
          totalSales: 156000,
          status: "active",
          joinedDate: "2023-01-15",
          description:
            "Organic Farms Ltd is a leading supplier of organic produce in Hyderabad. We grow all our products using sustainable farming practices without the use of harmful pesticides or chemicals.",
          website: "https://organicfarms.com",
          bankDetails: {
            accountName: "Organic Farms Ltd",
            accountNumber: "XXXX XXXX XXXX 1234",
            bankName: "State Bank of India",
            ifscCode: "SBIN0001234",
          },
        }

        // Sample products data
        const productsData = [
          {
            id: "1",
            name: "Organic Tomatoes",
            price: 60,
            stock: 100,
            category: "Vegetables",
            image: "/placeholder.svg?height=200&width=200",
            status: "approved",
            submittedDate: "2023-05-01",
          },
          {
            id: "6",
            name: "Farm Fresh Eggs",
            price: 80,
            stock: 200,
            category: "Dairy",
            image: "/placeholder.svg?height=200&width=200",
            status: "approved",
            submittedDate: "2023-05-01",
          },
          {
            id: "9",
            name: "Organic Broccoli",
            price: 70,
            stock: 50,
            category: "Vegetables",
            image: "/placeholder.svg?height=200&width=200",
            status: "pending",
            submittedDate: "2023-05-02",
          },
          {
            id: "2",
            name: "Fresh Milk",
            price: 60,
            stock: 100,
            category: "Dairy",
            image: "/placeholder.svg?height=200&width=200",
            status: "pending",
            submittedDate: "2023-05-03",
          },
        ]

        setSeller(sellerData)
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching seller data:", error)
        setError("Failed to load seller data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const approveProduct = (productId) => {
    // In a real app, this would be an API call
    setProducts(products.map((product) => (product.id === productId ? { ...product, status: "approved" } : product)))
  }

  const rejectProduct = (productId) => {
    // In a real app, this would be an API call
    setProducts(products.map((product) => (product.id === productId ? { ...product, status: "rejected" } : product)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error || "Seller not found"}</p>
        <Link href="/admin/sellers" className="text-primary hover:underline mt-2 inline-block">
          Back to Sellers
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link href="/admin/sellers" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Back to Sellers
        </Link>
      </div>

      {/* Seller Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                seller.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {seller.status === "active" ? "Active" : "Pending Approval"}
            </span>
            <span className="mx-2">•</span>
            <span className="text-muted-foreground">Seller ID: {seller.id}</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link
            href={`/admin/sellers/edit/${seller.id}`}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Edit Seller
          </Link>
          <button
            onClick={() => alert("Contact seller functionality would be implemented here")}
            className="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md"
          >
            Contact Seller
          </button>
        </div>
      </div>

      {/* Seller Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seller Information */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Seller Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Store size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{seller.name}</p>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                </div>
              </div>
              <div className="flex items-start">
                <User size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{seller.owner}</p>
                  <p className="text-sm text-muted-foreground">Owner</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{seller.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{seller.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{seller.location}</p>
                  <p className="text-sm text-muted-foreground">Location</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{seller.joinedDate}</p>
                  <p className="text-sm text-muted-foreground">Joined Date</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Business Details</h2>
            <p className="mb-4">{seller.description}</p>
            {seller.website && (
              <a
                href={seller.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {seller.website}
              </a>
            )}
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="font-medium">{seller.bankDetails.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium">{seller.bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-medium">{seller.bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IFSC Code</p>
                <p className="font-medium">{seller.bankDetails.ifscCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Stats and Products */}
        <div className="lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Package size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products Listed</p>
                  <p className="text-2xl font-bold">{seller.productsListed}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <DollarSign size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">₹{seller.totalSales.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Calendar size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-2xl font-bold">{new Date(seller.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
              <button
                className={`px-4 py-3 font-medium ${
                  activeTab === "products"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
              <button
                className={`px-4 py-3 font-medium ${
                  activeTab === "orders"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
              <button
                className={`px-4 py-3 font-medium ${
                  activeTab === "payments"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("payments")}
              >
                Payments
              </button>
            </div>

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Seller Products</h3>
                    <Link
                      href={`/admin/sellers/${seller.id}/products/add`}
                      className="text-primary hover:underline text-sm"
                    >
                      Add Product
                    </Link>
                  </div>
                </div>
                <div className="divide-y">
                  {products.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No products found.</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="p-4 flex items-center">
                        <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{product.name}</h3>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                product.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {product.status === "approved"
                                ? "Approved"
                                : product.status === "rejected"
                                  ? "Rejected"
                                  : "Pending"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.category} - ₹{product.price} - Stock: {product.stock}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {product.status === "pending" ? (
                            <>
                              <button
                                onClick={() => approveProduct(product.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                                title="Approve Product"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => rejectProduct(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                title="Reject Product"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                              title="View Product"
                            >
                              <Package size={18} />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">Order history will be displayed here.</p>
                <button
                  onClick={() => alert("This would show the seller's order history")}
                  className="mt-2 text-primary hover:underline"
                >
                  Load Order History
                </button>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">Payment history will be displayed here.</p>
                <button
                  onClick={() => alert("This would show the seller's payment history")}
                  className="mt-2 text-primary hover:underline"
                >
                  Load Payment History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
