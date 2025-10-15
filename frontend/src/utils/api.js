import { API_URL } from '../config';

/**
 * Helper function for making API calls
 * Automatically adds authentication token
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) && {
        'Content-Type': 'application/json'
      }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok && response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  return response;
};

/**
 * GET request helper
 */
export const get = (endpoint) => {
  return apiCall(endpoint, { method: 'GET' });
};

/**
 * POST request helper
 */
export const post = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * Upload file helper
 */
export const uploadFile = (endpoint, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiCall(endpoint, {
    method: 'POST',
    body: formData
  });
};
