import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12 sm:px-0">
      <div className="w-full rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Join Fulidhoo Tours to book and manage your trips.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
