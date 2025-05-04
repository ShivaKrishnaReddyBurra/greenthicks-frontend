"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import logo from "@/public/logo.png"

export default function AuthLandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9f3] px-4">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Image src={logo.src} alt="Green Thicks" width={180} height={180} className="mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl font-bold text-[#2e7d32] mb-4"
        >
          GreenThicks
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[#2e7d32] text-lg mb-10 max-w-sm mx-auto"
        >
          Fresh from farm to table. Experience our sustainable produce with just a click.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/login/login"
            className="px-8 py-3 bg-[#2e7d32] text-white font-medium rounded-md hover:bg-[#1b5e20] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login/signup"
            className="px-8 py-3 bg-transparent text-[#2e7d32] font-medium border border-[#2e7d32] rounded-md hover:bg-[#e8f5e9] transition-colors"
          >
            Create Account
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-sm text-[#2e7d32]/70 uppercase tracking-wider"
        >
          FRESH FROM FARM TO TABLE
        </motion.div>
      </div>
    </div>
  )
}
