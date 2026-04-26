import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/excursions", label: "Excursions" },
  { href: "/about", label: "About Fulidhoo" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold text-primary sm:text-2xl">
          Fulidhoo Tours
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-slate-700 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link href="/account/dashboard" className="btn-secondary px-3 py-2 text-xs sm:text-sm">
              Account
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary px-3 py-2 text-xs sm:text-sm">
              Login
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
