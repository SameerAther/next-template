"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useMeQuery } from "@/services/query/auth.query";
import { useAuthStore } from "@/stores/auth.store";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const me = useMeQuery();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (me.data?.data) setUser(me.data.data);
  }, [me.data, setUser]);

  if (me.isPending) return <div style={{ padding: 16 }}>Loading...</div>;

  return <>{children}</>;
}

