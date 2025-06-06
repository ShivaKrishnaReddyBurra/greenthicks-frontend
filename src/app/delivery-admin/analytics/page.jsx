"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  MapPin,
  Star,
  Users,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  Target,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function DeliveryAnalytics() {
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalDeliveries: 1247,
      completionRate: 94.2,
      avgDeliveryTime: 28,
      customerSatisfaction: 4.6,
      revenue: 156780,
      growth: 12.5,
    },
    performance: {
      onTimeDeliveries: 1175,
      lateDeliveries: 72,
      avgRating: 4.6,
      topPerformers: [],
    },
    regional: {
      regions: [
        { name: "Hyderabad", deliveries: 567, onTime: 96, revenue: 78450 },
        { name: "Warangal", deliveries: 342, onTime: 92, revenue: 45230 },
        { name: "Nizamabad", deliveries: 234, onTime: 88, revenue: 28100 },
        { name: "Karimnagar", deliveries: 104, onTime: 85, revenue: 15000 },
      ],
    },
    trends: {
      daily: [],
      hourly: [],
      weekly: [],
    },
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        // In a real app, this would fetch from your analytics API
        // const data = await fetchWithAuth(`/api/delivery/analytics?range=${timeRange}`)

        // Mock data generation
        const mockTrends = {
          daily: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            deliveries: Math.floor(Math.random() * 50) + 100,
            revenue: Math.floor(Math.random() * 10000) + 15000,
          })),
          hourly: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            deliveries: Math.floor(Math.random() * 20) + 5,
          })),
          weekly: Array.from({ length: 4 }, (_, i) => ({
            week: `Week ${i + 1}`,
            deliveries: Math.floor(Math.random() * 200) + 300,
            revenue: Math.floor(Math.random() * 50000) + 40000,
          })),
        }

        setAnalytics((prev) => ({
          ...prev,
          trends: mockTrends,
        }))
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange, toast])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Delivery Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Insights and performance metrics</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalDeliveries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp size={12} className="mr-1" />+{analytics.overview.growth}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.completionRate}%</div>
            <Progress value={analytics.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.avgDeliveryTime} min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowDown size={12} className="mr-1" />
                -2 min
              </span>{" "}
              improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {analytics.overview.customerSatisfaction}
              <Star className="h-4 w-4 text-yellow-500 ml-1" />
            </div>
            <Progress value={analytics.overview.customerSatisfaction * 20} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp size={12} className="mr-1" />+{analytics.overview.growth}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((analytics.performance.onTimeDeliveries / analytics.overview.totalDeliveries) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{analytics.performance.onTimeDeliveries} on-time deliveries</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="partners">Partner Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>On-time vs late deliveries breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">On-Time Deliveries</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{analytics.performance.onTimeDeliveries}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        {((analytics.performance.onTimeDeliveries / analytics.overview.totalDeliveries) * 100).toFixed(
                          1,
                        )}
                        %)
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(analytics.performance.onTimeDeliveries / analytics.overview.totalDeliveries) * 100}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Late Deliveries</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{analytics.performance.lateDeliveries}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        {((analytics.performance.lateDeliveries / analytics.overview.totalDeliveries) * 100).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(analytics.performance.lateDeliveries / analytics.overview.totalDeliveries) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Time Distribution</CardTitle>
                <CardDescription>Average delivery times by time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Time Distribution Chart</p>
                    <p className="text-sm text-muted-foreground">Chart visualization would be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Delivery metrics by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analytics.regional.regions.map((region, index) => (
                  <div key={region.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{region.name}</span>
                        </div>
                        <Badge variant="outline">{region.deliveries} deliveries</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(region.revenue)}</div>
                        <div className="text-sm text-muted-foreground">{region.onTime}% on-time</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={region.onTime} className="flex-1" />
                      <span className="text-sm font-medium w-12">{region.onTime}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Trends</CardTitle>
                <CardDescription>Delivery volume and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Daily Trends Chart</p>
                    <p className="text-sm text-muted-foreground">Line chart showing daily performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Distribution</CardTitle>
                <CardDescription>Peak delivery hours analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Hourly Distribution</p>
                    <p className="text-sm text-muted-foreground">Bar chart showing hourly delivery patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Week-over-week comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.trends.weekly.map((week, index) => (
                  <div key={week.week} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{week.week}</p>
                        <p className="text-sm text-muted-foreground">{week.deliveries} deliveries</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(week.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Best performing delivery partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Rajesh Kumar", deliveries: 89, rating: 4.9, earnings: 12500 },
                    { name: "Priya Sharma", deliveries: 76, rating: 4.8, earnings: 11200 },
                    { name: "Amit Patel", deliveries: 68, rating: 4.7, earnings: 9800 },
                    { name: "Neha Singh", deliveries: 62, rating: 4.6, earnings: 8900 },
                  ].map((partner, index) => (
                    <div key={partner.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{partner.name}</p>
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

            <Card>
              <CardHeader>
                <CardTitle>Partner Metrics</CardTitle>
                <CardDescription>Overall partner performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Average Rating</span>
                      <span className="text-sm font-medium">{analytics.performance.avgRating}/5.0</span>
                    </div>
                    <Progress value={analytics.performance.avgRating * 20} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Active Partners</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Partner Satisfaction</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">156</div>
                        <div className="text-sm text-muted-foreground">Total Partners</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">132</div>
                        <div className="text-sm text-muted-foreground">Active Today</div>
                      </div>
                    </div>
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
