"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, CreditCard, User, Mail, Phone, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { getCancellationById } from "@/lib/fetch-without-auth" // Updated import path

export default function CancellationDetails() {
  const params = useParams()
  const [cancellation, setCancellation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCancellation = async () => {
      try {
        setError(null)
        const data = await getCancellationById(params.id)
        setCancellation(data)
      } catch (error) {
        console.error("Error fetching cancellation:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCancellation()
    }
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

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        )
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {status}
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        )
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

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error Loading Cancellation</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/admin/cancellations"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cancellations
          </Link>
        </div>
      </div>
    )
  }

  if (!cancellation) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Cancellation Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The cancellation record you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/cancellations"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cancellations
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
              href="/admin/cancellations"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cancellation #{cancellation._id}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                for Order #{cancellation.orderId} • {formatDate(cancellation.createdAt)}
              </p>
            </div>
          </div>
          <div>{getStatusBadge(cancellation.status)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Cancellation Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cancellation Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Request Date:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {formatDate(cancellation.requestDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reason:</span>
                <span className="font-medium text-gray-800 dark:text-white">{cancellation.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {cancellation.paymentMethod}
                </span>
              </div>
              {cancellation.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{cancellation.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Refund Status:</span>
                <span
                  className={`font-medium ${
                    cancellation.refundStatus === "Refunded" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {cancellation.refundStatus}
                </span>
              </div>
              {cancellation.refundDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Refund Date:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {formatDate(cancellation.refundDate)}
                  </span>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800 dark:text-white">Refund Amount:</span>
                  <span className="font-bold text-green-600">{formatCurrency(cancellation.refundAmount)}</span>
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
                  <h3 className="font-medium text-gray-800 dark:text-white">{cancellation.customer?.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{cancellation.customer?.email}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{cancellation.customer?.phone}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Explanation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Explanation</h2>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">{cancellation.explanation}</p>
            </div>
          </div>
        </div>

        {/* Cancelled Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Cancelled Items</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {cancellation.items?.map((item, index) => (
              <div key={index} className="p-6 flex items-center">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  <img
                    src={item.image || "/placeholder.svg?height=80&width=80"}
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

        {/* Cancellation Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Cancellation Timeline</h2>
          </div>
          <div className="p-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {cancellation.timeline?.map((event, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                    {event.status === "Cancellation Requested" && (
                      <AlertTriangle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Cancellation Approved" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Refund Initiated" && (
                      <CreditCard className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Refund Completed" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Cancellation Rejected" && (
                      <XCircle className="w-3 h-3 text-red-800 dark:text-red-300" />
                    )}
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
