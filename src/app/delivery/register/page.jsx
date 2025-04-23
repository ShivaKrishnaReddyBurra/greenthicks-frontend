"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload, MapPin, Bike } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function DeliveryRegisterPage() {
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  // Personal details
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Vehicle details
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [deliveryArea, setDeliveryArea] = useState("")
  const [workingHours, setWorkingHours] = useState("")

  // Documents
  const [aadharCard, setAadharCard] = useState(null)
  const [drivingLicense, setDrivingLicense] = useState(null)
  const [vehicleRegistration, setVehicleRegistration] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [backgroundCheck, setBackgroundCheck] = useState(false)

  const handleNext = () => {
    if (step === 1) {
      if (!name || !email || !phone || !password || !confirmPassword) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        })
        return
      }
    }

    if (step === 2) {
      if (!vehicleType || !vehicleNumber || !licenseNumber || !deliveryArea || !workingHours) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    }

    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit the form
      if (!aadharCard || !drivingLicense || !vehicleRegistration || !profilePhoto) {
        toast({
          title: "Missing documents",
          description: "Please upload all required documents.",
          variant: "destructive",
        })
        return
      }

      if (!backgroundCheck) {
        toast({
          title: "Background check consent required",
          description: "Please consent to the background verification process.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Registration submitted",
        description: "Your delivery partner application has been submitted for review.",
      })

      // Redirect to confirmation page
      window.location.href = "/delivery/register/confirmation"
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/delivery/login" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bike className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Become a Delivery Partner</CardTitle>
                <CardDescription>Join our network of delivery partners and earn extra income</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <div className={`ml-4 ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                    <p className="font-medium">Personal Details</p>
                  </div>
                </div>
                <Separator className="w-12" />
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <div className={`ml-4 ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                    <p className="font-medium">Vehicle Information</p>
                  </div>
                </div>
                <Separator className="w-12" />
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    3
                  </div>
                  <div className={`ml-4 ${step === 3 ? "text-foreground" : "text-muted-foreground"}`}>
                    <p className="font-medium">Documents</p>
                  </div>
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type *</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle-number">Vehicle Number *</Label>
                    <Input
                      id="vehicle-number"
                      placeholder="MH01AB1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license-number">Driving License Number *</Label>
                  <Input
                    id="license-number"
                    placeholder="DL1234567890123"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-area">Preferred Delivery Area *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="delivery-area"
                      placeholder="Enter your preferred delivery area"
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setDeliveryArea(`${position.coords.latitude}, ${position.coords.longitude}`)
                              toast({
                                title: "Location detected",
                                description: "Your current location has been set as your preferred delivery area.",
                              })
                            },
                            (error) => {
                              toast({
                                title: "Location error",
                                description: "Could not get your current location. Please check permissions.",
                                variant: "destructive",
                              })
                            },
                          )
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">Use Current</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="working-hours">Preferred Working Hours *</Label>
                  <Select value={workingHours} onValueChange={setWorkingHours}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select working hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6 PM - 12 AM)</SelectItem>
                      <SelectItem value="flexible">Flexible Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg text-sm">
                  <p>
                    Please upload clear, legible scans or photos of the following documents. All documents will be
                    verified before your delivery partner account is approved.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar-card">Aadhar Card *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="aadhar-card"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setAadharCard)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("aadhar-card")?.click()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {aadharCard ? aadharCard.name : "Upload Aadhar Card"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driving-license">Driving License *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="driving-license"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setDrivingLicense)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("driving-license")?.click()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {drivingLicense ? drivingLicense.name : "Upload Driving License"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle-registration">Vehicle Registration *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="vehicle-registration"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setVehicleRegistration)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("vehicle-registration")?.click()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {vehicleRegistration ? vehicleRegistration.name : "Upload Vehicle Registration"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-photo">Profile Photo *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setProfilePhoto)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("profile-photo")?.click()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {profilePhoto ? profilePhoto.name : "Upload Profile Photo"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 mt-4">
                  <Checkbox
                    id="background-check"
                    checked={backgroundCheck}
                    onCheckedChange={(checked) => setBackgroundCheck(checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="background-check"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Background Verification Consent *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I consent to a background verification check as part of the application process.
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    By submitting this application, you agree to Green Thicks'{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Delivery Partner Guidelines
                    </Link>
                    . Your application will be reviewed within 2-3 business days.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>

            <Button onClick={handleNext}>{step < 3 ? "Next" : "Submit Application"}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}