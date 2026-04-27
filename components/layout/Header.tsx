import Link from "next/link";
import { LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex flex-col leading-none text-emerald-900 transition-opacity hover:opacity-90"
        >
          <span className="font-display text-xl font-bold tracking-[0.16em] sm:text-2xl">
            FULIDHOO
          </span>
          <span className="mt-1 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-emerald-700">
            <span className="h-px w-6 bg-current" aria-hidden />
            TOURS
            <span className="h-px w-6 bg-current" aria-hidden />
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] sm:gap-5 sm:text-sm">
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
            <>
              <Link
                href="/account/dashboard"
                className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-emerald-700 transition-colors hover:bg-emerald-50 sm:text-sm"
              >
                Account
              </Link>
              <Link
                href="/logout"
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-red-700 transition-colors hover:bg-red-50 sm:text-sm"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-emerald-700 transition-colors hover:bg-emerald-50 sm:text-sm"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
