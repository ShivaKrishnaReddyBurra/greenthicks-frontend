"use client"

import { useState, useEffect, Suspense } from "react"
import Link from 'next/link';
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { verifyEmailUpdate } from "@/lib/api"
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react"
import LogOut from "@/public/logo.png";
import Image from 'next/image'; 


function VerifyEmailUpdateContent() {
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get("email")
      const token = searchParams.get("token")

      if (!email || !token) {
        setStatus("error")
        setMessage("Invalid verification link. Missing email or token.")
        return
      }

      try {
        const response = await verifyEmailUpdate(email, token)
        setStatus("success")
        setMessage(response.message || "Email address updated successfully!")
      } catch (error) {
        console.error("Email verification error:", error)
        setStatus("error")
        setMessage(error.message || "Failed to verify email update. The link may be expired or invalid.")
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleBackToProfile = () => {
    router.push("/profile")
  }

  const handleBackToSupport = () => {
    router.push("/contact")
  }

  if (status === "loading") {
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
            <CardTitle>Verifying Email Update</CardTitle>
            <CardDescription>Please wait while we verify your email update...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
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
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              status === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <CardTitle>{status === "success" ? "Email Updated Successfully!" : "Verification Failed"}</CardTitle>
          <CardDescription>
            {status === "success"
              ? "Your email address has been updated successfully."
              : "We couldn't verify your email update."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={status === "success" ? "default" : "destructive"}>
            <Mail className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {status === "success" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">
                You can now use your new email address to log in to your account.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">
                The verification link may have expired or been used already. Please try requesting a new email update
                from your profile.
              </p>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Button onClick={handleBackToProfile} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <Button variant="outline" onClick={handleBackToSupport} className="w-full bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailUpdatePage() {
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
      <VerifyEmailUpdateContent />
    </Suspense>
  )
}