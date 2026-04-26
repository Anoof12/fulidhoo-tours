import Link from "next/link";
import { ExcursionCard } from "@/components/cards/ExcursionCard";
import { mapPrismaExcursionToView } from "@/lib/excursionMapper";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const excursions = await prisma.excursion.findMany({
    where: { isActive: true },
    include: { images: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const featured = excursions.map(mapPrismaExcursionToView);

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-br from-primary to-accent text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
            V. Fulidhoo, Maldives
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Discover Paradise with Local Island Excursions
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Book snorkeling, diving, fishing, and unforgettable ocean adventures hosted by
            experienced local guides.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/excursions"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-slate-100"
            >
              Browse Excursions
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Why Fulidhoo?
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Popular Excursions</h2>
            <p className="mt-2 text-slate-600">
              Start with our most-loved island experiences.
            </p>
          </div>
          <Link
            href="/excursions"
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            View all tours
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((excursion) => (
            <ExcursionCard key={excursion.id} excursion={excursion} />
          ))}
        </div>
      </section>
    </div>
  );
}
