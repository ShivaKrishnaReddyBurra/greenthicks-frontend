"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithoutAuth } from "@/lib/api";
import { checkAdminStatus, setAuthToken } from "@/lib/auth-utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await fetchWithoutAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Store JWT token
      setAuthToken(data.token);

      // Check admin status from token
      const isAdmin = checkAdminStatus();

      // Redirect based on admin status
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      // Handle specific backend errors
      setError(err.message === "Invalid credentials" ? "Invalid email or password" : "Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Green Thicks</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-md bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
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
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}