"use client";

import { useMeQuery } from "@/services/query/auth.query";
import { useLogoutMutation } from "@/services/mutation/auth.mutation";

export default function DashboardPage() {
  const me = useMeQuery();
  const logout = useLogoutMutation();

  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Dashboard (Private)
      </h1>

      <div style={{ display: "grid", gap: 10 }}>
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          style={{
            width: 140,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #111",
            background: "#fff",
          }}
        >
          Logout
        </button>

        <pre
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fafafa",
            overflow: "auto",
          }}
        >
          {JSON.stringify(
            { status: me.status, data: me.data ?? null, error: me.error ?? null },
            null,
            2
          )}
        </pre>
      </div>
    </main>
  );
}

