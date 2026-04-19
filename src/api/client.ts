import axios from "axios";
import { useScreenerStore } from "@/store/screenerStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = useScreenerStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear auth
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useScreenerStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;
