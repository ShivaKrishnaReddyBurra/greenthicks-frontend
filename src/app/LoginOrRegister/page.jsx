"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LeafLoader from "@/components/LeafLoader";
import LogOut from "@/public/logo.png";

const Index = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const actionTimeout = useRef(null);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-greenthicks-light/10 p-6">
      <div className="mb-8 animate-float">
        <Link
          href="/"
          className="flex items-center mb-6"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
        >
          <img
            src={LogOut.src}
            alt="GreenThicks Logo"
            className="h-32 sm:h-40 md:h-48"
          />
        </Link>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gradient mb-4 text-center">
        GreenThicks
      </h1>
      <p className="text-xl text-greenthicks-dark mb-8 text-center max-w-lg">
        Fresh from farm to table. Experience our sustainable produce with just a click.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          className="bg-greenthicks hover:bg-greenthicks-dark text-white px-8 py-6 text-lg"
          disabled={actionLoading}
        >
          <Link
            href="./login"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/login");
            }}
          >
            Sign In
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-greenthicks text-greenthicks hover:bg-greenthicks/10 px-8 py-6 text-lg"
          disabled={actionLoading}
        >
          <Link
            href="./register"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/register");
            }}
          >
            Create Account
          </Link>
        </Button>
      </div>

      <div className="mt-16 text-sm text-muted-foreground text-center">
        <p>FRESH FROM FARM TO TABLE</p>
      </div>
    </div>
  );
};

export default Index;