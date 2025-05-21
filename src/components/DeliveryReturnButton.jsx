"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Truck } from "lucide-react"
import { checkAdminStatus, checkDeliveryStatus } from "@/lib/auth-utils"

export default function DeliveryReturnButton() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Don't show on admin or delivery pages
  const isRestrictedPage = pathname.startsWith("/admin") || pathname.startsWith("/delivery")

  useEffect(() => {
    setMounted(true)
    const isAdmin = checkAdminStatus()
    const isDelivery = checkDeliveryStatus()
    setIsAuthorized(isAdmin || isDelivery)
  }, [])

  if (!mounted || !isAuthorized || isRestrictedPage) {
    return null
  }

  return (
    <Link
      href="/delivery/dashboard"
      className="fixed bottom-16 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors px-4 py-2 mb-2"
      aria-label="Return to Delivery Dashboard"
    >
      <Truck className="h-6 w-6" />
    </Link>
  )
}