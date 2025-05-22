"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { getDeliveryOrders, updateDeliveryStatus, getUserProfile, fetchWithAuth } from "@/lib/api";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    pending: 0,
  });
  const [isOnline, setIsOnline] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const debounceTimeout = useRef(null);

  const fetchDeliveries = async () => {
    setActionLoading(true);
    try {
      const data = await getDeliveryOrders(1, 10);
      const pending = data.orders.filter((order) => order.deliveryStatus !== "delivered");
      const completed = data.orders.filter((order) => order.deliveryStatus === "delivered");

      setPendingDeliveries(pending);
      setCompletedDeliveries(completed);

      const todayEarnings = completed
        .filter((order) => new Date(order.updatedAt).toDateString() === new Date().toDateString())
        .reduce((sum, order) => sum + order.total * 0.1, 0);
      const weekEarnings = completed
        .filter((order) => new Date(order.updatedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .reduce((sum, order) => sum + order.total * 0.1, 0);
      const monthEarnings = completed.reduce((sum, order) => sum + order.total * 0.1, 0);
      const pendingPayout = pending.reduce((sum, order) => sum + order.total * 0.1, 0);

      setEarnings({
        today: todayEarnings.toFixed(2),
        week: weekEarnings.toFixed(2),
        month: monthEarnings.toFixed(2),
        pending: pendingPayout.toFixed(2),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch deliveries",
        variant: "destructive",
      });
      if (error.message.includes("Token expired")) {
        setActionLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/delivery/login");
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    setActionLoading(true);
    try {
      const data = await getUserProfile();
      setIsOnline(data.activeStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch user profile",
        variant: "destructive",
      });
      if (error.message.includes("Token expired")) {
        setActionLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/delivery/login");
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchUserStatus();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await updateDeliveryStatus(orderId, newStatus);
        toast({
          title: "Status updated",
          description: `Order ${orderId} has been updated to ${newStatus.replace("-", " ")}.`,
        });

        if (newStatus === "delivered") {
          const delivery = pendingDeliveries.find((d) => d.globalId === orderId);
          if (delivery) {
            setCompletedDeliveries((prev) => [
              { ...delivery, deliveryStatus: "delivered", updatedAt: new Date() },
              ...prev,
            ]);
            setPendingDeliveries((prev) => prev.filter((d) => d.globalId !== orderId));
            setEarnings((prev) => ({
              ...prev,
              today: (parseFloat(prev.today) + delivery.total * 0.1).toFixed(2),
              week: (parseFloat(prev.week) + delivery.total * 0.1).toFixed(2),
              month: (parseFloat(prev.month) + delivery.total * 0.1).toFixed(2),
            }));
          }
        } else {
          setPendingDeliveries((prevDeliveries) =>
            prevDeliveries.map((delivery) =>
              delivery.globalId === orderId ? { ...delivery, deliveryStatus: newStatus } : delivery
            )
          );
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update status",
          variant: "destructive",
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const toggleOnlineStatus = async () => {
    setActionLoading(true);
    try {
      const data = await fetchWithAuth("/api/delivery/active-status", {
        method: "PUT",
      });
      setIsOnline(data.activeStatus);
      toast({
        title: "Status updated",
        description: `You are now ${data.activeStatus ? "online" : "offline"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update active status",
        variant: "destructive",
      });
      if (error.message.includes("Token expired")) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/delivery/login");
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
  };

  const handleTabChange = async (value) => {
    setActionLoading(true);
    setActiveTab(value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActionLoading(false);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setActionLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Assigned
          </Badge>
        );
      case "out-for-delivery":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "assigned":
        return "out-for-delivery";
      case "out-for-delivery":
        return "delivered";
      default:
        return currentStatus;
    }
  };

  const getStatusActionText = (currentStatus) => {
    switch (currentStatus) {
      case "assigned":
        return "Start Delivery";
      case "out-for-delivery":
        return "Mark as Delivered";
      default:
        return "Update Status";
    }
  };

  return (
    <>
      {actionLoading && <LeafLoader />}
      <DeliveryLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <Button
            variant={isOnline ? "default" : "outline"}
            onClick={toggleOnlineStatus}
            className={isOnline ? "bg-green-600 hover:bg-green-700" : "text-red-600 border-red-600 hover:bg-red-50"}
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
                <span className="text-green-500 inline-flex items-center">
                  +₹{(earnings.today * 0.1).toFixed(2)}
                </span>{" "}
                from yesterday
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
                <span className="text-green-500 inline-flex items-center">
                  +₹{(earnings.week * 0.1).toFixed(2)}
                </span>{" "}
                from last week
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
                {pendingDeliveries.filter((d) => d.deliveryStatus === "assigned").length} new assignments
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
                {
                  completedDeliveries.filter(
                    (d) => new Date(d.updatedAt).toDateString() === new Date().toDateString()
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  {Math.floor(80 + Math.random() * 20)}% completion rate
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-6" value={activeTab} onValueChange={handleTabChange}>
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
                      <div key={delivery.globalId} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}</p>
                            {getStatusBadge(delivery.deliveryStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{delivery.items.length} items</span>
                            <span>₹{delivery.total}</span>
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
                      <Button variant="ghost" className="w-full" onClick={() => handleTabChange("pending")}>
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
                      <p className="font-medium">₹{(earnings.month - earnings.pending).toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Bonuses</p>
                        <p className="text-xs text-muted-foreground">Peak hours & weekend incentives</p>
                      </div>
                      <p className="font-medium">₹{(earnings.month * 0.15).toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Tips</p>
                        <p className="text-xs text-muted-foreground">Customer appreciation</p>
                      </div>
                      <p className="font-medium">₹{(earnings.month * 0.08).toFixed(2)}</p>
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
                        <TableRow key={delivery.globalId}>
                          <TableCell className="font-medium">{delivery.id}</TableCell>
                          <TableCell>
                            {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                          </TableCell>
                          <TableCell>{getStatusBadge(delivery.deliveryStatus)}</TableCell>
                          <TableCell>{new Date(delivery.orderDate).toLocaleTimeString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/delivery/orders/${delivery.globalId}`} onClick={(e) => handleNavigation(e, `/delivery/orders/${delivery.globalId}`)}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(delivery.globalId, getNextStatus(delivery.deliveryStatus))}
                              >
                                {getStatusActionText(delivery.deliveryStatus)}
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
                <CardDescription>History of your assigned deliveries</CardDescription>
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
                        <TableRow key={delivery.globalId}>
                          <TableCell className="font-medium">{delivery.id}</TableCell>
                          <TableCell>
                            {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                          </TableCell>
                          <TableCell>{delivery.items.length}</TableCell>
                          <TableCell>₹{delivery.total}</TableCell>
                          <TableCell>₹{(delivery.total * 0.1).toFixed(2)}</TableCell>
                          <TableCell>{new Date(delivery.updatedAt).toLocaleDateString()}</TableCell>
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
    </>
  );
}
