"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getDeliveryOrders, assignDeliveryBoy, getDeliveryBoys } from "@/lib/api"

export default function DeliveryManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [deliveries, setDeliveries] = useState([])
  const [deliveryBoys, setDeliveryBoys] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersData, boysData] = await Promise.all([getDeliveryOrders(currentPage, 20), getDeliveryBoys()])

        setDeliveries(ordersData.orders)
        setTotalPages(Math.ceil(ordersData.total / 20))
        setDeliveryBoys(boysData.filter((boy) => boy.activeStatus))
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load delivery data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, toast])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
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

  const openAssignModal = (delivery) => {
    setSelectedDelivery(delivery)
    setAssignModalOpen(true)
  }

  const closeAssignModal = () => {
    setAssignModalOpen(false)
    setSelectedDelivery(null)
  }

  const handleAssignDeliveryBoy = async (deliveryBoyId) => {
    if (!selectedDelivery) return

    try {
      await assignDeliveryBoy(selectedDelivery.globalId, Number.parseInt(deliveryBoyId))

      setDeliveries(
        deliveries.map((delivery) =>
          delivery.globalId === selectedDelivery.globalId
            ? { ...delivery, deliveryBoyId: Number.parseInt(deliveryBoyId), deliveryStatus: "assigned" }
            : delivery,
        ),
      )

      toast({
        title: "Success",
        description: "Delivery boy assigned successfully",
      })
      closeAssignModal()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign delivery boy",
        variant: "destructive",
      })
    }
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${delivery.shippingAddress.firstName} ${delivery.shippingAddress.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.shippingAddress.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || delivery.deliveryStatus === statusFilter

    return matchesSearch && matchesStatus
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Delivery Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all delivery operations</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search deliveries..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
              {filteredDeliveries.length} deliveries found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle>Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDeliveries.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deliveries found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Delivery Partner
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDeliveries.map((delivery) => (
                      <tr key={delivery.globalId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{delivery.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {delivery.shippingAddress.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {delivery.shippingAddress.address}, {delivery.shippingAddress.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(delivery.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(delivery.deliveryStatus)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {delivery.deliveryBoyId ? (
                            <div>
                              <div className="text-sm font-medium">
                                {deliveryBoys.find((boy) => boy.globalId === delivery.deliveryBoyId)?.name || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-400">ID: {delivery.deliveryBoyId}</div>
                            </div>
                          ) : (
                            <span className="text-orange-500">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/delivery-admin/deliveries/${delivery.globalId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {!delivery.deliveryBoyId && (
                              <Button variant="ghost" size="sm" onClick={() => openAssignModal(delivery)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`tel:${delivery.shippingAddress.phone}`)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <Card key={delivery.globalId} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">#{delivery.id}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                          </p>
                        </div>
                        {getStatusBadge(delivery.deliveryStatus)}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                          <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                            {delivery.shippingAddress.address}, {delivery.shippingAddress.city}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(delivery.total)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {delivery.deliveryBoyId
                              ? deliveryBoys.find((boy) => boy.globalId === delivery.deliveryBoyId)?.name || "Unknown"
                              : "Not assigned"}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/delivery-admin/deliveries/${delivery.globalId}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        {!delivery.deliveryBoyId && (
                          <Button variant="outline" size="sm" onClick={() => openAssignModal(delivery)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${delivery.shippingAddress.phone}`)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      {assignModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Assign Delivery Partner</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Order #{selectedDelivery.id} - {selectedDelivery.shippingAddress.firstName}{" "}
              {selectedDelivery.shippingAddress.lastName}
            </p>

            <div className="space-y-3 mb-6">
              {deliveryBoys.map((boy) => (
                <div
                  key={boy.globalId}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => handleAssignDeliveryBoy(boy.globalId)}
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{boy.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {boy.phone} • {boy.address.city}
                    </div>
                    <div className="text-xs text-gray-400">
                      Rating: {boy.rating}/5 • {boy.totalDeliveries} deliveries
                    </div>
                  </div>
                  <Button size="sm">Assign</Button>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={closeAssignModal} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
