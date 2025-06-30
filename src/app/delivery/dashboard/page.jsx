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
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";

function CompletionRate() {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const value = Math.floor(80 + Math.random() * 20);
    setRate(value);
  }, []);

  if (rate === null) return <Skeleton className="h-6 w-24" />;

  return (
    <span className="text-green-500 inline-flex items-center">
      {rate}% completion rate
    </span>
  );
}

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

const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const mapContainerStyle = {
  height: "200px",
  width: "100%",
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
  const [actionLoading, setActionLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false); // New state for map visibility
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
      setIsLoading(false);
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
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchUserStatus();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast({
            title: "Error",
            description: "Failed to get current location",
            variant: "destructive",
          });
        }
      );
    }
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
      setActionLoading(false);
    }
  };

  const handleTabChange = async (value) => {
    setActionLoading(true);
    setActiveTab(value);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setActionLoading(false);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(href);
    setActionLoading(false);
  };

  const handlePlanRoute = async () => {
    setActionLoading(true);
    try {
      if (!userLocation) {
        toast({
          title: "Error",
          description: "Current location not available",
          variant: "destructive",
        });
        return;
      }

      const sortedDeliveries = pendingDeliveries
        .filter((delivery) => delivery.shippingAddress.location?.latitude && delivery.shippingAddress.location?.longitude)
        .sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow(userLocation.lat - parseFloat(a.shippingAddress.location.latitude), 2) +
            Math.pow(userLocation.lng - parseFloat(a.shippingAddress.location.longitude), 2)
          );
          const distB = Math.sqrt(
            Math.pow(userLocation.lat - parseFloat(b.shippingAddress.location.latitude), 2) +
            Math.pow(userLocation.lng - parseFloat(b.shippingAddress.location.longitude), 2)
          );
          return distA - distB;
        });

      if (sortedDeliveries.length === 0) {
        toast({
          title: "Error",
          description: "No valid delivery locations available",
          variant: "destructive",
        });
        return;
      }

      const origin = `${userLocation.lat},${userLocation.lng}`;
      const destinations = sortedDeliveries.map(
        (delivery) => `${delivery.shippingAddress.location.latitude},${delivery.shippingAddress.location.longitude}`
      );
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinations[destinations.length - 1]}&waypoints=${destinations.slice(0, -1).join('|')}&travelmode=driving`;

      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open Google Maps",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500 text-sm">
            Assigned
          </Badge>
        );
      case "out-for-delivery":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-500 text-sm">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-500 text-sm">Delivered</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">Unknown</Badge>;
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

  const defaultCenter = pendingDeliveries.length > 0 && pendingDeliveries[0].shippingAddress.location?.latitude
    ? {
        lat: parseFloat(pendingDeliveries[0].shippingAddress.location?.latitude),
        lng: parseFloat(pendingDeliveries[0].shippingAddress.location?.longitude),
      }
    : { lat: 17.9784, lng: 79.5941 };

  return (
    <>
      {actionLoading && <LeafLoader />}
      <DeliveryLayout>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4 max-w-[100vw] overflow-x-hidden">
            <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">Delivery Dashboard</h1>
              <Button
                variant={isOnline ? "default" : "outline"}
                onClick={toggleOnlineStatus}
                className={`${isOnline ? "bg-green-600 hover:bg-green-700" : "text-red-600 border-red-600 hover:bg-red-50"} text-sm h-10 px-4`}
              >
                {isOnline ? "Online" : "Offline"}
              </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
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
                <CardContent className="p-4">
                  <div className="text-lg sm:text-xl font-bold">₹{earnings.today}</div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      +₹{(earnings.today * 0.1).toFixed(2)}
                    </span>{" "}
                    from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
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
                <CardContent className="p-4">
                  <div className="text-lg sm:text-xl font-bold">₹{earnings.week}</div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      +₹{(earnings.week * 0.1).toFixed(2)}
                    </span>{" "}
                    from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-lg sm:text-xl font-bold">{pendingDeliveries.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {pendingDeliveries.filter((d) => d.deliveryStatus === "assigned").length} new assignments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-lg sm:text-xl font-bold">
                    {
                      completedDeliveries.filter(
                        (d) => new Date(d.updatedAt).toDateString() === new Date().toDateString()
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="mt-4" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full flex flex-row justify-start overflow-x-auto">
                <TabsTrigger value="overview" className="text-sm px-3 py-1.5">Overview</TabsTrigger>
                <TabsTrigger value="pending" className="text-sm px-3 py-1.5">Pending Deliveries</TabsTrigger>
                <TabsTrigger value="completed" className="text-sm px-3 py-1.5">Completed Deliveries</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg sm:text-xl">Today's Delivery Route</CardTitle>
                        <CardDescription className="text-sm">Optimize your route for maximum efficiency</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowMap(!showMap)} className="text-sm h-10 px-4">
                          {showMap ? "Hide Delivery Map" : "Show Delivery Map"}
                        </Button>
                        <Button onClick={handlePlanRoute} disabled={pendingDeliveries.length === 0} className="text-sm h-10 px-4">
                          Plan Route
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {showMap && (
                    <CardContent className="min-h-[200px] sm:h-[300px] relative">
                      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                        {pendingDeliveries.length > 0 ? (
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={defaultCenter}
                            zoom={12}
                          >
                            {pendingDeliveries.map((delivery) => (
                              delivery.shippingAddress.location?.latitude && delivery.shippingAddress.location?.longitude && (
                                <Marker
                                  key={delivery.globalId}
                                  position={{
                                    lat: parseFloat(delivery.shippingAddress.location?.latitude),
                                    lng: parseFloat(delivery.shippingAddress.location?.longitude),
                                  }}
                                  title={`${delivery.shippingAddress.firstName} ${delivery.shippingAddress.lastName}`}
                                  label={delivery.id}
                                />
                              )
                            ))}
                          </GoogleMap>
                        ) : (
                          <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                              <p className="text-sm font-medium">No Delivery Locations</p>
                              <p className="text-sm text-muted-foreground">
                                No pending deliveries to display on the map.
                              </p>
                            </div>
                          </div>
                        )}
                      </LoadScript>
                    </CardContent>
                  )}
                </Card>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Next Deliveries</CardTitle>
                      <CardDescription className="text-sm">Your upcoming deliveries for today</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {pendingDeliveries.slice(0, 3).map((delivery) => (
                          <div key={delivery.globalId} className="flex items-start gap-2 pb-2 border-b last:border-0 last:pb-0">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}</p>
                                {getStatusBadge(delivery.deliveryStatus)}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <span>{delivery.items.length} items</span>
                                <span>₹{delivery.total}</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {pendingDeliveries.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground text-sm">No pending deliveries</p>
                          </div>
                        )}

                        {pendingDeliveries.length > 3 && (
                          <Button variant="ghost" className="w-full text-sm h-10 px-4" onClick={() => handleTabChange("pending")}>
                            View All Deliveries
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Earnings Breakdown</CardTitle>
                      <CardDescription className="text-sm">Your earnings for this month</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">Base Earnings</p>
                            <p className="text-sm text-muted-foreground">For {completedDeliveries.length} deliveries</p>
                          </div>
                          <p className="font-medium text-sm">₹{(earnings.month - earnings.pending).toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">Bonuses</p>
                            <p className="text-sm text-muted-foreground">Peak hours & weekend incentives</p>
                          </div>
                          <p className="font-medium text-sm">₹{(earnings.month * 0.15).toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">Tips</p>
                            <p className="text-sm text-muted-foreground">Customer appreciation</p>
                          </div>
                          <p className="font-medium text-sm">₹{(earnings.month * 0.08).toFixed(2)}</p>
                        </div>

                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">Pending Payout</p>
                            <p className="text-sm text-muted-foreground">Will be credited in 2 days</p>
                          </div>
                          <p className="font-medium text-orange-500 text-sm">₹{earnings.pending}</p>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm">Total Earnings</p>
                            <p className="font-bold text-sm">₹{earnings.month}</p>
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
                    <CardTitle className="text-lg sm:text-xl">Pending Deliveries</CardTitle>
                    <CardDescription className="text-sm">Manage your assigned deliveries</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    {pendingDeliveries.length > 0 ? (
                      <>
                        <div className="lg:hidden space-y-4">
                          {pendingDeliveries.map((delivery) => (
                            <div
                              key={delivery.globalId}
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm overflow-hidden"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <p className="font-medium text-sm truncate">{delivery.id}</p>
                                {getStatusBadge(delivery.deliveryStatus)}
                              </div>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-900 dark:text-white">
                                  {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 truncate">
                                  {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Assigned: {new Date(delivery.orderDate).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="mt-3 flex justify-end gap-2">
                                <Link href={`/delivery/orders/${delivery.globalId}`} onClick={(e) => handleNavigation(e, `/delivery/orders/${delivery.globalId}`)}>
                                  <Button variant="ghost" size="sm" className="text-sm h-10 px-4">
                                    View
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  className="text-sm h-10 px-4"
                                  onClick={() => handleStatusUpdate(delivery.globalId, getNextStatus(delivery.deliveryStatus))}
                                >
                                  {getStatusActionText(delivery.deliveryStatus)}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="hidden lg:block overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-sm w-[80px]">Order ID</TableHead>
                                <TableHead className="text-sm">Customer</TableHead>
                                <TableHead className="text-sm">Address</TableHead>
                                <TableHead className="text-sm">Status</TableHead>
                                <TableHead className="text-sm">Assigned At</TableHead>
                                <TableHead className="text-sm text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pendingDeliveries.map((delivery) => (
                                <TableRow key={delivery.globalId}>
                                  <TableCell className="font-medium text-sm">{delivery.id}</TableCell>
                                  <TableCell className="text-sm">
                                    {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                                  </TableCell>
                                  <TableCell className="text-sm max-w-[150px] truncate">
                                    {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                                  </TableCell>
                                  <TableCell>{getStatusBadge(delivery.deliveryStatus)}</TableCell>
                                  <TableCell className="text-sm">{new Date(delivery.orderDate).toLocaleTimeString()}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Link href={`/delivery/orders/${delivery.globalId}`} onClick={(e) => handleNavigation(e, `/delivery/orders/${delivery.globalId}`)}>
                                        <Button variant="ghost" size="sm" className="text-sm h-10 px-4">
                                          View
                                        </Button>
                                      </Link>
                                      <Button
                                        size="sm"
                                        className="text-sm h-10 px-4"
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
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="text-base font-medium mb-1">No pending deliveries</h3>
                        <p className="text-sm text-muted-foreground">You don't have any pending deliveries at the moment.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Completed Deliveries</CardTitle>
                    <CardDescription className="text-sm">History of your assigned deliveries</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    {completedDeliveries.length > 0 ? (
                      <>
                        <div className="lg:hidden space-y-4">
                          {completedDeliveries.map((delivery) => (
                            <div
                              key={delivery.globalId}
                              className="bg-white dark:bg-black-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm overflow-hidden"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <p className="font-medium text-sm truncate">{delivery.id}</p>
                                {getStatusBadge(delivery.deliveryStatus)}
                              </div>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-900 dark:text-white">
                                  {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 truncate">
                                  {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Items: {delivery.items.length}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Amount: ₹{delivery.total}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Earnings: ₹{(delivery.total * 0.1).toFixed(2)}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Completed: {new Date(delivery.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="hidden lg:block overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-sm w-[80px]">Order ID</TableHead>
                                <TableHead className="text-sm">Customer</TableHead>
                                <TableHead className="text-sm">Address</TableHead>
                                <TableHead className="text-sm">Items</TableHead>
                                <TableHead className="text-sm">Amount</TableHead>
                                <TableHead className="text-sm">Earnings</TableHead>
                                <TableHead className="text-sm">Completed On</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {completedDeliveries.map((delivery) => (
                                <TableRow key={delivery.globalId}>
                                  <TableCell className="font-medium text-sm">{delivery.id}</TableCell>
                                  <TableCell className="text-sm">
                                    {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                                  </TableCell>
                                  <TableCell className="text-sm max-w-[150px] truncate">
                                    {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                                  </TableCell>
                                  <TableCell className="text-sm">{delivery.items.length}</TableCell>
                                  <TableCell className="text-sm">₹{delivery.total}</TableCell>
                                  <TableCell className="text-sm">₹{(delivery.total * 0.1).toFixed(2)}</TableCell>
                                  <TableCell className="text-sm">{new Date(delivery.updatedAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <h3 className="text-base font-medium mb-1">No completed deliveries</h3>
                        <p className="text-sm text-muted-foreground">You haven't completed any deliveries yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DeliveryLayout>
    </>
  );
}