import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type AccessTokenPayload = {
  exp?: number;
};

const PUBLIC_PATHS = ["/login"] as const;
const PRIVATE_ROOTS = ["/dashboard"] as const;

const normalize = (p: string) => (p === "/" ? "/" : p.replace(/\/+$/, ""));

const startsWithAny = (path: string, prefixes: readonly string[]) => {
  const n = normalize(path);
  return prefixes.some((p) => {
    const base = normalize(p);
    return n === base || n.startsWith(base + "/");
  });
};

function isExpired(token: string) {
  try {
    const payload = jwtDecode<AccessTokenPayload>(token);
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;

  const isPrivate = startsWithAny(path, PRIVATE_ROOTS as unknown as string[]);
  const isPublic = startsWithAny(path, PUBLIC_PATHS as unknown as string[]);

  if (!token || isExpired(token)) {
    if (isPrivate) {
      const url = new URL("/login", request.url);
      const res = NextResponse.redirect(url);
      if (token) res.cookies.delete("accessToken");
      return res;
    }
    return NextResponse.next();
  }

  if (isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_static|_vercel|.*\\..*).*)"],
};

