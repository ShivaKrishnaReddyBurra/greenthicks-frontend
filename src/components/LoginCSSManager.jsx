"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function LoginCSSManager() {
  const loginCSSRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPage = ["/login", "/register", "/LoginOrRegister", "/signin", "/forgot-password", "/reset-password", "/verify-email", "/verify-phone"].includes(pathname);
    if (isAuthPage) {
      import("../app/login.css").then(() => {
        if (loginCSSRef.current) {
          document.head.removeChild(loginCSSRef.current);
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./login.css"; // ✅ Use public path if necessary
        loginCSSRef.current = link;
        document.head.appendChild(link);
      });
    } else {
      if (loginCSSRef.current) {
        document.head.removeChild(loginCSSRef.current);
        loginCSSRef.current = null;
      }
    }

    return () => {
      if (loginCSSRef.current) {
        document.head.removeChild(loginCSSRef.current);
        loginCSSRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
