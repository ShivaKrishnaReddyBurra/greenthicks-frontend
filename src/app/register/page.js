"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, UserPlus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchWithoutAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LogOut from "@/public/logo.png";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    // Basic client-side phone number validation
    const phoneRegex = /^\+\d{10,12}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be in international format (e.g., +12345678901)");
      setLoading(false);
      return;
    }

    try {
      await fetchWithoutAuth("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, isAdmin, firstName, lastName, username, phone }),
      });

      setSuccess("Registration successful! Please check your email to verify your account.");
      toast({
        title: "Registration Successful",
        description: "Please verify your email to activate your account.",
      });
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <img
            src={LogOut.src}
            alt="GreenThicks Logo"
            className="h-16 md:h-20"
          />
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-greenthicks/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-greenthicks-gold/20 rounded-full blur-3xl" />

        <Card className="border-greenthicks-light/20 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Join GreenThicks
            </h1>
            <p className="text-sm text-muted-foreground">
              Create an account to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User size={16} />
                    </div>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="bg-white/50 focus:bg-white/80 transition-colors"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <UserPlus size={16} />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Greenthicks user"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone size={16} />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+12345678901"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="^\+\d{10,12}$"
                    title="Phone number must be in international format (e.g., +12345678901)"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use international format (e.g., +12345678901)
                </p>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={16} />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 bg-white/50 focus:bg-white/80 transition-colors"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-greenthicks-dark to-greenthicks hover:from-greenthicks hover:to-greenthicks-light transition-all duration-300 border-none mt-4"
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}