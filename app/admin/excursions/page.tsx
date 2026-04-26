import Link from "next/link";
import { ToggleExcursionActiveButton } from "@/components/admin/ToggleExcursionActiveButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExcursionsPage() {
  const excursions = await prisma.excursion.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Excursions</h1>
        <Link
          href="/admin/excursions/create"
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
        >
          Add Excursion
        </Link>
      </div>
      <div className="space-y-3">
        {excursions.map((excursion) => (
          <div key={excursion.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              {excursion.title} - ${excursion.pricePerPerson.toString()}
            </p>
            <p>{excursion.category}</p>
            <p className="text-xs font-semibold">
              {excursion.isActive ? "Status: ACTIVE" : "Status: INACTIVE"}
            </p>
            <ToggleExcursionActiveButton excursionId={excursion.id} isActive={excursion.isActive} />
          </div>
        ))}
      </div>
    </div>
  );
}
