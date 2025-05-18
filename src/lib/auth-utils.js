import { jwtDecode } from "jwt-decode";


// Store JWT token in localStorage
export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};


export function checkDeliveryStatus() {
  // Check if the user has delivery role
  const user = getCurrentUser(); // Hypothetical function to get user data
  return user?.role === "delivery";
}

function getCurrentUser() {
  // Implement logic to get current user from session, token, or context
  // Example: return JSON.parse(localStorage.getItem("user")) or fetch from API
  return null; // Replace with actual logic
}

// Get JWT token from localStorage
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Get user ID from JWT token
export const getUserId = () => {
  if (typeof window !== "undefined") {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
  }
  return null;
};

// Check if the current user is an admin (client-side)
export const checkAdminStatus = () => {
  if (typeof window !== "undefined") {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.isAdmin === true;
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
    }
  }
  return false;
};

// Clear authentication data
export const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};