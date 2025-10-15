// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Check if we're in production
export const IS_PRODUCTION = import.meta.env.PROD;

// Export for easy access
export default {
  API_URL,
  SOCKET_URL,
  IS_PRODUCTION
};
