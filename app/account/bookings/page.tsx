import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountBookingsPage() {
  const user = await getCurrentUser();
  const bookings = await prisma.booking.findMany({
    where: { userId: user!.id },
    include: { excursion: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">My Bookings</h1>
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-600">You have no bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {booking.bookingNumber} - {booking.excursion.title}
              </p>
              <p>Date: {new Date(booking.bookingDate).toDateString()}</p>
              <p>Participants: {booking.participants}</p>
              <p>Status: {booking.status}</p>
              <p>Total: ${booking.totalPrice.toString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
