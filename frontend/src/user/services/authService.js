import axios from "axios";
import { clearAuthData } from "./tokenService";

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// Use the single axios instance from axios.js
const authService = {
  // Login with email and password
  login: async (credentials) => {
    try {
      // Check if credentials contains email and password directly or in a user object
      const loginData = credentials.user 
        ? { email: credentials.user.email, password: credentials.password || '' } // Handle Google auth case
        : { email: credentials.email, password: credentials.password };
      
      console.log('Sending login data:', { ...loginData, password: '****' });
      
      const response = await axios.post(`${API_URL}/auth/signin`, loginData, {
        withCredentials: true
      });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      // Clear user data if login fails
      localStorage.removeItem('user');
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData, {
        withCredentials: true
      });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/signout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      clearAuthData();
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      console.log('Getting current user profile from server...');
      
      // Always fetch fresh user data from server
      const response = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      const user = response.data;
      
      console.log('Profile data received successfully from server');
      
      // Store the complete user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      
      // If it's a token error, clear the user
      if (
        error.response?.status === 403 ||
        (error.error && error.error.includes('Invalid or expired refresh token'))
      ) {
        clearAuthData();
      }
      
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/user/profile`, userData, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await axios.put(`${API_URL}/user/change-password`, passwordData, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Address management
  addAddress: async (addressData) => {
    try {
      const response = await axios.post(`${API_URL}/user/addresses`, addressData, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: "Failed to add address" };
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await axios.put(`${API_URL}/user/addresses/${addressId}`, addressData, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: "Failed to update address" };
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const response = await axios.delete(`${API_URL}/user/addresses/${addressId}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: "Failed to delete address" };
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const response = await axios.patch(`${API_URL}/user/addresses/${addressId}/default`, {}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: "Failed to set default address" };
    }
  },

  // Get orders
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/orders`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').accessToken || ''}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        clearAuthData();
      }
      throw error.response?.data || { message: 'Failed to get orders' };
    }
  },
  
  // Explicitly refresh token
  refreshToken: async () => {
    try {
      const refreshToken = JSON.parse(localStorage.getItem('user') || '{}').refreshToken;
      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      clearAuthData();
      throw error.response?.data || { message: 'Failed to refresh token' };
    }
  }
};

export default authService; 