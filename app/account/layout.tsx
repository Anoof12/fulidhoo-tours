import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

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

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border border-black/5 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-500">My Account</p>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
