"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Camera,
  MessageSquare,
  Truck,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Send,
  CheckSquare,
  XSquare,
  Banknote,
  Smartphone,
  CreditCardIcon as CardIcon,
} from "lucide-react"

// Mock data for the return
const getReturnData = (id) => {
  return {
    id: id,
    orderId: "ORD-9876",
    date: "2023-05-01T14:30:00",
    requestDate: "2023-05-01T10:30:00",
    status: "Pending", // Changed to Pending to show controls
    reason: "Damaged product",
    explanation: "The product arrived with visible damage to the packaging and the contents were partially crushed.",
    refundAmount: 450,
    paymentMethod: "UPI",
    paymentDetails: {
      type: "UPI",
      upiId: "customer@okaxis",
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      originalTransactionId: "UPI123456789",
      transactionDate: "2023-04-28T10:15:00",
    },
    refundPreference: "original", // 'original', 'cash', 'store_credit'
    customer: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 9876543210",
      address: "123 Main Street, Bangalore, Karnataka, 560001",
    },
    items: [
      {
        id: "1",
        name: "Organic Tomatoes",
        price: 80,
        quantity: 5,
        total: 400,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "2",
        name: "Fresh Spinach Bundle",
        price: 60,
        quantity: 2,
        total: 120,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    timeline: [
      {
        status: "Return Requested",
        date: "2023-05-01T10:30:00",
        description: "Customer requested return",
      },
    ],
    feedback:
      "The customer service was excellent in handling my return request. Very satisfied with the quick resolution.",
  }
}

export default function ReturnDetails() {
  const params = useParams()
  const router = useRouter()
  const [returnData, setReturnData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showRefundOptions, setShowRefundOptions] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState(null)
  const [refundMethod, setRefundMethod] = useState("original")
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("")
  const [deliveryNote, setDeliveryNote] = useState("")
  const [bankTransactionId, setBankTransactionId] = useState("")

  // Mock delivery personnel list
  const deliveryPersonnel = [
    { id: "DEL-001", name: "Vijay Kumar" },
    { id: "DEL-002", name: "Suresh Patel" },
    { id: "DEL-003", name: "Amit Singh" },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReturnData(getReturnData(params.id))
      setLoading(false)
    }, 500)
  }, [params.id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {status}
          </span>
        )
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status}
          </span>
        )
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {status}
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        )
    }
  }

  const handleApproveReturn = () => {
    setConfirmationAction("approve")
    setShowConfirmation(true)
  }

  const handleRejectReturn = () => {
    setConfirmationAction("reject")
    setShowConfirmation(true)
  }

  const confirmAction = () => {
    setProcessingAction(true)
    setShowConfirmation(false)

    // Simulate API call
    setTimeout(() => {
      const updatedReturnData = { ...returnData }

      if (confirmationAction === "approve") {
        updatedReturnData.status = "Approved"
        updatedReturnData.timeline.push({
          status: "Return Approved",
          date: new Date().toISOString(),
          description: "Return request approved by admin",
        })
      } else if (confirmationAction === "reject") {
        updatedReturnData.status = "Rejected"
        updatedReturnData.timeline.push({
          status: "Return Rejected",
          date: new Date().toISOString(),
          description: "Return request rejected by admin",
        })
      } else if (confirmationAction === "process_refund") {
        updatedReturnData.timeline.push({
          status: "Refund Initiated",
          date: new Date().toISOString(),
          description: `Refund of ${formatCurrency(returnData.refundAmount)} initiated to ${refundMethod === "original" ? "original payment method" : refundMethod === "cash" ? "cash via delivery" : "store credit"}`,
        })

        if (refundMethod === "original") {
          updatedReturnData.timeline.push({
            status: "Refund Completed",
            date: new Date().toISOString(),
            description: `Refund successfully processed with transaction ID: ${bankTransactionId}`,
          })
        } else if (refundMethod === "cash") {
          updatedReturnData.timeline.push({
            status: "Cash Refund Assigned",
            date: new Date().toISOString(),
            description: `Cash refund assigned to delivery personnel: ${selectedDeliveryPerson}`,
          })
        }
      }

      setReturnData(updatedReturnData)
      setProcessingAction(false)
      setShowRefundOptions(false)
      setShowDeliveryForm(false)
      setBankTransactionId("")
      setSelectedDeliveryPerson("")
      setDeliveryNote("")
    }, 1500)
  }

  const handleProcessRefund = () => {
    if (refundMethod === "original") {
      if (!bankTransactionId) {
        alert("Please enter a bank transaction ID")
        return
      }
    } else if (refundMethod === "cash") {
      if (!selectedDeliveryPerson) {
        alert("Please select a delivery person")
        return
      }
    }

    setConfirmationAction("process_refund")
    setShowConfirmation(true)
  }

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case "upi":
        return <Smartphone className="h-5 w-5 text-purple-500" />
      case "credit_card":
      case "debit_card":
        return <CardIcon className="h-5 w-5 text-blue-500" />
      case "cash":
        return <Banknote className="h-5 w-5 text-green-500" />
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!returnData) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Return Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The return record you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/returns"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Returns
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/returns"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Return #{returnData.id}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                for Order #{returnData.orderId} • {formatDate(returnData.date)}
              </p>
            </div>
          </div>
          <div>{getStatusBadge(returnData.status)}</div>
        </div>

        {/* Admin Action Buttons - Only show for Pending returns */}
        {returnData.status === "Pending" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Admin Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleApproveReturn}
                disabled={processingAction}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Approve Return
              </button>
              <button
                onClick={handleRejectReturn}
                disabled={processingAction}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XSquare className="h-4 w-4 mr-2" />
                Reject Return
              </button>
            </div>
          </div>
        )}

        {/* Refund Processing Section - Only show for Approved returns */}
        {returnData.status === "Approved" && !returnData.timeline.some((event) => event.status.includes("Refund")) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Process Refund</h2>
              <button
                onClick={() => setShowRefundOptions(!showRefundOptions)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showRefundOptions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>

            {showRefundOptions && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Original Payment Method</h3>
                  <div className="flex items-center mb-3">
                    {getPaymentMethodIcon(returnData.paymentMethod)}
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{returnData.paymentMethod}</span>
                  </div>

                  {returnData.paymentDetails && (
                    <div className="space-y-2 text-sm">
                      {returnData.paymentDetails.upiId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">UPI ID:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {returnData.paymentDetails.upiId}
                          </span>
                        </div>
                      )}
                      {returnData.paymentDetails.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Account Holder:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {returnData.paymentDetails.name}
                          </span>
                        </div>
                      )}
                      {returnData.paymentDetails.originalTransactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Original Transaction ID:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {returnData.paymentDetails.originalTransactionId}
                          </span>
                        </div>
                      )}
                      {returnData.paymentDetails.transactionDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Transaction Date:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {formatDate(returnData.paymentDetails.transactionDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">Refund Method</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="original"
                        name="refundMethod"
                        value="original"
                        checked={refundMethod === "original"}
                        onChange={() => {
                          setRefundMethod("original")
                          setShowDeliveryForm(false)
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="original" className="ml-2 block text-gray-700 dark:text-gray-300">
                        Refund to original payment method
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        name="refundMethod"
                        value="cash"
                        checked={refundMethod === "cash"}
                        onChange={() => {
                          setRefundMethod("cash")
                          setShowDeliveryForm(true)
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="cash" className="ml-2 block text-gray-700 dark:text-gray-300">
                        Cash refund via delivery
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="store_credit"
                        name="refundMethod"
                        value="store_credit"
                        checked={refundMethod === "store_credit"}
                        onChange={() => {
                          setRefundMethod("store_credit")
                          setShowDeliveryForm(false)
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="store_credit" className="ml-2 block text-gray-700 dark:text-gray-300">
                        Issue store credit
                      </label>
                    </div>
                  </div>
                </div>

                {refundMethod === "original" && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Bank Transaction Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="transactionId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Bank Transaction ID
                        </label>
                        <input
                          type="text"
                          id="transactionId"
                          value={bankTransactionId}
                          onChange={(e) => setBankTransactionId(e.target.value)}
                          placeholder="Enter bank transaction ID"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {showDeliveryForm && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Cash Delivery Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="deliveryPerson"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Select Delivery Person
                        </label>
                        <select
                          id="deliveryPerson"
                          value={selectedDeliveryPerson}
                          onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select a delivery person</option>
                          {deliveryPersonnel.map((person) => (
                            <option key={person.id} value={person.name}>
                              {person.name} ({person.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="deliveryNote"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Delivery Note (Optional)
                        </label>
                        <textarea
                          id="deliveryNote"
                          value={deliveryNote}
                          onChange={(e) => setDeliveryNote(e.target.value)}
                          placeholder="Add any special instructions for the delivery person"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-md">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          <strong>Delivery Address:</strong> {returnData.customer.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
                  <button
                    onClick={handleProcessRefund}
                    disabled={processingAction}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Process Refund ({formatCurrency(returnData.refundAmount)})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Return Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Return Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Request Date:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  {formatDate(returnData.requestDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reason:</span>
                <span className="font-medium text-gray-800 dark:text-white">{returnData.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-800 dark:text-white flex items-center">
                  {getPaymentMethodIcon(returnData.paymentMethod)}
                  <span className="ml-1">{returnData.paymentMethod}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Refund Preference:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {returnData.refundPreference === "original"
                    ? "Original Payment Method"
                    : returnData.refundPreference === "cash"
                      ? "Cash"
                      : "Store Credit"}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800 dark:text-white">Refund Amount:</span>
                  <span className="font-bold text-green-600">{formatCurrency(returnData.refundAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{returnData.customer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{returnData.customer.email}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{returnData.customer.phone}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Explanation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Explanation</h2>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">{returnData.explanation}</p>
            </div>
          </div>
        </div>

        {/* Returned Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Returned Items</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {returnData.items.map((item) => (
              <div key={item.id} className="p-6 flex items-center">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="ml-4 text-base font-medium text-gray-800 dark:text-white">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                  <div className="mt-1 flex text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Photos */}
        {returnData.photos && returnData.photos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Product Photos</h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Camera className="h-4 w-4 mr-1" />
                {returnData.photos.length} photos provided
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {returnData.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Return photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Feedback */}
        {returnData.feedback && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Customer Feedback
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 italic">"{returnData.feedback}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Return Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Return Timeline</h2>
          </div>
          <div className="p-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {returnData.timeline.map((event, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-green-900">
                    {event.status === "Return Requested" && (
                      <AlertTriangle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Return Approved" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Refund Initiated" && (
                      <FileText className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Refund Completed" && (
                      <CheckCircle className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                    {event.status === "Return Rejected" && (
                      <XCircle className="w-3 h-3 text-red-800 dark:text-red-300" />
                    )}
                    {event.status === "Cash Refund Assigned" && (
                      <Truck className="w-3 h-3 text-green-800 dark:text-green-300" />
                    )}
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-800 dark:text-white">
                    {event.status}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                    {formatDate(event.date)}
                  </time>
                  <p className="text-base font-normal text-gray-600 dark:text-gray-400">{event.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedPhoto || "/placeholder.svg"}
              alt="Return photo"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {confirmationAction === "approve" && "Approve Return"}
              {confirmationAction === "reject" && "Reject Return"}
              {confirmationAction === "process_refund" && "Process Refund"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {confirmationAction === "approve" && "Are you sure you want to approve this return request?"}
              {confirmationAction === "reject" && "Are you sure you want to reject this return request?"}
              {confirmationAction === "process_refund" &&
                `Are you sure you want to process a refund of ${formatCurrency(returnData.refundAmount)} via ${refundMethod === "original" ? "original payment method" : refundMethod === "cash" ? "cash delivery" : "store credit"}?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  confirmationAction === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
