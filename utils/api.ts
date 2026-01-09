// utils/api.ts
import axios from "axios";

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
const envBase = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL;
const apiBase = isDev ? "/api" : (envBase || "https://clutchzone-backend.onrender.com/api");

const api = axios.create({
  baseURL: apiBase,
  timeout: 6000,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("cz_token");
    if (token) {
      if (!config.headers) config.headers = {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use((res) => res, (err) => {
  try {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("cz_token");
      // if (typeof window !== "undefined" && window.location?.hash?.includes("/admin")) {
      //   window.location.hash = "#/login";
      // }
    }
  } catch {
    // ignore
  }
  return Promise.reject(err);
});

export default api;
