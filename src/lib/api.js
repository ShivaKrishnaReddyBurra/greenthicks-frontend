import { getAuthToken } from "@/lib/auth-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchWithoutAuth = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || 'Something went wrong');
    }
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("you are not logged in, please login");
  }

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    let errorMessage = [error.message || 'Something went wrong'];
    if(error.error){
      errorMessage = errorMessage.concat(error.error);
    }
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
      throw new Error("Token expired or invalid");
    }
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || 'Something went wrong');
    }
    throw new Error(errorMessage || 'Something went wrong');
  }

  return response.json();
};

export const fetchWithAuthFormData = async (url, formData, method = 'POST') => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No token provided");
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
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
      }
      throw new Error("Token expired or invalid");
    }
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || 'Something went wrong');
    }
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export const fetchWithAuthFile = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No token provided");
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
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
      }
      throw new Error("Token expired or invalid");
    }
    if (error.errors) {
      const errorMessages = error.errors.map((err) => err.msg).join("; ");
      throw new Error(errorMessages || 'Something went wrong');
    }
    throw new Error(error.message || 'Something went wrong');
  }

  return response;
};

export const apiAddToFavorites = async (productId) => {
  return fetchWithAuth('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
};

export const apiRemoveFromFavorites = async (productId) => {
  return fetchWithAuth(`/api/favorites/${productId}`, {
    method: 'DELETE',
  });
};

export const apiClearFavorites = async () => {
  return fetchWithAuth('/api/favorites', {
    method: 'DELETE',
  });
};

export const getFavorites = async () => {
  return fetchWithAuth('/api/favorites');
};

// Delivery API functions
export const getDeliveryOrders = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/delivery?page=${page}&limit=${limit}`);
};

export const assignDeliveryBoy = async (globalId, deliveryBoyId) => {
  return fetchWithAuth(`/api/delivery/${globalId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ deliveryBoyId }),
  });
};

export const updateDeliveryStatus = async (globalId, status) => {
  return fetchWithAuth(`/api/delivery/${globalId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const setDeliveryBoyRole = async (globalId, isDeliveryBoy) => {
  return fetchWithAuth(`/api/delivery/user/${globalId}/delivery-role`, {
    method: 'PUT',
    body: JSON.stringify({ isDeliveryBoy }),
  });
};

export const getDeliveryBoyById = async (globalId) => {
  return fetchWithAuth(`/api/delivery/user/${globalId}`);
};

export const getDeliveryBoys = async () => {
  const users = await fetchWithAuth('/api/auth/users');
  return users.filter((user) => user.isDeliveryBoy);
};

// Product API functions
export const getProducts = async () => {
  return fetchWithoutAuth('/api/products');
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
    formData.append('images', image);
  });

  return fetchWithAuthFormData('/api/products', formData, 'POST');
};

export const updateProduct = async (globalId, productData, images) => {
  const formData = new FormData();

  Object.keys(productData).forEach((key) => {
    formData.append(key, productData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  return fetchWithAuthFormData(`/api/products/${globalId}`, formData, 'PUT');
};

export const deleteProduct = async (globalId) => {
  return fetchWithAuth(`/api/products/${globalId}`, { method: 'DELETE' });
};

// Order API functions
export const createOrder = async (orderData) => {
  return fetchWithAuth('/api/orders', {
    method: 'POST',
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
  return fetchWithAuth(`/api/orders/${globalId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'cancelled' }),
  });
};

export const exportOrders = async () => {
  return fetchWithAuthFile('/api/orders/export', {
    method: 'GET',
  });
};

// Cart API functions
export const addToCart = async (productId, quantity) => {
  return fetchWithAuth('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
};

export const getCart = async () => {
  return fetchWithAuth('/api/cart');
};

export const removeFromCart = async (productId) => {
  return fetchWithAuth(`/api/cart/item/${productId}`, {
    method: 'DELETE',
  });
};

export const clearCart = async () => {
  return fetchWithAuth('/api/cart', {
    method: 'DELETE',
  });
};

// User Profile API function
export const getUserProfile = async () => {
  return fetchWithAuth('/api/auth/profile');
};

// User Management API functions
export const getAllUsers = async () => {
  return fetchWithAuth('/api/auth/users');
};

export const updateUser = async (globalId, userData) => {
  return fetchWithAuth(`/api/auth/user/${globalId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (globalId) => {
  return fetchWithAuth(`/api/auth/user/${globalId}`, {
    method: 'DELETE',
  });
};

export const getUserDetails = async (globalId, page = 1, limit = 10) => {
  return fetchWithAuth(`/api/auth/user/${globalId}/details?page=${page}&limit=${limit}`);
};

// Coupon API function
export const validateCoupon = async (couponCode, subtotal) => {
  return fetchWithAuth('/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code: couponCode, subtotal }),
  });
};

export const getInvoices = async (page = 1, limit = 10) => {
  return fetchWithAuth(`/api/invoices?page=${page}&limit=${limit}`);
};

export const exportInvoices = async () => {
  return fetchWithAuthFile('/api/invoices/export', { method: 'GET' });
};

export const getInvoiceData = async (globalId) => {
  return fetchWithAuth(`/api/invoices/${globalId}`);
};

// Delivery Partner Login with role validation
export const deliveryLogin = async (identifier, password) => {
  // Perform login request
  const loginData = await fetchWithoutAuth('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

  // Check if user is either a delivery boy or admin
  if (!loginData.user.isDeliveryBoy && !loginData.user.isAdmin) {
    throw new Error('Access restricted: Only delivery partners or admins can log in');
  }

  return loginData;
};