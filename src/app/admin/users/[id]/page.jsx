"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
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
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    // Check admin status
    if (!checkAdminStatus()) {
      router.push("/login");
      return;
    }

    // Fetch user details and orders
    const fetchData = async () => {
      try {
        const users = await fetchWithAuth("/api/auth/users");
        const userData = users.find((u) => u.globalId === globalId);
        if (!userData) {
          throw new Error("User not found");
        }
        const ordersData = await fetchWithAuth(`/api/orders/user/${globalId}`);
        setUser(userData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Failed to load user data. Please try again.");
        if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [globalId, router]);

  const handleDeleteUser = async () => {
    try {
      await fetchWithAuth(`/api/auth/user/${globalId}`, { method: "DELETE" });
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
          const newStatus = user.status === "active" ? "inactive" : "active";
          await fetchWithAuth(`/api/auth/user/${globalId}`, {
            method: "PUT",
            body: JSON.stringify({ status: newStatus }),
          });
          setUser((prev) => ({ ...prev, status: newStatus }));
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

  if (error || !user) {
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
  const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown";

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
                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user.status === "active" ? "Active" : "Inactive"}
            </span>
            <span className="mx-2">•</span>
            <span className="text-muted-foreground">User ID: {user.globalId || "N/A"}</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href={`/admin/users/edit/${user.globalId}`} className="flex items-center">
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
                    <p className="font-medium">{user.email || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mr-3 text-muted- SHARED CONVERSATION
                    foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{user.phone || "Not set"}</p>
                    <p className="text-sm text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{user.address || "Not set"}</p>
                    <p className="text-sm text-muted-foreground">Address</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-3 text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">{user.joinedDate || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                  </div>
                </div>
              </div>
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
                      <p className="text-xl font-bold">{user.totalOrders || 0}</p>
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
                      <p className="text-xl font-bold">₹{(user.totalSpent || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Orders and Favorites */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="p-4">
                <h3 className="font-semibold mb-4">Order History</h3>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center">No orders found.</p>
                ) : (
                  <div className="divide-y">
                    {orders.map((order) => (
                      <div key={order.id} className="py-4 flex items-center">
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
                              {order.status === "delivered"
                                ? "Delivered"
                                : order.status === "cancelled"
                                ? "Cancelled"
                                : "Processing"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.date} - {order.items} items - ₹{order.total}
                          </p>
                        </div>
                        <Button asChild variant="link">
                          <Link href={`/admin/delivery/orders/${order.id}`}>View Details</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="favorites" className="p-4">
                <p className="text-muted-foreground text-center">User's favorite products will be displayed here.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    toast({
                      title: "Info",
                      description: "Favorites functionality not yet implemented.",
                    });
                  }}
                >
                  Load Favorites
                </Button>
              </TabsContent>
              <TabsContent value="activity" className="p-4">
                <p className="text-muted-foreground text-center">User activity log will be displayed here.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    toast({
                      title: "Info",
                      description: "Activity log functionality not yet implemented.",
                    });
                  }}
                >
                  Load Activity Log
                </Button>
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
                  {user.status === "active" ? "Deactivate Account" : "Activate Account"}
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