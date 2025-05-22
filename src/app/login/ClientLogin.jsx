"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { fetchWithoutAuth } from "@/lib/api";
import { checkAdminStatus, setAuthToken } from "@/lib/auth-utils";
import LogOut from "@/public/logo.png";
import { useToast } from "@/hooks/use-toast";
import LeafLoader from "@/components/LeafLoader";

export default function ClientLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const returnUrl = searchParams.get("returnUrl") || "/products";
  const actionTimeout = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      setError("");
      try {
        const data = await fetchWithoutAuth("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier, password }),
        });

        setAuthToken(data.token);
        const isAdmin = checkAdminStatus();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (isAdmin) {
          router.push("/admin/dashboard?refresh=true");
        } else {
          router.push(`${decodeURIComponent(returnUrl)}?refresh=true`);
        }
        toast({
          title: "Login successful",
          description: "You are now logged in.",
        });
      } catch (err) {
        let errorMessage = err.message;
        if (err.message === "Invalid credentials") {
          errorMessage = "Invalid username or password";
        } else if (err.message.includes("is required")) {
          errorMessage = "Please fill in all fields";
        } else if (err.message === "Please verify your email before logging in.") {
          errorMessage = (
            <>
              Please verify your email to log in.{" "}
              <Link
                href={`/resend-verification?email=${encodeURIComponent(identifier)}`}
                className="text-primary font-medium hover:underline"
                onClick={(e) => handleNavigation(e, `/resend-verification?email=${encodeURIComponent(identifier)}`)}
              >
                Resend verification email
              </Link>
            </>
          );
        } else {
          errorMessage = "Login failed. Please try again.";
        }
        setError(errorMessage);
        console.error(err);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <h1 className="text-3xl font-extrabold tracking-tight">
              Sign in to GreenThicks
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your username or email and password to access your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="identifier">Username or Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User size={16} />
                  </div>
                  <Input
                    id="identifier"
                    placeholder="username or you@example.com"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={16} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-greenthicks-dark to-greenthicks hover:from-greenthicks hover:to-greenthicks-light transition-all duration-300 border-none mt-4"
                disabled={actionLoading}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                onClick={(e) => handleNavigation(e, "/register")}
                className="text-primary font-medium hover:underline"
              >
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}