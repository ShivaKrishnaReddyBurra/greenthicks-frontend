import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import webicon from "@/public/favicon.ico";
import LayoutWrapper from "@/components/layout-wrapper"; // new wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Green Thicks - Fresh Organic Vegetables",
  description: "Farm to table organic vegetables delivered to your doorstep",
  icons: webicon,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={webicon.src} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
