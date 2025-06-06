"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Users,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Phone,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getDeliveryBoys } from "@/lib/api"

export default function DeliveryPartnersManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    avgRating: 0,
    totalDeliveries: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const partnersData = await getDeliveryBoys()

        // Enhance partners data with mock statistics
        const enhancedPartners = partnersData.map((partner) => ({
          ...partner,
          rating: (4.0 + Math.random() * 1).toFixed(1),
          totalDeliveries: Math.floor(Math.random() * 200) + 50,
          completedToday: Math.floor(Math.random() * 10) + 1,
          earnings: Math.floor(Math.random() * 15000) + 5000,
          onTimeRate: Math.floor(Math.random() * 20) + 80,
          joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        }))

        setPartners(enhancedPartners)
        setTotalPages(Math.ceil(enhancedPartners.length / 10))

        // Calculate stats
        const totalPartners = enhancedPartners.length
        const activePartners = enhancedPartners.filter((p) => p.activeStatus).length
        const avgRating = enhancedPartners.reduce((sum, p) => sum + Number.parseFloat(p.rating), 0) / totalPartners
        const totalDeliveries = enhancedPartners.reduce((sum, p) => sum + p.totalDeliveries, 0)

        setStats({
          totalPartners,
          activePartners,
          avgRating: avgRating.toFixed(1),
          totalDeliveries,
        })
      } catch (error) {
        console.error("Error fetching partners:", error)
        toast({
          title: "Error",
          description: "Failed to load delivery partners",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <XCircle size={12} className="mr-1" />
        Inactive
      </Badge>
    )
  }

  const getPerformanceBadge = (onTimeRate) => {
    if (onTimeRate >= 95) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    } else if (onTimeRate >= 85) {
      return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    } else if (onTimeRate >= 75) {
      return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Poor</Badge>
    }
  }

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && partner.activeStatus) ||
      (statusFilter === "inactive" && !partner.activeStatus)

    const matchesLocation =
      locationFilter === "all" || partner.address?.city?.toLowerCase() === locationFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesLocation
  })

  const paginatedPartners = filteredPartners.slice((currentPage - 1) * 10, currentPage * 10)

  const uniqueLocations = [...new Set(partners.map((p) => p.address?.city).filter(Boolean))]

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Delivery Partners</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage delivery partner network</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
          <Users className="h-4 w-4 mr-2" />
          Add New Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPartners}</div>
            <p className="text-xs text-muted-foreground">{stats.activePartners} active partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {stats.avgRating}
              <Star className="h-4 w-4 text-yellow-500 ml-1" />
            </div>
            <p className="text-xs text-muted-foreground">Across all partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePartners}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activePartners / stats.totalPartners) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search partners..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
              {filteredPartners.length} partners found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Partners</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedPartners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No partners found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Partner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Deliveries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedPartners.map((partner) => (
                      <tr key={partner.globalId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                              <AvatarFallback>
                                {partner.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{partner.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">ID: {partner.globalId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{partner.phone}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{partner.email || "No email"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {partner.address?.city || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{partner.rating}</span>
                          </div>
                          <div className="mt-1">{getPerformanceBadge(partner.onTimeRate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {partner.totalDeliveries}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{partner.completedToday} today</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(partner.activeStatus)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/delivery-admin/partners/${partner.globalId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${partner.phone}`)}>
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden space-y-4">
                {paginatedPartners.map((partner) => (
                  <div key={partner.globalId} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                          <AvatarFallback>
                            {partner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className="text-sm text-gray-500">ID: {partner.globalId}</p>
                        </div>
                      </div>
                      {getStatusBadge(partner.activeStatus)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Phone:</span>
                        <p>{partner.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {partner.address?.city || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Rating:</span>
                        <p className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {partner.rating}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Deliveries:</span>
                        <p>{partner.totalDeliveries} total</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPerformanceBadge(partner.onTimeRate)}
                        <span className="text-sm text-gray-500">{partner.onTimeRate}% on-time</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/delivery-admin/partners/${partner.globalId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => window.open(`tel:${partner.phone}`)}>
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredPartners.length)} of{" "}
                    {filteredPartners.length} partners
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
    </div>
  )
}
