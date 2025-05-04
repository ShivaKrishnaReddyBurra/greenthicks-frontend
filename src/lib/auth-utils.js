// Authentication utilities for the admin portal

// Check if the credentials match admin credentials
export const isAdminUser = (username, password) => {
  return username === "a" && password === "a"
}

// Check if the current user is an admin (for client-side)
export const checkAdminStatus = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAdmin") === "true"
  }
  return false
}

// Set admin status in localStorage
export const setAdminStatus = (status) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("isAdmin", status)
  }
}

// Clear admin status
export const clearAdminStatus = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAdmin")
  }
}
