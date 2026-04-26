import { ExcursionsCapacityCatalog } from "@/components/excursions/ExcursionsCapacityCatalog";

export const metadata = {
  title: "Excursions | Fulidhoo Tours",
  description: "Browse available snorkeling, diving, and island excursions in Fulidhoo.",
};

export default function ExcursionsPage() {
  return (
    <div>
      <section className="bg-accent/95 py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Explore</p>
          <h1 className="font-display mt-2 text-4xl font-bold text-white md:text-5xl">
            Find your perfect excursion
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            Filter by availability and browse real-time capacity for every active trip in Fulidhoo.
          </p>
        </div>
      </section>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <ExcursionsCapacityCatalog />
      </div>
    </div>
  );
}
