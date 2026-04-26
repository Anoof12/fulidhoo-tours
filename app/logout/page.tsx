"use client";

import { signOut } from "next-auth/react";

export default function LogoutPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center px-4">
      <div className="w-full rounded-2xl border border-black/5 bg-white p-6 text-center">
        <h1 className="text-xl font-bold text-slate-900">Sign out</h1>
        <p className="mt-2 text-sm text-slate-600">You can sign out from your account securely.</p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Sign out now
        </button>
      </div>
    </div>
  );
}
