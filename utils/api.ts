// utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://clutchzone-backend.onrender.com/api",
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
