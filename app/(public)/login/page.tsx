"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useLoginMutation } from "@/services/mutation/auth.mutation";

const schema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).required("Password is required"),
  })
  .required();

type LoginForm = yup.InferType<typeof schema>;

export default function LoginPage() {
  const login = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <main style={{ maxWidth: 420, margin: "48px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Login
      </h1>

      <form
        onSubmit={handleSubmit((values) => login.mutate(values))}
        style={{ display: "grid", gap: 12 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            {...register("email")}
            placeholder="you@example.com"
            autoComplete="email"
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
          />
          {errors.email?.message ? (
            <small style={{ color: "crimson" }}>{errors.email.message}</small>
          ) : null}
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
          />
          {errors.password?.message ? (
            <small style={{ color: "crimson" }}>
              {errors.password.message}
            </small>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={login.isPending}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #111",
            background: login.isPending ? "#eee" : "#111",
            color: login.isPending ? "#111" : "#fff",
          }}
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </button>

        {login.error ? (
          <small style={{ color: "crimson" }}>
            {(login.error instanceof Error && login.error.message) ||
              "Login failed"}
          </small>
        ) : null}
      </form>
    </main>
  );
}

