"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, ChevronRight, ChevronLeft, Eye, Download, Calendar, CheckCircle, XCircle } from "lucide-react"

export default function ReturnsPage() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterReason, setFilterReason] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dateRange, setDateRange] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReturns = [
        {
          id: "RET-1001",
          orderId: "ORD-9876",
          customer: "Rahul Sharma",
          amount: 450,
          date: "2023-05-01",
          reason: "Damaged product",
          status: "Approved",
          products: ["Organic Tomatoes (1kg)"],
          hasPhotos: true,
        },
        {
          id: "RET-1002",
          orderId: "ORD-9865",
          customer: "Priya Patel",
          amount: 890,
          date: "2023-05-01",
          reason: "Wrong item received",
          status: "Pending",
          products: ["Organic Brown Rice (5kg)"],
          hasPhotos: true,
        },
        {
          id: "RET-1003",
          orderId: "ORD-9854",
          customer: "Amit Kumar",
          amount: 350,
          date: "2023-04-30",
          reason: "Quality issues",
          status: "Approved",
          products: ["Organic Milk (1L)"],
          hasPhotos: true,
        },
        {
          id: "RET-1004",
          orderId: "ORD-9843",
          customer: "Neha Singh",
          amount: 760,
          date: "2023-04-29",
          reason: "Expired product",
          status: "Rejected",
          products: ["Fresh Spinach (500g)", "Organic Carrots (1kg)"],
          hasPhotos: true,
        },
        {
          id: "RET-1005",
          orderId: "ORD-9832",
          customer: "Vikram Reddy",
          amount: 315,
          date: "2023-04-28",
          reason: "Not as described",
          status: "Approved",
          products: ["Organic Honey (500g)"],
          hasPhotos: false,
        },
      ]

      setReturns(mockReturns)
      setTotalPages(Math.ceil(mockReturns.length / 10))
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "Pending":
        return (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              {status}
            </span>
            <div className="flex space-x-1">
              <button
                className="p-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-800/50"
                title="Approve"
              >
                <CheckCircle size={14} />
              </button>
              <button
                className="p-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/50"
                title="Reject"
              >
                <XCircle size={14} />
              </button>
            </div>
          </div>
        )
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {status}
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

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch =
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesReason = filterReason === "all" || returnItem.reason.toLowerCase() === filterReason.toLowerCase()

    const matchesDate = dateRange === "all" || 
      (dateRange === "today" && returnItem.date === new Date().toISOString().split("T")[0]) ||
      (dateRange === "week" && new Date(returnItem.date) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
      (dateRange === "month" && new Date(returnItem.date) >= new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (dateRange === "quarter" && new Date(returnItem.date) >= new Date(new Date().setMonth(new Date().getMonth() - 3)))

    return matchesSearch && matchesReason && matchesDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Product Returns</h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search returns..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-sm sm:text-base"
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
            >
              <option value="all">All Reasons</option>
              <option value="damaged product">Damaged product</option>
              <option value="wrong item received">Wrong item received</option>
              <option value="quality issues">Quality issues</option>
              <option value="expired product">Expired product</option>
              <option value="not as described">Not as described</option>
            </select>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 text-sm sm:text-base"
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

          <div className="text-right text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
            {filteredReturns.length} returns found
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Return ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Photos
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReturns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {returnItem.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {returnItem.orderId}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {returnItem.customer}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {returnItem.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(returnItem.amount)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {returnItem.reason}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{getStatusBadge(returnItem.status)}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {returnItem.hasPhotos ? "Yes" : "No"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/returns/${returnItem.id}`}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredReturns.length}</span> of{" "}
            <span className="font-medium">{filteredReturns.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm sm:text-base"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm sm:text-base"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {filteredReturns.map((returnItem) => (
          <div key={returnItem.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">ID: {returnItem.id}</span>
                {getStatusBadge(returnItem.status)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Order ID: {returnItem.orderId}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Customer: {returnItem.customer}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Date: {returnItem.date}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Amount: {formatCurrency(returnItem.amount)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Reason: {returnItem.reason}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Photos: {returnItem.hasPhotos ? "Yes" : "No"}</div>
              <div className="flex justify-end">
                <Link
                  href={`/admin/returns/${returnItem.id}`}
                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Mobile Pagination */}
        <div className="p-4 flex flex-col items-center gap-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredReturns.length}</span> of{" "}
            <span className="font-medium">{filteredReturns.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
