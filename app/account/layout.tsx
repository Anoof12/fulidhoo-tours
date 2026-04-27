import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasCustomerPortalAccess } from "@/lib/roles";

const items = [
  { href: "/account/dashboard", label: "Dashboard" },
  { href: "/account/bookings", label: "My Bookings" },
  { href: "/account/favorites", label: "Favorites" },
  { href: "/account/profile", label: "Profile" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!hasCustomerPortalAccess(user.role)) {
    redirect("/access-denied?area=customer");
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">My Account</p>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Logout
          </Link>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
