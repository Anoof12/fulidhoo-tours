import Link from "next/link";
import { RedirectNotice } from "@/components/common/RedirectNotice";

type AccessDeniedPageProps = {
  searchParams: Promise<{ area?: string }>;
};

function messageForArea(area: string | undefined): string {
  if (area === "admin") {
    return "You are signed in, but your account does not have permission to access admin pages.";
  }
  if (area === "customer") {
    return "This page is available only for customer accounts.";
  }
  return "Your account does not have permission to access this area.";
}

export default async function AccessDeniedPage({ searchParams }: AccessDeniedPageProps) {
  const params = await searchParams;
  const area = params.area;
  const message = messageForArea(area);
  const redirectNotice =
    "You were redirected because your current account role cannot access that page.";

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <RedirectNotice text={redirectNotice} />
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Access Control</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-3 text-slate-700">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="btn-secondary">
            Go to Home
          </Link>
          <Link href="/login" className="btn-primary">
            Sign in with another account
          </Link>
        </div>
      </div>
    </div>
  );
}
