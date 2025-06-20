import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data; // Ensure your Laravel API returns proper JSON structure
  } catch (error) {
    // Improved error handling
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    // Ensure the response contains both token and user
    if (response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    }
    throw new Error('Invalid response structure');
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('token');
  } catch (error) {
    throw error.response.data;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    return null;
  }
};