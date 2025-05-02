"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { checkAdminStatus } from "@/lib/auth-utils"

export default function AdminLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!checkAdminStatus()) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 pt-16">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
