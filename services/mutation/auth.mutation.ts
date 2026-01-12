"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api/auth.api";
import type { LoginPayload, LoginResponse } from "@/services/interface/auth";
import type { ApiResponse } from "@/services/interface/api";
import { useAuthStore } from "@/stores/auth.store";

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<ApiResponse<LoginResponse>, Error, LoginPayload>({
    mutationKey: ["auth", "login"],
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (res) => {
      setAuth(res.data.accessToken, res.data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/dashboard");
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationKey: ["auth", "logout"],
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });
}
