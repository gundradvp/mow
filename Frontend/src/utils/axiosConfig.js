// This file configures axios globally for the application

import axios from "axios";

// Configure axios globally
axios.defaults.timeout = 10000; // 10 seconds
axios.defaults.baseURL = window.location.origin; // Use the same origin as the app

// Handle response errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Use mock data if we're in development mode and the request fails
    // This prevents the app from breaking when there's no backend
    if (process.env.NODE_ENV === "development") {
      console.warn("API request failed, returning mock data:", error);
      return Promise.resolve({
        data: {
          message: "This is mock data since the backend is not running",
          success: true,
          timestamp: new Date().toISOString(),
        },
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
