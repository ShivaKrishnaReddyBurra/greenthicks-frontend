"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  User,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Edit,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getDeliveryOrderById, updateDeliveryStatus, assignDeliveryBoy, getDeliveryBoys } from "@/lib/api"

export default function DeliveryDetailPage({ params }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deliveryBoys, setDeliveryBoys] = useState([])
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingAssignment, setUpdatingAssignment] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [deliveryData, boysData] = await Promise.all([getDeliveryOrderById(id), getDeliveryBoys()])

        setDelivery(deliveryData)
        setNewStatus(deliveryData.deliveryStatus)
        setSelectedDeliveryBoy(deliveryData.deliveryBoyId?.toString() || "")
        setDeliveryBoys(boysData.filter((boy) => boy.activeStatus))
      } catch (error) {
        console.error("Error fetching delivery details:", error)
        toast({
          title: "Error",
          description: "Failed to load delivery details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const handleUpdateStatus = async () => {
    if (!delivery || newStatus === delivery.deliveryStatus) return

    try {
      setUpdatingStatus(true)
      await updateDeliveryStatus(id, newStatus)

      setDelivery({
        ...delivery,
        deliveryStatus: newStatus,
      })

      toast({
        title: "Success",
        description: "Delivery status updated successfully",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAssignDeliveryBoy = async () => {
    if (!delivery || !selectedDeliveryBoy || selectedDeliveryBoy === (delivery.deliveryBoyId?.toString() || "")) return

    try {
      setUpdatingAssignment(true)
      await assignDeliveryBoy(id, Number.parseInt(selectedDeliveryBoy))

      setDelivery({
        ...delivery,
        deliveryBoyId: Number.parseInt(selectedDeliveryBoy),
        deliveryStatus: delivery.deliveryStatus === "pending" ? "assigned" : delivery.deliveryStatus,
      })

      if (delivery.deliveryStatus === "pending") {
        setNewStatus("assigned")
      }

      toast({
        title: "Success",
        description: "Delivery partner assigned successfully",
      })
    } catch (error) {
      console.error("Error assigning delivery boy:", error)
      toast({
        title: "Error",
        description: "Failed to assign delivery partner",
        variant: "destructive",
      })
    } finally {
      setUpdatingAssignment(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={12} className="mr-1" />
            Delivered
          </Badge>
        )
      case "out-for-delivery":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Truck size={12} className="mr-1" />
            In Transit
          </Badge>
        )
      case "assigned":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock size={12} className="mr-1" />
            Assigned
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <AlertTriangle size={12} className="mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="p-4 md:p-6">
        <Link href="/delivery-admin/deliveries">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deliveries
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Delivery Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The delivery you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/delivery-admin/deliveries">
              <Button>View All Deliveries</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const assignedDeliveryBoy = deliveryBoys.find((boy) => boy.globalId === delivery.deliveryBoyId)

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <Link href="/delivery-admin/deliveries">
          <Button variant="ghost" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deliveries
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              Order #{delivery.id} {getStatusBadge(delivery.deliveryStatus)}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Created on {formatDate(delivery.createdAt)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={() => window.print()} className="mr-2">
              Print Details
            </Button>
            <Button variant="default" onClick={() => router.refresh()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Delivery Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Status and Assignment Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium mb-4">Delivery Status Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Update Status
                    </label>
                    <div className="flex space-x-2">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleUpdateStatus}
                        disabled={updatingStatus || newStatus === delivery.deliveryStatus}
                      >
                        {updatingStatus ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </div>

                  {/* Delivery Boy Assignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assign Delivery Partner
                    </label>
                    <div className="flex space-x-2">
                      <Select value={selectedDeliveryBoy} onValueChange={setSelectedDeliveryBoy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select partner" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryBoys.map((boy) => (
                            <SelectItem key={boy.globalId} value={boy.globalId.toString()}>
                              {boy.name} - {boy.phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAssignDeliveryBoy}
                        disabled={
                          updatingAssignment ||
                          !selectedDeliveryBoy ||
                          selectedDeliveryBoy === (delivery.deliveryBoyId?.toString() || "")
                        }
                      >
                        {updatingAssignment ? "Assigning..." : "Assign"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="font-medium mb-3">Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Package className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Order ID</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">#{delivery.id}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Order Date</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(delivery.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(delivery.total)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Expected Delivery</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {delivery.expectedDeliveryDate
                            ? formatDate(delivery.expectedDeliveryDate)
                            : "Not scheduled yet"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Payment Status</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {delivery.paymentStatus === "paid" ? (
                            <span className="text-green-600 dark:text-green-400">Paid</span>
                          ) : (
                            <span className="text-orange-600 dark:text-orange-400">Pending</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Delivery Method</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {delivery.deliveryMethod || "Standard Delivery"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div>
                <h3 className="font-medium mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <User className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Customer Name</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Phone Number</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <a href={`tel:${delivery.shippingAddress.phone}`} className="hover:underline">
                            {delivery.shippingAddress.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Delivery Address</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {delivery.shippingAddress.address}, {delivery.shippingAddress.city},{" "}
                          {delivery.shippingAddress.state} {delivery.shippingAddress.pincode}
                        </p>
                      </div>
                    </div>
                    {delivery.shippingAddress.landmark && (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Landmark</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {delivery.shippingAddress.landmark}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {delivery.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {formatCurrency(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right"
                        >
                          Subtotal:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                          {formatCurrency(delivery.subtotal || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right"
                        >
                          Shipping:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                          {formatCurrency(delivery.shippingFee || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right"
                        >
                          Tax:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                          {formatCurrency(delivery.tax || 0)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white text-right"
                        >
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                          {formatCurrency(delivery.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Partner Card */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent>
              {assignedDeliveryBoy ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{assignedDeliveryBoy.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {assignedDeliveryBoy.globalId}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <a href={`tel:${assignedDeliveryBoy.phone}`} className="hover:underline">
                            {assignedDeliveryBoy.phone}
                          </a>
                        </p>
                      </div>
                    </div>

                    {assignedDeliveryBoy.vehicleInfo && (
                      <div className="flex items-start">
                        <Truck className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Vehicle</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {assignedDeliveryBoy.vehicleInfo.type} - {assignedDeliveryBoy.vehicleInfo.number}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link href={`/delivery-admin/partners/${assignedDeliveryBoy.globalId}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Full Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No Partner Assigned</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    This delivery doesn't have a partner assigned yet.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      document.getElementById("assign-partner-section")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Assign Partner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {delivery.timeline?.map((event, index) => (
                  <div key={index} className="relative pl-6 pb-4">
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div className="absolute left-0 top-1 h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">{event.status}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(event.timestamp)}</p>
                      {event.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.note}</p>}
                    </div>
                  </div>
                ))}

                {(!delivery.timeline || delivery.timeline.length === 0) && (
                  <div className="text-center py-4">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No timeline events yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${delivery.shippingAddress.phone}`)}
              >
                <Phone className="mr-2 h-4 w-4" /> Call Customer
              </Button>

              {assignedDeliveryBoy && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(`tel:${assignedDeliveryBoy.phone}`)}
                >
                  <Phone className="mr-2 h-4 w-4" /> Call Delivery Partner
                </Button>
              )}

              <Button variant="outline" className="w-full justify-start" onClick={() => window.print()}>
                <Edit className="mr-2 h-4 w-4" /> Print Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
