import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AdminReturnButton from "@/components/admin-return-button";
import { Providers } from "./providers";
import webicon from "@/public/favicon.ico";
import LayoutWrapper from "@/components/layout-wrapper"; // new wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'GreenThicks - Fresh Organic Vegetables Delivered to Your Home',
  description: 'Order fresh, organic vegetables directly from GreenThicks farms to your doorstep. Experience purity, taste, and health with every delivery!',
  keywords: ['GreenThicks','greenthicks','green thicks','organic vegetables delivery', 'fresh organic vegetables', 'healthy vegetables', 'organic vegetables', 'fresh vegetables', 'vegetable delivery', 'farm fresh vegetables', 'buy vegetables online'],
  authors: [{ name: 'GreenThicks Team' }],
  openGraph: {
    title: 'GreenThicks - Fresh Organic Vegetables',
    description: 'Farm-fresh organic vegetables delivered to your home. Healthy. Fresh. Pure. Taste the difference!',
    url: 'https://www.greenthicks.live',
    siteName: 'GreenThicks',
    icons: webicon,
    locale: 'en_US',
    type: 'website',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
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
      </body>
    </html>
  );
}
