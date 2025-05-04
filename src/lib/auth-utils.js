// Authentication utilities for the admin portal

// Check if the credentials match admin credentials
export const isAdminUser = (username, password) => {
  return username === "a" && password === "a"
}

export function isDeliveryUser(username, password) {
  return username === "d" && password === "d";
}


// Check if the current user is an admin (for client-side)
export const checkAdminStatus = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAdmin") === "true"
  }
  return false
}

// Set admin status in localStorage
export function setUserRole(role) {
  localStorage.setItem("userRole", role);
}


// Clear admin status
export const clearAdminStatus = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAdmin")
  }
}
