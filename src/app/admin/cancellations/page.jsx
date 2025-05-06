"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, ChevronRight, ChevronLeft, Eye, Download, Calendar } from "lucide-react"

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterReason, setFilterReason] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dateRange, setDateRange] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCancellations = [
        {
          id: "CAN-1001",
          orderId: "ORD-9876",
          customer: "Rahul Sharma",
          amount: 1250,
          paymentMethod: "UPI",
          paymentStatus: "Refunded",
          date: "2023-05-01",
          reason: "Changed mind",
          products: ["Organic Tomatoes (1kg)", "Fresh Spinach (500g)"],
          notes: "Customer requested immediate refund",
        },
        {
          id: "CAN-1002",
          orderId: "ORD-9865",
          customer: "Priya Patel",
          amount: 890,
          paymentMethod: "Credit Card",
          paymentStatus: "Pending Refund",
          date: "2023-05-01",
          reason: "Found better price",
          products: ["Organic Brown Rice (5kg)"],
          notes: "Customer mentioned finding 15% lower price elsewhere",
        },
        {
          id: "CAN-1003",
          orderId: "ORD-9854",
          customer: "Amit Kumar",
          amount: 2340,
          paymentMethod: "Debit Card",
          paymentStatus: "Refunded",
          date: "2023-04-30",
          reason: "Delivery too slow",
          products: ["Organic Apples (2kg)", "Organic Milk (1L)", "Honey (500g)"],
          notes: "Customer was upset about 2-day delivery estimate",
        },
        {
          id: "CAN-1004",
          orderId: "ORD-9843",
          customer: "Neha Singh",
          amount: 760,
          paymentMethod: "UPI",
          paymentStatus: "Refunded",
          date: "2023-04-29",
          reason: "Ordered by mistake",
          products: ["Fresh Spinach (500g)", "Organic Carrots (1kg)"],
          notes: "Customer placed order accidentally",
        },
        {
          id: "CAN-1005",
          orderId: "ORD-9832",
          customer: "Vikram Reddy",
          amount: 1890,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Not Applicable",
          date: "2023-04-28",
          reason: "Changed mind",
          products: ["Organic Potatoes (2kg)", "Fresh Ginger (250g)", "Turmeric Powder (100g)"],
          notes: "Cancelled before dispatch",
        },
      ]

      setCancellations(mockCancellations)
      setTotalPages(Math.ceil(mockCancellations.length / 10))
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

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "Refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "Pending Refund":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        )
      case "Not Applicable":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
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

  const filteredCancellations = cancellations.filter((cancellation) => {
    const matchesSearch =
      cancellation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancellation.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancellation.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesReason = filterReason === "all" || cancellation.reason.toLowerCase() === filterReason.toLowerCase()

    return matchesSearch && matchesReason
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Order Cancellations</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
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
              placeholder="Search cancellations..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
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
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3"
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
            {filteredCancellations.length} cancellations found
          </div>
        </div>
      </div>

      {/* Cancellations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cancellation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Refund Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCancellations.map((cancellation) => (
                <tr key={cancellation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {cancellation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(cancellation.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getPaymentStatusBadge(cancellation.paymentStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {cancellation.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/cancellations/${cancellation.id}`}
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
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredCancellations.length}</span> of{" "}
            <span className="font-medium">{filteredCancellations.length}</span> results
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
      </div>
    </div>
  )
}
