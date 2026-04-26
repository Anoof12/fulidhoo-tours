import { BookingStatusControl } from "@/components/admin/BookingStatusControl";
import { MarkPaidButton } from "@/components/admin/MarkPaidButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { excursion: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Manage Bookings</h1>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              {booking.bookingNumber} - {booking.excursion.title}
            </p>
            <p>{booking.user.email}</p>
            <p>Status: {booking.status}</p>
            <p>Payment: {booking.paymentStatus}</p>
            <BookingStatusControl bookingId={booking.id} currentStatus={booking.status} />
            {booking.paymentStatus !== "PAID" ? (
              <MarkPaidButton bookingId={booking.id} />
            ) : (
              <p className="mt-2 text-xs font-semibold text-emerald-700">Paid on site</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
