"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPassword } from "@/lib/api";
import { Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import LogOut from "@/public/logo.png";
import LeafLoader from "@/components/LeafLoader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const actionTimeout = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      if (!email) {
        setError("Email address is required.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      try {
        setLoading(true);
        setActionLoading(true);
        setError("");
        await forgotPassword(email);
        setSuccess(true);
      } catch (err) {
        console.error("Forgot password error:", err);
        setError(err.message || "Failed to send reset email. Please try again.");
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setActionLoading(false);
      }
    }, 500);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(href);
    }, 500);
  };

  if (actionLoading) {
    return <LeafLoader />;
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
              width={80}
              height={80}
            />
          </Link>
        </div>
        <div className="w-full max-w-md relative z-10 my-8">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-greenthicks/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-greenthicks-gold/20 rounded-full blur-3xl" />
          <Card className="border-greenthicks-light/20 overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight">Reset Email Sent!</h1>
              <p className="text-sm text-muted-foreground">Check your email for password reset instructions.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <AlertDescription>
                  We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
                  instructions to reset your password.
                </AlertDescription>
              </div>
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <AlertDescription>
                  If you don't see the email in your inbox, please check your spam folder. The reset link will expire in 1
                  hour.
                </AlertDescription>
              </div>
              <Button
                onClick={(e) => handleNavigation(e, "/login")}
                className="w-full bg-gradient-to-r from-greenthicks-dark to-greenthicks hover:from-greenthicks hover:to-greenthicks-light transition-all duration-300 border-none"
                disabled={actionLoading}
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            width={80}
            height={80}
          />
        </Link>
      </div>
      <div className="w-full max-w-md relative z-10 my-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-greenthicks/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-greenthicks-gold/20 rounded-full blur-3xl" />
        <Card className="border-greenthicks-light/20 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground">Enter your email address and we'll send you a reset link.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <AlertDescription>{error}</AlertDescription>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-greenthicks-dark to-greenthicks hover:from-greenthicks hover:to-greenthicks-light transition-all duration-300 border-none"
                disabled={loading || actionLoading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Reset Link
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleNavigation(e, "/login")}
                className="w-full bg-transparent border-greenthicks-light/50 hover:bg-greenthicks-light/10"
                disabled={loading || actionLoading}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}