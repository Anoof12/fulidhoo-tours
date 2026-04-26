import Link from "next/link";
import { ToggleExcursionActiveButton } from "@/components/admin/ToggleExcursionActiveButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExcursionsPage() {
  const excursions = await prisma.excursion.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="surface-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-slate-900">Manage Excursions</h1>
        <Link
          href="/admin/excursions/create"
          className="btn-primary"
        >
          Add Excursion
        </Link>
      </div>
      <div className="space-y-3">
        {excursions.map((excursion) => (
          <div
            key={excursion.id}
            className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 transition hover:border hover:border-primary/30"
          >
            <p className="font-semibold text-slate-900">
              {excursion.title} - ${excursion.pricePerPerson.toString()}
            </p>
            <p>{excursion.category}</p>
            <p className="text-xs font-semibold">
              {excursion.isActive ? "Status: ACTIVE" : "Status: INACTIVE"}
            </p>
            <div className="mt-2">
              <Link href={`/admin/excursions/${excursion.id}/edit`} className="text-xs font-semibold text-primary underline">
                Edit excursion
              </Link>
            </div>
            <ToggleExcursionActiveButton excursionId={excursion.id} isActive={excursion.isActive} />
          </div>
        ))}
      </div>
    </div>
  );
}
