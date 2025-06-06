"use client"

import { useState } from "react"
import {
  MapPin,
  Route,
  Clock,
  Truck,
  Navigation,
  Zap,
  Target,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function RouteOptimization() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState([
    {
      id: "RT-001",
      partnerId: "DEL-001",
      partnerName: "Rajesh Kumar",
      status: "active",
      deliveries: 8,
      estimatedTime: 240,
      actualTime: 225,
      distance: 45.2,
      efficiency: 94,
      stops: [
        { address: "Banjara Hills", status: "completed", time: "09:30" },
        { address: "Jubilee Hills", status: "completed", time: "10:15" },
        { address: "Madhapur", status: "in-progress", time: "11:00" },
        { address: "Gachibowli", status: "pending", time: "11:45" },
        { address: "Kondapur", status: "pending", time: "12:30" },
      ],
    },
    {
      id: "RT-002",
      partnerId: "DEL-002",
      partnerName: "Priya Sharma",
      status: "active",
      deliveries: 6,
      estimatedTime: 180,
      actualTime: 165,
      distance: 32.8,
      efficiency: 98,
      stops: [
        { address: "Secunderabad", status: "completed", time: "09:00" },
        { address: "Begumpet", status: "completed", time: "09:45" },
        { address: "Somajiguda", status: "completed", time: "10:30" },
        { address: "Ameerpet", status: "in-progress", time: "11:15" },
        { address: "SR Nagar", status: "pending", time: "12:00" },
      ],
    },
    {
      id: "RT-003",
      partnerId: "DEL-003",
      partnerName: "Amit Patel",
      status: "delayed",
      deliveries: 10,
      estimatedTime: 300,
      actualTime: 340,
      distance: 58.5,
      efficiency: 76,
      stops: [
        { address: "Kukatpally", status: "completed", time: "08:30" },
        { address: "KPHB", status: "completed", time: "09:15" },
        { address: "Miyapur", status: "completed", time: "10:00" },
        { address: "Bachupally", status: "delayed", time: "10:45" },
        { address: "Nizampet", status: "pending", time: "11:30" },
      ],
    },
  ])

  const [optimizationStats, setOptimizationStats] = useState({
    totalRoutes: 15,
    activeRoutes: 12,
    avgEfficiency: 89,
    timeSaved: 45,
    fuelSaved: 12.5,
    co2Reduced: 28.3,
  })

  const handleOptimizeRoutes = async () => {
    setLoading(true)
    try {
      // Simulate route optimization
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update routes with optimized data
      setRoutes((prevRoutes) =>
        prevRoutes.map((route) => ({
          ...route,
          efficiency: Math.min(route.efficiency + Math.floor(Math.random() * 10), 100),
          estimatedTime: Math.max(route.estimatedTime - Math.floor(Math.random() * 30), 120),
        })),
      )

      toast({
        title: "Routes Optimized",
        description: "All active routes have been optimized for efficiency.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize routes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={12} className="mr-1" />
            Active
          </Badge>
        )
      case "delayed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle size={12} className="mr-1" />
            Delayed
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStopStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />
      case "in-progress":
        return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      case "delayed":
        return <div className="w-3 h-3 bg-red-500 rounded-full" />
      default:
        return <div className="w-3 h-3 bg-gray-300 rounded-full" />
    }
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Route Optimization</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Optimize delivery routes for maximum efficiency</p>
        </div>
        <Button
          onClick={handleOptimizeRoutes}
          disabled={loading}
          className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700"
        >
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
          Optimize All Routes
        </Button>
      </div>

      {/* Optimization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationStats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">{optimizationStats.activeRoutes} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationStats.avgEfficiency}%</div>
            <Progress value={optimizationStats.avgEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationStats.timeSaved} min</div>
            <p className="text-xs text-muted-foreground">Per route on average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationStats.fuelSaved}L</div>
            <p className="text-xs text-muted-foreground">Today's optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Reduced</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationStats.co2Reduced}kg</div>
            <p className="text-xs text-muted-foreground">Environmental impact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationStats.activeRoutes}</div>
            <p className="text-xs text-muted-foreground">Currently on delivery</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-routes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active-routes">Active Routes</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Route Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active-routes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {routes.map((route) => (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{route.partnerName}</CardTitle>
                      <CardDescription>
                        Route {route.id} • {route.deliveries} deliveries
                      </CardDescription>
                    </div>
                    {getStatusBadge(route.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Distance:</span>
                      <p>{route.distance} km</p>
                    </div>
                    <div>
                      <span className="font-medium">Efficiency:</span>
                      <p className="flex items-center">
                        {route.efficiency}%
                        <Progress value={route.efficiency} className="ml-2 flex-1" />
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Est. Time:</span>
                      <p>
                        {Math.floor(route.estimatedTime / 60)}h {route.estimatedTime % 60}m
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Actual Time:</span>
                      <p className={route.actualTime > route.estimatedTime ? "text-red-500" : "text-green-500"}>
                        {Math.floor(route.actualTime / 60)}h {route.actualTime % 60}m
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Route Progress</h4>
                    <div className="space-y-2">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {getStopStatusBadge(stop.status)}
                          <div className="flex-1">
                            <span className="text-sm font-medium">{stop.address}</span>
                            <span className="text-xs text-muted-foreground ml-2">{stop.time}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {stop.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Map
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Settings</CardTitle>
                <CardDescription>Configure route optimization parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Minimize Time</option>
                    <option>Minimize Distance</option>
                    <option>Minimize Fuel</option>
                    <option>Balanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Deliveries per Route</label>
                  <input type="number" defaultValue="10" className="w-full p-2 border rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Working Hours</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="time" defaultValue="09:00" className="p-2 border rounded-md" />
                    <input type="time" defaultValue="18:00" className="p-2 border rounded-md" />
                  </div>
                </div>
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Optimization
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Results</CardTitle>
                <CardDescription>Latest optimization performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Routes Optimized</span>
                    <span className="font-medium">12/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Time Improvement</span>
                    <span className="font-medium text-green-600">-18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Distance Reduction</span>
                    <span className="font-medium text-green-600">-12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Savings</span>
                    <span className="font-medium text-green-600">-15%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Optimization Score</h4>
                  <div className="flex items-center space-x-2">
                    <Progress value={89} className="flex-1" />
                    <span className="font-bold">89%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Excellent optimization performance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Performance Trends</CardTitle>
                <CardDescription>Historical optimization data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium">Performance Trends Chart</p>
                    <p className="text-sm text-muted-foreground">Chart showing route efficiency over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Efficiency</CardTitle>
                <CardDescription>Route performance by area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: "Central Hyderabad", efficiency: 94, routes: 8 },
                    { area: "West Hyderabad", efficiency: 87, routes: 6 },
                    { area: "East Hyderabad", efficiency: 91, routes: 5 },
                    { area: "North Hyderabad", efficiency: 83, routes: 4 },
                  ].map((area) => (
                    <div key={area.area} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{area.area}</span>
                        <span className="text-sm text-muted-foreground">{area.routes} routes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={area.efficiency} className="flex-1" />
                        <span className="text-sm font-medium w-12">{area.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
