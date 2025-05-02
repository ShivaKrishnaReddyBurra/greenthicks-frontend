"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled for the InvoiceGenerator component
const InvoiceGenerator = dynamic(() => import("@/components/invoice-generator"), {
  ssr: false,
})

export default function InvoicePage({ params }) {
  const { id } = params
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Simulate fetching order details
    const fetchOrder = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample order data
        const orderData = {
          id: `ORD-${id}`,
          customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+91 9876543210",
            address: "123 Main St, Hyderabad, 500001",
          },
          items: [
            {
              id: 1,
              name: "Organic Tomatoes",
              price: 60,
              quantity: 2,
              total: 120,
              image: "/placeholder.svg?height=200&width=200",
            },
            {
              id: 2,
              name: "Fresh Spinach Bundle",
              price: 40,
              quantity: 1,
              total: 40,
              image: "/placeholder.svg?height=200&width=200",
            },
            {
              id: 3,
              name: "Organic Apples",
              price: 120,
              quantity: 3,
              total: 360,
              image: "/placeholder.svg?height=200&width=200",
            },
          ],
          subtotal: 520,
          discount: 50,
          deliveryCharge: 50,
          total: 520,
          status: "Delivered",
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Paid",
          date: "2023-05-01",
          deliveryPartner: {
            id: "DEL-001",
            name: "Raj Kumar",
            phone: "+91 9876543211",
          },
          trackingInfo: [
            {
              status: "ordered",
              timestamp: "2023-05-01T10:30:00Z",
              message: "Order placed successfully",
            },
            {
              status: "processing",
              timestamp: "2023-05-01T11:00:00Z",
              message: "Order is being processed",
            },
            {
              status: "shipped",
              timestamp: "2023-05-01T14:00:00Z",
              message: "Order has been shipped",
            },
            {
              status: "delivered",
              timestamp: "2023-05-01T17:30:00Z",
              message: "Order has been delivered",
            },
          ],
        }

        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Failed to load order. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error || "Order not found"}</p>
        <Link href="/admin/invoices" className="text-primary hover:underline mt-2 inline-block">
          Back to Invoices
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link
          href="/admin/orders"
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </Link>
      </div>

      <InvoiceGenerator order={order} />
    </div>
  )
}
