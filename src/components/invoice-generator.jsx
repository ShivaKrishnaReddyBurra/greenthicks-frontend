"use client";

import { useState, useRef } from "react"
import { Printer, Download, Mail, CheckCircle, QrCode } from "lucide-react"
import logo from "@/public/logo.png"
import QRCode from "react-qr-code"

export default function InvoiceGenerator({ order }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [showPaymentQR, setShowPaymentQR] = useState(false)
  const invoiceRef = useRef(null)

  // Simple print function that uses the browser's print API
  const handlePrint = () => {
    setIsGenerating(true)

    // Give time for any pending state updates
    setTimeout(() => {
      // Store the original body content
      const originalContent = document.body.innerHTML

      // Replace with our invoice content
      const printContent = invoiceRef.current.innerHTML
      document.body.innerHTML = `
        <style>
          @media print {
            body { 
              padding: 20px;
              color: #000;
              background-color: #fff;
            }
            button { 
              display: none !important; 
            }
          }
        </style>
        <div>${printContent}</div>
      `

      // Print
      window.print()

      // Restore original content
      document.body.innerHTML = originalContent

      // Reset state
      setIsGenerating(false)
    }, 500)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Generate a delivery verification QR code with minimal order details
  const generateDeliveryQR = () => {
    // Only include essential order details
    const deliveryVerificationUrl = `http://greenthicks.live/delivery/verify?orderId=${order.id}&total=${order.total}&paymentMethod=${order.paymentMethod}`
    return deliveryVerificationUrl
  }

  // Generate UPI payment QR code when needed
  const generateUpiQR = (amount) => {
    const upiUrl = `upi://pay?pa=funnygn156@&mc=123456&tid=${order.id}&tr=${order.id}&tn=Payment+for+order&am=${amount}&cu=INR`
    return upiUrl
  }

  // Handle cash payment confirmation
  const confirmCashPayment = () => {
    setPaymentConfirmed(true)
    // In a real app, you would send this confirmation to your backend
  }

  // Toggle payment QR code display
  const togglePaymentQR = () => {
    setShowPaymentQR(!showPaymentQR)
  }

  // Simulate QR code scan by delivery personnel
  const handleQRScan = () => {
    setShowDeliveryOptions(true)
  }

  const handleDownload = async () => {
  setIsGenerating(true);

  try {
    // Simulate file generation (you can replace this with actual logic)
    const blob = new Blob(["This is your invoice content."], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.pdf";
    a.click();

    URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    console.error("Download failed:", error);
  } finally {
    setIsGenerating(false);
  }
};
  


  if (!order) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Invoice #{order.id}</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Printer className="h-4 w-4 mr-1" />
            {isGenerating ? "Generating..." : "Print Invoice"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            {isGenerating ? "Generating..." : "Download Invoice"}
          </button>

          <button className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            <Mail className="h-4 w-4 mr-1" />
            Email Invoice
          </button>
        </div>
      </div>

      {/* Printable Invoice */}
      <div className="p-6">
        <div ref={invoiceRef} className="bg-white text-black p-8 max-w-4xl mx-auto">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <p className="text-gray-600 mt-1">#{order.id}</p>
              {/* Delivery Verification QR Code */}
              <div className="mt-1 text-left">
                <div className="flex justify-left items-center">
                  <div className="border-2 border-gray-20 p-1 rounded-lg">
                    <QRCode value={generateDeliveryQR()} size={80} />
                  </div>
                </div>
              </div>
            </div>

            {/* Logo and Company Details */}
            <div className="text-right">
              <img src={logo.src || "/placeholder.svg"} alt="Green Thicks" className="h-12 mb-2 inline-block" />
              <p className="font-bold">Green Thicks</p>
              <p className="text-gray-600">hunmakonda,Telangana,India</p>
              <p className="text-gray-600">Tel: +91 9705045597</p>
              <p className="text-gray-600">Email: greenthickss@gmail.com</p>
            </div>
          </div>

          {/* Bill To & Invoice Details */}
          <div className="flex justify-between mt-8">
            <div>
              <h2 className="font-bold text-gray-700 mb-2">BILL TO:</h2>
              <p className="font-medium">{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.email}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-bold text-gray-700">Invoice Date:</span>
                <span className="ml-2">{formatDate(order.date)}</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-gray-700">Payment Method:</span>
                <span className="ml-2">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="font-bold text-gray-700">Order Status:</span>
                <span className="ml-2">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left border border-gray-300">Item</th>
                  <th className="py-2 px-4 text-right border border-gray-300">Quantity</th>
                  <th className="py-2 px-4 text-right border border-gray-300">Unit Price</th>
                  <th className="py-2 px-4 text-right border border-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border border-gray-300">{item.name}</td>
                    <td className="py-2 px-4 text-right border border-gray-300">{item.quantity}</td>
                    <td className="py-2 px-4 text-right border border-gray-300">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-4 text-right border border-gray-300">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="mt-4 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-2 text-green-600">
                  <span className="font-medium">Discount:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="font-medium">Delivery Charge:</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>


          {/* Delivery Options Panel - This would normally appear on the delivery person's device */}
          {showDeliveryOptions && (
            <div className="mt-6 border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
              <h3 className="text-xl font-bold text-center text-blue-800 mb-4">Delivery Verification</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <h4 className="font-bold text-gray-800">Order #{order.id}</h4>
                <p className="text-gray-600">Total Amount: {formatCurrency(order.total)}</p>
                <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
              </div>
            </div>
          )}

          {/* Terms and Notes */}
          <div className="mt-8 pt-8 border-t border-gray-300">
            <h3 className="font-bold text-gray-700 mb-2">Terms & Conditions:</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>All items are organic and fresh.</li>
              <li>Returns accepted within 4 hours of delivery if products are damaged.</li>
              <li>Payment is due as per the selected payment method.</li>
              <li>Delivery times are estimates and may vary based on location.</li>
            </ul>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Thank you for shopping with Green Thicks!</p>
              <p className="mt-1">For any queries, please contact our customer support at greenthicks@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}