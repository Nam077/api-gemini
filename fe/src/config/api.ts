import axios from 'axios';

// API Base URL - sử dụng Vite environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Tạo axios instance với cấu hình mặc định
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT, // Sử dụng env variable cho timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Endpoints
export const API_ENDPOINTS = {
  SCRIPTS: '/scripts',
  GENERATE_SCRIPT: '/scripts/generate',
  USERS: '/users',
  AUTH: '/auth',
} as const;

// Response interceptor để handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response.data?.message || 'Internal server error');
    }
    return Promise.reject(error);
  }
);

export default apiClient;