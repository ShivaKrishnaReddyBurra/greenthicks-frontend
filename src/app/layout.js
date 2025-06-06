"use client";

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
import { metadata } from './metadata';
import DeliveryReturnButton from '@/components/DeliveryReturnButton';
import DeliveryAdminReturnButton from '@/components/DeliveryAdminReturnPage';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const loginCSSRef = useRef(null);

  useEffect(() => {
    const isAuthPage = ['/login', '/register', '/LoginOrRegister'].includes(pathname);
    if (isAuthPage) {
      import('./login.css').then((module) => {
        if (loginCSSRef.current) {
          document.head.removeChild(loginCSSRef.current);
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './login.css';
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={webicon.src} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-3 sm:bottom-8 sm:right-8">
              <div className="flex space-x-3">
                <DeliveryAdminReturnButton />
                <DeliveryReturnButton />
              </div>
              <div className="flex justify-center">
                <AdminReturnButton />
              </div>
            </div>
          </Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}