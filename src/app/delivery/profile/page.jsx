'use client';
import { useState } from "react";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Clock,
  Calendar
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <DeliveryLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">John Doe</CardTitle>
                <CardDescription>Delivery Partner since May 2023</CardDescription>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-gray-300" />
                  <span className="ml-2 text-sm font-medium">4.8</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>John Doe</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                  <span>123 Main St, Anytown, USA 12345</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Vehicle Information</h3>
                <div className="flex items-center">
                  <Badge variant="outline">Car</Badge>
                </div>
                <p className="text-sm text-gray-500">Toyota Corolla (2018)</p>
                <p className="text-sm text-gray-500">License: ABC-1234</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    <Award className="h-3 w-3 mr-1" />
                    Top Performer
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Always On Time
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <Calendar className="h-3 w-3 mr-1" />
                    1 Year Service
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
                  <TabsTrigger value="bank">Bank Details</TabsTrigger>
                </TabsList>

                {/* Personal Info */}
                <TabsContent value="personal" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Main St" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Anytown" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" defaultValue="12345" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      defaultValue="Experienced delivery driver with a passion for customer service."
                    />
                  </div>
                </TabsContent>

                {/* Vehicle Info */}
                <TabsContent value="vehicle" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Input id="vehicleType" defaultValue="Car" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input id="make" defaultValue="Toyota" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" defaultValue="Corolla" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" defaultValue="2018" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input id="color" defaultValue="Silver" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input id="licensePlate" defaultValue="ABC-1234" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Information</Label>
                    <Input id="insurance" defaultValue="Policy #: INS-5678-90" />
                  </div>
                </TabsContent>

                {/* Bank Info */}
                <TabsContent value="bank" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input id="accountName" defaultValue="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" defaultValue="National Bank" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" defaultValue="**** **** **** 1234" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input id="routingNumber" defaultValue="**** ****" type="password" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID (SSN/EIN)</Label>
                    <Input id="taxId" defaultValue="***-**-1234" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
                    <Input id="paymentMethod" defaultValue="Direct Deposit" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={loading} className="ml-auto">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DeliveryLayout>
  );
}
