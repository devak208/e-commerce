/* import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "${import.meta.env.VITE_API_URL}",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for handling auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error("API Error:", error.response.status, error.response.data);

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - could redirect to login
        console.log("Unauthorized access");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
 */