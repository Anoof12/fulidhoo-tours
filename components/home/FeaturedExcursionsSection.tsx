import Link from "next/link";
import { ExcursionCard } from "@/components/cards/ExcursionCard";
import type { Excursion } from "@/types/excursion";

type FeaturedExcursionsSectionProps = {
  excursions: Excursion[];
};

export function FeaturedExcursionsSection({ excursions }: FeaturedExcursionsSectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Featured</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-slate-900">Top Rated Excursions</h2>
          <p className="mt-2 text-slate-600">Handpicked adventures with excellent traveler feedback.</p>
        </div>
        <Link href="/excursions" className="text-sm font-semibold text-primary hover:text-primary-dark">
          View all excursions
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {excursions.map((excursion) => (
          <ExcursionCard key={excursion.id} excursion={excursion} />
        ))}
      </div>
    </section>
  );
}
