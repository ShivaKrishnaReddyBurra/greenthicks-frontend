"use client"
import React from "react"
import { useState } from "react"
import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerLayout } from "@/components/seller-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function SellerDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,345</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +18% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+48</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +12% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                +2 <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>{" "}
              new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                -4% <ArrowDownRight className="h-3 w-3 ml-1" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Your sales performance over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] flex items-end justify-between">
                <div className="w-[8%] h-[30%] bg-primary/20 rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Mon: ₹420
                  </div>
                </div>
                <div className="w-[8%] h-[45%] bg-primary/20 rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Tue: ₹650
                  </div>
                </div>
                <div className="w-[8%] h-[60%] bg-primary/20 rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Wed: ₹820
                  </div>
                </div>
                <div className="w-[8%] h-[40%] bg-primary/20 rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Thu: ₹580
                  </div>
                </div>
                <div className="w-[8%] h-[75%] bg-primary/20 rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Fri: ₹1,050
                  </div>
                </div>
                <div className="w-[8%] h-[90%] bg-primary rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Sat: ₹1,250
                  </div>
                </div>
                <div className="w-[8%] h-[65%] bg-primary/20 rounded-t-md relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    Sun: ₹890
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Organic Spinach</TableCell>
                      <TableCell className="text-right">245</TableCell>
                      <TableCell className="text-right">₹4,900</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fresh Carrots</TableCell>
                      <TableCell className="text-right">132</TableCell>
                      <TableCell className="text-right">₹2,640</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tomatoes</TableCell>
                      <TableCell className="text-right">97</TableCell>
                      <TableCell className="text-right">₹1,940</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bell Peppers</TableCell>
                      <TableCell className="text-right">65</TableCell>
                      <TableCell className="text-right">₹1,625</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Products that need restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Organic Spinach</span>
                        <span className="text-sm text-muted-foreground">15%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-destructive h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Fresh Carrots</span>
                        <span className="text-sm text-muted-foreground">30%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Bell Peppers</span>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Cucumber</span>
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-destructive h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your most recent customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-7652</TableCell>
                    <TableCell>Rahul Sharma</TableCell>
                    <TableCell>Apr 5, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-7651</TableCell>
                    <TableCell>Priya Patel</TableCell>
                    <TableCell>Apr 4, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Processing
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹420</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-7650</TableCell>
                    <TableCell>Amit Kumar</TableCell>
                    <TableCell>Apr 4, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        Shipped
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-7649</TableCell>
                    <TableCell>Neha Singh</TableCell>
                    <TableCell>Apr 3, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹1,250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-7648</TableCell>
                    <TableCell>Vikram Reddy</TableCell>
                    <TableCell>Apr 2, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Delivered</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹580</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Organic Spinach</TableCell>
                    <TableCell>Leafy Greens</TableCell>
                    <TableCell>₹20/bunch</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-500 text-red-500">
                        Low Stock
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fresh Carrots</TableCell>
                    <TableCell>Root Vegetables</TableCell>
                    <TableCell>₹40/kg</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Medium Stock
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tomatoes</TableCell>
                    <TableCell>Fruit Vegetables</TableCell>
                    <TableCell>₹60/kg</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        In Stock
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bell Peppers</TableCell>
                    <TableCell>Fruit Vegetables</TableCell>
                    <TableCell>₹25/piece</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Medium Stock
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cucumber</TableCell>
                    <TableCell>Fruit Vegetables</TableCell>
                    <TableCell>₹15/piece</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-red-500 text-red-500">
                        Low Stock
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SellerLayout>
  )
}
