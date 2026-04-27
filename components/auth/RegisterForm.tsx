"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resolvePostLoginRedirect } from "@/lib/roleRedirects";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    country: z.string().optional(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must include one uppercase letter")
      .regex(/[0-9]/, "Must include one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setError("");
    setIsLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setIsLoading(false);
      setError(payload?.error ?? "Registration failed. Please try again.");
      return;
    }

    const loginResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (loginResult?.error) {
      setIsLoading(false);
      setError("Account created, but automatic sign in failed. Please sign in manually.");
      router.push("/login");
      return;
    }

    setIsLoading(false);
    router.refresh();
    const session = await getSession();
    const nextPath = resolvePostLoginRedirect(session?.user?.role, null);
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {[
        { key: "name", label: "Name", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone", type: "text" },
        { key: "country", label: "Country", type: "text" },
        { key: "password", label: "Password", type: "password" },
        { key: "confirmPassword", label: "Confirm Password", type: "password" },
      ].map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
          <input
            type={field.type}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-primary"
            {...form.register(field.key as keyof RegisterFormValues)}
          />
          {form.formState.errors[field.key as keyof RegisterFormValues]?.message ? (
            <p className="mt-1 text-xs text-red-600">
              {
                form.formState.errors[field.key as keyof RegisterFormValues]
                  ?.message as string
              }
            </p>
          ) : null}
        </div>
      ))}

      {Object.keys(form.formState.errors).length > 0 ? (
        <p className="text-xs text-red-600">
          Please fix the highlighted form fields and try again.
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-primary" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
