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
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
