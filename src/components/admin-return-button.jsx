"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings } from "lucide-react"
import { checkAdminStatus } from "@/lib/auth-utils"

export default function AdminReturnButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Don't show on admin pages
  const isAdminPage = pathname.startsWith("/admin")

  useEffect(() => {
    setMounted(true)
    setIsAdmin(checkAdminStatus())
  }, [])

  if (!mounted || !isAdmin || isAdminPage) {
    return null
  }

  return (
    <Link
      href="/admin/dashboard"
      className="fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      aria-label="Return to Admin Dashboard"
    >
      <Settings className="h-6 w-6" />
    </Link>
  )
}
