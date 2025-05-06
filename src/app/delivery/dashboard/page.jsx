"use client"
import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeliveryLayout } from "@/components/delivery-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DeliveryDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [pendingDeliveries, setPendingDeliveries] = useState([])
  const [completedDeliveries, setCompletedDeliveries] = useState([])
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    pending: 0,
  })

  // Mock data for deliveries
  useEffect(() => {
    // Generate random pending deliveries
    const generatePendingDeliveries = () => {
      const deliveries = []
      const statuses = ["assigned", "picked_up", "in_transit"]

      for (let i = 0; i < 5; i++) {
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const customerName = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Neha Singh", "Vikram Reddy"][i]
        const address = [
          "123 Main St, Green Park, Delhi",
          "45 Park Avenue, Bandra, Mumbai",
          "78 Lake View, Koramangala, Bangalore",
          "22 Hill Road, Jubilee Hills, Hyderabad",
          "56 Garden Lane, Salt Lake, Kolkata",
        ][i]
        const items = Math.floor(2 + Math.random() * 5)
        const amount = Math.floor(200 + Math.random() * 800)

        deliveries.push({
          id: orderId,
          status,
          customerName,
          address,
          items,
          amount,
          assignedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString(),
        })
      }

      return deliveries
    }

    // Generate random completed deliveries
    const generateCompletedDeliveries = () => {
      const deliveries = []

      for (let i = 0; i < 10; i++) {
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`
        const customerName = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Neha Singh", "Vikram Reddy"][i % 5]
        const address = [
          "123 Main St, Green Park, Delhi",
          "45 Park Avenue, Bandra, Mumbai",
          "78 Lake View, Koramangala, Bangalore",
          "22 Hill Road, Jubilee Hills, Hyderabad",
          "56 Garden Lane, Salt Lake, Kolkata",
        ][i % 5]
        const items = Math.floor(2 + Math.random() * 5)
        const amount = Math.floor(200 + Math.random() * 800)
        const earnings = Math.floor(50 + Math.random() * 100)

        deliveries.push({
          id: orderId,
          customerName,
          address,
          items,
          amount,
          earnings,
          completedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toLocaleDateString(),
        })
      }

      return deliveries
    }

    // Generate random earnings
    const generateEarnings = () => {
      return {
        today: Math.floor(300 + Math.random() * 500),
        week: Math.floor(1500 + Math.random() * 1000),
        month: Math.floor(6000 + Math.random() * 4000),
        pending: Math.floor(200 + Math.random() * 300),
      }
    }

    setPendingDeliveries(generatePendingDeliveries())
    setCompletedDeliveries(generateCompletedDeliveries())
    setEarnings(generateEarnings())
  }, [])

  const handleStatusUpdate = (orderId, newStatus) => {
    setPendingDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) => (delivery.id === orderId ? { ...delivery, status: newStatus } : delivery)),
    )

    toast({
      title: "Status updated",
      description: `Order ${orderId} has been updated to ${newStatus.replace("_", " ")}.`,
    })

    // If delivery is completed, move it to completed deliveries
    if (newStatus === "delivered") {
      const delivery = pendingDeliveries.find((d) => d.id === orderId)
      if (delivery) {
        const completedDelivery = {
          ...delivery,
          completedAt: new Date().toLocaleDateString(),
          earnings: Math.floor(50 + Math.random() * 100),
        }

        setCompletedDeliveries((prev) => [completedDelivery, ...prev])
        setPendingDeliveries((prev) => prev.filter((d) => d.id !== orderId))

        // Update earnings
        setEarnings((prev) => ({
          ...prev,
          today: prev.today + completedDelivery.earnings,
          week: prev.week + completedDelivery.earnings,
          month: prev.month + completedDelivery.earnings,
        }))
      }
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Assigned
          </Badge>
        )
      case "picked_up":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Picked Up
          </Badge>
        )
      case "in_transit":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            In Transit
          </Badge>
        )
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "assigned":
        return "picked_up"
      case "picked_up":
        return "in_transit"
      case "in_transit":
        return "delivered"
      default:
        return currentStatus
    }
  }

  const getStatusActionText = (currentStatus) => {
    switch (currentStatus) {
      case "assigned":
        return "Mark as Picked Up"
      case "picked_up":
        return "Start Delivery"
      case "in_transit":
        return "Mark as Delivered"
      default:
        return "Update Status"
    }
  }

  const [isOnline, setIsOnline] = useState(true)

const toggleOnlineStatus = () => {
  setIsOnline((prev) => !prev)
}  

  return (
    <DeliveryLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
        <Button variant="outline" onClick={() => router.push("/delivery/profile")}>
          Update Availability
        </Button>
        <Button
            variant={isOnline ? "default" : "outline"}
            onClick={toggleOnlineStatus}
            className={isOnline ? "bg-green-600 hover:bg-green-700" : "text-red-600 border-red-600 hover:bg-red-800 "}
          >
            {isOnline ? "Online" : "Offline"}
          </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.today}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">+₹{Math.floor(Math.random() * 100)} </span> from
              yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 3v4M8 3v4M3 11h18M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.week}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">+₹{Math.floor(Math.random() * 300)} </span> from
              last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingDeliveries.filter((d) => d.status === "assigned").length} new assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedDeliveries.filter((d) => d.completedAt === new Date().toLocaleDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                {Math.floor(80 + Math.random() * 20)}% completion rate
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Delivery Route</CardTitle>
              <CardDescription>Optimize your route for maximum efficiency</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] relative">
              {/* Google Maps would be integrated here in a real application */}
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">Delivery Map</p>
                  <p className="text-sm text-muted-foreground">
                    Google Maps integration would show your delivery route here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Next Deliveries</CardTitle>
                <CardDescription>Your upcoming deliveries for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDeliveries.slice(0, 3).map((delivery) => (
                    <div key={delivery.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{delivery.customerName}</p>
                          {getStatusBadge(delivery.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{delivery.address}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{delivery.items} items</span>
                          <span>₹{delivery.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {pendingDeliveries.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No pending deliveries</p>
                    </div>
                  )}

                  {pendingDeliveries.length > 3 && (
                    <Button variant="ghost" className="w-full" onClick={() => setActiveTab("pending")}>
                      View All Deliveries
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
                <CardDescription>Your earnings for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Base Earnings</p>
                      <p className="text-xs text-muted-foreground">For {completedDeliveries.length} deliveries</p>
                    </div>
                    <p className="font-medium">₹{earnings.month - earnings.pending}</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Bonuses</p>
                      <p className="text-xs text-muted-foreground">Peak hours & weekend incentives</p>
                    </div>
                    <p className="font-medium">₹{Math.floor(earnings.month * 0.15)}</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Tips</p>
                      <p className="text-xs text-muted-foreground">Customer appreciation</p>
                    </div>
                    <p className="font-medium">₹{Math.floor(earnings.month * 0.08)}</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Pending Payout</p>
                      <p className="text-xs text-muted-foreground">Will be credited in 2 days</p>
                    </div>
                    <p className="font-medium text-orange-500">₹{earnings.pending}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <p className="font-medium">Total Earnings</p>
                      <p className="font-bold">₹{earnings.month}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Deliveries</CardTitle>
              <CardDescription>Manage your assigned deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingDeliveries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell>{delivery.customerName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{delivery.address}</TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        <TableCell>{delivery.assignedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/delivery/orders/${delivery.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, getNextStatus(delivery.status))}
                            >
                              {getStatusActionText(delivery.status)}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending deliveries</h3>
                  <p className="text-muted-foreground">You don't have any pending deliveries at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Deliveries</CardTitle>
              <CardDescription>History of your completed deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              {completedDeliveries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Completed On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell>{delivery.customerName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{delivery.address}</TableCell>
                        <TableCell>{delivery.items}</TableCell>
                        <TableCell>₹{delivery.amount}</TableCell>
                        <TableCell>₹{delivery.earnings}</TableCell>
                        <TableCell>{delivery.completedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No completed deliveries</h3>
                  <p className="text-muted-foreground">You haven't completed any deliveries yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DeliveryLayout>
  )
}
