import axios from "axios";
import { API_CONFIG } from "./config";
import { attachInterceptors } from "./interceptors";

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

attachInterceptors(apiClient);
