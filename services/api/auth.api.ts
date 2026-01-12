import axiosService from "@/services/middleware/axios.middleware";
import type { ApiResponse } from "@/services/interface/api";
import type { LoginPayload, LoginResponse, User } from "@/services/interface/auth";

const AUTH_ROUTES = {
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
} as const;

class AuthApiService {
  async login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
    const response = await axiosService.post<ApiResponse<LoginResponse>>(
      AUTH_ROUTES.login,
      payload
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await axiosService.post<void>(AUTH_ROUTES.logout);
  }

  async me(): Promise<ApiResponse<User>> {
    const response = await axiosService.get<ApiResponse<User>>(AUTH_ROUTES.me);
    return response.data;
  }
}

export const authService = new AuthApiService();
