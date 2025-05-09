"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login"); // Check for login route
  const isDeliveryRoute = pathname.startsWith("/delivery"); // Check for delivery route
  const isRegisterRoute = pathname.startsWith("/register"); // Check for signup route
  const isNotFoundRoute = pathname.startsWith("/LoginOrRegister"); // Check for not found route
  const isSigninRoute = pathname.startsWith("/signin"); // Check for home route

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminRoute && !isLoginRoute && !isDeliveryRoute &&  !isRegisterRoute && !isNotFoundRoute && !isSigninRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute  && !isLoginRoute  && !isDeliveryRoute &&  !isRegisterRoute && !isNotFoundRoute && !isSigninRoute && <Footer />}
    </div>
  );
}
