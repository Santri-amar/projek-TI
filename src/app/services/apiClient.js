import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://school.petik.or.id";

export const apiClient = axios.create({
  baseURL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isLoginRequest = config.url?.includes("/login/");

  if (token && !isLoginRequest) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      "Terjadi kesalahan pada server.";

    return Promise.reject(new Error(message));
  },
);

export const API_BASE_URL = baseURL;
