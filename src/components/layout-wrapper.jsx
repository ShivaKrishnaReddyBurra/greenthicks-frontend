"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
