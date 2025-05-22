"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Store,
  BarChart,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  ShoppingBagIcon,
  FileText,
  Home,
  FileEdit,
  AlertTriangle,
  RefreshCw,
  ShoppingCartIcon,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { clearAuth } from "@/lib/auth-utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    clearAuth();
    router.push("/login");
    setIsLoading(false);
  };

  const handleThemeChange = async (newTheme) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTheme(newTheme);
    setIsLoading(false);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
    { name: "Delivery", href: "/admin/delivery", icon: Truck },
    { name: "Cancellations", href: "/admin/cancellations", icon: AlertTriangle },
    { name: "Returns", href: "/admin/returns", icon: RefreshCw },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: ShoppingBagIcon },
    { name: "Service-Areas", href: "/admin/service-areas", icon: ShoppingBagIcon },
    { name: "Sellers", href: "/admin/sellers", icon: Store },
    { name: "Static Pages", href: "/admin/pages", icon: FileEdit },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const logoSrc = mounted && theme === "dark" ? logo.src : logo.src;

  return (
    <>
      {isLoading && <LeafLoader />}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b h-16 flex items-center px-4 md:px-6 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              href="/admin/dashboard"
              onClick={(e) => handleNavigation(e, "/admin/dashboard")}
              className="flex items-center"
            >
              <div className="relative h-8 w-32">
                {mounted && (
                  <Image
                    src={logoSrc}
                    alt="Green Thicks"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                )}
              </div>
              <span className="ml-0 text-lg font-semibold hidden md:inline">Admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mounted && theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : mounted && theme === "light" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Laptop className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                  <Laptop className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/"
              onClick={(e) => handleNavigation(e, "/")}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Home size={20} />
            </Link>
            <Link
              href="/admin/notifications"
              onClick={(e) => handleNavigation(e, "/admin/notifications")}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 pt-16`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavigation(e, item.href)}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon size={20} className={`mr-3 ${isActive ? "text-green-600 dark:text-green-400" : ""}`} />
                      <span>{item.name}</span>
                      {item.name === "Notifications" && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          3
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t dark:border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-semibold">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">greenthickss@gmail.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
