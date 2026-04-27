import Image from "next/image";
import Link from "next/link";
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
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
      <h1 className="mb-4 mt-2 text-2xl font-bold text-slate-900">My Bookings</h1>
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">You have no bookings yet.</p>
            <Link href="/excursions" className="mt-2 inline-block text-sm font-semibold text-primary">
              Browse excursions
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              <p className="font-semibold text-slate-900">
                {booking.bookingNumber} - {booking.excursion.title}
              </p>
              <p>Date: {new Date(booking.bookingDate).toDateString()}</p>
              <p>Participants: {booking.participants}</p>
              <p>Status: {booking.status}</p>
              <p>Total: ${booking.totalPrice.toString()}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href={`/api/user/bookings/${booking.id}/calendar`}
                  className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Add to calendar (.ics)
                </Link>
                <Link
                  href={`/excursions/${booking.excursion.slug}?date=${new Date(booking.bookingDate).toISOString().slice(0, 10)}&participants=${booking.participants}`}
                  className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Rebook this trip
                </Link>
              </div>
              <details className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-700">
                  Show booking QR code
                </summary>
                <div className="mt-3 flex flex-col items-start gap-2">
                  <Image
                    src={`/api/user/bookings/${booking.id}/qr`}
                    alt={`QR code for booking ${booking.bookingNumber}`}
                    width={160}
                    height={160}
                  />
                  <p className="text-xs text-slate-500">
                    Scan this at check-in with your booking number.
                  </p>
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
