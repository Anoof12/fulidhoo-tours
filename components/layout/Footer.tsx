import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0b1228] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-600" />
            <span className="font-display text-4xl font-semibold">Wanderlust</span>
          </div>
          <p className="max-w-xs text-xl leading-relaxed text-slate-400">
            Curating unforgettable adventures since 2015. Your journey to extraordinary starts here.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="h-12 w-12 rounded-full bg-slate-800" />
            <span className="h-12 w-12 rounded-full bg-slate-800" />
            <span className="h-12 w-12 rounded-full bg-slate-800" />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-4xl font-semibold text-white">Explore</h3>
          <div className="space-y-3 text-2xl text-slate-400">
            <Link href="/excursions" className="block hover:text-white">
              All Excursions
            </Link>
            <p>Mountain Treks</p>
            <p>Beach Getaways</p>
            <p>Cultural Tours</p>
            <p>Wildlife Safaris</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-4xl font-semibold text-white">Company</h3>
          <div className="space-y-3 text-2xl text-slate-400">
            <Link href="/about" className="block hover:text-white">
              About Us
            </Link>
            <p>Careers</p>
            <p>Blog</p>
            <Link href="/contact" className="block hover:text-white">
              Contact
            </Link>
            <p>Partners</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-4xl font-semibold text-white">Support</h3>
          <div className="space-y-3 text-2xl text-slate-400">
            <p>Help Center</p>
            <p>Cancellation Policy</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Accessibility</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-lg text-slate-400 sm:px-6 md:flex-row md:items-center">
          <p>Copyright {new Date().getFullYear()} Wanderlust Excursions. All rights reserved.</p>
          <div className="flex gap-2">
            <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
              VISA
            </span>
            <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
              MC
            </span>
            <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
              AMEX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
