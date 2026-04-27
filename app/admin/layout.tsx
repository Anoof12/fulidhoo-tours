import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasAdminPanelAccess } from "@/lib/roles";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/excursions", label: "Excursions" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!hasAdminPanelAccess(user.role)) {
    redirect("/");
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-[250px_1fr]">
      <aside className="h-fit rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Control Panel</p>
        <p className="font-display mb-1 mt-2 text-xl font-semibold text-slate-900">Admin</p>
        <p className="mb-2 text-xs text-slate-500">Operations Console</p>
        <p className="mb-3 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          {user.role.replaceAll("_", " ")}
        </p>
        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            Logout
          </Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
