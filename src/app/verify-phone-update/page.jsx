"use client"

import { useState, useEffect, Suspense } from "react"
import Link from 'next/link';
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyPhoneUpdate } from "@/lib/api"
import { CheckCircle, XCircle, Loader2, ArrowLeft, AlertCircle, Phone } from "lucide-react"
import LogOut from "@/public/logo.png" ;
import Image from 'next/image'; 

function VerifyPhoneUpdateContent() {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const tokenParam = searchParams.get("token")

    if (!emailParam || !tokenParam) {
      setError("Invalid verification link. Missing email or token.")
      setLoading(false)
      return
    }

    setEmail(emailParam)
    setToken(tokenParam)
    verifyPhone(emailParam, tokenParam)
  }, [searchParams])

  const verifyPhone = async (email, token) => {
    try {
      setLoading(true)
      setError("")
      await verifyPhoneUpdate(email, token)
      setSuccess(true)
    } catch (err) {
      console.error("Phone verification error:", err)
      setError(err.message || "Failed to verify phone update. The link may be expired or invalid.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToProfile = () => {
    router.push("/profile")
  }

  const handleBackToSupport = () => {
    router.push("/contact")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
             <div className="absolute top-6 left-6 z-10">
        <Link href="/" onClick={(e) => handleNavigation(e, "/")}>
          <Image
            src={LogOut}
            alt="GreenThicks Logo"
            className="h-16 md:h-20"
            width={110}
            height={100}
          />
        </Link>
      </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
            <CardTitle>Verifying Phone Update</CardTitle>
            <CardDescription>Please wait while we verify your phone number update...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
              <div className="absolute top-6 left-6 z-10">
        <Link href="/" onClick={(e) => handleNavigation(e, "/")}>
          <Image
            src={LogOut}
            alt="GreenThicks Logo"
            className="h-16 md:h-20"
            width={110}
            height={100}
          />
        </Link>
      </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Invalid Verification Link</CardTitle>
            <CardDescription>This phone verification link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please request a new phone update from your profile page.</AlertDescription>
            </Alert>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleBackToProfile} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
              <Button variant="outline" onClick={handleBackToSupport} className="flex-1 bg-transparent">
                Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
              <div className="absolute top-6 left-6 z-10">
        <Link href="/" onClick={(e) => handleNavigation(e, "/")}>
          <Image
            src={LogOut}
            alt="GreenThicks Logo"
            className="h-16 md:h-20"
            width={110}
            height={100}
          />
        </Link>
      </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Phone Number Updated Successfully!</CardTitle>
            <CardDescription>Your phone number has been successfully updated.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Phone className="h-4 w-4" />
              <AlertDescription>Your phone number has been successfully updated and verified.</AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Your new phone number is now active on your account.</AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleBackToProfile} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
              <Button variant="outline" onClick={handleBackToSupport} className="flex-1 bg-transparent">
                Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
            <div className="absolute top-6 left-6 z-10">
        <Link href="/" onClick={(e) => handleNavigation(e, "/")}>
          <Image
            src={LogOut}
            alt="GreenThicks Logo"
            className="h-16 md:h-20"
            width={110}
            height={100}
          />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Phone Verification Failed</CardTitle>
          <CardDescription>We couldn't verify your phone number update.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please try requesting a new phone update from your profile page, or contact support if the problem
              persists.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={handleBackToProfile} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <Button variant="outline" onClick={handleBackToSupport} className="flex-1 bg-transparent">
              Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPhoneUpdatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <VerifyPhoneUpdateContent />
    </Suspense>
  )
}