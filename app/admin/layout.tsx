import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/excursions", label: "Excursions" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "TOUR_OPERATOR")) {
    redirect("/login");
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-[250px_1fr]">
      <aside className="surface-card h-fit p-3 sm:p-4">
        <p className="font-display mb-1 text-xl font-semibold text-slate-900">Admin</p>
        <p className="mb-3 text-xs text-slate-500">Operations Console</p>
        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
