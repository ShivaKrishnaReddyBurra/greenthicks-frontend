"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { isAdminUser, setAdminStatus } from "@/lib/auth-utils"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check if admin credentials
      if (isAdminUser(username, password)) {
        // Set admin status
        setAdminStatus(true)
        // Redirect to admin dashboard
        router.push("/admin/dashboard")
        return
      }

      // Regular user login logic (simulate API call)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, allow any non-empty credentials
      if (username && password) {
        // Set user as logged in (not admin)
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("username", username)
        router.push("/")
      } else {
        setError("Please enter both username and password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Green Thicks</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border rounded-md bg-background"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded-md bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
