"use client";

import { create } from "zustand";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import type { User } from "@/services/interface/auth";

const ACCESS_TOKEN_COOKIE = "accessToken";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateToken: (token: string) => void;
  setUser: (user: User | null) => void;
};

const initialToken =
  typeof window !== "undefined"
    ? ((getCookie(ACCESS_TOKEN_COOKIE) as string | undefined) ?? null)
    : null;

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: initialToken,
  user: null,
  isAuthenticated: Boolean(initialToken),

  setAuth: (token, user) => {
    setCookie(ACCESS_TOKEN_COOKIE, token);
    set({ accessToken: token, user, isAuthenticated: true });
  },

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

  updateToken: (token) => {
    setCookie(ACCESS_TOKEN_COOKIE, token);
    set({ accessToken: token });
  },

  clearAuth: () => {
    deleteCookie(ACCESS_TOKEN_COOKIE);
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));

