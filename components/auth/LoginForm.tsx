"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setError("");
    setIsLoading(true);
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/account/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-primary"
          {...form.register("email")}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-primary"
          {...form.register("password")}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-primary" href="/register">
          Sign up
        </Link>
      </p>
    </form>
  );
}
