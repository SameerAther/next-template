"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/api/auth.api";
import type { ApiResponse } from "@/services/interface/api";
import type { User } from "@/services/interface/auth";

export function useMeQuery() {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    retry: false,
  });
}

