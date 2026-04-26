import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getMonthWindow(monthParam?: string) {
  const now = new Date();
  const monthDate = monthParam ? new Date(`${monthParam}-01T00:00:00`) : now;
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; excursionId?: string }>;
}) {
  const params = await searchParams;
  const { start, end } = getMonthWindow(params.month);
  const excursions = await prisma.excursion.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
    select: { id: true, title: true, maxCapacity: true },
  });
  const selectedExcursionId = params.excursionId ?? "";

  const bookings = await prisma.booking.findMany({
    where: {
      bookingDate: { gte: start, lte: end },
      ...(selectedExcursionId ? { excursionId: selectedExcursionId } : {}),
      status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
    },
    include: {
      excursion: { select: { id: true, title: true, maxCapacity: true, slug: true } },
    },
    orderBy: [{ bookingDate: "asc" }, { createdAt: "asc" }],
  });

  const grouped = new Map<
    string,
    { bookings: typeof bookings; totalParticipants: number; maxCapacity: number }
  >();

  for (const booking of bookings) {
    const key = booking.bookingDate.toISOString().slice(0, 10);
    const existing = grouped.get(key) ?? {
      bookings: [],
      totalParticipants: 0,
      maxCapacity: selectedExcursionId ? booking.excursion.maxCapacity : 0,
    };
    existing.bookings.push(booking);
    existing.totalParticipants += booking.participants;
    if (!selectedExcursionId) {
      existing.maxCapacity += booking.excursion.maxCapacity;
    }
    grouped.set(key, existing);
  }

  const days = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  const monthValue = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="surface-card space-y-4 p-4 sm:p-5">
      <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Booking Calendar</h1>
      <form className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm md:grid-cols-3">
        <input name="month" type="month" defaultValue={monthValue} className="input-base" />
        <select name="excursionId" defaultValue={selectedExcursionId} className="input-base">
          <option value="">All excursions</option>
          {excursions.map((excursion) => (
            <option key={excursion.id} value={excursion.id}>
              {excursion.title}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary w-full justify-center md:w-auto">
          Apply
        </button>
      </form>

      {days.length === 0 ? (
        <p className="text-sm text-slate-600">No bookings found for this period.</p>
      ) : (
        <div className="space-y-4">
          {days.map(([date, info]) => {
            const percentage = Math.round((info.totalParticipants / Math.max(1, info.maxCapacity)) * 100);
            const isFull = percentage >= 100;
            return (
              <div key={date} className="rounded-lg border border-slate-200 p-4 transition hover:border-primary/30">
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <p className="font-semibold text-slate-900">{date}</p>
                  <p className={`text-xs font-semibold ${isFull ? "text-red-700" : "text-slate-700"}`}>
                    {info.totalParticipants} participants | {percentage}% utilized
                  </p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${isFull ? "bg-red-500" : percentage >= 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  {info.bookings.map((booking) => (
                    <div key={booking.id} className="rounded bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">
                        {booking.bookingNumber} - {booking.excursion.title}
                      </p>
                      <p className="text-xs text-slate-600">
                        {booking.participants} pax | {booking.status}
                      </p>
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="inline-block pt-1 text-xs font-semibold text-primary underline"
                      >
                        Open booking
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
