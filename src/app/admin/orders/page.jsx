"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, FileText, Printer, ChevronRight, ChevronLeft, Eye, Download } from "lucide-react"
import { getAllOrders, getUserProfile, exportOrders } from "@/lib/api"

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

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-4">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-4 py-4">
      <div className="flex justify-end space-x-2">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </td>
  </tr>
)

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="flex space-x-2">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-32 mt-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-24 mt-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-20 mt-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-16 mt-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
)

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const userProfile = await getUserProfile()
        setIsAdmin(userProfile.isAdmin)

        const data = await getAllOrders(currentPage, 10)
        setOrders(data.orders || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage])

  const handleExportOrders = async () => {
    setIsExporting(true)
    try {
      const response = await exportOrders()
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'orders_export.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsExporting(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {status}
          </span>
        )
      case "shipped":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            {status}
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress?.firstName + " " + order.shippingAddress?.lastName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && order.status.toLowerCase() === filterStatus.toLowerCase()
  })

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link href="/login" className="text-green-600 hover:text-green-700">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isExporting && <LeafLoader />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
        {isAdmin && (
          <button
            onClick={handleExportOrders}
            disabled={isExporting}
            className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="text-right text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
            {filteredOrders.length} orders
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                Array(10).fill().map((_, index) => <SkeletonRow key={index} />)
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.globalId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(order.orderDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/orders/${order.globalId}`}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/invoices/${order.globalId}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FileText size={16} />
                        </Link>
                        <Link
                          href={`/admin/invoices/${order.globalId}?print=true`}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          <Printer size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4 p-4">
          {loading ? (
            Array(10).fill().map((_, index) => <SkeletonCard key={index} />)
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.globalId}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/orders/${order.globalId}`}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/invoices/${order.globalId}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FileText size={16} />
                    </Link>
                    <Link
                      href={`/admin/invoices/${order.globalId}?print=true`}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <Printer size={16} />
                    </Link>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Customer:</span>{" "}
                    <span className="text-gray-900 dark:text-white">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>{" "}
                    <span className="text-gray-900 dark:text-white">
                      {new Date(order.orderDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Amount:</span>{" "}
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>{" "}
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * 10, filteredOrders.length)}</span> of{" "}
            <span className="font-medium">{filteredOrders.length}</span> results
          </div>
          <div className
Name="flex space-x-2">
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .leafbase {
          width: 50px;
          height: 50px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .lf {
          width: 100%;
          height: 100%;
          position: relative;
          animation: spin 1.2s linear infinite;
        }

        .leaf1, .leaf2, .leaf3 {
          position: absolute;
          width: 20px;
          height: 20px;
          transform-origin: center;
        }

        .leaf1 {
          transform: rotate(0deg);
        }

        .leaf2 {
          transform: rotate(120deg);
        }

        .leaf3 {
          transform: rotate(240deg);
        }

        .leaf11, .leaf12 {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50% 50% 0 0;
        }

        .leaf11 {
          left: 0;
          transform: rotate(-45deg);
        }

        .leaf12 {
          right: 0;
          transform: rotate(45deg);
        }

        .tail {
          position: absolute;
          width: 4px;
          height: 12px;
          background: #22c55e;
          bottom: -8px;
          border-radius: 2px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}