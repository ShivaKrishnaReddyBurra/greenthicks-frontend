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

export default function InvoicePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
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
        const margin = 40
        let y = 40

        // Header (unchanged)
        doc.setFontSize(20)
        doc.text("Invoice", 300, y, { align: "center" })
        y += 30
        doc.setFontSize(12)
        doc.text("GreenThicks", 300, y, { align: "center" })
        y += 20
        doc.text("Your address", 300, y, { align: "center" })
        y += 20
        doc.text("contact@greenthicks.com", 300, y, { align: "center" })
        y += 20
        doc.text(`Invoice #${invoiceData.id}`, 300, y, { align: "center" })
        y += 20
        doc.text(`Date: ${invoiceData.date}`, 300, y, { align: "center" })
        y += 30

        // Billed To (unchanged)
        doc.setFontSize(12)
        doc.text("Billed To:", margin, y)
        y += 20
        doc.text(invoiceData.customer.name, margin, y)
        y += 20
        doc.text(invoiceData.customer.address, margin, y)
        y += 20
        doc.text(`Email: ${invoiceData.customer.email}`, margin, y)
        y += 30

        // Items Table (unchanged)
        doc.setFontSize(10)
        const tableTop = y
        const itemWidth = 300
        const qtyWidth = 60
        const priceWidth = 80
        const totalWidth = 80

        doc.text("Description", margin, tableTop)
        doc.text("Qty", margin + itemWidth, tableTop, { align: "right" })
        doc.text("Unit Price", margin + itemWidth + qtyWidth, tableTop, { align: "right" })
        doc.text("Total", margin + itemWidth + qtyWidth + priceWidth, tableTop, { align: "right" })
        y += 15
        doc.line(margin, y, 572 - margin, y)
        y += 10

        invoiceData.items.forEach((item) => {
          doc.text(item.name, margin, y, { maxWidth: itemWidth })
          doc.text(item.quantity.toString(), margin + itemWidth, y, { align: "right" })
          doc.text(`$${item.price.toFixed(2)}`, margin + itemWidth + qtyWidth, y, { align: "right" })
          doc.text(`$${item.total.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, { align: "right" })
          y += 20
        })

        // Totals (unchanged)
        y += 10
        doc.line(margin, y, 572 - margin, y)
        y += 10
        doc.text("Subtotal", margin + itemWidth + qtyWidth, y, { align: "right" })
        doc.text(`$${invoiceData.subtotal.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
          align: "right",
        })
        y += 20
        doc.text("Delivery Charge", margin + itemWidth + qtyWidth, y, { align: "right" })
        doc.text(`$${invoiceData.shipping.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
          align: "right",
        })

        if (invoiceData.discount > 0) {
          y += 20
          doc.text("Discount", margin + itemWidth + qtyWidth, y, { align: "right" })
          doc.text(`-$${invoiceData.discount.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
            align: "right",
          })
        }

        y += 20
        doc.text("Total", margin + itemWidth + qtyWidth, y, { align: "right" })
        doc.text(`$${invoiceData.total.toFixed(2)}`, margin + itemWidth + qtyWidth + priceWidth, y, {
          align: "right",
        })

        // Payment (unchanged)
        y += 30
        doc.text("Payment Details:", margin, y)
        y += 20
        doc.text(`Method: ${invoiceData.paymentMethod}`, margin, y)
        y += 20
        doc.text(`Status: ${invoiceData.paymentStatus}`, margin, y)
        y += 30

        // Footer (unchanged)
        doc.text("Thank you for your business!", 300, y, { align: "center" })
        y += 20
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Responsive spinner size */}
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Responsive heading size */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center mb-4 sm:mb-6 max-w-4xl mx-auto">
        <Link
          href="/admin/orders"
          className="flex items-center text-sm sm:text-base text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft size={14} className="mr-2 sm:size-16" />
          Back to Orders
        </Link>
      </div>

      {/* Ensure InvoiceGenerator is constrained and responsive */}
      {order && (
        <div className="max-w-4xl mx-auto">
          <InvoiceGenerator order={order} />
        </div>
      )}
    </div>
  )
}