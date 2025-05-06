"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
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
  ShoppingBag,
  FileText,
  Home,
} from "lucide-react"
import { clearAuth } from "@/lib/auth-utils"
import { useTheme } from "next-themes"
import logo from "@/public/logo.png";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Delivery", href: "/admin/delivery", icon: Truck },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Sellers", href: "/admin/sellers", icon: Store },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const logoSrc = mounted && theme === "dark" ? logo : logo

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b h-16 flex items-center px-4 md:px-6 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="relative h-8 w-32">
                {mounted && (
                  <Image
                    src={logoSrc || "/placeholder.svg"}
                    alt="Green Thicks"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                )}
              </div>
              <span className="ml-2 text-lg font-semibold hidden md:inline">Admin</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Home size={20} />
            </Link>
            <Link
              href="/admin/notifications"
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

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 pt-16`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setIsOpen(false)}
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
                )
              })}
            </ul>
          </nav>

          {/* User profile */}
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
  )
}
