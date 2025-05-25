"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LeafLoader from "@/components/LeafLoader";
import LogOut from "@/public/logo.png";

export default function VerifyEmailClient() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const actionTimeout = useRef(null);

  useEffect(() => {
    const verify = async () => {
      setActionLoading(true);
      if (!email || !token) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email or request a new verification link.");
        toast({
          title: "Invalid Link",
          description: "The verification link is invalid or incomplete.",
          variant: "destructive",
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActionLoading(false);
        return;
      }

      clearTimeout(actionTimeout.current);
      actionTimeout.current = setTimeout(async () => {
        try {
          const data = await verifyEmail(email, token);
          setStatus("success");
          setMessage(data.message || "Email verified successfully! You can now log in.");
          toast({
            title: "Email Verified",
            description: "Your email has been verified. You can now log in.",
          });
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Loader for redirect
          router.push("/login");
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || "Verification failed. Please try again or request a new verification link.";
          setStatus("error");
          setMessage(errorMessage);
          toast({
            title: "Verification Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setActionLoading(false);
        }
      }, 500);
    };

    verify();
  }, [email, token, router, toast]);

  const handleNavigation = async (path) => {
    clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(async () => {
      setActionLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push(path);
      } catch (error) {
        console.error("Navigation error:", error);
        toast({
          title: "Error",
          description: "Failed to navigate. Please try again.",
          variant: "destructive",
        });
      } finally {
        setActionLoading(false);
      }
    }, 500);
  };

  if (actionLoading) {
    return <LeafLoader />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
        >
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
              Email Verification
            </h1>
            <p className="text-sm text-muted-foreground">
              Verifying your email address
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {status === "success" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                {message}
                <div className="mt-4">
                  <Link
                    href={`/resend-verification?email=${encodeURIComponent(email || "")}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(`/resend-verification?email=${encodeURIComponent(email || "")}`);
                    }}
                  >
                    <Button
                      className="bg-gradient-to-r from-greenthicks-dark to-greenthicks hover:from-greenthicks hover:to-greenthicks-light transition-all duration-300 border-none"
                      disabled={actionLoading}
                    >
                      Resend Verification Email
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}