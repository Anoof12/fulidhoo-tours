import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkPaidButton } from "@/components/admin/MarkPaidButton";
import { BookingStatusControl } from "@/components/admin/BookingStatusControl";
import { prisma } from "@/lib/prisma";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { user: true, excursion: true },
  });
  if (!booking) notFound();

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-5">
      <h1 className="text-2xl font-bold text-slate-900">Booking {booking.bookingNumber}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Booking Info</p>
          <p>Status: {booking.status}</p>
          <p>Payment: {booking.paymentStatus}</p>
          <p>Created: {booking.createdAt.toLocaleString()}</p>
          <p>Updated: {booking.updatedAt.toLocaleString()}</p>
          <BookingStatusControl bookingId={booking.id} currentStatus={booking.status} />
          {booking.paymentStatus !== "PAID" ? <MarkPaidButton bookingId={booking.id} /> : null}
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Customer</p>
          <p>{booking.customerName}</p>
          <p>{booking.customerEmail}</p>
          <p>{booking.customerPhone}</p>
          <p>Country: {booking.user.country ?? "N/A"}</p>
          {booking.specialRequests ? (
            <p className="mt-2 rounded bg-amber-50 p-2 text-amber-900">
              Special requests: {booking.specialRequests}
            </p>
          ) : null}
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Excursion</p>
          <p>{booking.excursion.title}</p>
          <p>Date: {booking.bookingDate.toLocaleDateString()}</p>
          <p>Participants: {booking.participants}</p>
          <p>Duration: {booking.excursion.duration} min</p>
          <p>Meeting point: {booking.excursion.meetingPoint}</p>
          <Link href={`/excursions/${booking.excursion.slug}`} className="text-primary underline">
            View public excursion page
          </Link>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Payment</p>
          <p>Total: ${booking.totalPrice.toString()}</p>
          <p>Payment status: {booking.paymentStatus}</p>
        </div>
      </div>
    </div>
  );
}
