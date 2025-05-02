"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ExportReports() {
  const [reportType, setReportType] = useState("sales")
  const [dateRange, setDateRange] = useState("month")
  const [format, setFormat] = useState("csv")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      // In a real app, this would be an API call to generate and download the report
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      setSuccess(true)
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error exporting report:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link href="/admin/analytics" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="mr-2" />
          Back to Analytics
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Export Reports</h1>

      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sales"
                  name="reportType"
                  value="sales"
                  checked={reportType === "sales"}
                  onChange={() => setReportType("sales")}
                  className="mr-2"
                />
                <label htmlFor="sales">Sales Report</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="inventory"
                  name="reportType"
                  value="inventory"
                  checked={reportType === "inventory"}
                  onChange={() => setReportType("inventory")}
                  className="mr-2"
                />
                <label htmlFor="inventory">Inventory Report</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="customers"
                  name="reportType"
                  value="customers"
                  checked={reportType === "customers"}
                  onChange={() => setReportType("customers")}
                  className="mr-2"
                />
                <label htmlFor="customers">Customer Report</label>
              </div>
              <input
  type="radio"
  id="customers"
  name="reportType"
  value="customers"
  checked={reportType === "customers"}
  onChange={() => setReportType("customers")}
  className="mr-2"
/>
<label htmlFor="customers">Customer Report</label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              onClick={handleExport}
              disabled={loading}
              className={`w-full p-3 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Exporting..." : "Export Report"}
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="col-span-1 md:col-span-2 mt-4 text-green-600">
              Report exported successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
