"use client"

import { useState, useEffect, Suspense } from "react"
import Link from 'next/link';
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { resetPassword } from "@/lib/api"
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import LogOut from "@/public/logo.png" ;
import Image from 'next/image'; 

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromURL = searchParams.get("token");
    const emailParam = searchParams.get("email")
    const tokenParam = searchParams.get("token")

    if (!emailParam || !tokenParam) {
      setError("Invalid reset link. Missing email or token.")
      return
    }

    setEmail(emailParam)
    setToken(tokenParam)
  }, [searchParams])

  useEffect(() => {
    // Calculate password strength
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }, [password])

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  const validatePassword = () => {
    if (!password) {
      setError("Password is required.")
      return false
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return false
    }

    return true
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validatePassword()) {
    return;
  }

  try {
    setLoading(true);
    setError("");

    await resetPassword({
      email,
      token,
      password,
      confirmPassword: password
    });

    setSuccess(true);
  } catch (err) {
    console.error("Reset password error:", err);
    setError(err.message || "Failed to reset password. The link may be expired or invalid.");
  } finally {
    setLoading(false);
  }
};

  const handleBackToLogin = () => {
    router.push("/login")
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>This password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please request a new password reset link from the login page.</AlertDescription>
            </Alert>
            <Button onClick={handleBackToLogin} className="w-full mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
            <CardTitle>Password Reset Successful!</CardTitle>
            <CardDescription>Your password has been successfully reset.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>You can now log in with your new password.</AlertDescription>
            </Alert>

            <Button onClick={handleBackToLogin} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength < 50
                          ? "text-red-600"
                          : passwordStrength < 75
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-2" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Password requirements:</p>
              <ul className="space-y-1 text-xs">
                <li className={`flex items-center space-x-2 ${password.length >= 8 ? "text-green-600" : ""}`}>
                  <span>{password.length >= 8 ? "✓" : "•"}</span>
                  <span>At least 8 characters</span>
                </li>
                <li className={`flex items-center space-x-2 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                  <span>{/[A-Z]/.test(password) ? "✓" : "•"}</span>
                  <span>One uppercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                  <span>{/[a-z]/.test(password) ? "✓" : "•"}</span>
                  <span>One lowercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                  <span>{/[0-9]/.test(password) ? "✓" : "•"}</span>
                  <span>One number</span>
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading || passwordStrength < 50}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reset Password
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleBackToLogin}
              className="w-full bg-transparent"
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  )
}
