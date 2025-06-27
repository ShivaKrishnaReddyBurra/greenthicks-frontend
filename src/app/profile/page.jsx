"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/api"
import { getAuthToken, clearAuth } from "@/lib/auth-utils"
import { Bell, Edit, MapPin, Plus, Save, Trash, User, X, Phone, Lock, Mail } from "lucide-react"
import coverPhoto from "@/public/coverpage.png"
import coverPhoto1 from "@/public/coverpage1.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import LeafLoader from "@/components/LeafLoader"
import CheckoutMapComponent from "@/components/checkout-map-component"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [showAddressPrompt, setShowAddressPrompt] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
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
    currentLocation: null,
    mapLocation: null,
    useCurrentLocation: false,
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const actionTimeout = useRef(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.matchMedia("(max-width: 640px)").matches
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // fetchUserData function - fetches user profile and addresses
  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const [profileData, addressesData] = await Promise.all([
        fetchWithAuth("/api/auth/profile"),
        fetchWithAuth("/api/addresses"),
      ])
      console.log("Fetched addresses:", JSON.stringify(addressesData, null, 2))
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
      }
      setUser(userData)
      setAddresses(addressesData)
      setShowAddressPrompt(addressesData.length === 0)
      const primaryAddress = addressesData.find((addr) => addr.isPrimary) || addressesData[0]
      if (primaryAddress) {
        setSelectedAddressId(primaryAddress.addressId)
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
          currentLocation: primaryAddress.location || null,
          mapLocation: primaryAddress.mapLocation || null,
          useCurrentLocation: false,
        })
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
          currentLocation: null,
          mapLocation: null,
          useCurrentLocation: false,
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load profile or addresses. Please try again.",
        variant: "destructive",
      })
      if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        clearAuth()
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setIsLoading(true)
      setTimeout(() => {
        router.push("/login")
      }, 1000)
      return
    }
    fetchUserData()
  }, [router])

  // handleInputChange function - handles form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // handleMapLocationSelect function - handles map location selection
  const handleMapLocationSelect = (location, address, addressComponents) => {
    setFormData((prev) => ({
      ...prev,
      mapLocation: location,
      address: address,
      city: addressComponents.city || prev.city,
      state: addressComponents.state || prev.state,
      zipCode: addressComponents.zipCode || prev.zipCode,
    }))

    toast({
      title: "Location Selected",
      description: "Your delivery location has been updated.",
    })
  }

  // handleEmailVerification function - handles email verification request
  const handleEmailVerification = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      // Try the forgot password endpoint for email change
      const response = await fetchWithAuth("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          type: "email-change",
          newEmail: newEmail,
        }),
      })

      toast({
        title: "Success",
        description: "Email verification link sent to your registered email address.",
      })
      setShowEmailVerification(false)
      setNewEmail("")
    } catch (error) {
      console.error("Error sending email verification:", error)

      // If the specific endpoint doesn't exist, try a generic approach
      if (error.status === 404) {
        toast({
          title: "Feature Not Available",
          description: "Email change feature is not currently available. Please contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send verification. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setActionLoading(false)
    }
  }

  // handlePhoneVerification function - handles phone verification request
  const handlePhoneVerification = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      // Try the update phone endpoint
      const response = await fetchWithAuth("/api/auth/update-phone", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          newPhone: newPhone,
        }),
      })

      toast({
        title: "Success",
        description: "Phone verification link sent to your registered email address.",
      })
      setShowPhoneVerification(false)
      setNewPhone("")
    } catch (error) {
      console.error("Error sending phone verification:", error)

      // If the specific endpoint doesn't exist, try a generic approach
      if (error.status === 404) {
        toast({
          title: "Feature Not Available",
          description: "Phone change feature is not currently available. Please contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send verification. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setActionLoading(false)
    }
  }

  // handleResetPassword function - handles password reset request
  const handleResetPassword = async () => {
    setActionLoading(true)
    try {
      // Use the standard forgot password endpoint
      const response = await fetchWithAuth("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
        }),
      })

      toast({
        title: "Success",
        description: "Password reset link sent to your registered email address.",
      })
      setShowResetPassword(false)
    } catch (error) {
      console.error("Error sending password reset:", error)

      // If the endpoint doesn't exist, provide helpful feedback
      if (error.status === 404) {
        toast({
          title: "Feature Not Available",
          description: "Password reset feature is not currently available. Please contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send password reset link. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setActionLoading(false)
    }
  }

  // handleProfileSubmit function - handles profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    clearTimeout(actionTimeout.current)
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true)
      try {
        await fetchWithAuth(`/api/auth/user/${user.globalId}`, {
          method: "PUT",
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
          }),
        })
        setUser((prev) => ({
          ...prev,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }))
        setIsEditingProfile(false)
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        })
      } catch (error) {
        console.error("Error updating profile:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          clearAuth()
          router.push("/login")
        }
      } finally {
        setActionLoading(false)
      }
    }, 500)
  }

  // handleAddressSubmit function - handles address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    clearTimeout(actionTimeout.current)
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true)
      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          isPrimary: formData.isPrimary,
        }

        if (
          formData.mapLocation &&
          typeof formData.mapLocation.lat === "number" &&
          typeof formData.mapLocation.lng === "number"
        ) {
          payload.mapLocation = {
            lat: formData.mapLocation.lat,
            lng: formData.mapLocation.lng,
          }
        }

        if (selectedAddressId) {
          const updatedAddress = await fetchWithAuth(`/api/addresses/${selectedAddressId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.addressId === selectedAddressId
                ? { ...updatedAddress.address, isPrimary: formData.isPrimary }
                : { ...addr, isPrimary: formData.isPrimary ? false : addr.isPrimary },
            ),
          )
        } else {
          const newAddress = await fetchWithAuth("/api/addresses", {
            method: "POST",
            body: JSON.stringify(payload),
          })
          setAddresses((prev) => [
            ...prev.map((addr) => ({ ...addr, isPrimary: formData.isPrimary ? false : addr.isPrimary })),
            { ...newAddress.address, isPrimary: formData.isPrimary },
          ])
          setSelectedAddressId(newAddress.address.addressId)
        }

        await fetchUserData()
        setIsEditingAddress(false)
        setShowAddressPrompt(false)
        toast({
          title: "Success",
          description: selectedAddressId ? "Address updated successfully." : "Address added successfully.",
        })
      } catch (error) {
        console.error("Error saving address:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to save address. Please try again.",
          variant: "destructive",
        })
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          clearAuth()
          router.push("/login")
        }
      } finally {
        setActionLoading(false)
      }
    }, 500)
  }

  // handleCancelProfile function - cancels profile editing
  const handleCancelProfile = () => {
    setIsEditingProfile(false)
    setFormData((prev) => ({
      ...prev,
      firstName: user?.firstName || user?.name?.split(" ")[0] || "",
      lastName: user?.lastName || user?.name?.split(" ")[1] || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }))
  }

  // handleCancelAddress function - cancels address editing
  const handleCancelAddress = () => {
    setIsEditingAddress(false)
    const primaryAddress = addresses.find((addr) => addr.isPrimary) || addresses[0]
    if (primaryAddress) {
      setSelectedAddressId(primaryAddress.addressId)
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
        mapLocation: primaryAddress.mapLocation || null,
        useCurrentLocation: false,
      }))
    } else {
      setSelectedAddressId(null)
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
        mapLocation: null,
        useCurrentLocation: false,
      }))
    }
  }

  // handleAddNewAddress function - initiates adding new address
  const handleAddNewAddress = () => {
    setActionLoading(true)
    setTimeout(() => {
      setIsEditingAddress(true)
      setSelectedAddressId(null)
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
        mapLocation: null,
        useCurrentLocation: false,
      }))
      setActionLoading(false)
    }, 500)
  }

  // handleSetPrimary function - sets an address as primary
  const handleSetPrimary = async (addressId) => {
    clearTimeout(actionTimeout.current)
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true)
      try {
        // Validate addressId
        if (!Number.isInteger(Number(addressId)) || addressId < 1) {
          throw new Error("Invalid addressId: must be a positive integer")
        }

        const addressToUpdate = addresses.find((addr) => addr.addressId === addressId)
        if (!addressToUpdate) {
          throw new Error("Address not found")
        }

        // Construct sanitized payload
        const payload = {
          isPrimary: true,
        }
        // Only include fields if they exist and are valid
        if (addressToUpdate.firstName?.trim()) payload.firstName = addressToUpdate.firstName.trim()
        if (addressToUpdate.lastName?.trim()) payload.lastName = addressToUpdate.lastName.trim()
        if (addressToUpdate.address?.trim()) payload.address = addressToUpdate.address.trim()
        if (addressToUpdate.city?.trim()) payload.city = addressToUpdate.city.trim()
        if (addressToUpdate.state?.trim()) payload.state = addressToUpdate.state.trim()
        if (addressToUpdate.zipCode?.trim() && /^\d{5,6}$/.test(addressToUpdate.zipCode.trim())) {
          payload.zipCode = addressToUpdate.zipCode.trim()
        }
        if (addressToUpdate.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressToUpdate.email.trim())) {
          payload.email = addressToUpdate.email.trim()
        }
        if (addressToUpdate.phone?.trim() && /^(?:\+91\s?)?[6-9]\d{9}$/.test(addressToUpdate.phone.trim())) {
          payload.phone = addressToUpdate.phone.trim()
        }
        if (
          addressToUpdate.mapLocation &&
          typeof addressToUpdate.mapLocation.lat === "number" &&
          typeof addressToUpdate.mapLocation.lng === "number" &&
          addressToUpdate.mapLocation.lat >= -90 &&
          addressToUpdate.mapLocation.lat <= 90 &&
          addressToUpdate.mapLocation.lng >= -180 &&
          addressToUpdate.mapLocation.lng <= 180
        ) {
          payload.mapLocation = {
            lat: addressToUpdate.mapLocation.lat,
            lng: addressToUpdate.mapLocation.lng,
          }
        }

        console.log("Sending payload to updateAddress:", JSON.stringify(payload, null, 2))

        const updatedAddress = await fetchWithAuth(`/api/addresses/${addressId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.addressId === addressId
              ? { ...updatedAddress.address, isPrimary: true }
              : { ...addr, isPrimary: false },
          ),
        )

        setSelectedAddressId(addressId)
        setFormData({
          firstName: updatedAddress.address.firstName || "",
          lastName: updatedAddress.address.lastName || "",
          email: updatedAddress.address.email || "",
          address: updatedAddress.address.address || "",
          city: updatedAddress.address.city || "",
          state: updatedAddress.address.state || "",
          zipCode: updatedAddress.address.zipCode || "",
          phone: updatedAddress.address.phone || "",
          isPrimary: true,
          username: user?.username || "",
          mapLocation: updatedAddress.address.mapLocation || null,
          useCurrentLocation: false,
        })

        await fetchUserData()
        toast({
          title: "Success",
          description: "Primary address updated successfully.",
        })
      } catch (error) {
        console.error("Error setting primary address:", {
          message: error.message,
          status: error.status,
          response: error.response,
        })
        toast({
          title: "Error",
          description: error.message || "Failed to set primary address. Please try again.",
          variant: "destructive",
        })
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          clearAuth()
          router.push("/login")
        }
      } finally {
        setActionLoading(false)
      }
    }, 500)
  }

  // handleDeleteAddress function - deletes an address
  const handleDeleteAddress = async (addressId) => {
    clearTimeout(actionTimeout.current)
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true)
      try {
        await fetchWithAuth(`/api/addresses/${addressId}`, {
          method: "DELETE",
        })
        setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId))
        if (selectedAddressId === addressId) {
          const primaryAddress =
            addresses.find((addr) => addr.isPrimary && addr.addressId !== addressId) || addresses[0]
          if (primaryAddress) {
            setSelectedAddressId(primaryAddress.addressId)
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
              mapLocation: primaryAddress.mapLocation,
              useCurrentLocation: false,
            })
          } else {
            setSelectedAddressId(null)
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
              mapLocation: null,
              useCurrentLocation: false,
            }))
          }
        }
        await fetchUserData()
        setShowAddressPrompt(addresses.length === 1)
        toast({
          title: "Success",
          description: "Address deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting address:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to delete address. Please try again.",
          variant: "destructive",
        })
        if (error.message.includes("Unauthorized") || error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          clearAuth()
          router.push("/login")
        }
      } finally {
        setActionLoading(false)
      }
    }, 500)
  }

  // handleNavigation function - handles navigation with loading state
  const handleNavigation = async (callback) => {
    clearTimeout(actionTimeout.current)
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      callback()
      setActionLoading(false)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Cover Photo Skeleton */}
          <Skeleton className="h-48 md:h-64 w-full rounded-lg mb-8" />

          {/* Profile Header Skeleton */}
          <div className="relative -mt-16 md:-mt-20 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-2 w-full max-w-xs">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>

          {/* Tabs and Content Skeleton */}
          <div className="space-y-6">
            {/* Tabs Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Card Skeleton */}
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                </div>
              </div>

              {/* Sidebar Card Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      {actionLoading && <LeafLoader />}
      {showAddressPrompt && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-auto max-w-2xl mt-4">
          <p className="font-medium">Please add an address to complete your profile!</p>
          <p className="text-sm">Adding an address will help us serve you better.</p>
          <Button
            className="mt-2"
            onClick={() =>
              handleNavigation(() => {
                setActiveTab("addresses")
                handleAddNewAddress()
              })
            }
            disabled={actionLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address Now
          </Button>
        </div>
      )}

      <div className="relative">
        <div className="h-48 md:h-64 w-full bg-muted overflow-hidden">
          <img src={isMobile ? coverPhoto1.src : coverPhoto.src} alt="Cover" className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20 mb-6 flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="h-8 w-8 text-muted-foreground"
                    disabled={actionLoading}
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
                            disabled={actionLoading}
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
                            disabled={actionLoading}
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
                          disabled={actionLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center gap-2">
                          <Input id="email" name="email" type="email" value={formData.email} disabled />
                          <Dialog open={showEmailVerification} onOpenChange={setShowEmailVerification}>
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline" size="icon" disabled={actionLoading}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change Email Address</DialogTitle>
                                <DialogDescription>
                                  Enter your new email address. A verification link will be sent to your current email
                                  address.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEmailVerification} className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="newEmail">New Email</Label>
                                  <Input
                                    id="newEmail"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Your new email address"
                                    required
                                    disabled={actionLoading}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEmailVerification(false)}
                                    disabled={actionLoading}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={actionLoading || !newEmail}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Verification
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center gap-2">
                          <Input id="phone" name="phone" value={formData.phone} disabled />
                          <Dialog open={showPhoneVerification} onOpenChange={setShowPhoneVerification}>
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline" size="icon" disabled={actionLoading}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change Phone Number</DialogTitle>
                                <DialogDescription>
                                  Enter your new phone number. A verification link will be sent to your email address.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handlePhoneVerification} className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="newPhone">New Phone Number</Label>
                                  <Input
                                    id="newPhone"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="+91 9123456789"
                                    pattern="^(?:\+91\s?)?\d{10}$"
                                    title="Phone number must be in Indian format (e.g., +91 9123456789)"
                                    required
                                    disabled={actionLoading}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowPhoneVerification(false)}
                                    disabled={actionLoading}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={actionLoading || !newPhone}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    Send Verification
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-xs text-muted-foreground">Use Indian format (e.g., +91 9123456789)</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleCancelProfile} disabled={actionLoading}>
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
                          <p>
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
                              user.totalSpent,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                  <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        disabled={actionLoading}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Reset Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          A password reset link will be sent to your registered email address ({user.email}).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowResetPassword(false)}
                            disabled={actionLoading}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleResetPassword} disabled={actionLoading}>
                            <Lock className="h-4 w-4 mr-2" />
                            Send Reset Link
                          </Button>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                    onClick={() =>
                      handleNavigation(() => {
                        clearAuth()
                        router.push("/login")
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

          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Addresses</h2>
              <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
                <DialogTrigger asChild>
                  <Button type="button" onClick={handleAddNewAddress} disabled={actionLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                          disabled={actionLoading}
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
                          disabled={actionLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Input id="email" name="email" type="email" value={formData.email} disabled />
                        <Dialog open={showEmailVerification} onOpenChange={setShowEmailVerification}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="icon" disabled={actionLoading}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Email Address</DialogTitle>
                              <DialogDescription>
                                Enter your new email address. A verification link will be sent to your current email
                                address.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEmailVerification} className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="newEmail">New Email</Label>
                                <Input
                                  id="newEmail"
                                  type="email"
                                  value={newEmail}
                                  onChange={(e) => setNewEmail(e.target.value)}
                                  placeholder="Your new email address"
                                  required
                                  disabled={actionLoading}
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowEmailVerification(false)}
                                  disabled={actionLoading}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={actionLoading || !newEmail}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Verification
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Input id="phone" name="phone" value={formData.phone} disabled />
                        <Dialog open={showPhoneVerification} onOpenChange={setShowPhoneVerification}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="icon" disabled={actionLoading}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Phone Number</DialogTitle>
                              <DialogDescription>
                                Enter your new phone number. A verification link will be sent to your email address.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePhoneVerification} className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="newPhone">New Phone Number</Label>
                                <Input
                                  id="newPhone"
                                  value={newPhone}
                                  onChange={(e) => setNewPhone(e.target.value)}
                                  placeholder="+91 9123456789"
                                  pattern="^(?:\+91\s?)?\d{10}$"
                                  title="Phone number must be in Indian format (e.g., +91 9123456789)"
                                  required
                                  disabled={actionLoading}
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowPhoneVerification(false)}
                                  disabled={actionLoading}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={actionLoading || !newPhone}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Send Verification
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <p className="text-xs text-muted-foreground">Use Indian format (e.g., +91 9123456789)</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="address">Address</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="useCurrentLocation"
                            checked={formData.useCurrentLocation}
                            onCheckedChange={async (checked) => {
                              setActionLoading(true)
                              if (checked) {
                                if (navigator.geolocation) {
                                  navigator.geolocation.getCurrentPosition(
                                    async (position) => {
                                      setFormData({
                                        ...formData,
                                        useCurrentLocation: true,
                                        currentLocation: {
                                          latitude: position.coords.latitude,
                                          longitude: position.coords.longitude,
                                        },
                                      })
                                      toast({
                                        title: "Location shared",
                                        description: "Your current location has been added to help with delivery.",
                                      })
                                      setActionLoading(false)
                                    },
                                    async (error) => {
                                      toast({
                                        title: "Location error",
                                        description: "Could not get your current location. Please check permissions.",
                                        variant: "destructive",
                                      })
                                      setActionLoading(false)
                                    },
                                  )
                                } else {
                                  toast({
                                    title: "Geolocation unavailable",
                                    description: "Your browser does not support geolocation.",
                                    variant: "destructive",
                                  })
                                  setActionLoading(false)
                                }
                              } else {
                                setFormData({
                                  ...formData,
                                  useCurrentLocation: false,
                                  currentLocation: null,
                                })
                                setActionLoading(false)
                              }
                            }}
                            disabled={actionLoading}
                          />
                          <Label htmlFor="useCurrentLocation">Use Current Location</Label>
                        </div>
                      </div>
                      <CheckoutMapComponent
                        onLocationSelect={handleMapLocationSelect}
                        initialLocation={formData.mapLocation}
                        initialAddress={formData.address}
                      />
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        required
                        disabled={actionLoading}
                      />
                      {formData.useCurrentLocation && formData.currentLocation && (
                        <div className="bg-primary/10 p-2 rounded-md text-sm">
                          <MapPin className="h-4 w-4 text-primary inline mr-2 flex-shrink-0" />
                          <span>Location shared for precise delivery</span>
                        </div>
                      )}
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
                          disabled={actionLoading}
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
                          disabled={actionLoading}
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
                        disabled={actionLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isPrimary"
                          checked={formData.isPrimary}
                          onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked })}
                          disabled={actionLoading}
                        />
                        <Label htmlFor="isPrimary">Set as primary address</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCancelAddress} disabled={actionLoading}>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.addressId} className={address.isPrimary ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {address.isPrimary && <Badge>Primary</Badge>}
                        {address.mapLocation && (
                          <span className="text-green-600 flex items-center text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            Map Location
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setActionLoading(true)
                            setTimeout(() => {
                              setIsEditingAddress(true)
                              setSelectedAddressId(address.addressId)
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
                                mapLocation: address.mapLocation,
                                useCurrentLocation: false,
                              })
                              setActionLoading(false)
                            }, 500)
                          }}
                          disabled={actionLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
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
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
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
                    <p className="mt-1 text-sm text-muted-foreground">Add an address to get started.</p>
                    <Button type="button" onClick={handleAddNewAddress} disabled={actionLoading}>
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
  )
}
