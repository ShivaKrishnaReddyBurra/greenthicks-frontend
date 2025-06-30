"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, ChevronRight, ChevronLeft, Eye, Download, Calendar, Leaf } from "lucide-react"
import { getCancellations } from "@/lib/fetch-without-auth"

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLeafLoading, setIsLeafLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterReason, setFilterReason] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dateRange, setDateRange] = useState("all")
  const [error, setError] = useState(null)

  // Leaf loader component
const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

  useEffect(() => {
    const fetchCancellations = async () => {
      try {
        setError(null)
        const data = await getCancellations(currentPage, 10)
        setCancellations(data.cancellations || data)
        setTotalPages(data.totalPages || Math.ceil((data.cancellations || data).length / 10))
      } catch (error) {
        console.error("Error fetching cancellations:", error)
        setError(error.message)
      } finally {
        setTimeout(() => setIsPageLoading(false), 1000) // Simulate loading delay
      }
    }

    fetchCancellations()
  }, [currentPage])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "Refunded":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "Pending Refund":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        )
      case "Not Applicable":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  const handleButtonClick = (action) => {
    setIsLeafLoading(true)
    setTimeout(() => {
      action()
      setIsLeafLoading(false)
    }, 1000) // Simulate loading delay
  }

  const filteredCancellations = cancellations.filter((cancellation) => {
    const matchesSearch =
      cancellation._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancellation.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancellation.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesReason = filterReason === "all" || cancellation.reason?.toLowerCase() === filterReason.toLowerCase()

    const matchesDate =
      dateRange === "all" ||
      (dateRange === "today" && new Date(cancellation.createdAt).toDateString() === new Date().toDateString()) ||
      (dateRange === "week" &&
        new Date(cancellation.createdAt) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
      (dateRange === "month" &&
        new Date(cancellation.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (dateRange === "quarter" &&
        new Date(cancellation.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 3)))

    return matchesSearch && matchesReason && matchesDate
  })

  if (isPageLoading) {
    return (
      <div className="p-2 sm:p-3 md:p-4 min-h-screen max-w-screen-lg mx-auto w-full">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 sm:w-40"></div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-2 sm:p-3 mb-3 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 ml-auto md:col-span-3"></div>
            </div>
          </div>
          {/* Desktop Table Skeleton */}
          <div className="hidden sm:block bg-gray-200 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="p-2 sm:p-3 overflow-x-auto">
              <div className="grid grid-cols-9 gap-1 mb-2 min-w-0">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full min-w-0"></div>
                ))}
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-9 gap-1 mb-1 min-w-0">
                  {[...Array(9)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full min-w-0"></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="p-2 sm:p-3 flex flex-col sm:flex-row justify-between gap-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
              <div className="flex space-x-1">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
              </div>
            </div>
          </div>
          {/* Mobile Card Skeleton */}
          <div className="sm:hidden space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-10"></div>
                  </div>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  ))}
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6 ml-auto"></div>
                </div>
              </div>
            ))}
            <div className="p-2 flex flex-col items-center gap-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
              <div className="flex space-x-1">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 sm:p-3 md:p-4 text-center min-h-screen max-w-screen-lg mx-auto w-full">
        {isLeafLoading && <LeafLoader />}
        <div className="text-red-500 mb-3">
          <p className="text-base sm:text-lg font-medium">Error loading cancellations</p>
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
        <button
          onClick={() =>
            handleButtonClick(() => {
              window.location.reload()
            })
          }
          className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-xs sm:text-sm"
          disabled={isLeafLoading}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-900 min-h-screen max-w-screen-lg mx-auto w-full">
      {isLeafLoading && <LeafLoader />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white">Order Cancellations</h1>
        <div className="mt-2 sm:mt-0 flex space-x-1">
          <button
            onClick={() =>
              handleButtonClick(() => {
                // Implement export report logic here
                console.log("Export report clicked")
              })
            }
            className="flex items-center px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-xs sm:text-sm disabled:opacity-50"
            disabled={isLeafLoading}
          >
            <Download className="h-3 w-3 mr-1" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2 sm:p-3 mb-3 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cancellations..."
              className="pl-8 pr-2 py-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-1 px-2 text-xs sm:text-sm"
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
            >
              <option value="all">All Reasons</option>
              <option value="changed mind">Changed mind</option>
              <option value="found better price">Found better price</option>
              <option value="delivery too slow">Delivery too slow</option>
              <option value="ordered by mistake">Ordered by mistake</option>
            </select>
          </div>

          <div className="flex items-center">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-1 px-2 text-xs sm:text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>

          <div className="text-right text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end md:col-span-3">
            {filteredCancellations.length} cancellations found
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-0 w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cancellation ID
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Refund Status
                </th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-2 sm:px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCancellations.map((cancellation) => (
                <tr key={cancellation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {cancellation._id}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.orderId}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.customer?.name}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(cancellation.createdAt)}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(cancellation.refundAmount)}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.paymentMethod}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap">
                    {getPaymentStatusBadge(cancellation.refundStatus)}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.reason}
                  </td>
                  <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                    <Link
                      href={`/admin/cancellations/${cancellation._id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        handleButtonClick(() => {
                          window.location.href = `/admin/cancellations/${cancellation._id}`
                        })
                      }}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-2 sm:px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * 10, filteredCancellations.length)}</span> of{" "}
            <span className="font-medium">{filteredCancellations.length}</span> results
          </div>
          <div className="flex space-x-1">
            <button
              className="px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-xs sm:text-sm"
              disabled={currentPage === 1 || isLeafLoading}
              onClick={() =>
                handleButtonClick(() => {
                  setCurrentPage(currentPage - 1)
                })
              }
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-xs sm:text-sm"
              disabled={currentPage === totalPages || isLeafLoading}
              onClick={() =>
                handleButtonClick(() => {
                  setCurrentPage(currentPage + 1)
                })
              }
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-2">
        {filteredCancellations.map((cancellation) => (
          <div
            key={cancellation._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">ID: {cancellation._id}</span>
                {getPaymentStatusBadge(cancellation.refundStatus)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Order ID: {cancellation.orderId}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Customer: {cancellation.customer?.name}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Date: {formatDate(cancellation.createdAt)}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Amount: {formatCurrency(cancellation.refundAmount)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Payment Method: {cancellation.paymentMethod}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Reason: {cancellation.reason}</div>
              <div className="flex justify-end">
                <Link
                  href={`/admin/cancellations/${cancellation._id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleButtonClick(() => {
                      window.location.href = `/admin/cancellations/${cancellation._id}`
                    })
                  }}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  <Eye size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Mobile Pagination */}
        <div className="p-2 flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * 10, filteredCancellations.length)}</span> of{" "}
            <span className="font-medium">{filteredCancellations.length}</span> results
          </div>
          <div className="flex space-x-1">
            <button
              className="px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-xs sm:text-sm"
              disabled={currentPage === 1 || isLeafLoading}
              onClick={() =>
                handleButtonClick(() => {
                  setCurrentPage(currentPage - 1)
                })
              }
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-xs sm:text-sm"
              disabled={currentPage === totalPages || isLeafLoading}
              onClick={() =>
                handleButtonClick(() => {
                  setCurrentPage(currentPage + 1)
                })
              }
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}