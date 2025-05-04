"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";
import { checkAdminStatus } from "@/lib/auth-utils";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!checkAdminStatus()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white transition-colors duration-300">
      {/* Sidebar stays fixed */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 pt-16 md:ml-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
