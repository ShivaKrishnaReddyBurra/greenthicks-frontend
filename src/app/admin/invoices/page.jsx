"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, FileText, Printer, Download, Mail, ChevronRight, ChevronLeft } from "lucide-react"
import { fetchWithAuth, fetchWithAuthFile } from "@/lib/api"

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
    <td className="px-2 sm:px-4 py-2">
      
        <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-1 sm:mr-2"></div>
        <div className="h-3 sm:h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </td>
    <td className="px-2 sm:px-4 py-2">
      <div className="h-3 sm:h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-2 sm:px-4 py-2 hidden md:table-cell">
      <div className="h-3 sm:h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">
      <div className="h-3 sm:h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-2 sm:px-4 py-2 hidden lg:table-cell">
      <div className="h-3 sm:h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-2 sm:px-4 py-2 hidden md:table-cell">
      <div className="h-3 sm:h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="px-2 sm:px-4 py-2">
      <div className="flex justify-end space-x-1 sm:space-x-2">
        <div className="h-3 sm:h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 sm:h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 sm:h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </td>
  </tr>
)

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchWithAuth(`/api/invoices?page=${currentPage}&limit=10`)
        setInvoices(data.invoices || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [currentPage])

  const handleExportInvoices = async () => {
    setIsExporting(true)
    try {
      const response = await fetchWithAuthFile('/api/invoices/export', { method: 'GET' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'invoices_export.csv')
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
      case "Paid":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "Pending":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && invoice.status.toLowerCase() === filterStatus.toLowerCase()
  })

  const handleViewInvoice = (orderId) => {
    window.open(`/admin/invoices/${orderId}`, '_blank');
  }

  if (error) {
    return (
      <div className="p-3 text-center">
        <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{error}</p>
        <Link href="/admin/orders" className="text-green-600 hover:text-green-700 text-xs sm:text-sm">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isExporting && <LeafLoader />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-0">Invoices</h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={handleExportInvoices}
            disabled={isExporting}
            className="flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-xs sm:text-sm w-full sm:w-auto justify-center disabled:opacity-50"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-7 sm:pl-8 pr-3 py-1.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-1.5 px-2 text-xs sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="text-right text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
            {filteredInvoices.length} found
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Customer
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Amount
                </th>
                <th className="px-2 sm:px-4 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="px-2 sm:px-4 py-2 text-right text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                Array(10).fill().map((_, index) => <SkeletonRow key={index} />)
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                        INV-{invoice.id}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                      <Link
                        href={`/admin/orders/${invoice.orderId}`}
                        className="hover:text-green-600 dark:hover:text-green-400"
                      >
                        ORD-{invoice.orderId}
                      </Link>
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                      {invoice.customer}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                      {new Date(invoice.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap hidden md:table-cell">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div className="flex justify-end space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice.orderId)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-[10px] sm:text-xs"
                        >
                          View
                        </button>
                        <Link
                          href={`/admin/invoices/${invoice.orderId}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Printer size={12} className="sm:h-4 sm:w-4" />
                        </Link>
                        <button
                          disabled
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 opacity-50 cursor-not-allowed"
                          title="Email functionality not implemented"
                        >
                          <Mail size={12} className="sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * 10, filteredInvoices.length)}</span> of{" "}
            <span className="font-medium">{filteredInvoices.length}</span>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              className="px-1.5 sm:px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-[10px] sm:text-sm"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={12} className="sm:h-4 sm:w-4" />
            </button>
            <button
              className="px-1.5 sm:px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-[10px] sm:text-sm"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={12} className="sm:h-4 sm:w-4" />
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