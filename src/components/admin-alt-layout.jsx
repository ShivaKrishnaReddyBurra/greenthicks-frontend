"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ShoppingBag,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  Truck,
  Store,
  FileText,
  Search,
} from "lucide-react";
import logo from "@/public/logo.png";

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

export default function AdminAltLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleButtonClick = async (e, action, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    if (action) {
      action();
    } else if (href) {
      window.location.href = href;
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/admin-alt/dashboard", icon: Home },
    { name: "Orders", href: "/admin-alt/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin-alt/products", icon: Store },
    { name: "Customers", href: "/admin-alt/users", icon: Users },
    { name: "Delivery", href: "/admin-alt/delivery", icon: Truck },
    { name: "Sellers", href: "/admin-alt/sellers", icon: Store },
    { name: "Invoices", href: "/admin-alt/invoices", icon: FileText },
    { name: "Analytics", href: "/admin-alt/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin-alt/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {isLoading && <LeafLoader />}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center px-4">
            <Image src={logo.src} alt="Green Thicks" width={150} height={40} className="h-10 w-auto" />
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-4 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleButtonClick(e, null, item.href)}
                    className={`${
                      isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={(e) => handleButtonClick(e, null, "/logout")}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Image src={logo.src} alt="Green Thicks" width={120} height={32} className="h-8 w-auto" />
            <button
              onClick={(e) => handleButtonClick(e, () => setSidebarOpen(false))}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleButtonClick(e, () => setSidebarOpen(false), item.href)}
                    className={`${
                      isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    } group flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-200`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={(e) => handleButtonClick(e, () => setSidebarOpen(false), "/logout")}
              className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="w-full">
          <div className="relative z-10 flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex">
            <button
              onClick={(e) => handleButtonClick(e, () => setSidebarOpen(true))}
              className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex justify-between px-4 md:px-6">
              <div className="flex-1 flex items-center">
                <div className="relative w-full max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-green-500 dark:text-gray-200"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <button
                  onClick={(e) => handleButtonClick(e, null, "#notifications")}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}