import Link from "next/link";
import { BookingCountdown } from "@/components/booking/BookingCountdown";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const user = await getCurrentUser();

  const [upcoming, completed, bookings] = await Promise.all([
    prisma.booking.count({
      where: { userId: user!.id, bookingDate: { gte: new Date() } },
    }),
    prisma.booking.count({
      where: { userId: user!.id, status: "COMPLETED" },
    }),
    prisma.booking.findMany({
      where: { userId: user!.id, bookingDate: { gte: new Date() } },
      include: { excursion: true },
      orderBy: { bookingDate: "asc" },
      take: 3,
    }),
  ]);

  const totalSpent = await prisma.booking.aggregate({
    where: { userId: user!.id, paymentStatus: "PAID" },
    _sum: { totalPrice: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name ?? "Guest"}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Upcoming Bookings" value={String(upcoming)} />
        <Card title="Completed Trips" value={String(completed)} />
        <Card title="Total Spent" value={`$${totalSpent._sum.totalPrice ?? 0}`} />
      </div>
      <BookingCountdown minutes={30} label="Next booking confirmation window" />

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Excursions</h2>
          <Link href="/account/bookings" className="text-sm font-semibold text-primary">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-600">No upcoming bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {booking.excursion.title} - {new Date(booking.bookingDate).toDateString()} -{" "}
                {booking.participants} guests
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
