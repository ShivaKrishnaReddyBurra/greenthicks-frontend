"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LogOut from "@/public/logo.png";

export default function VerifyEmailClient() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!email || !token) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email or request a new verification link.");
        return;
      }

      try {
        const data = await verifyEmail(email, token);
        setStatus("success");
        setMessage(data.message || "Email verified successfully! You can now log in.");
        toast({
          title: "Email Verified",
          description: "Your email has been verified. You can now log in.",
        });
        setTimeout(() => router.push("/login"), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification failed. Please try again or request a new verification link.");
        toast({
          title: "Verification Failed",
          description: err.message || "An error occurred during verification.",
          variante: "destructive",
        });
      }
    };

    verify();
  }, [email, token, router, toast]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
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
            {status === "verifying" && (
              <div className="text-center text-muted-foreground">
                Verifying your email...
              </div>
            )}
            {status === "success" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                {message}
                <div className="mt-4">
                  <Link href={`/resend-verification?email=${encodeURIComponent(email || "")}`}>
                    <Button className="bg-gradient-to-r from-greenthicks-dark to-greenthicks hover:from-greenthicks hover:to-greenthicks-light transition-all duration-300 border-none">
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