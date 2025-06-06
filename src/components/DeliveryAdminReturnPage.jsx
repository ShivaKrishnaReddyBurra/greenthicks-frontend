"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { checkAdminStatus } from "@/lib/auth-utils";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export default function DeliveryAdminReturnButton() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isRestrictedPage = pathname.startsWith("/admin") || pathname.startsWith("/delivery");

  useEffect(() => {
    setMounted(true);
    const isAdmin = checkAdminStatus();
    setIsAuthorized(isAdmin);
  }, []);

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsLoading(false);
  };

  if (!mounted || !isAuthorized || isRestrictedPage) {
    return null;
  }

  return (
    <>
      {isLoading && <LeafLoader />}
      <Link
  href="/delivery-admin/dashboard"
  onClick={(e) => handleNavigation(e, "/delivery-admin/dashboard")}
  className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
  aria-label="Return to Admin Dashboard"
>
  <Shield className="h-6 w-6" />
</Link>
    </>
  );
}