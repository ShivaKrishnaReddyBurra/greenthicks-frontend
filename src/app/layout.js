"use client"; // Mark as client component

import React, { useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AdminReturnButton from "@/components/admin-return-button";
import { Providers } from "./providers";
import webicon from "@/public/favicon.ico";
import LayoutWrapper from "@/components/layout-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { metadata } from './metadata'; // Import metadata from the separate file

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const loginCSSRef = useRef(null);

  useEffect(() => {
    // Check if the current route is one of the auth pages
    const isAuthPage = ['/login', '/register', '/LoginOrRegister'].includes(pathname);
    if (isAuthPage) {
      // Dynamically import login.css for auth pages
      import('./login.css').then((module) => {
        if (loginCSSRef.current) {
          // Remove the previous CSS if it exists
          document.head.removeChild(loginCSSRef.current);
        }
        // Create a new link element for the CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './login.css';
        loginCSSRef.current = link;
        document.head.appendChild(link);
      });
    } else {
      // Remove the login CSS if navigating away from an auth page
      if (loginCSSRef.current) {
        document.head.removeChild(loginCSSRef.current);
        loginCSSRef.current = null;
      }
    }

    // Cleanup function to remove the CSS when the component unmounts
    return () => {
      if (loginCSSRef.current) {
        document.head.removeChild(loginCSSRef.current);
        loginCSSRef.current = null;
      }
    };
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={webicon.src} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </ThemeProvider>
        <AdminReturnButton href="/admin/dashboard" className="fixed bottom-4 right-4 z-50" />
        <Toaster />
      </body>
    </html>
  );
}
