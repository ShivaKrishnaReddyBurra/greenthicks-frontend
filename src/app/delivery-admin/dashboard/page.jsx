"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Users,
  Truck,
  AlertTriangle,
  Download,
  Package,
  ArrowUp,
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getDeliveryOrders, getDeliveryBoys, fetchWithAuth } from "@/lib/api"

export default function DeliveryAdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activePartners: 0,
    pendingDeliveries: 0,
    completedToday: 0,
    totalRevenue: 0,
    avgDeliveryTime: 0,
    customerSatisfaction: 0,
    onTimeDeliveryRate: 0,
  })

  const [recentDeliveries, setRecentDeliveries] = useState([])
  const [topPartners, setTopPartners] = useState([])
  const [deliveryMetrics, setDeliveryMetrics] = useState({
    hourlyData: [],
    statusDistribution: [],
    regionPerformance: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch delivery orders
        const ordersData = await getDeliveryOrders(1, 20)

        // Fetch delivery partners
        const partnersData = await getDeliveryBoys()

        // Fetch analytics data
        const analyticsData = await fetchWithAuth("/api/delivery/analytics")

        // Process stats
        const totalDeliveries = ordersData.total || 0
        const activePartners = partnersData.filter((p) => p.activeStatus).length
        const pendingDeliveries = ordersData.orders.filter(
          (o) => o.deliveryStatus === "assigned" || o.deliveryStatus === "out-for-delivery",
        ).length
        const completedToday = ordersData.orders.filter(
          (o) => o.deliveryStatus === "delivered" && new Date(o.updatedAt).toDateString() === new Date().toDateString(),
        ).length

        setStats({
          totalDeliveries,
          activePartners,
          pendingDeliveries,
          completedToday,
          totalRevenue: analyticsData?.totalRevenue || 125000,
          avgDeliveryTime: analyticsData?.avgDeliveryTime || 28,
          customerSatisfaction: analyticsData?.customerSatisfaction || 4.6,
          onTimeDeliveryRate: analyticsData?.onTimeDeliveryRate || 94.2,
        })

        // Set recent deliveries
        setRecentDeliveries(ordersData.orders.slice(0, 10))

        // Set top partners (mock data for now)
        const topPartnersData = partnersData.slice(0, 5).map((partner) => ({
          id: partner.globalId,
          name: partner.name,
          deliveries: Math.floor(Math.random() * 50) + 20,
          rating: (4.0 + Math.random() * 1).toFixed(1),
          earnings: Math.floor(Math.random() * 5000) + 2000,
          location: partner.address?.city || "Unknown",
        }))
        setTopPartners(topPartnersData)

        // Set delivery metrics (mock data)
        setDeliveryMetrics({
          hourlyData: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            deliveries: Math.floor(Math.random() * 20) + 5,
          })),
          statusDistribution: [
            { status: "Delivered", count: completedToday, percentage: 65 },
            { status: "Out for Delivery", count: Math.floor(pendingDeliveries * 0.6), percentage: 20 },
            { status: "Assigned", count: Math.floor(pendingDeliveries * 0.4), percentage: 15 },
          ],
          regionPerformance: [
            { region: "Hyderabad", deliveries: 145, onTime: 96 },
            { region: "Warangal", deliveries: 89, onTime: 92 },
            { region: "Nizamabad", deliveries: 67, onTime: 88 },
          ],
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Delivery Operations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage delivery operations</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
          <Button className="flex items-center bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp size={12} className="mr-1" />
                +12%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePartners}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp size={12} className="mr-1" />
                +3
              </span>{" "}
              new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">{stats.onTimeDeliveryRate}% on-time</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDeliveryTime} min</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {stats.customerSatisfaction}
              <Star className="h-4 w-4 text-yellow-500 ml-1" />
            </div>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTimeDeliveryRate}%</div>
            <Progress value={stats.onTimeDeliveryRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp size={12} className="mr-1" />
                +8.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deliveries">Recent Deliveries</TabsTrigger>
          <TabsTrigger value="partners">Top Partners</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Deliveries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Latest delivery activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDeliveries.slice(0, 5).map((delivery) => (
                    <div key={delivery.globalId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                          <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">#{delivery.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(delivery.deliveryStatus)}
                        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(delivery.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/delivery-admin/deliveries">
                    <Button variant="outline" className="w-full">
                      View All Deliveries
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryMetrics.statusDistribution.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status.toLowerCase().replace(" ", "-"))}
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{item.count}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>All Recent Deliveries</CardTitle>
              <CardDescription>Complete list of recent delivery activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.globalId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(delivery.deliveryStatus)}
                      <p className="text-sm font-medium mt-1">{formatCurrency(delivery.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(delivery.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Partners</CardTitle>
              <CardDescription>Best delivery partners this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPartners.map((partner, index) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {partner.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {partner.deliveries} deliveries • {partner.rating} ⭐
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(partner.earnings)}</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Delivery performance by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryMetrics.regionPerformance.map((region) => (
                    <div key={region.region} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{region.region}</span>
                        <span className="text-sm text-muted-foreground">{region.deliveries} deliveries</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={region.onTime} className="flex-1" />
                        <span className="text-sm font-medium">{region.onTime}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Trends</CardTitle>
                <CardDescription>Hourly delivery distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Delivery Analytics Chart</p>
                    <p className="text-sm text-muted-foreground">Chart visualization would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
