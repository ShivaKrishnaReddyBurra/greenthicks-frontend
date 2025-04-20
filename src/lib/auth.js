import jwt from 'jsonwebtoken';

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwt.decode(token);
    if (!decoded) return false;

    const { exp } = decoded;
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};