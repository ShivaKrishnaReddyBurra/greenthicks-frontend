"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { getAuthToken, clearAuth } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Edit, X, Plus, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isPrimary: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, addressesData] = await Promise.all([
          fetchWithAuth("/api/auth/profile"),
          fetchWithAuth("/api/addresses"),
        ]);
        setUser(profileData);
        setAddresses(addressesData);
        // Set form data to primary address or first address
        const primaryAddress = addressesData.find((addr) => addr.isPrimary) || addressesData[0];
        if (primaryAddress) {
          setSelectedAddressId(primaryAddress.addressId);
          setFormData({
            firstName: primaryAddress.firstName,
            lastName: primaryAddress.lastName,
            address: primaryAddress.address,
            city: primaryAddress.city,
            state: primaryAddress.state,
            zipCode: primaryAddress.zipCode,
            isPrimary: primaryAddress.isPrimary,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile or addresses. Please try again.",
          variant: "destructive",
        });
        if (error.message.includes("Unauthorized")) {
          clearAuth();
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = getAuthToken();
    if (!token || !user) {
      router.push("/login");
      return;
    }

    try {
      if (selectedAddressId) {
        // Update existing address
        const updatedAddress = await fetchWithAuth(`/api/addresses/${selectedAddressId}`, {
          method: "PUT",
          body: JSON.stringify({ ...formData, isPrimary: true }),
        });
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.addressId === selectedAddressId
              ? { ...updatedAddress.address, isPrimary: true }
              : { ...addr, isPrimary: false }
          )
        );
        setUser((prev) => ({
          ...prev,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          location: formData.city,
        }));
      } else {
        // Add new address
        const newAddress = await fetchWithAuth("/api/addresses", {
          method: "POST",
          body: JSON.stringify({ ...formData, isPrimary: true }),
        });
        setAddresses((prev) => [
          ...prev.map((addr) => ({ ...addr, isPrimary: false })),
          { ...newAddress.address, isPrimary: true },
        ]);
        setSelectedAddressId(newAddress.address.addressId);
        setUser((prev) => ({
          ...prev,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          location: formData.city,
        }));
      }
      setIsEditing(false);
      toast({
        title: "Success",
        description: selectedAddressId ? "Address updated successfully." : "Address added successfully.",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
      if (error.message.includes("Unauthorized")) {
        clearAuth();
        router.push("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const primaryAddress = addresses.find((addr) => addr.isPrimary) || addresses[0];
    if (primaryAddress) {
      setSelectedAddressId(primaryAddress.addressId);
      setFormData({
        firstName: primaryAddress.firstName,
        lastName: primaryAddress.lastName,
        address: primaryAddress.address,
        city: primaryAddress.city,
        state: primaryAddress.state,
        zipCode: primaryAddress.zipCode,
        isPrimary: primaryAddress.isPrimary,
      });
    } else {
      setSelectedAddressId(null);
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        isPrimary: false,
      });
    }
  };

  const handleAddNewAddress = () => {
    setIsEditing(true);
    setSelectedAddressId(null);
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      isPrimary: true,
    });
  };

  const handleSetPrimary = async (addressId) => {
    setIsSubmitting(true);
    const token = getAuthToken();
    if (!token || !user) {
      router.push("/login");
      return;
    }

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
      setUser((prev) => ({
        ...prev,
        name: `${updatedAddress.address.firstName} ${updatedAddress.address.lastName}`.trim(),
        location: updatedAddress.address.city,
      }));
      setSelectedAddressId(addressId);
      setFormData({
        firstName: updatedAddress.address.firstName,
        lastName: updatedAddress.address.lastName,
        address: updatedAddress.address.address,
        city: updatedAddress.address.city,
        state: updatedAddress.address.state,
        zipCode: updatedAddress.address.zipCode,
        isPrimary: true,
      });
      toast({
        title: "Success",
        description: "Primary address updated successfully.",
      });
    } catch (error) {
      console.error("Error setting primary address:", error);
      toast({
        title: "Error",
        description: "Failed to set primary address. Please try again.",
        variant: "destructive",
      });
      if (error.message.includes("Unauthorized")) {
        clearAuth();
        router.push("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>User Profile</span>
            {!isEditing && (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Primary Address
                </Button>
                <Button variant="outline" onClick={handleAddNewAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter zip code"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {selectedAddressId ? "Save Changes" : "Add Address"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p>{user.name || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joined Date</Label>
                  <p>{user.joinedDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Orders</Label>
                  <p>{user.totalOrders}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Spent</Label>
                  <p>₹{user.totalSpent}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="capitalize">{user.status}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-lg">Addresses</Label>
                {addresses.length === 0 ? (
                  <p className="text-muted-foreground">No addresses added.</p>
                ) : (
                  <div className="space-y-4 mt-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr.addressId}
                        className={`p-4 border rounded-md ${
                          addr.isPrimary ? "border-primary bg-primary/5" : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {addr.firstName} {addr.lastName}
                              {addr.isPrimary && (
                                <Check className="h-4 w-4 inline ml-2 text-primary" />
                              )}
                            </p>
                            <p>{addr.address}</p>
                            <p>
                              {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                          </div>
                          {!addr.isPrimary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetPrimary(addr.addressId)}
                              disabled={isSubmitting}
                            >
                              Set as Primary
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}