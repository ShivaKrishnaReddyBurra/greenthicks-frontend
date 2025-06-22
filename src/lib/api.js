import { getAuthToken } from "@/lib/auth-utils";
import { jwtDecode } from "jwt-decode";
 // Added for decoding JWT to get user ID

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Centralized response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    let error = {};
    try {
      const text = await response.text();
      error = text ? JSON.parse(text) : { message: `Request failed with status ${response.status}` };
    } catch (parseError) {
      error = { message: `Request failed with status ${response.status}`, rawResponse: text };
    }
    const errorMessage = error.errors && Array.isArray(error.errors)
      ? error.errors.map((err) => err.msg || err.message || "Unknown error").join("; ")
      : error.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMessage);
    err.status = response.status;
    err.response = error;
    console.error("API error:", { url: response.url, status: response.status, error }); // Added logging
    throw err;
  }
  return response.json();
};

export const fetchWithoutAuth = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  let response;
  try {
    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
  } catch (fetchError) {
    throw new Error(`Network error: ${fetchError.message}`);
  }

  return handleResponse(response);
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const timeout = 10000; // 10 seconds timeout

  if (!token) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Not authenticated. Please log in.");
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal, // Added AbortController signal
    });

    clearTimeout(timeoutId);
  } catch (fetchError) {
    if (fetchError.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw new Error(`Network error: ${fetchError.message}`);
  }

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  return handleResponse(response);
};

export const fetchWithAuthFormData = async (url, formData, method = "POST") => {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Not authenticated. Please log in.");
  }

  if (!(formData instanceof FormData)) {
    throw new Error("formData must be a FormData object");
  }

  const entries = [...formData.entries()];
  if (entries.length === 0) {
    throw new Error("FormData is empty");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: formData,
    });
  } catch (fetchError) {
    throw new Error(`Network error: ${fetchError.message}`);
  }

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  return handleResponse(response);
};

export const fetchWithAuthFile = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Not authenticated. Please log in.");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
  } catch (fetchError) {
    throw new Error(`Network error: ${fetchError.message}`);
  }

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  return response;
};

// Product API functions
export const getProducts = async () => {
  return fetchWithoutAuth("/api/products");
};

export const getProductById = async (globalId) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  return fetchWithoutAuth(`/api/products/${globalId}`);
};

export const createProduct = async (productData, images = [], imageData = []) => {
  if (!productData || typeof productData !== "object") {
    throw new Error("Invalid product data provided");
  }
  if (!Array.isArray(imageData)) {
    throw new Error("imageData must be an array");
  }
  if (!Array.isArray(productData.tags)) {
    throw new Error("tags must be an array");
  }
  if (typeof productData.nutrition !== "object" || productData.nutrition === null) {
    throw new Error("nutrition must be an object");
  }
  if (typeof productData.policies !== "object" || productData.policies === null) {
    throw new Error("policies must be an object");
  }

  const validCategories = [
    'leafy', 'fruit', 'root', 'herbs', 'milk', 'pulses', 'grains', 
    'spices', 'nuts', 'oils', 'snacks', 'beverages'
  ];
  if (productData.category && !validCategories.includes(productData.category)) {
    throw new Error(`Invalid category: must be one of ${validCategories.join(", ")}`);
  }

  const formData = new FormData();

  const simpleFields = [
    "name", "description", "price", "category", "unit", "stock", "sku",
    "published", "featured", "bestseller", "seasonal", "new", "organic",
  ];

  for (const key of simpleFields) {
    if (productData[key] != null) {
      formData.append(key, String(productData[key]).trim());
    }
  }

  if (productData.originalPrice != null && productData.originalPrice !== '') {
    formData.append("originalPrice", String(productData.originalPrice));
  }

  if (productData.discount != null && productData.discount !== '') {
    formData.append("discount", String(productData.discount));
  }

  try {
    formData.append("tags", JSON.stringify(productData.tags || []));
  } catch (error) {
    throw new Error(`Failed to serialize tags: ${error.message}`);
  }

  try {
    const nutritionData = {
      calories: Number(productData.nutrition.calories) || 0,
      protein: Number(productData.nutrition.protein) || 0,
      carbs: Number(productData.nutrition.carbs) || 0,
      fat: Number(productData.nutrition.fat) || 0,
      fiber: Number(productData.nutrition.fiber) || 0,
      vitamins: Array.isArray(productData.nutrition.vitamins) ? productData.nutrition.vitamins : [],
    };
    formData.append("nutrition", JSON.stringify(nutritionData));
  } catch (error) {
    throw new Error(`Failed to serialize nutrition data: ${error.message}`);
  }

  try {
    const policiesData = {
      return: String(productData.policies.return || ""),
      shipping: String(productData.policies.shipping || ""),
      availability: String(productData.policies.availability || ""),
    };
    formData.append("policies", JSON.stringify(policiesData));
  } catch (error) {
    throw new Error(`Failed to serialize policies data: ${error.message}`);
  }

  if (Array.isArray(images) && images.length > 0) {
    if (images.length > 6) {
      throw new Error("Maximum 6 images allowed");
    }
    images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append("images", image);
      } else {
        console.warn(`Invalid image at index ${index}: not a File object`);
      }
    });
  } else {
    throw new Error("At least one image is required");
  }

  try {
    const sanitizedImageData = imageData.map(({ primary }) => ({ primary: Boolean(primary) }));
    formData.append("imageData", JSON.stringify(sanitizedImageData));
  } catch (error) {
    throw new Error(`Failed to serialize imageData: ${error.message}`);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
    }
  }

  return fetchWithAuthFormData("/api/products", formData, "POST");
};

export const updateProduct = async (globalId, productData, images = [], imageData = [], keepExistingImages = true) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  if (!productData || typeof productData !== "object") {
    throw new Error("Invalid product data provided");
  }
  if (!Array.isArray(imageData)) {
    throw new Error("imageData must be an array");
  }

  const validCategories = ['leafy', 'fruit', 'root', 'herbs', 'milk', 'pulses', 'grains', 'spices', 'nuts', 'oils', 'snacks', 'beverages'];
  if (productData.category && !validCategories.includes(productData.category)) {
    throw new Error(`Invalid category: must be one of ${validCategories.join(", ")}`);
  }

  const formData = new FormData();

  const simpleFields = [
    "name", "description", "price", "originalPrice", "category", "unit", "stock",
    "discount", "featured", "bestseller", "seasonal", "new", "organic", "sku", "published",
  ];

  for (const key of simpleFields) {
    if (productData[key] != null) {
      formData.append(key, String(productData[key]).trim());
    }
  }

  if (Array.isArray(productData.tags)) {
    formData.append("tags", JSON.stringify(productData.tags));
  }

  if (productData.nutrition && typeof productData.nutrition === "object") {
    formData.append("nutrition", JSON.stringify({
      calories: Number(productData.nutrition.calories) || 0,
      protein: Number(productData.nutrition.protein) || 0,
      carbs: Number(productData.nutrition.carbs) || 0,
      fat: Number(productData.nutrition.fat) || 0,
      fiber: Number(productData.nutrition.fiber) || 0,
      vitamins: Array.isArray(productData.nutrition.vitamins) ? productData.nutrition.vitamins : [],
    }));
  }

  if (productData.policies && typeof productData.policies === "object") {
    formData.append("policies", JSON.stringify({
      return: productData.policies.return || "",
      shipping: productData.policies.shipping || "",
      availability: productData.policies.availability || "",
    }));
  }

  formData.append("keepExistingImages", String(keepExistingImages));

  if (Array.isArray(images) && images.length > 0) {
    if (images.length > 6) {
      throw new Error("Maximum 6 images allowed");
    }
    images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });
  }

  if (imageData.length > 0) {
    formData.append("imageData", JSON.stringify(imageData.map(({ primary }) => ({ primary: Boolean(primary) }))));
  }

  return fetchWithAuthFormData(`/api/products/${globalId}`, formData, "PUT");
};

export const deleteProduct = async (globalId) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  return fetchWithAuth(`/api/products/${globalId}`, { method: "DELETE" });
};

export const setPrimaryImage = async (globalId, imageUrl) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid imageUrl: must be a non-empty string");
  }
  return fetchWithAuth(`/api/products/${globalId}/set-primary-image`, {
    method: "PUT",
    body: JSON.stringify({ imageUrl }),
  });
};

export const deleteImage = async (globalId, imageUrl) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid imageUrl: must be a non-empty string");
  }
  return fetchWithAuth(`/api/products/${globalId}/image`, {
    method: "DELETE",
    body: JSON.stringify({ imageUrl }),
  });
};

export const addProductReview = async (globalId, reviewData) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  if (!reviewData || typeof reviewData !== "object") {
    throw new Error("Invalid review data provided");
  }
  if (!Number.isInteger(reviewData.rating) || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }
  if (!reviewData.review || typeof reviewData.review !== "string" || reviewData.review.trim() === "") {
    throw new Error("Review text is required");
  }

  const formData = new FormData();
  formData.append("rating", reviewData.rating.toString());
  formData.append("review", reviewData.review.trim());
  formData.append("verified", String(reviewData.verified || false));
  if (reviewData.name) {
    formData.append("name", reviewData.name);
  }

  if (Array.isArray(reviewData.images) && reviewData.images.length > 0) {
    if (reviewData.images.length > 4) {
      throw new Error("Maximum 4 review images allowed");
    }

    reviewData.images.forEach((img, index) => {
      const matches = img.match(/^data:image\/(png|jpeg);base64,(.+)$/);
      if (matches) {
        const ext = matches[1];
        const base64Data = matches[2];
        const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {
          type: `image/${ext}`,
        });
        const file = new File([blob], `review-image-${index}.${ext}`, {
          type: `image/${ext}`,
        });
        formData.append("reviewImages", file);
      }
    });
  }

  return fetchWithAuthFormData(`/api/products/${globalId}/reviews`, formData, "POST");
};



export const getProductReviews = async (globalId) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  return fetchWithoutAuth(`/api/products/${globalId}/reviews`);
};

export const updateReviewStatus = async (globalId, reviewId, approved) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  if (!reviewId || !/^[0-9a-fA-F]{24}$/.test(reviewId)) {
    throw new Error("Invalid reviewId: must be a valid MongoDB ObjectId");
  }
  if (typeof approved !== "boolean") {
    throw new Error("Approved status must be a boolean");
  }
  return fetchWithAuth(`/api/products/${globalId}/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: approved ? "approved" : "rejected" }),
  });
};

export const deleteReview = async (globalId, reviewId) => {
  if (!Number.isInteger(Number(globalId)) || Number(globalId) < 1) {
    throw new Error("Invalid globalId: must be a positive integer");
  }
  if (!reviewId || !/^[0-9a-fA-F]{24}$/.test(reviewId)) {
    throw new Error("Invalid reviewId: must be a valid MongoDB ObjectId");
  }
  return fetchWithAuth(`/api/products/${globalId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
};

// User Profile API functions
export const getUserProfile = async () => {
  return fetchWithAuth("/api/auth/profile");
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

// Order API functions
export const createOrder = async (orderData) => {
  return fetchWithAuth("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getUserOrders = async (page = 1, limit = 50) => {
  return fetchWithAuth(`/api/orders/my-orders?page=${page}&limit=${limit}`);
};

export const getAllOrders = async (page = 1, limit = 50) => {
  return fetchWithAuth(`/api/orders?page=${page}&limit=${limit}`);
};

export const getOrder = async (globalId) => {
  return fetchWithAuth(`/api/orders/${globalId}`);
};

export const cancelOrder = async (globalId, cancelData = {}) => {
  return fetchWithAuth(`/api/orders/${globalId}/cancel`, {
    method: "PUT",
    body: JSON.stringify(cancelData),
  });
};

export const exportOrders = async () => {
  return fetchWithAuthFile("/api/orders/export", { method: "GET" });
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
  return fetchWithAuth(`/api/cart/${productId}`, {
    method: "DELETE",
  });
};

export const clearCart = async () => {
  return fetchWithAuth("/api/cart", {
    method: "DELETE",
  });
};

// User Management API functions
export const getAllUsers = async () => {
  return fetchWithAuth("/api/auth/users");
};

export const updateUser = async (globalId, userData) => {
  return fetchWithAuth(`/api/auth/users/${globalId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (globalId) => {
  return fetchWithAuth(`/api/auth/users/${globalId}`, {
    method: "DELETE",
  });
};

export const getUserDetails = async (globalId, page = 1, limit = 50) => {
  return fetchWithAuth(`/api/auth/users/${globalId}/details?page=${page}&limit=${limit}`);
};

// Coupon API functions
export const validateCoupon = async (couponCode, subtotal) => {
  return fetchWithAuth("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ couponCode, subtotal }),
  });
};

// Invoice API functions
export const getInvoices = async (page = 1, limit = 50) => {
  return fetchWithAuth(`/api/invoices?page=${page}&limit=${limit}`);
};

export const exportInvoices = async () => {
  return fetchWithAuthFile("/api/invoices/export", { method: "GET" });
};

export const getInvoiceData = async (globalId) => {
  return fetchWithAuth(`/api/invoices/${globalId}`);
};

// Delivery API functions
export const getDeliveryOrders = async (page = 1, limit = 50) => {
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
  return fetchWithAuth(`/api/delivery/users/${globalId}/delivery-role`, {
    method: "PUT",
    body: JSON.stringify({ isDeliveryBoy }),
  });
};

export const getDeliveryBoyById = async (globalId) => {
  return fetchWithAuth(`/api/delivery/users/${globalId}`);
};

export const getDeliveryBoys = async () => {
  const users = await fetchWithAuth("/api/auth/users");
  return users.filter((user) => user.isDeliveryBoy);
};

// Email Verification API functions
export const verifyEmail = async (email, token) => {
  return fetchWithoutAuth(
    `/api/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
    { method: "GET" },
  );
};

export const resendVerificationEmail = async (email) => {
  return fetchWithoutAuth("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// Delivery Partner Login with role validation
export const deliveryLogin = async (identifier, password) => {
  const loginData = await fetchWithoutAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  if (!loginData.user.isDeliveryBoy && !loginData.user.isAdmin) {
    throw new Error("Access restricted: Only delivery partners or admins can log in.");
  }

  return loginData;
};

// Delivery Map and Location API functions
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

export const getDeliveryStats = async () => {
  return fetchWithAuth("/api/delivery-dashboard/stats");
};

export const getDeliveryEarnings = async (period = "month") => {
  return fetchWithAuth(`/api/delivery-dashboard/earnings?period=${period}`);
};

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

export const exportSalesReport = async (dateRange, format = "csv") => {
  return fetchWithAuth("/api/reports/sales", {
    method: "POST",
    body: JSON.stringify({ dateRange, format }),
  });
};

export const exportInventoryReport = async (format = "csv") => {
  return fetchWithAuth("/api/reports/inventory", {
    method: "POST",
    body: JSON.stringify({ format }),
  });
};

export const exportCustomerReport = async (format = "csv") => {
  return fetchWithAuth("/api/reports/customer", {
    method: "POST",
    body: JSON.stringify({ format }),
  });
};

export const getAdminProfile = async () => {
  return fetchWithAuth("/api/admin/profile");
};

export const updateAdminProfile = async (profileData) => {
  return fetchWithAuth("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  return fetchWithAuth("/api/admin/profile/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const getAdminActivity = async (page = 1, limit = 50) => {
  return fetchWithAuth(`/api/admin/profile/activity?page=${page}&limit=${limit}`);
};

export const getDeliveryBoysAdmin = async () => {
  return fetchWithAuth("/api/delivery/admin/delivery-boys");
};

export const getDeliveryAnalytics = async (period = "month") => {
  return fetchWithAuth(`/api/delivery/admin/analytics?period=${period}`);
};

export const assignDeliveryBoyAdmin = async (orderId, deliveryBoyId) => {
  return fetchWithAuth(`/api/delivery/admin/assign-delivery/${orderId}`, {
    method: "POST",
    body: JSON.stringify({ deliveryBoyId }),
  });
};

export const getDeliveryPerformanceReport = async (deliveryBoyId, startDate, endDate) => {
  const params = new URLSearchParams();
  if (deliveryBoyId) params.append("deliveryBoyId", deliveryBoyId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return fetchWithAuth(`/api/delivery/admin/performance-report?${params.toString()}`);
};

// Admin API functions
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
export const getCancellations = async (page = 1, limit = 50) => {
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
    method: "PUT",
    body: JSON.stringify(refundData),
  });
};

// Returns API functions
export const getReturns = async (page = 1, limit = 50) => {
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

export async function getServiceAreas({ limit = 100, active = true } = {}) {
  try {
    const response = await fetchWithAuth(`/api/service-areas?limit=${limit}&active=${active}`, {
      method: "GET",
    });
    return response; // Backend returns { success, serviceAreas, pagination }
  } catch (error) {
    console.error("Error fetching service areas:", error);
    throw error;
  }
}

export async function checkPincode(pincode) {
  try {
    const response = await fetch(`${API_URL}/pincode/${pincode}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const serviceArea = data.find((area) => area.active) || data[0];
    if (!serviceArea) {
      return { available: false, message: "No active service areas found for this pincode" };
    }
    return {
      available: true,
      serviceArea: {
        ...serviceArea,
        estimatedDeliveryTime: formatDeliveryTime(serviceArea.estimatedDeliveryTime),
      },
    };
  } catch (error) {
    console.error("Error checking pincode:", error);
    return { available: false, message: error.message };
  }
}

export async function getNearbyServiceAreas(lat, lng, maxRadiusKm = 50) {
  try {
    const { serviceAreas } = await getServiceAreas({ active: true });
    if (!serviceAreas.length) {
      return { nearbyServiceAreas: [] };
    }

    if (!window.google || !window.google.maps.geometry) {
      console.warn("Google Maps geometry library not loaded");
      return { nearbyServiceAreas: [] };
    }

    const userLocation = new window.google.maps.LatLng(lat, lng);
    const nearbyServiceAreas = serviceAreas
      .filter((area) => {
        if (!area.centerLocation || !area.centerLocation.lat || !area.centerLocation.lng) {
          return false;
        }
        const areaLocation = new window.google.maps.LatLng(
          area.centerLocation.lat,
          area.centerLocation.lng
        );
        const distanceMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
          userLocation,
          areaLocation
        );
        const distanceKm = distanceMeters / 1000;
        return distanceKm <= maxRadiusKm && area.active;
      })
      .map((area) => {
        const areaLocation = new window.google.maps.LatLng(
          area.centerLocation.lat,
          area.centerLocation.lng
        );
        const distanceMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
          userLocation,
          areaLocation
        );
        const distanceKm = (distanceMeters / 1000).toFixed(1);
        return {
          ...area,
          distance: parseFloat(distanceKm),
          estimatedDeliveryTime: formatDeliveryTime(area.estimatedDeliveryTime),
        };
      })
      .sort((a, b) => a.distance - b.distance);

    return { nearbyServiceAreas };
  } catch (error) {
    console.error("Error fetching nearby service areas:", error);
    return { nearbyServiceAreas: [] };
  }
}

// Helper to format estimatedDeliveryTime
function formatDeliveryTime(minutes) {
  if (typeof minutes !== "number" || isNaN(minutes)) {
    return "12-24 hours";
  }
  const lower = Math.max(15, minutes - 5);
  const upper = minutes + 5;
  return `${lower}-${upper} minutes`;
}