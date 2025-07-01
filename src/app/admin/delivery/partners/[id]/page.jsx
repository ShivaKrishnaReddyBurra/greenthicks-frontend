import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Star,
  Truck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DeliveryPartnerDetailsPage({ params, partnerData }) {
  // If no partnerData is provided, you can handle the loading or error state
  if (!partnerData) {
    return <div>Loading partner data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm mb-6">
        <Link href="/delivery" className="text-muted-foreground hover:text-foreground">
          Delivery
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <Link href="/delivery/partners" className="text-muted-foreground hover:text-foreground">
          Partners
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <span className="font-medium">{partnerData.id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={partnerData.avatar || "/placeholder.svg"} alt={partnerData.name} />
            <AvatarFallback>
              {partnerData.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{partnerData.name}</h1>
              <Badge variant={partnerData.status === "active" ? "success" : "secondary"} className="capitalize">
                {partnerData.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {partnerData.id}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {partnerData.rating}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {partnerData.joinedDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button size="sm" className="flex-1 md:flex-none">
            <Truck className="h-4 w-4 mr-2" />
            Assign Delivery
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total Deliveries</CardDescription>
            <CardTitle className="text-2xl">{partnerData.totalDeliveries}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>On-Time Rate</CardDescription>
            <CardTitle className="text-2xl">{partnerData.onTimeRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-2xl">{partnerData.successRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Today's Earnings</CardDescription>
            <CardTitle className="text-2xl">₹{partnerData.earnings.today}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="deliveries">
            <TabsList className="mb-4">
              <TabsTrigger value="deliveries">Recent Deliveries</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="deliveries" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Deliveries</CardTitle>
                  <CardDescription>Last 5 deliveries by this partner</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partnerData.recentDeliveries?.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              delivery.status === "delivered" ? "bg-green-100" : "bg-amber-100"
                            }`}
                          >
                            {delivery.status === "delivered" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{delivery.customer}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {delivery.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{delivery.amount}</div>
                          <div className="text-sm text-muted-foreground">{delivery.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Deliveries
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Last 10 customer ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl font-bold">{partnerData.rating}</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(partnerData.rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {partnerData.performance.ratings?.length || 0} ratings
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = partnerData.performance.ratings?.filter((r) => r === rating).length || 0;
                      const percentage = partnerData.performance.ratings?.length
                        ? (count / partnerData.performance.ratings.length) * 100
                        : 0;

                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="w-8 text-sm">{rating} ★</div>
                          <Progress value={percentage} className="h-2" />
                          <div className="text-sm text-muted-foreground w-8">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>What customers are saying</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partnerData.performance.feedback?.map((feedback, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{feedback.customer}</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= feedback.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                        <div className="text-xs text-muted-foreground mt-1">{feedback.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Earnings Summary</CardTitle>
                  <CardDescription>Financial performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Today</div>
                      <div className="text-2xl font-bold mt-1">₹{partnerData.earnings.today}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">This Week</div>
                      <div className="text-2xl font-bold mt-1">₹{partnerData.earnings.week}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">This Month</div>
                      <div className="text-2xl font-bold mt-1">₹{partnerData.earnings.month}</div>
                    </div>
                  </div>

                  <div className="h-[200px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Earnings chart would appear here</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Download Earnings Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Partner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Contact Information</div>
                  <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1 mt-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerData.phone}</span>
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerData.email}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Vehicle Information</div>
                  <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1 mt-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerData.vehicleType}</span>
                    <span className="col-start-2">{partnerData.vehicleNumber}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerData.currentLocation}</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last active {partnerData.lastActive}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Service Area</div>
                  <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{partnerData.serviceArea}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Partner Details
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                View All Deliveries
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                Temporarily Suspend
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}