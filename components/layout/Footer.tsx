import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-black/10 bg-slate-950 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="mb-4 inline-flex flex-col leading-none text-emerald-200">
            <span className="font-display text-2xl font-bold tracking-[0.16em] sm:text-3xl">FULIDHOO</span>
            <span className="mt-1 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-emerald-300/90">
              <span className="h-px w-8 bg-current" aria-hidden />
              TOURS
              <span className="h-px w-8 bg-current" aria-hidden />
            </span>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-300">
            Book snorkeling, diving, fishing, and island experiences around{" "}
            <strong className="font-semibold text-slate-100">V. Fulidhoo</strong> (Vaavu Atoll),
            Maldives. Reserve through the site (cart and checkout); payment for excursions is
            collected on-site with your operator.
          </p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400">
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
              <span>V. Fulidhoo, Vaavu Atoll, Maldives</span>
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-medium text-emerald-300 transition-colors hover:text-emerald-100"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              Questions? Contact us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Explore
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/excursions" className="transition-colors hover:text-white">
                Excursions
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-white">
                About Fulidhoo
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Your account
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/login" className="transition-colors hover:text-white">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="transition-colors hover:text-white">
                Register
              </Link>
            </li>
            <li>
              <Link href="/account/dashboard" className="transition-colors hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/account/bookings" className="transition-colors hover:text-white">
                My bookings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Fulidhoo Tours. Excursion booking for visitors to V. Fulidhoo.
          </p>
          <p className="text-slate-500">Vaavu Atoll · Maldives</p>
        </div>
      </div>
    </footer>
  );
}
