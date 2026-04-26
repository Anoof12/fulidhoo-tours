import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/excursions", label: "Excursions" },
  { href: "/about", label: "About Fulidhoo" },
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-primary">
          Fulidhoo Tours
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-700 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/account/dashboard" className="text-slate-700 hover:text-primary">
                Account
              </Link>
              {(user.role === "ADMIN" || user.role === "TOUR_OPERATOR") && (
                <Link href="/admin" className="text-slate-700 hover:text-primary">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" className="text-slate-700 hover:text-primary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
