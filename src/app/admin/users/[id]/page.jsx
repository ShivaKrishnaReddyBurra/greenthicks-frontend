"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingBag, DollarSign, Calendar, Edit, Trash2 } from "lucide-react"

export default function UserDetails({ params }) {
  const { id } = params
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("orders")
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    // Simulate fetching user details
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample user data
        const userData = {
          id: id,
          name: "John Doe",
          email: "john@example.com",
          phone: "+91 9876543210",
          location: "Hyderabad",
          totalOrders: 12,
          totalSpent: 8500,
          status: "active",
          joinedDate: "2023-01-15",
          address: "123 Main St, Hyderabad, 500001",
          favorites: ["1", "4", "9"],
        }

        // Sample orders data
        const ordersData = [
          {
            id: "ORD-1234",
            date: "2023-05-01",
            items: 3,
            total: 1250,
            status: "delivered",
          },
          {
            id: "ORD-1235",
            date: "2023-04-15",
            items: 2,
            total: 850,
            status: "delivered",
          },
          {
            id: "ORD-1236",
            date: "2023-03-22",
            items: 5,
            total: 2100,
            status: "delivered",
          },
          {
            id: "ORD-1237",
            date: "2023-02-10",
            items: 1,
            total: 750,
            status: "cancelled",
          },
        ]

        setUser(userData)
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDeleteUser = async () => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to users page
      window.location.href = "/admin/users"
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Failed to delete user. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error || "User not found"}</p>
        <Link href="/admin/users" className="text-primary hover:underline mt-2 inline-block">
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link href="/admin/users" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Back to Users
        </Link>
      </div>

      {/* User Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user.status === "active" ? "Active" : "Inactive"}
            </span>
            <span className="mx-2">•</span>
            <span className="text-muted-foreground">User ID: {user.id}</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link
            href={`/admin/users/edit/${user.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors"
          >
            <Edit size={18} className="mr-2" />
            Edit User
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Delete User
          </button>
        </div>
      </div>

      {/* User Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{user.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{user.address}</p>
                  <p className="text-sm text-muted-foreground">Address</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={20} className="mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{user.joinedDate}</p>
                  <p className="text-sm text-muted-foreground">Joined Date</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">User Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <ShoppingBag size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-xl font-bold">{user.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <DollarSign size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-xl font-bold">₹{user.totalSpent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Orders and Favorites */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
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
                  activeTab === "favorites"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("favorites")}
              >
                Favorites
              </button>
              <button
                className={`px-4 py-3 font-medium ${
                  activeTab === "activity"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Order History</h3>
                </div>
                <div className="divide-y">
                  {orders.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No orders found.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="p-4 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{order.id}</h3>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status === "delivered"
                                ? "Delivered"
                                : order.status === "cancelled"
                                  ? "Cancelled"
                                  : "Processing"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.date} - {order.items} items - ₹{order.total}
                          </p>
                        </div>
                        <Link href={`/admin/delivery/orders/${order.id}`} className="text-primary hover:underline">
                          View Details
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">User's favorite products will be displayed here.</p>
                <button
                  onClick={() => alert("This would show the user's favorite products")}
                  className="mt-2 text-primary hover:underline"
                >
                  Load Favorites
                </button>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">User activity log will be displayed here.</p>
                <button
                  onClick={() => alert("This would show the user's activity log")}
                  className="mt-2 text-primary hover:underline"
                >
                  Load Activity Log
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => alert("Email sent to user")}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center"
              >
                Send Email
              </button>
              <button
                onClick={() => alert("User account status toggled")}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center"
              >
                {user.status === "active" ? "Deactivate Account" : "Activate Account"}
              </button>
              <button
                onClick={() => alert("Password reset link sent")}
                className="bg-muted hover:bg-muted/80 p-4 rounded-lg text-center"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete User</h3>
            <p className="mb-6">
              Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
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
