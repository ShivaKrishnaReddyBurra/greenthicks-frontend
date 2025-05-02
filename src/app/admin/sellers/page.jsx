"use client"

import { useState, useEffect } from "react"
import { Search, Filter, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function SellerManagement() {
  const [sellers, setSellers] = useState([])
  const [pendingProducts, setPendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("sellers")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate fetching sellers and pending products
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample sellers data
        const sellersData = [
          {
            id: "SEL-001",
            name: "Organic Farms Ltd",
            owner: "Rahul Sharma",
            email: "rahul@organicfarms.com",
            phone: "+91 9876543210",
            location: "Hyderabad",
            productsListed: 24,
            totalSales: 156000,
            status: "active",
            joinedDate: "2023-01-15",
          },
          {
            id: "SEL-002",
            name: "Fresh Harvest Co.",
            owner: "Priya Patel",
            email: "priya@freshharvest.com",
            phone: "+91 9876543211",
            location: "Warangal",
            productsListed: 18,
            totalSales: 98000,
            status: "active",
            joinedDate: "2023-02-10",
          },
          {
            id: "SEL-003",
            name: "Nature's Basket",
            owner: "Vikram Reddy",
            email: "vikram@naturesbasket.com",
            phone: "+91 9876543212",
            location: "Hyderabad",
            productsListed: 32,
            totalSales: 215000,
            status: "active",
            joinedDate: "2023-01-05",
          },
          {
            id: "SEL-004",
            name: "Green Valley Produce",
            owner: "Anita Singh",
            email: "anita@greenvalley.com",
            phone: "+91 9876543213",
            location: "Warangal",
            productsListed: 15,
            totalSales: 78000,
            status: "pending",
            joinedDate: "2023-04-20",
          },
          {
            id: "SEL-005",
            name: "Farm Fresh Organics",
            owner: "Suresh Kumar",
            email: "suresh@farmfresh.com",
            phone: "+91 9876543214",
            location: "Hyderabad",
            productsListed: 0,
            totalSales: 0,
            status: "pending",
            joinedDate: "2023-05-01",
          },
        ]

        // Sample pending products data
        const pendingProductsData = [
          {
            id: "PROD-101",
            name: "Organic Tomatoes",
            sellerId: "SEL-001",
            sellerName: "Organic Farms Ltd",
            price: 60,
            suggestedPrice: 65,
            stock: 100,
            category: "Vegetables",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-102",
            name: "Fresh Spinach Bundle",
            sellerId: "SEL-002",
            sellerName: "Fresh Harvest Co.",
            price: 40,
            suggestedPrice: 45,
            stock: 50,
            category: "Vegetables",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-103",
            name: "Organic Apples",
            sellerId: "SEL-003",
            sellerName: "Nature's Basket",
            price: 120,
            suggestedPrice: 130,
            stock: 75,
            category: "Fruits",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-104",
            name: "Farm Fresh Eggs",
            sellerId: "SEL-001",
            sellerName: "Organic Farms Ltd",
            price: 80,
            suggestedPrice: 85,
            stock: 200,
            category: "Dairy",
            submittedDate: "2023-05-01",
          },
          {
            id: "PROD-105",
            name: "Organic Honey",
            sellerId: "SEL-002",
            sellerName: "Fresh Harvest Co.",
            price: 250,
            suggestedPrice: 275,
            stock: 30,
            category: "Organic",
            submittedDate: "2023-05-01",
          },
        ]

        setSellers(sellersData)
        setPendingProducts(pendingProductsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const approveProduct = (productId) => {
    // In a real app, this would be an API call
    setPendingProducts(pendingProducts.filter((product) => product.id !== productId))
  }

  const rejectProduct = (productId) => {
    // In a real app, this would be an API call
    setPendingProducts(pendingProducts.filter((product) => product.id !== productId))
  }

  const approveSeller = (sellerId) => {
    // In a real app, this would be an API call
    setSellers(sellers.map((seller) => (seller.id === sellerId ? { ...seller, status: "active" } : seller)))
  }

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "active") return matchesSearch && seller.status === "active"
    if (filter === "pending") return matchesSearch && seller.status === "pending"

    return matchesSearch
  })

  const filteredProducts = pendingProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seller Management</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "sellers"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("sellers")}
        >
          Sellers
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pending-products"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("pending-products")}
        >
          Pending Products
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder={activeTab === "sellers" ? "Search sellers..." : "Search products..."}
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "sellers" && (
            <div className="flex items-center">
              <Filter size={18} className="mr-2 text-muted-foreground" />
              <select
                className="border rounded-md bg-background px-3 py-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Sellers</option>
                <option value="active">Active Sellers</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "sellers" ? (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Loading sellers...</p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="p-8 text-center">
              <p>No sellers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Owner</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Products</th>
                    <th className="text-left py-3 px-4">Total Sales</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4">{seller.id}</td>
                      <td className="py-3 px-4">{seller.name}</td>
                      <td className="py-3 px-4">{seller.owner}</td>
                      <td className="py-3 px-4">{seller.location}</td>
                      <td className="py-3 px-4">{seller.productsListed}</td>
                      <td className="py-3 px-4">₹{seller.totalSales.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            seller.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {seller.status === "active" ? "Active" : "Pending Approval"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {seller.status === "pending" ? (
                          <button onClick={() => approveSeller(seller.id)} className="text-primary hover:underline">
                            Approve
                          </button>
                        ) : (
                          <a href={`/admin/sellers/${seller.id}`} className="text-primary hover:underline">
                            View Details
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p>No pending products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Product Name</th>
                    <th className="text-left py-3 px-4">Seller</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price (₹)</th>
                    <th className="text-left py-3 px-4">Suggested Price (₹)</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4">{product.id}</td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{product.sellerName}</p>
                          <p className="text-xs text-muted-foreground">{product.sellerId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">₹{product.price}</td>
                      <td className="py-3 px-4">₹{product.suggestedPrice}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
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
                          <a
                            href={`/admin/sellers/products/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="Edit Product"
                          >
                            <AlertTriangle size={18} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
