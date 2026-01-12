import { getCookie } from "cookies-next/client";

const ACCESS_TOKEN_COOKIE = "accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = getCookie(ACCESS_TOKEN_COOKIE);
  if (!token) return null;
  return String(token);
}

