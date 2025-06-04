import { getAuthToken } from "@/lib/auth-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchWithoutAuth = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || "Something went wrong");
    }
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("You are not logged in, please login");
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    let errorMessage = error.message || "Something went wrong";
    if (error.error) {
      errorMessage = `${errorMessage}; ${error.error}`;
    }
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      throw new Error("Token expired or invalid");
    }
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || "Something went wrong");
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchWithAuthFormData = async (url, formData, method = "POST") => {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("You are not logged in, please login");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      throw new Error("Token expired or invalid");
    }
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || "Something went wrong");
    }
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export const fetchWithAuthFile = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("You are not logged in, please login");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      throw new Error("Token expired or invalid");
    }
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || "Something went wrong");
    }
    throw new Error(error.message || "Something went wrong");
  }

  return response;
};

// Admin Dashboard API functions
export const getAdminStats = async () => {
  return fetchWithAuth("/api/admin/stats");
};

export const getRecentOrders = async () => {
  return fetchWithAuth("/api/admin/recent-orders");
};

export const getTopProducts = async () => {
  return fetchWithAuth("/api/admin/top-products");
};

export const getSalesTrend = async () => {
  return fetchWithAuth("/api/admin/sales-trend");
};

// Admin Notifications API functions
export const getNotifications = async () => {
  return fetchWithAuth("/api/admin/notifications");
};

export const createNotification = async (notificationData) => {
  return fetchWithAuth("/api/admin/notifications", {
    method: "POST",
    body: JSON.stringify(notificationData),
  });
};

export const markNotificationAsRead = async (notificationId) => {
  return fetchWithAuth(`/api/admin/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const markAllNotificationsAsRead = async () => {
  return fetchWithAuth("/api/admin/notifications/read-all", {
    method: "PATCH",
  });
};

export const deleteNotification = async (notificationId) => {
  return fetchWithAuth(`/api/admin/notifications/${notificationId}`, {
    method: "DELETE",
  });
};

export const clearAllNotifications = async () => {
  return fetchWithAuth("/api/admin/notifications", {
    method: "DELETE",
  });
};

// Admin Settings API functions
export const getAdminSettings = async () => {
  return fetchWithAuth("/api/admin/settings");
};

export const updateAdminSettings = async (category, settingsData) => {
  return fetchWithAuth(`/api/admin/settings/${category}`, {
    method: "PUT",
    body: JSON.stringify(settingsData),
  });
};

export const resetAdminSettings = async (category) => {
  return fetchWithAuth(`/api/admin/settings/${category}/reset`, {
    method: "POST",
  });
};

// Cancellations API functions
export const getCancellations = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/cancellations?page=${page}&limit=${limit}`);
};

export const getCancellationById = async (id) => {
  return fetchWithAuth(`/api/cancellations/${id}`);
};

export const updateCancellationStatus = async (id, status) => {
  return fetchWithAuth(`/api/cancellations/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const processCancellationRefund = async (id, refundData) => {
  return fetchWithAuth(`/api/cancellations/${id}/refund`, {
    method: "POST",
    body: JSON.stringify(refundData),
  });
};

// Returns API functions
export const getReturns = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/returns?page=${page}&limit=${limit}`);
};

export const getReturnById = async (id) => {
  return fetchWithAuth(`/api/returns/${id}`);
};

export const updateReturnStatus = async (id, status) => {
  return fetchWithAuth(`/api/returns/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const processReturnRefund = async (id, refundData) => {
  return fetchWithAuth(`/api/returns/${id}/refund`, {
    method: "POST",
    body: JSON.stringify(refundData),
  });
};

// Favorites API functions
export const apiAddToFavorites = async (productId) => {
  return fetchWithAuth("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
};

export const apiRemoveFromFavorites = async (productId) => {
  return fetchWithAuth(`/api/favorites/${productId}`, {
    method: "DELETE",
  });
};

export const apiClearFavorites = async () => {
  return fetchWithAuth("/api/favorites", {
    method: "DELETE",
  });
};

export const getFavorites = async () => {
  return fetchWithAuth("/api/favorites");
};

// Delivery API functions
export const getDeliveryOrders = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/delivery?page=${page}&limit=${limit}`);
};

export const assignDeliveryBoy = async (globalId, deliveryBoyId) => {
  return fetchWithAuth(`/api/delivery/${globalId}/assign`, {
    method: "POST",
    body: JSON.stringify({ deliveryBoyId }),
  });
};

export const updateDeliveryStatus = async (globalId, status) => {
  return fetchWithAuth(`/api/delivery/${globalId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const setDeliveryBoyRole = async (globalId, isDeliveryBoy) => {
  return fetchWithAuth(`/api/delivery/user/${globalId}/delivery-role`, {
    method: "PUT",
    body: JSON.stringify({ isDeliveryBoy }),
  });
};

export const getDeliveryBoyById = async (globalId) => {
  return fetchWithAuth(`/api/delivery/user/${globalId}`);
};

export const getDeliveryBoys = async () => {
  const users = await fetchWithAuth("/api/users"); // Updated to use /api/users
  return users.filter((user) => user.isDeliveryBoy);
};

// Product API functions
export const getProducts = async () => {
  return fetchWithoutAuth("/api/products");
};

export const getProductById = async (globalId) => {
  return fetchWithoutAuth(`/api/products/${globalId}`);
};

export const createProduct = async (productData, images) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });
  images.forEach((image) => {
    formData.append("images", image);
  });
  return fetchWithAuthFormData("/api/products", formData, "POST");
};

export const updateProduct = async (globalId, productData, images) => {
  const formData = new FormData();
  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }
  return fetchWithAuthFormData(`/api/products/${globalId}`, formData, "PUT");
};

export const deleteProduct = async (globalId) => {
  return fetchWithAuth(`/api/products/${globalId}`, { method: "DELETE" });
};

// Order API functions
export const createOrder = async (orderData) => {
  return fetchWithAuth("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getUserOrders = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/orders/my-orders?page=${page}&limit=${limit}`);
};

export const getAllOrders = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/orders?page=${page}&limit=${limit}`);
};

export const getOrder = async (globalId) => {
  return fetchWithAuth(`/api/orders/${globalId}`);
};

export const cancelOrder = async (globalId) => {
  return fetchWithAuth(`/api/orders/${globalId}/cancel`, {
    method: "PUT",
    body: JSON.stringify({ status: "cancelled" }),
  });
};

export const exportOrders = async () => {
  return fetchWithAuthFile("/api/orders/export", {
    method: "GET",
  });
};

// Cart API functions
export const addToCart = async (productId, quantity) => {
  return fetchWithAuth("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
};

export const getCart = async () => {
  return fetchWithAuth("/api/cart");
};

export const removeFromCart = async (productId) => {
  return fetchWithAuth(`/api/cart/item/${productId}`, {
    method: "DELETE",
  });
};

export const clearCart = async () => {
  return fetchWithAuth("/api/cart", {
    method: "DELETE",
  });
};

// User Profile API function
export const getUserProfile = async () => {
  return fetchWithAuth("/api/auth/profile");
};

// User Management API functions
export const getAllUsers = async () => {
  return fetchWithAuth("/api/users"); // Updated to use /api/users
};

export const updateUser = async (globalId, userData) => {
  return fetchWithAuth(`/api/users/${globalId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (globalId) => {
  return fetchWithAuth(`/api/users/${globalId}`, {
    method: "DELETE",
  });
};

export const getUserDetails = async (globalId, page = 1, limit = 10) => {
  return fetchWithAuth(`/api/users/${globalId}/details?page=${page}&limit=${limit}`);
};

// Coupon API function
export const validateCoupon = async (couponCode, subtotal) => {
  return fetchWithAuth("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code: couponCode, subtotal }),
  });
};

export const getInvoices = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/invoices?page=${page}&limit=${limit}`);
};

export const exportInvoices = async () => {
  return fetchWithAuthFile("/api/invoices/export", { method: "GET" });
};

export const getInvoiceData = async (globalId) => {
  return fetchWithAuth(`/api/invoices/${globalId}`);
};

// Delivery Partner Login with role validation
export const deliveryLogin = async (identifier, password) => {
  const loginData = await fetchWithoutAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  if (!loginData.user.isDeliveryBoy && !loginData.user.isAdmin) {
    throw new Error("Access restricted: Only delivery partners or admins can log in");
  }

  return loginData;
};

// Email Verification API functions
export const verifyEmail = async (email, token) => {
  return fetchWithoutAuth(
    `/api/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
    {
      method: "GET",
    }
  );
};

export const resendVerificationEmail = async (email) => {
  return fetchWithoutAuth("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// Delivery Map API functions
export const getDeliveryLocations = async () => {
  return fetchWithAuth("/api/delivery-map/locations");
};

export const updateDeliveryLocation = async (latitude, longitude, address) => {
  return fetchWithAuth("/api/delivery-map/update-location", {
    method: "POST",
    body: JSON.stringify({ latitude, longitude, address }),
  });
};

export const getCurrentLocation = async () => {
  return fetchWithAuth("/api/delivery-map/current-location");
};

// Delivery Dashboard API functions
export const getDeliveryStats = async () => {
  return fetchWithAuth("/api/delivery-dashboard/stats");
};

export const getDeliveryEarnings = async (period = "month") => {
  return fetchWithAuth(`/api/delivery-dashboard/earnings?period=${period}`);
};

// Delivery Profile API functions
export const getDeliveryProfile = async () => {
  return fetchWithAuth("/api/delivery-profile");
};

export const updateDeliveryPersonalInfo = async (personalData) => {
  return fetchWithAuth("/api/delivery-profile/personal", {
    method: "PUT",
    body: JSON.stringify(personalData),
  });
};

export const updateDeliveryVehicleInfo = async (vehicleData) => {
  return fetchWithAuth("/api/delivery-profile/vehicle", {
    method: "PUT",
    body: JSON.stringify(vehicleData),
  });
};

export const updateDeliveryBankDetails = async (bankData) => {
  return fetchWithAuth("/api/delivery-profile/bank", {
    method: "PUT",
    body: JSON.stringify(bankData),
  });
};

export const changeDeliveryPassword = async (currentPassword, newPassword) => {
  return fetchWithAuth("/api/delivery-profile/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

// Delivery Settings API functions
export const getDeliverySettings = async () => {
  return fetchWithAuth("/api/delivery-settings");
};

export const updateDeliveryNotificationSettings = async (notificationData) => {
  return fetchWithAuth("/api/delivery-settings/notifications", {
    method: "PUT",
    body: JSON.stringify(notificationData),
  });
};

export const updateDeliveryAppSettings = async (appData) => {
  return fetchWithAuth("/api/delivery-settings/app", {
    method: "PUT",
    body: JSON.stringify(appData),
  });
};

export const updateDeliveryPrivacySettings = async (privacyData) => {
  return fetchWithAuth("/api/delivery-settings/privacy", {
    method: "PUT",
    body: JSON.stringify(privacyData),
  });
};

// Export Reports API functions
export const exportSalesReport = async (dateRange, format) => {
  return fetchWithAuth("/api/export-reports/sales", {
    method: "POST",
    body: JSON.stringify({ dateRange, format }),
  });
};

export const exportInventoryReport = async (format) => {
  return fetchWithAuth("/api/export-reports/inventory", {
    method: "POST",
    body: JSON.stringify({ format }),
  });
};

export const exportCustomerReport = async (format) => {
  return fetchWithAuth("/api/export-reports/customers", {
    method: "POST",
    body: JSON.stringify({ format }),
  });
};

// Admin Profile API functions
export const getAdminProfile = async () => {
  return fetchWithAuth("/api/admin-profile");
};

export const updateAdminProfile = async (profileData) => {
  return fetchWithAuth("/api/admin-profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  return fetchWithAuth("/api/admin-profile/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const getAdminActivity = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/admin-profile/activity?page=${page}&limit=${limit}`);
};

// Delivery Admin API functions
export const getDeliveryBoysAdmin = async () => {
  return fetchWithAuth("/api/delivery-admin/delivery-boys");
};

export const getDeliveryAnalytics = async (period = "month") => {
  return fetchWithAuth(`/api/delivery-admin/analytics?period=${period}`);
};

export const assignDeliveryBoyAdmin = async (orderId, deliveryBoyId) => {
  return fetchWithAuth(`/api/delivery-admin/assign-delivery/${orderId}`, {
    method: "POST",
    body: JSON.stringify({ deliveryBoyId }),
  });
};

export const getDeliveryPerformanceReport = async (deliveryBoyId, startDate, endDate) => {
  const params = new URLSearchParams();
  if (deliveryBoyId) params.append("deliveryBoyId", deliveryBoyId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return fetchWithAuth(`/api/delivery-admin/performance-report?${params.toString()}`);
};