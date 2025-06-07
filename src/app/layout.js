import { Inter } from "next/font/google";
import "./globals.css";
import { metadata as appMetadata } from "./metadata";
import { viewport as appViewport } from "./metadata"; // ✅ Import viewport metadata
import DeliveryReturnButton from "@/components/DeliveryReturnButton";
import DeliveryAdminReturnButton from "@/components/DeliveryAdminReturnPage";
import AdminReturnButton from "@/components/admin-return-button";
import { ThemeProvider } from '@/components/theme-provider'; // ✅ Correct if ThemeProvider is a named export
import { Providers } from "./providers";
import LayoutWrapper from "@/components/layout-wrapper";
import { Toaster } from "@/components/ui/toaster";
import webicon from "@/public/favicon.ico";
import LoginCSSManager from "@/components/LoginCSSManager"; // ✅ New client component

export const metadata = appMetadata;
export const viewport = appViewport; // ✅ Use the imported viewport metadata
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={webicon.src} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <LoginCSSManager /> {/* ✅ Only this runs on client */}
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
