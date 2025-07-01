"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { jsPDF } from "jspdf"
import dynamic from "next/dynamic"

const InvoiceGenerator = dynamic(() => import("@/components/invoice-generator"), {
  ssr: false,
})

// LeafLoader component optimized for mobile
const LeafLoader = () => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
      <div className="absolute animate-spin rounded-full h-full w-full border-t-3 border-b-3 border-green-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-300 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6 0 1.66.67 3.17 1.76 4.24.39.39 1.02.39 1.41 0s.39-1.02 0-1.41C8.67 10.17 9.69 9 11 9c1.31 0 2.33 1.17 2.24 2.59-.06.98-.84 1.78-1.83 1.97-.49.09-.91-.36-.91-.87 0-.39-.31-.71-.69-.71s-.69.31-.69.69c0 1.29 1.05 2.34 2.34 2.34 1.79 0 3.24-1.45 3.24-3.24 0-3.31-2.69-6-6-6z"/>
        </svg>
      </div>
    </div>
  </div>
)

// SkeletonLoader component optimized for mobile
const SkeletonLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 lg:p-6 animate-pulse">
    <div className="max-w-3xl mx-auto">
      {/* Header skeleton */}
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
      
      {/* Invoice content skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-6"></div>
        
        {/* Table skeleton */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 sm:gap-4">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Totals skeleton */}
        <div className="mt-6 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 ml-auto"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 ml-auto"></div>
        </div>
      </div>
    </div>
  </div>
)

export default function InvoicePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)
  const print = searchParams.get("print") === "true"

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true)
      setError(null)
      try {
        const invoiceData = await fetchWithAuth(`/api/invoices/${params.id}`, {
          headers: { Accept: "application/json" },
        })

        setOrder(invoiceData)

        const doc = new jsPDF({ unit: "pt", format: "a4" })
        const margin = 20 // Reduced margin for better mobile fit
        let y = 30

        // Header
        doc.setFontSize(16) // Smaller font for mobile
        doc.text("Invoice", 300, y, { align: "center" })
        y += 20
        doc.setFontSize(9)
        doc.text("GreenThicks", 300, y, { align: "center" })
        y += 12
        doc.text("Your address", 300, y, { align: "center" })
        y += 12
        doc.text("contact@greenthicks.com", 300, y, { align: "center" })
        y += 12
        doc.text(`Invoice #${invoiceData.id}`, 300, y, { align: "center" })
        y += 12
        doc.text(`Date: ${invoiceData.date}`, 300, y, { align: "center" })
        y += 20

        // Billed To
        doc.setFontSize(9)
        doc.text("Billed To:", margin, y)
        y += 12
        doc.text(invoiceData.customer.name, margin, y)
        y += 12
        doc.text(invoiceData.customer.address, margin, y, { maxWidth: 180 }) // Adjusted maxWidth
        y += 12
        doc.text(`Email: ${invoiceData.customer.email}`, margin, y)
        y += 12
        doc.text(`Phone: ${invoiceData.customer.phoneNumber}`, margin, y)
        y += 20

        // Items Table
        doc.setFontSize(7) // Smaller font for table
        const tableTop = y
        const itemWidth = 260 // Adjusted for smaller screens
        const qtyWidth = 50
        const priceWidth = 60
        const totalWidth = 60

        doc.text("Description", margin, tableTop)
        doc.text("Qty", margin + itemWidth, tableTop, { align: "right" })
        doc.text("Unit Price", margin + itemWidth + qtyWidth, tableTop, { align: "right" })
        doc.text("Total", margin + itemWidth + qtyWidth + priceWidth, tableTop, { align: "right" })
        y += 10
        doc.line(margin, y, 572 - margin, y)
        y += 6

        invoiceData.items.forEach((item) => {
          doc.text(item.name, margin, y, { maxWidth: itemWidth })
          doc.text(item.quantity.toString(), margin + itemWidth, y, { align: "right" })
          doc.text(`$${item.price.toFixed(2)}`, margin + itemWidth + qtyWidth, y, { align: "right" })
          doc.text(`$${item.total.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, { align: "right" })
          y += 12
        })

        // Totals
        y += 6
        doc.line(margin, y, 572 - margin, y)
        y += 6
        doc.text("Subtotal", margin + itemWidth + qtyWidth, y, { align: "right" })
        doc.text(`$${invoiceData.subtotal.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
          align: "right",
        })
        y += 12
        doc.text("Delivery Charge", margin + itemWidth + qtyWidth, y, { align: "right" })
        doc.text(`$${invoiceData.shipping.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
          align: "right",
        })

        if (invoiceData.discount > 0) {
          y += 12
          doc.text("Discount", margin + itemWidth + qtyWidth, y, { align: "right" })
          doc.text(`-$${invoiceData.discount.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
            align: "right",
          })
        }

        y += 12
        doc.text("Total", margin + itemWidth + qtyWidth, y, { align: "right" })
        doc.text(`$${invoiceData.total.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
          align: "right",
        })

        // Payment
        y += 20
        doc.text("Payment Details:", margin, y)
        y += 12
        doc.text(`Method: ${invoiceData.paymentMethod}`, margin, y)
        y += 12
        doc.text(`Status: ${invoiceData.paymentStatus}`, margin, y)
        y += 20

        // Footer
        doc.text("Thank you for your business!", 300, y, { align: "center" })
        y += 12
        doc.text("For any questions, please contact us at contact@greenthicks.com", 300, y, { align: "center" })

        const pdfOutput = doc.output("blob")
        const url = window.URL.createObjectURL(pdfOutput)
        setPdfUrl(url)

        if (print) {
          setTimeout(() => {
            const link = document.createElement("a")
            link.href = url
            link.download = `invoice_${invoiceData.id}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }, 1000)
        }
      } catch (err) {
        console.error("Fetch invoice error:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()

    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [params.id, print])

  const handleButtonClick = () => {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 1000) // Simulate async action
  }

  if (loading) {
    return <SkeletonLoader />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 lg:p-6 flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Error</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">{error}</p>
          <Link
            href="/admin/invoices"
            onClick={handleButtonClick}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm md:text-base font-medium"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Invoices
          </Link>
          {buttonLoading && <LeafLoader />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-3 sm:mb-4">
          <Link
            href="/admin/orders"
            onClick={handleButtonClick}
            className="flex items-center text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
            Back to Orders
          </Link>
        </div>

        {order && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4">
            <InvoiceGenerator order={order} />
          </div>
        )}
      </div>
      {buttonLoading && <LeafLoader />}
    </div>
  )
}