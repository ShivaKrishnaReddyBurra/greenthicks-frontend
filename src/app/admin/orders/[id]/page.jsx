"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Truck,
  Package,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Mail,
  User,
  Calendar,
  CreditCard,
  XCircle,
} from "lucide-react"
import { getOrder, getUserProfile, fetchWithAuth, cancelOrder } from "@/lib/api"

export default function OrderDetails() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const print = searchParams.get('print') === 'true'

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      setError(null)
      try {
        const userProfile = await getUserProfile()
        setIsAdmin(userProfile.isAdmin)
        setUser(userProfile)

        const orderData = await getOrder(params.id)
        setOrder(orderData)

        if (print) {
          window.open(`/api/invoices/${params.id}`, '_blank')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, print])

  const updateOrderStatus = async () => {
    if (!isAdmin || !newStatus) return
    try {
      const response = await fetchWithAuth(`/api/orders/${params.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      })
      setOrder(response.order)
      setNewStatus("")
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancelOrder = async () => {
    if (isAdmin || !order || !['processing', 'pending'].includes(order.status)) return
    try {
      const response = await cancelOrder(params.id)
      setOrder(response.order)
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 sm:w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded mt-4 sm:mt-6"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mt-4 sm:mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error || "Order Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
            {error
              ? "An error occurred while fetching the order."
              : "The order you are looking for does not exist or has been removed."}
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const timeline = [
    {
      status: "Order Placed",
      date: order.orderDate,
      description: `Order #${order.id} was placed successfully`,
    },
    ...(order.paymentStatus === "completed"
      ? [
          {
            status: "Payment Confirmed",
            date: order.orderDate,
            description: `Payment of ${formatCurrency(order.total)} was confirmed`,
          },
        ]
      : []),
    {
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      date: order.updatedAt,
      description: `Order is ${order.status}`,
    },
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link
              href="/admin/orders"
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Order #{order.id}</h1>
            <span className={`ml-3 px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Link
              href={`/admin/invoices/${order.globalId}`}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Invoice
            </Link>
            {isAdmin ? (
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-sm sm:text-base w-full sm:w-auto"
                >
                  <option value="">Select Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={updateOrderStatus}
                  disabled={!newStatus}
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Update Status
                </button>
              </div>
            ) : (
              ['processing', 'pending'].includes(order.status) && (
                <button
                  onClick={handleCancelOrder}
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {formatDate(order.orderDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {order.paymentMethod.replace("-", " ").toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                <span className={`font-medium ${order.paymentStatus === "completed" ? "text-green-600" : "text-red-600"}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Charge:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {formatCurrency(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-semibold text-gray-800 dark:text-white">Total:</span>
                  <span className="font-bold text-green-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-start">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mr-2 sm:mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Customer</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mr-2 sm:mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{user?.email || "N/A"}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Email</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Shipping Information</h2>
            <div className="flex items-start text-sm sm:text-base">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mr-2 sm:mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Delivery Address</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {order.items.map((item) => (
              <div key={item.productId} className="p-4 sm:p-6 flex items-center">
                <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 sm:ml-6 flex-1">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="mt-1 sm:mt-0 text-sm sm:text-base font-medium text-gray-800 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="mt-1 flex text-xs sm:text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Order Timeline</h2>
          </div>
          <div className="p-4 sm:p-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {timeline.map((event, index) => (
                <li key={index} className="mb-8 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                    {event.status === "Order Placed" && (
                      <Package className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Payment Confirmed" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Processing" && <Clock className="w-3 h-3 text-green-800 dark:text-green-300" />}
                    {event.status === "Shipped" && <Truck className="w-3 h-3 text-green-800 dark:text-green-300" />}
                    {event.status === "Delivered" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Cancelled" && (
                      <XCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                  </span>
                  <h3 className="flex items-center mb-1 text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                    {event.status}
                  </h3>
                  <time className="block mb-2 text-xs sm:text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    {formatDate(event.date)}
                  </time>
                  <p className="text-sm sm:text-base font-normal text-gray-600 dark:text-gray-400">{event.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}