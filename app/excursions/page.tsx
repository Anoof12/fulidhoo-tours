import { ExcursionsCapacityCatalog } from "@/components/excursions/ExcursionsCapacityCatalog";

export const metadata = {
  title: "Excursions | Fulidhoo Tours",
  description: "Browse available snorkeling, diving, and island excursions in Fulidhoo.",
};

export default function ExcursionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Browse Excursions</h1>
        <p className="max-w-2xl text-slate-600">
          Choose from handpicked local tours designed for couples, families, and adventure
          travelers visiting V. Fulidhoo.
        </p>
      </header>

      <ExcursionsCapacityCatalog />
    </div>
  );
}
