import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative -mt-20 min-h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1800&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-black/55" />

      <div className="relative mx-auto flex min-h-[90vh] w-full max-w-6xl items-center px-4 pb-16 pt-40 text-white sm:px-6">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
            V. Fulidhoo, Maldives
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Fulidhoo Tours
          </h1>
          <p className="mt-2 font-display text-xl text-emerald-100 sm:text-2xl">
            Discover island adventures with local experts
          </p>
          <p className="mt-6 max-w-2xl text-base text-slate-100/90 sm:text-lg">
            Book snorkeling, diving, sandbank trips, and authentic Fulidhoo experiences with a
            cleaner, modern booking flow inspired by the new reference design.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/excursions" className="btn-primary bg-white text-emerald-900 hover:bg-slate-100">
              Explore Excursions
            </Link>
            <Link href="/about" className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white/20">
              About Fulidhoo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
