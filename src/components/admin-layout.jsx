"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";
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

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!checkAdminStatus()) {
      setIsLoading(true);
      setTimeout(() => {
        router.push("/login");
        setIsLoading(false);
      }, 1000);
    }
  }, [router]);

  return (
    <>
      {isLoading && <LeafLoader />}
      <div className="flex min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white transition-colors duration-300">
        <AdminSidebar />
        <div className="flex-1 pt-16 md:ml-64">
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}