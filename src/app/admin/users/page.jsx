"use client"

import { useState, useEffect } from "react"
import { Search, Filter, UserPlus, Edit, Trash2, Eye } from "lucide-react"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate fetching users
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample users data
        const usersData = [
          {
            id: "USR-001",
            name: "John Doe",
            email: "john@example.com",
            phone: "+91 9876543210",
            location: "Hyderabad",
            totalOrders: 12,
            totalSpent: 8500,
            status: "active",
            joinedDate: "2023-01-15",
          },
          {
            id: "USR-002",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+91 9876543211",
            location: "Warangal",
            totalOrders: 8,
            totalSpent: 6200,
            status: "active",
            joinedDate: "2023-02-10",
          },
          {
            id: "USR-003",
            name: "Robert Johnson",
            email: "robert@example.com",
            phone: "+91 9876543212",
            location: "Hyderabad",
            totalOrders: 15,
            totalSpent: 12000,
            status: "active",
            joinedDate: "2023-01-05",
          },
          {
            id: "USR-004",
            name: "Emily Davis",
            email: "emily@example.com",
            phone: "+91 9876543213",
            location: "Warangal",
            totalOrders: 5,
            totalSpent: 3800,
            status: "inactive",
            joinedDate: "2023-03-20",
          },
          {
            id: "USR-005",
            name: "Michael Brown",
            email: "michael@example.com",
            phone: "+91 9876543214",
            location: "Hyderabad",
            totalOrders: 10,
            totalSpent: 7500,
            status: "active",
            joinedDate: "2023-02-15",
          },
        ]

        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // In a real app, this would be an API call
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "active") return matchesSearch && user.status === "active"
    if (filter === "inactive") return matchesSearch && user.status === "inactive"

    return matchesSearch
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">User Management</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center">
          <UserPlus size={20} className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-muted-foreground" />
            <select
              className="border rounded-md bg-background px-3 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Total Spent</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.location}</td>
                    <td className="py-3 px-4">{user.totalOrders}</td>
                    <td className="py-3 px-4">₹{user.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <a
                          href={`/admin/users/${user.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                          title="View User"
                        >
                          <Eye size={18} />
                        </a>
                        <a
                          href={`/admin/users/edit/${user.id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </a>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
