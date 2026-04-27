import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative -mt-20 min-h-[85vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-emerald-900/65 to-black/50" />

      <div className="relative mx-auto flex min-h-[85vh] w-full max-w-md items-center px-4 py-24 sm:px-0">
        <div className="w-full rounded-3xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to browse excursions and manage your bookings.
          </p>
          <div className="mt-6">
            <Suspense fallback={<p className="text-sm text-slate-500">Loading...</p>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
