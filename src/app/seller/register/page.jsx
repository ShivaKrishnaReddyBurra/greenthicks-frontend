"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload } from "lucide-react"

export default function SellerRegisterPage() {
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  // Personal details
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Business details
  const [businessName, setBusinessName] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [description, setDescription] = useState("")

  // Documents
  const [aadharCard, setAadharCard] = useState(null)
  const [organicCertificate, setOrganicCertificate] = useState(null)
  const [profilePhoto, setProfilePhoto] = useState(null)

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
      if (!businessName || !businessAddress || !businessType || !description) {
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
      if (!aadharCard || !organicCertificate || !profilePhoto) {
        toast({
          title: "Missing documents",
          description: "Please upload all required documents.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Registration submitted",
        description: "Your seller application has been submitted for review.",
      })
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
          <Link href="/login" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Become a Seller</CardTitle>
            <CardDescription>Join our network of organic farmers and producers</CardDescription>
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
                    <p className="font-medium">Business Information</p>
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
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
                    <Label htmlFor="password">Password</Label>
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
                    <Label htmlFor="confirm-password">Confirm Password</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business/Farm Name</Label>
                  <Input
                    id="business-name"
                    placeholder="Green Acres Organic Farm"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-address">Business Address</Label>
                  <Textarea
                    id="business-address"
                    placeholder="Full address including city, state and PIN code"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual-farmer">Individual Farmer</SelectItem>
                      <SelectItem value="farmer-group">Farmer Group/Cooperative</SelectItem>
                      <SelectItem value="processor">Food Processor</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tell us about your farm/business and products</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your farming practices, types of vegetables you grow, certifications, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg text-sm">
                  <p>
                    Please upload clear, legible scans or photos of the following documents. All documents will be
                    verified before your seller account is approved.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar-card">Aadhar Card</Label>
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
                    <Label htmlFor="organic-certificate">Organic Certification</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="organic-certificate"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setOrganicCertificate)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("organic-certificate")?.click()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {organicCertificate ? organicCertificate.name : "Upload Organic Certificate"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-photo">Profile Photo</Label>
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

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    By submitting this application, you agree to Green Thicks'{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Seller Guidelines
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