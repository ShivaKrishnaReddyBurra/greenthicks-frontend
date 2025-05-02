"use client"

import { useState, useEffect } from "react"
import { MapPin, Truck, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function DeliveryManagement() {
  const [orders, setOrders] = useState([])
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)

  useEffect(() => {
    // Simulate fetching orders and delivery partners
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample orders data
        const ordersData = [
          {
            id: "ORD-1234",
            customer: "John Doe",
            address: "123 Main St, Hyderabad, 500001",
            items: 5,
            total: 1250,
            status: "pending",
            date: "2023-05-01",
            assignedTo: null,
          },
          {
            id: "ORD-1235",
            customer: "Jane Smith",
            address: "456 Oak St, Hyderabad, 500002",
            items: 3,
            total: 850,
            status: "assigned",
            date: "2023-05-01",
            assignedTo: "DEL-001",
          },
          {
            id: "ORD-1236",
            customer: "Robert Johnson",
            address: "789 Pine St, Warangal, 506001",
            items: 7,
            total: 2100,
            status: "in_transit",
            date: "2023-05-01",
            assignedTo: "DEL-004",
          },
          {
            id: "ORD-1237",
            customer: "Emily Davis",
            address: "101 Elm St, Hyderabad, 500003",
            items: 2,
            total: 750,
            status: "delivered",
            date: "2023-05-01",
            assignedTo: "DEL-002",
          },
          {
            id: "ORD-1238",
            customer: "Michael Brown",
            address: "202 Cedar St, Warangal, 506002",
            items: 4,
            total: 1500,
            status: "pending",
            date: "2023-05-01",
            assignedTo: null,
          },
        ]

        // Sample delivery partners data
        const partnersData = [
          { id: "DEL-001", name: "Raj Kumar", location: "Hyderabad", status: "active", ordersDelivered: 152 },
          { id: "DEL-002", name: "Priya Singh", location: "Hyderabad", status: "active", ordersDelivered: 98 },
          { id: "DEL-003", name: "Amit Patel", location: "Hyderabad", status: "inactive", ordersDelivered: 67 },
          { id: "DEL-004", name: "Sneha Reddy", location: "Warangal", status: "active", ordersDelivered: 124 },
          { id: "DEL-005", name: "Vikram Sharma", location: "Warangal", status: "active", ordersDelivered: 89 },
          { id: "DEL-006", name: "Deepa Nair", location: "Hyderabad", status: "active", ordersDelivered: 45 },
          { id: "DEL-007", name: "Karthik Rao", location: "Hyderabad", status: "active", ordersDelivered: 76 },
          { id: "DEL-008", name: "Meena Gupta", location: "Warangal", status: "active", ordersDelivered: 112 },
          { id: "DEL-009", name: "Suresh Menon", location: "Hyderabad", status: "active", ordersDelivered: 34 },
        ]

        setOrders(ordersData)
        setPartners(partnersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const openAssignModal = (order) => {
    setSelectedOrder(order)
    setAssignModalOpen(true)
  }

  const closeAssignModal = () => {
    setAssignModalOpen(false)
    setSelectedOrder(null)
  }

  const assignDeliveryPartner = (partnerId) => {
    if (selectedOrder) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? { ...order, assignedTo: partnerId, status: "assigned" } : order,
        ),
      )
      closeAssignModal()
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        )
      case "assigned":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <Truck size={14} className="mr-1" />
            Assigned
          </span>
        )
      case "in_transit":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            <Truck size={14} className="mr-1" />
            In Transit
          </span>
        )
      case "delivered":
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Delivered
          </span>
        )
      default:
        return (
          <span className="flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            <AlertTriangle size={14} className="mr-1" />
            Unknown
          </span>
        )
    }
  }

  const getPartnerById = (id) => {
    return partners.find((partner) => partner.id === id) || null
  }

  const getPartnersCountByLocation = () => {
    const counts = {}
    partners.forEach((partner) => {
      if (partner.status === "active") {
        counts[partner.location] = (counts[partner.location] || 0) + 1
      }
    })
    return counts
  }

  const locationCounts = getPartnersCountByLocation()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Delivery Management</h1>

      {/* Delivery Partners Summary */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Delivery Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(locationCounts).map(([location, count]) => (
            <div key={location} className="bg-muted/50 rounded-lg p-4 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{location}</p>
                <p className="text-2xl font-bold">{count} Partners</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Delivery Orders</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Address</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Delivery Partner</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const partner = order.assignedTo ? getPartnerById(order.assignedTo) : null

                  return (
                    <tr key={order.id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.address}</td>
                      <td className="py-3 px-4">{order.items}</td>
                      <td className="py-3 px-4">₹{order.total}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">
                        {partner ? (
                          <div>
                            <p>{partner.name}</p>
                            <p className="text-xs text-muted-foreground">{partner.id}</p>
                          </div>
                        ) : (
                          <span className="text-amber-500">Not assigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {order.status === "pending" || order.status === "assigned" ? (
                          <button onClick={() => openAssignModal(order)} className="text-primary hover:underline">
                            {order.assignedTo ? "Reassign" : "Assign"}
                          </button>
                        ) : (
                          <a href={`/admin/delivery/orders/${order.id}`} className="text-primary hover:underline">
                            View
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delivery Partners Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Delivery Partners</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center">
            <p>No delivery partners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Orders Delivered</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4">{partner.id}</td>
                    <td className="py-3 px-4">{partner.name}</td>
                    <td className="py-3 px-4">{partner.location}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          partner.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {partner.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{partner.ordersDelivered}</td>
                    <td className="py-3 px-4">
                      <a href={`/admin/delivery/partners/${partner.id}`} className="text-primary hover:underline">
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Delivery Partner Modal */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Assign Delivery Partner</h3>
            <p className="mb-4">
              <span className="font-semibold">Order:</span> {selectedOrder.id} - {selectedOrder.customer}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Delivery Address:</span> {selectedOrder.address}
            </p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Select a delivery partner:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {partners
                  .filter((partner) => partner.status === "active")
                  .map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => assignDeliveryPartner(partner.id)}
                      className="w-full text-left p-3 border rounded-md hover:bg-muted/50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.id} - {partner.location}
                        </p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {partner.ordersDelivered} orders
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeAssignModal}
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
