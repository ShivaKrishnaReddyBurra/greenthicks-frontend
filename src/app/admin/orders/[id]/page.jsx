"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Truck,
  Package,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CreditCard,
} from "lucide-react"

// Mock data for the order
const getOrderData = (id) => {
  return {
    id: id,
    date: "2023-05-15T10:30:00",
    status: "Processing",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    total: 2450,
    subtotal: 2300,
    deliveryCharge: 150,
    discount: 0,
    customer: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 9876543210",
      address: "123 Green Avenue, Jubilee Hills, Hyderabad, Telangana, 500033",
    },
    items: [
      {
        id: "1",
        name: "Organic Tomatoes",
        price: 80,
        quantity: 5,
        total: 400,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "2",
        name: "Fresh Spinach Bundle",
        price: 60,
        quantity: 2,
        total: 120,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "3",
        name: "Organic Brown Rice (5kg)",
        price: 450,
        quantity: 1,
        total: 450,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "4",
        name: "Cold-Pressed Coconut Oil",
        price: 350,
        quantity: 2,
        total: 700,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "5",
        name: "Organic Honey (500g)",
        price: 315,
        quantity: 2,
        total: 630,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    timeline: [
      {
        status: "Order Placed",
        date: "2023-05-15T10:30:00",
        description: "Order #9876 was placed successfully",
      },
      {
        status: "Payment Confirmed",
        date: "2023-05-15T10:35:00",
        description: "Payment of ₹2,450 was confirmed",
      },
      {
        status: "Processing",
        date: "2023-05-15T14:20:00",
        description: "Order is being processed and packed",
      },
    ],
  }
}

export default function OrderDetails() {
  const params = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(getOrderData(params.id))
      setLoading(false)
    }, 500)
  }, [params.id])

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
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Order Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The order you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/orders"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order #{order.id}</h1>
            <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/invoices/${order.id}`}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Invoice
            </Link>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <Truck className="h-4 w-4 mr-2" />
              Update Status
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {formatDate(order.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                <span className={`font-medium ${order.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"}`}>
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
                    {formatCurrency(order.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-semibold text-gray-800 dark:text-white">Total:</span>
                  <span className="font-bold text-green-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{order.customer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{order.customer.email}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{order.customer.phone}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shipping Information</h2>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Delivery Address</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{order.customer.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {order.items.map((item) => (
              <div key={item.id} className="p-6 flex items-center">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="ml-4 text-base font-medium text-gray-800 dark:text-white">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                  <div className="mt-1 flex text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Order Timeline</h2>
          </div>
          <div className="p-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {order.timeline.map((event, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                    {event.status === "Order Placed" && (
                      <Package className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Payment Confirmed" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Processing" && <Clock className="w-3 h-3 text-green-800 dark:text-green-300" />}
                    {event.status === "Shipped" && <Truck className="w-3 h-3 text-green-800 dark:text-green-300" />}
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-800 dark:text-white">
                    {event.status}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    {formatDate(event.date)}
                  </time>
                  <p className="text-base font-normal text-gray-600 dark:text-gray-400">{event.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
