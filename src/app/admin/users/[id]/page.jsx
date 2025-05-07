"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getUserDetails, updateUser, deleteUser } from "@/lib/api";
import { checkAdminStatus } from "@/lib/auth-utils";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Home,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function UserDetails() {
  const router = useRouter();
  const { id } = useParams();
  const globalId = parseInt(id);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    // Check admin status
    if (!checkAdminStatus()) {
      toast({
        title: "Unauthorized",
        description: "You must be an admin to view this page. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // Fetch user details
    const fetchData = async () => {
      try {
        const data = await getUserDetails(globalId);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message || "Failed to load user data. Please try again.");
        if (
          error.message === "No token provided" ||
          error.message === "Token expired or invalid" ||
          error.message.includes("Unauthorized") ||
          error.message.includes("Forbidden")
        ) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Redirecting to login...",
            variant: "destructive",
          });
          setTimeout(() => router.push("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [globalId, router]);

  const handleDeleteUser = async () => {
    try {
      await deleteUser(globalId);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      router.push("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAction = async (action) => {
    try {
      let message;
      switch (action) {
        case "email":
          // Placeholder: Implement actual email sending
          message = "Email sent to user";
          break;
        case "toggle-status":
          const newStatus = userDetails.status === "active" ? "inactive" : "active";
          await updateUser(globalId, { status: newStatus });
          setUserDetails((prev) => ({ ...prev, status: newStatus }));
          message = "User account status toggled";
          break;
        case "reset-password":
          // Placeholder: Implement actual password reset
          message = "Password reset link sent";
          break;
        default:
          return;
      }
      toast({
        title: "Success",
        description: message,
      });
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to perform ${action}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || "User not found"}</p>
          <Button asChild variant="link">
            <Link href="/admin/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Compute display name
  const displayName = userDetails.name || `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || "Unknown";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Button asChild variant="link">
          <Link href="/admin/users" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      {/* User Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                userDetails.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {userDetails.status === "active" ? "Active" : "Inactive"}
            </span>
            <span className="mx-2">•</span>
            <span className="text-muted-foreground">User ID: {userDetails.globalId || "N/A"}</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href={`/admin/users/edit/${userDetails.globalId}`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteModal(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      </div>

      {/* User Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{userDetails.email || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{userDetails.phone || "Not set"}</p>
                    <p className="text-sm text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{userDetails.location || userDetails.city || "Not set"}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{userDetails.joinedDate || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.addresses.length === 0 ? (
                <p className="text-muted-foreground">No addresses found.</p>
              ) : (
                <div className="space-y-4">
                  {userDetails.addresses.map((address) => (
                    <div key={address.addressId} className="flex items-start">
                      <Home className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                      <div>
                        <p className="font-medium">
                          {address.firstName} {address.lastName}
                          {address.isPrimary && " (Primary)"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.address}, {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-xl font-bold">{userDetails.totalOrders || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-xl font-bold">₹{(userDetails.totalSpent || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Orders and Cart */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="cart">Cart</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="p-4">
                <h3 className="font-semibold mb-4">Order History</h3>
                {userDetails.orders.data.length === 0 ? (
                  <p className="text-muted-foreground text-center">No orders found.</p>
                ) : (
                  <div className="divide-y">
                    {userDetails.orders.data.map((order) => (
                      <div key={order.globalId} className="py-4 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{order.id}</h3>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString()} - {order.items.length} items - ₹
                            {order.total.toFixed(2)}
                          </p>
                        </div>
                        <Button asChild variant="link">
                          <Link href={`/admin/orders/${order.globalId}`}>View Details</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="cart" className="p-4">
                <h3 className="font-semibold mb-4">Cart Items</h3>
                {userDetails.cart.items.length === 0 ? (
                  <p className="text-muted-foreground text-center">Cart is empty.</p>
                ) : (
                  <div className="divide-y">
                    {userDetails.cart.items.map((item) => (
                      <div key={item.productId} className="py-4 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <h3 className="font-medium">{item.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} - Price: ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => handleQuickAction("email")}>
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickAction("toggle-status")}
                >
                  {userDetails.status === "active" ? "Deactivate Account" : "Activate Account"}
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction("reset-password")}>
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{displayName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}