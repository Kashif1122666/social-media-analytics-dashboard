import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL  , // your backend
  withCredentials: true, // send cookies if needed
});

// Request interceptor → attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming JWT stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized → maybe redirect to login
      console.warn("Unauthorized, redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
