import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Sequential queries avoid exhausting Supabase pooler (often connection_limit: 1).
  const customers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const bookings = await prisma.booking.count();
  const activeExcursions = await prisma.excursion.count({ where: { isActive: true } });
  const revenue = await prisma.booking.aggregate({
    where: { paymentStatus: "PAID" },
    _sum: { totalPrice: true },
  });
  const bookingLoad = await prisma.booking.groupBy({
    by: ["excursionId"],
    where: { status: { in: ["PENDING", "CONFIRMED"] } },
    _sum: { participants: true },
  });
  const excursionRows = await prisma.excursion.findMany({
    where: { isActive: true },
    select: { id: true, title: true, maxCapacity: true },
    orderBy: { createdAt: "desc" },
  });

  const loadMap = Object.fromEntries(bookingLoad.map((item) => [item.excursionId, item._sum.participants ?? 0]));
  const utilizationRows = excursionRows.map((excursion) => {
    const booked = loadMap[excursion.id] ?? 0;
    const percentage = Math.round((booked / Math.max(1, excursion.maxCapacity)) * 100);
    return { excursion, booked, percentage };
  });
  const fullyBooked = utilizationRows.filter((row) => row.percentage >= 100);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Overview</p>
        <h1 className="font-display mt-2 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Revenue" value={`$${revenue._sum.totalPrice ?? 0}`} />
        <Card title="Total Bookings" value={String(bookings)} />
        <Card title="Active Excursions" value={String(activeExcursions)} />
        <Card title="Total Customers" value={String(customers)} />
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Capacity Utilization</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {utilizationRows.map((row) => (
            <div key={row.excursion.id} className="rounded-lg border border-slate-200 p-4 transition hover:border-primary/40">
              <p className="text-sm font-semibold text-slate-900">{row.excursion.title}</p>
              <p className="text-xs text-slate-600">
                {row.booked} / {row.excursion.maxCapacity} booked
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    row.percentage >= 95
                      ? "bg-red-500"
                      : row.percentage >= 80
                        ? "bg-orange-500"
                        : row.percentage >= 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, row.percentage)}%` }}
                />
              </div>
              {row.percentage >= 95 ? (
                <p className="mt-2 text-xs font-semibold text-red-700">
                  Alert: fully booked or near full. Suggest adding extra slots.
                </p>
              ) : null}
            </div>
          ))}
        </div>
        {fullyBooked.length > 0 ? (
          <p className="mt-4 text-sm font-medium text-red-700">
            {fullyBooked.length} excursions are fully booked. Consider adding more dates or
            increasing capacity.
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            No fully booked excursions right now.
          </p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-primary/30">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
