"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchWithoutAuth } from "@/lib/api";

export default function DeliveryLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithoutAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Store token and user data in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Delivery partner login successful",
        description: "Welcome back to your delivery dashboard!",
      });

      router.push("/delivery/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials or access restricted",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h1 className="text-2xl font-bold mb-2">Delivery Partner Login</h1>
          <p className="text-muted-foreground mb-6">Access your delivery dashboard to manage deliveries</p>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have a delivery partner account?{" "}
              <Link href="/delivery/register" className="text-primary hover:underline">
                Apply now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}