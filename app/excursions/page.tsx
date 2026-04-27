import { ExcursionsCapacityCatalog } from "@/components/excursions/ExcursionsCapacityCatalog";

export const metadata = {
  title: "Excursions | Fulidhoo Tours",
  description: "Browse available snorkeling, diving, and island excursions in Fulidhoo.",
};

export default function ExcursionsPage() {
  return (
    <div className="pb-14">
      <section className="relative -mt-20 overflow-hidden py-28 sm:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-black/50" />
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Explore</p>
          <h1 className="font-display mt-2 text-4xl font-bold text-white md:text-6xl">
            Find your perfect excursion
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">
            Filter by availability and browse real-time capacity for every active trip in Fulidhoo.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
          <ExcursionsCapacityCatalog />
        </div>
      </section>
    </div>
  );
}
