
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { getAuthToken, clearAuth } from "@/lib/auth-utils";
import {
  Bell,
  Edit,
  MapPin,
  Plus,
  Save,
  Trash,
  User,
  X,
  Phone,
} from "lucide-react";
import coverPhoto from "@/public/coverpage.png";
import coverPhoto1 from "@/public/coverpage1.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import LeafLoader from "@/components/LeafLoader";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    isPrimary: false,
  });
  const [actionLoading, setActionLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const actionTimeout = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.matchMedia("(max-width: 640px)").matches;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchUserData = async () => {
    setActionLoading(true);
    try {
      const [profileData, addressesData] = await Promise.all([
        fetchWithAuth("/api/auth/profile"),
        fetchWithAuth("/api/addresses"),
      ]);
      const userData = {
        ...profileData,
        globalId: profileData.globalId,
        name: profileData.name || `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim(),
        username: profileData.username || "",
        avatar: profileData.avatar || "@/public/logo.png",
        joinedDate: profileData.joinedDate || "Unknown",
        location: profileData.location || "Not set",
        totalSpent: profileData.totalSpent || 0,
        totalOrders: profileData.totalOrders || 0,
        phone: profileData.phone || "Not set",
      };
      setUser(userData);
      setAddresses(addressesData);
      setShowAddressPrompt(addressesData.length === 0);
      const primaryAddress = addressesData.find((addr) => addr.isPrimary) || addressesData[0];
      if (primaryAddress) {
        setSelectedAddressId(primaryAddress.addressId);
        setFormData({
          firstName: primaryAddress.firstName || "",
          lastName: primaryAddress.lastName || "",
          username: userData.username || "",
          email: primaryAddress.email || profileData.email || "",
          address: primaryAddress.address || "",
          city: primaryAddress.city || "",
          state: primaryAddress.state || "",
          zipCode: primaryAddress.zipCode || "",
          phone: primaryAddress.phone || "",
          isPrimary: primaryAddress.isPrimary || false,
        });
      } else {
        setFormData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          username: userData.username || "",
          email: profileData.email || "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          phone: profileData.phone || "",
          isPrimary: false,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile or addresses. Please try again.",
        variant: "destructive",
      });
      if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        clearAuth();
        router.push("/login");
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setActionLoading(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }
    fetchUserData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await fetchWithAuth(`/api/auth/user/${user.globalId}`, {
          method: "PUT",
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
          }),
        });
        setUser((prev) => ({
          ...prev,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }));
        setIsEditingProfile(false);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          clearAuth();
          router.push("/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        if (selectedAddressId) {
          const updatedAddress = await fetchWithAuth(`/api/addresses/${selectedAddressId}`, {
            method: "PUT",
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              isPrimary: formData.isPrimary,
            }),
          });
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.addressId === selectedAddressId
                ? { ...updatedAddress.address, isPrimary: formData.isPrimary }
                : { ...addr, isPrimary: formData.isPrimary ? false : addr.isPrimary }
            )
          );
        } else {
          const newAddress = await fetchWithAuth("/api/addresses", {
            method: "POST",
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              isPrimary: formData.isPrimary,
            }),
          });
          setAddresses((prev) => [
            ...prev.map((addr) => ({ ...addr, isPrimary: formData.isPrimary ? false : addr.isPrimary })),
            { ...newAddress.address, isPrimary: formData.isPrimary }
          ]);
          setSelectedAddressId(newAddress.address.addressId);
        }
        await fetchUserData();
        setIsEditingAddress(false);
        setShowAddressPrompt(false);
        toast({
          title: "Success",
          description: selectedAddressId ? "Address updated successfully." : "Address added successfully.",
        });
      } catch (error) {
        console.error("Error saving address:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save address. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          clearAuth();
          router.push("/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setFormData((prev) => ({
      ...prev,
      firstName: user?.firstName || user?.name?.split(" ")[0] || "",
      lastName: user?.lastName || user?.name?.split(" ")[1] || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }));
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    const primaryAddress = addresses.find((addr) => addr.isPrimary) || addresses[0];
    if (primaryAddress) {
      setSelectedAddressId(primaryAddress.addressId);
      setFormData((prev) => ({
        ...prev,
        firstName: primaryAddress.firstName || "",
        lastName: primaryAddress.lastName || "",
        username: user?.username || "",
        email: primaryAddress.email || user?.email || "",
        address: primaryAddress.address || "",
        city: primaryAddress.city || "",
        state: primaryAddress.state || "",
        zipCode: primaryAddress.zipCode || "",
        phone: primaryAddress.phone || "",
        isPrimary: primaryAddress.isPrimary || false,
      }));
    } else {
      setSelectedAddressId(null);
      setFormData((prev) => ({
        ...prev,
        firstName: user?.firstName || user?.name?.split(" ")[0] || "",
        lastName: user?.lastName || user?.name?.split(" ")[1] || "",
        username: user?.username || "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: user?.phone || "",
        isPrimary: false,
      }));
    }
  };

  const handleAddNewAddress = () => {
    setIsEditingAddress(true);
    setSelectedAddressId(null);
    setFormData((prev) => ({
      ...prev,
      firstName: user?.firstName || user?.name?.split(" ")[0] || "",
      lastName: user?.lastName || user?.name?.split(" ")[1] || "",
      username: user?.username || "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: user?.phone || "",
      isPrimary: true,
    }));
  };

  const handleSetPrimary = async (addressId) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        const addressToUpdate = addresses.find((addr) => addr.addressId === addressId);
        if (!addressToUpdate) {
          throw new Error("Address not found");
        }
        const updatedAddress = await fetchWithAuth(`/api/addresses/${addressId}`, {
          method: "PUT",
          body: JSON.stringify({ ...addressToUpdate, isPrimary: true }),
        });
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.addressId === addressId
              ? { ...updatedAddress.address, isPrimary: true }
              : { ...addr, isPrimary: false }
          )
        );
        setSelectedAddressId(addressId);
        setFormData({
          firstName: updatedAddress.address.firstName,
          lastName: updatedAddress.address.lastName,
          email: updatedAddress.address.email,
          address: updatedAddress.address.address,
          city: updatedAddress.address.city,
          state: updatedAddress.address.state,
          zipCode: updatedAddress.address.zipCode,
          phone: updatedAddress.address.phone,
          isPrimary: true,
          username: user?.username || "",
        });
        await fetchUserData();
        toast({
          title: "Success",
          description: "Primary address updated successfully.",
        });
      } catch (error) {
        console.error("Error setting primary address:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to set primary address. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          clearAuth();
          router.push("/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleDeleteAddress = async (addressId) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await fetchWithAuth(`/api/addresses/${addressId}`, {
          method: "DELETE",
        });
        setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
        if (selectedAddressId === addressId) {
          const primaryAddress = addresses.find((addr) => addr.isPrimary && addr.addressId !== addressId) || addresses[0];
          if (primaryAddress) {
            setSelectedAddressId(primaryAddress.addressId);
            setFormData({
              firstName: primaryAddress.firstName,
              lastName: primaryAddress.lastName,
              email: primaryAddress.email,
              address: primaryAddress.address,
              city: primaryAddress.city,
              state: primaryAddress.state,
              zipCode: primaryAddress.zipCode,
              phone: primaryAddress.phone,
              isPrimary: primaryAddress.isPrimary,
              username: user?.username || "",
            });
          } else {
            setSelectedAddressId(null);
            setFormData((prev) => ({
              ...prev,
              firstName: user?.firstName || user?.name?.split(" ")[0] || "",
              lastName: user?.lastName || user?.name?.split(" ")[1] || "",
              username: user?.username || "",
              email: user?.email || "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              phone: user?.phone || "",
              isPrimary: false,
            }));
          }
        }
        await fetchUserData();
        setShowAddressPrompt(addresses.length === 1);
        toast({
          title: "Success",
          description: "Address deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting address:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete address. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          clearAuth();
          router.push("/login");
        }
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
      }
    }, 500);
  };

  const handleNavigation = async (callback) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      callback();
    }, 500);
  };

  if (actionLoading) {
    return <LeafLoader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      {showAddressPrompt && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-auto max-w-2xl mt-4">
          <p className="font-medium">Please add an address to complete your profile!</p>
          <p className="text-sm">Adding an address will help us serve you better.</p>
          <Button
            className="mt-2"
            onClick={() =>
              handleNavigation(() => {
                setActiveTab("addresses");
                handleAddNewAddress();
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address Now
          </Button>
        </div>
      )}

      {/* Cover Photo and Profile Header */}
      <div className="relative">
        <div className="h-48 md:h-64 w-full bg-muted overflow-hidden">
          <img
            src={isMobile ? coverPhoto1.src : coverPhoto.src}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20 mb-6 flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-4xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 md:mt-0 md:mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-muted-foreground">{user.username ? `@${user.username}` : "No username set"}</p>
                <p className="text-sm text-muted-foreground mt-1">Member since {user.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex overflow-x-auto pb-2 md:pb-0">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Your first name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Your last name"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Your username"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 912345678901"
                          pattern="/^(?:\+91\s?)?\d{10}$/"
                          title="Phone number must be in Indian format (e.g., +91 92345678901)"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Use international format (e.g., +91 2345678901)
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleCancelProfile}
                          disabled={actionLoading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" disabled={actionLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                          <p>{user.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                          <p>{user.username || "Not set"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                          <p>{user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                          <p>{user.phone || "Not set"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                          <p>{user.location}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Joined Date</h3>
                          <p>{user.joinedDate}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                          <p>{user.totalOrders}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
                          <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(user.totalSpent)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>Quick stats about your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className="capitalize">{user.status || "Active"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Addresses Saved</h3>
                    <p>{addresses.length}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      handleNavigation(() => {
                        clearAuth();
                        router.push("/login");
                      })
                    }
                    disabled={actionLoading}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Addresses</h2>
              <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddNewAddress} disabled={actionLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedAddressId ? "Edit Address" : "Add New Address"}</DialogTitle>
                    <DialogDescription>Enter the details for your address.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddressSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 92345678901"
                        pattern="/^(?:\+91\s?)?\d{10}$/"
                        title="Phone number must be in Indian format (e.g., +91 92345678901)"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Use international format (e.g., +91 92345678901)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Zip code"
                        pattern="^\d{5,6}$"
                        title="Zip code must be 5 or 6 digits"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelAddress}
                        disabled={actionLoading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={actionLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {selectedAddressId ? "Save Changes" : "Add Address"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.addressId} className={address.isPrimary ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {address.isPrimary && <Badge>Primary</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setIsEditingAddress(true);
                            setSelectedAddressId(address.addressId);
                            setFormData({
                              firstName: address.firstName,
                              lastName: address.lastName,
                              email: address.email,
                              address: address.address,
                              city: address.city,
                              state: address.state,
                              zipCode: address.zipCode,
                              phone: address.phone,
                              isPrimary: address.isPrimary,
                              username: user?.username || "",
                            });
                          }}
                          disabled={actionLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteAddress(address.addressId)}
                          disabled={actionLoading}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1">
                      <p className="font-medium">{`${address.firstName} ${address.lastName}`}</p>
                      <p className="text-sm">{address.address}</p>
                      <p className="text-sm">
                        {address.city}, {address.state} - {address.zipCode}
                      </p>
                      <p className="text-sm">{address.email}</p>
                      <p className="text-sm">{address.phone}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {!address.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleSetPrimary(address.addressId)}
                        disabled={actionLoading}
                      >
                        Set as Primary
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
              {addresses.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No addresses added</h3>
                    <p className="mt-1 text-muted-foreground">Add an address to get started</p>
                    <Button onClick={handleAddNewAddress} disabled={actionLoading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}