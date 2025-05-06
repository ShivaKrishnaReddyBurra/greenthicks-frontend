"use client"
import { DeliveryLayout } from "@/components/delivery-layout"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react"

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockDeliveries = [
        {
          id: "DEL-1001",
          orderId: "ORD-5678",
          type: "order",
          customer: {
            name: "Rahul Sharma",
            address: "123 Main Street, Bangalore, Karnataka, 560001",
            phone: "+91 9876543210",
          },
          items: [
            { name: "Organic Tomatoes", quantity: 2 },
            { name: "Fresh Spinach", quantity: 1 },
          ],
          amount: 450,
          status: "pending",
          assignedAt: "2023-05-01T10:30:00",
          deliveryTime: "2023-05-01T14:00:00",
          distance: "3.2 km",
          earnings: 60,
        },
        {
          id: "DEL-1002",
          orderId: "ORD-5679",
          type: "order",
          customer: {
            name: "Priya Patel",
            address: "456 Park Avenue, Bangalore, Karnataka, 560002",
            phone: "+91 9876543211",
          },
          items: [
            { name: "Organic Brown Rice", quantity: 1 },
            { name: "Organic Honey", quantity: 1 },
          ],
          amount: 650,
          status: "accepted",
          assignedAt: "2023-05-01T11:15:00",
          deliveryTime: "2023-05-01T15:30:00",
          distance: "4.5 km",
          earnings: 75,
        },
        {
          id: "DEL-1003",
          orderId: "ORD-5680",
          type: "order",
          customer: {
            name: "Amit Kumar",
            address: "789 Lake View, Bangalore, Karnataka, 560003",
            phone: "+91 9876543212",
          },
          items: [
            { name: "Organic Milk", quantity: 2 },
            { name: "Fresh Carrots", quantity: 1 },
          ],
          amount: 320,
          status: "completed",
          assignedAt: "2023-05-01T09:00:00",
          deliveryTime: "2023-05-01T12:45:00",
          distance: "2.8 km",
          earnings: 55,
          completedAt: "2023-05-01T12:30:00",
        },
        {
          id: "DEL-1004",
          orderId: "RET-1001",
          type: "refund",
          customer: {
            name: "Neha Singh",
            address: "101 Green Road, Bangalore, Karnataka, 560004",
            phone: "+91 9876543213",
          },
          items: [{ name: "Cash Refund", quantity: 1 }],
          amount: 760,
          status: "pending",
          assignedAt: "2023-05-01T13:20:00",
          deliveryTime: "2023-05-01T17:00:00",
          distance: "5.1 km",
          earnings: 80,
        },
        {
          id: "DEL-1005",
          orderId: "ORD-5682",
          type: "order",
          customer: {
            name: "Vikram Reddy",
            address: "202 Hill View, Bangalore, Karnataka, 560005",
            phone: "+91 9876543214",
          },
          items: [
            { name: "Organic Apples", quantity: 3 },
            { name: "Fresh Cucumber", quantity: 2 },
          ],
          amount: 480,
          status: "completed",
          assignedAt: "2023-04-30T14:00:00",
          deliveryTime: "2023-04-30T17:30:00",
          distance: "3.7 km",
          earnings: 65,
          completedAt: "2023-04-30T17:15:00",
        },
      ]

      setDeliveries(mockDeliveries)
      setTotalPages(Math.ceil(mockDeliveries.length / 10))
      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Completed
          </span>
        )
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Accepted
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </span>
        )
      case "declined":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Declined
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-green-500" />
      case "refund":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const handleAcceptDelivery = (id) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) => (delivery.id === id ? { ...delivery, status: "accepted" } : delivery)),
    )
    setNotificationType("success")
    setNotificationMessage("Delivery accepted successfully!")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleDeclineDelivery = (id) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) => (delivery.id === id ? { ...delivery, status: "declined" } : delivery)),
    )
    setNotificationType("info")
    setNotificationMessage("Delivery declined")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleCompleteDelivery = (id) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "completed", completedAt: new Date().toISOString() } : delivery,
      ),
    )
    setNotificationType("success")
    setNotificationMessage("Delivery marked as completed!")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || delivery.status === filterStatus
    const matchesType = filterType === "all" || delivery.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <DeliveryLayout>
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notificationType === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              : notificationType === "info"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
          }`}
        >
          {notificationMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">My Deliveries</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search deliveries..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="refund">Refunds</option>
            </select>
          </div>

          <div className="text-right text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
            {filteredDeliveries.length} deliveries found
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No deliveries found matching your filters.</p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(delivery.type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {delivery.type === "order" ? "Order" : "Refund"} #{delivery.orderId}
                        </h3>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Delivery ID: {delivery.id}</p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(delivery.amount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Earnings: {formatCurrency(delivery.earnings)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</h4>
                    <p className="text-gray-800 dark:text-white">{delivery.customer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.customer.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Address</h4>
                    <p className="text-gray-800 dark:text-white flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-1 flex-shrink-0" />
                      <span>{delivery.customer.address}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Distance: {delivery.distance}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Items</h4>
                  <ul className="text-gray-800 dark:text-white">
                    {delivery.items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-6 text-center">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {delivery.status === "completed" ? (
                      <span>Completed on {formatDate(delivery.completedAt)}</span>
                    ) : (
                      <span>Expected delivery by {formatDate(delivery.deliveryTime)}</span>
                    )}
                  </div>

                  <div className="mt-3 md:mt-0 flex space-x-2">
                    {delivery.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAcceptDelivery(delivery.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineDelivery(delivery.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </button>
                      </>
                    )}
                    {delivery.status === "accepted" && (
                      <button
                        onClick={() => handleCompleteDelivery(delivery.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Completed
                      </button>
                    )}
                    <Link
                      href={`/delivery/my_deliveries/${delivery.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredDeliveries.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredDeliveries.length}</span> of{" "}
            <span className="font-medium">{filteredDeliveries.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
    </DeliveryLayout>
  )
}
