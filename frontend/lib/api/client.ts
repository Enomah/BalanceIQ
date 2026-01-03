import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for attaching the Bearer token
apiClient.interceptors.request.use(
  (config) => {
    // Access zustand store outside of hooks
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const showToast = useToastStore.getState().showToast;
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Optional: Only show toast for non-404 errors or specific conditions
    // If you want to handle errors manually in some places, you can skip this
    // or check for a custom config flag like error.config.skipToast

    if (!error.config?.skipToast) {
      showToast(message, "error");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
