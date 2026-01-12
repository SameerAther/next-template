import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getAccessToken } from "@/utils/auth";

interface RequestConfig extends AxiosRequestConfig {}

class AxiosService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : "http://localhost:8000/api";

    this.client = axios.create({ baseURL });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 && typeof window !== "undefined") {
          const { useAuthStore } = await import("@/stores/auth.store");
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private transformConfig(config?: RequestConfig): AxiosRequestConfig {
    return config || {};
  }

  async get<T>(url: string, config?: RequestConfig) {
    const response = await this.client.get<T>(url, this.transformConfig(config));
    return response;
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig) {
    const response = await this.client.post<T>(
      url,
      data,
      this.transformConfig(config)
    );
    return response;
  }
}

const axiosService = new AxiosService();
export default axiosService;
export type { RequestConfig };

