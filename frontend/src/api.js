import axios from "axios";

// Base API configuration
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Orders API
const api = axios.create({
  baseURL: `${baseURL}/orders`,
  headers: { 
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Chatbot API
export const chatbotApi = axios.create({
  baseURL: "http://localhost:5000/api/chatbot",
  headers: { 
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout for chatbot responses
});

// Request interceptors for error handling and authentication
const setupInterceptors = (apiInstance, apiName) => {
  // Request interceptor
  apiInstance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log(`${apiName} Request:`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL
      });
      
      return config;
    },
    (error) => {
      console.error(`${apiName} Request Error:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiInstance.interceptors.response.use(
    (response) => {
      console.log(`${apiName} Response:`, {
        status: response.status,
        data: response.data
      });
      return response;
    },
    (error) => {
      console.error(`${apiName} Response Error:`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });

      // Handle common errors
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        console.warn(`${apiName}: Resource not found`);
      } else if (error.response?.status >= 500) {
        console.error(`${apiName}: Server error`);
      } else if (error.code === 'ECONNABORTED') {
        console.error(`${apiName}: Request timeout`);
      } else if (!error.response) {
        console.error(`${apiName}: Network error - server may be down`);
      }

      return Promise.reject(error);
    }
  );
};

// Setup interceptors for both APIs
setupInterceptors(api, 'Orders API');
setupInterceptors(chatbotApi, 'Chatbot API');

// Export default orders API and named chatbot API
export default api;