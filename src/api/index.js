import axios from "axios";
import { decryptAESGCM } from "../utils/decryptAESGCM";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token automatically
api.interceptors.request.use(
  (config) => {
    const noAuthRoutes = ["/api/auth/login", "/api/auth/register"];
    if (!noAuthRoutes.some((route) => config.url.includes(route))) {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("JWT_Token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor: auto-decrypt backend AES-GCM responses
api.interceptors.response.use(
  async (response) => {
    if (typeof response.data === "string") {
      try {
        const key = import.meta.env.REACT_APP_ENCRYPTION_KEY; // hex format
        response.data = await decryptAESGCM(response.data, key);
      } catch (err) {
        console.warn("Response decryption failed, returning raw data");
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Wrapper functions
export const getData = (url, config) => api.get(url, config);
export const postData = (url, data, config) => api.post(url, data, config);
export const putData = (url, data, config) => api.put(url, data, config);
export const deleteData = (url, config) => api.delete(url, config);

export default api;
