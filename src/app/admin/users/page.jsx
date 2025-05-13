"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { checkAdminStatus } from "@/lib/auth-utils";
import { Search, Filter, UserPlus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Check admin status
    if (!checkAdminStatus()) {
      router.push("/login");
      return;
    }

    // Fetch users
    const fetchUsers = async () => {
      try {
        const data = await fetchWithAuth("/api/auth/users");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleDeleteUser = async (globalId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await fetchWithAuth(`/api/auth/user/${globalId}`, { method: "DELETE" });
      setUsers(users.filter((user) => user.globalId !== globalId));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    // Ensure fields are strings, use fallbacks if undefined
    const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown";
    const email = user.email || "";
    const id = user.id || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && user.status === "active";
    if (filter === "inactive") return matchesSearch && user.status === "inactive";

    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-0">User Management</h1>
        <Button asChild className="text-sm sm:text-base">
          <a href="/admin/users/new" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add New User
          </a>
        </Button>
      </div>

      {/* Search and Filter */}

      <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="mr-2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px] sm:w-[180px] text-sm sm:text-base">
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Users</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-card rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm sm:text-base">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm sm:text-base">No users found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 sm:px-6">ID</TableHead>
                <TableHead className="px-4 sm:px-6">Name</TableHead>
                <TableHead className="px-4 sm:px-6">Email</TableHead>
                <TableHead className="px-4 sm:px-6">Location</TableHead>
                <TableHead className="px-4 sm:px-6">Orders</TableHead>
                <TableHead className="px-4 sm:px-6">Total Spent</TableHead>
                <TableHead className="px-4 sm:px-6">Status</TableHead>
                <TableHead className="px-4 sm:px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.globalId}>
                  <TableCell className="px-4 sm:px-6">{user.id || "N/A"}</TableCell>
                  <TableCell className="px-4 sm:px-6">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown"}</TableCell>
                  <TableCell className="px-4 sm:px-6">{user.email || "N/A"}</TableCell>
                  <TableCell className="px-4 sm:px-6">{user.location || user.city || "N/A"}</TableCell>
                  <TableCell className="px-4 sm:px-6">{user.totalOrders || 0}</TableCell>
                  <TableCell className="px-4 sm:px-6">₹{(user.totalSpent || 0).toLocaleString()}</TableCell>
                  <TableCell className="px-4 sm:px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 sm:px-6">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/admin/users/${user.globalId}`} title="View User">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/admin/users/edit/${user.globalId}`} title="Edit User">
                          <Edit className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.globalId)}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.globalId} className="bg-card rounded-lg shadow-md p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown"}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">ID: {user.id || "N/A"}</div>
                <div className="text-sm text-muted-foreground">Email: {user.email || "N/A"}</div>
                <div className="text-sm text-muted-foreground">Location: {user.location || user.city || "N/A"}</div>
                <div className="text-sm text-muted-foreground">Orders: {user.totalOrders || 0}</div>
                <div className="text-sm text-muted-foreground">Total Spent: ₹{(user.totalSpent || 0).toLocaleString()}</div>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/admin/users/${user.globalId}`} title="View User">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/admin/users/edit/${user.globalId}`} title="Edit User">
                      <Edit className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(user.globalId)}
                    title="Delete User"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}