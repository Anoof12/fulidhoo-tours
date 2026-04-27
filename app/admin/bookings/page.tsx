import Link from "next/link";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { BulkBookingActions } from "@/components/admin/BulkBookingActions";
import { BookingStatusControl } from "@/components/admin/BookingStatusControl";
import { MarkPaidButton } from "@/components/admin/MarkPaidButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const sortMap = {
  newest: { createdAt: "desc" as const },
  oldest: { createdAt: "asc" as const },
  date_asc: { bookingDate: "asc" as const },
  date_desc: { bookingDate: "desc" as const },
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    from?: string;
    to?: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    excursionId?: string;
    sort?: keyof typeof sortMap;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const pageSize = 20;
  const sort = params.sort && params.sort in sortMap ? params.sort : "newest";

  const where = {
    ...(params.from || params.to
      ? {
          bookingDate: {
            ...(params.from ? { gte: new Date(params.from) } : {}),
            ...(params.to ? { lte: new Date(params.to) } : {}),
          },
        }
      : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.paymentStatus ? { paymentStatus: params.paymentStatus } : {}),
    ...(params.excursionId ? { excursionId: params.excursionId } : {}),
    ...(params.q
      ? {
          OR: [
            { bookingNumber: { contains: params.q, mode: "insensitive" as const } },
            { customerName: { contains: params.q, mode: "insensitive" as const } },
            { customerEmail: { contains: params.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [bookings, total, excursions] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { excursion: true, user: true },
      orderBy: sortMap[sort],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
    prisma.excursion.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const query = new URLSearchParams(
    Object.entries({
      q: params.q ?? "",
      from: params.from ?? "",
      to: params.to ?? "",
      status: params.status ?? "",
      paymentStatus: params.paymentStatus ?? "",
      excursionId: params.excursionId ?? "",
      sort,
    }).filter(([, value]) => value),
  );
  const exportHref = `/api/admin/bookings/export?${query.toString()}`;

  return (
    <div className="space-y-4 rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Manage Bookings</h1>
        <a
          href={exportHref}
          className="btn-secondary w-full justify-center sm:w-auto"
        >
          Export CSV
        </a>
      </div>
      <form className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm md:grid-cols-4">
        <input name="q" placeholder="Search booking/customer/email" defaultValue={params.q} className="input-base md:col-span-2" />
        <input name="from" type="date" defaultValue={params.from} className="input-base" />
        <input name="to" type="date" defaultValue={params.to} className="input-base" />
        <select name="status" defaultValue={params.status ?? ""} className="input-base">
          <option value="">All statuses</option>
          {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select name="paymentStatus" defaultValue={params.paymentStatus ?? ""} className="input-base">
          <option value="">All payments</option>
          {["UNPAID", "PAID", "REFUNDED", "FAILED"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select name="excursionId" defaultValue={params.excursionId ?? ""} className="input-base">
          <option value="">All excursions</option>
          {excursions.map((excursion) => (
            <option key={excursion.id} value={excursion.id}>
              {excursion.title}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="input-base">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="date_desc">Booking date (latest)</option>
          <option value="date_asc">Booking date (earliest)</option>
        </select>
        <div className="grid gap-2 md:col-span-4 sm:grid-cols-2">
          <button type="submit" className="btn-primary w-full justify-center">
            Apply Filters
          </button>
          <Link href="/admin/bookings" className="btn-secondary w-full justify-center">
            Clear Filters
          </Link>
        </div>
      </form>

      <BulkBookingActions
        rows={bookings.map((booking) => ({
          id: booking.id,
          label: `${booking.bookingNumber} - ${booking.customerName}`,
        }))}
      />

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:border-primary/30"
          >
            <p className="font-semibold text-slate-900">
              {booking.bookingNumber} - {booking.excursion.title}
            </p>
            <p>{booking.user.email}</p>
            <p>Status: {booking.status}</p>
            <p>Payment: {booking.paymentStatus}</p>
            <p>
              Date: {new Date(booking.bookingDate).toLocaleDateString()} | Participants:{" "}
              {booking.participants}
            </p>
            <Link href={`/admin/bookings/${booking.id}`} className="text-xs font-semibold text-primary underline">
              View details
            </Link>
            <BookingStatusControl bookingId={booking.id} currentStatus={booking.status} />
            {booking.paymentStatus !== "PAID" ? (
              <MarkPaidButton bookingId={booking.id} />
            ) : (
              <p className="mt-2 text-xs font-semibold text-emerald-700">Paid on site</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {(page - 1) * pageSize + 1}-{Math.min(total, page * pageSize)} of {total}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <Link
            href={`/admin/bookings?${new URLSearchParams({ ...Object.fromEntries(query.entries()), page: String(Math.max(1, page - 1)) }).toString()}`}
            className={`rounded border px-2 py-1 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            Prev
          </Link>
          <span>
            Page {page} / {totalPages}
          </span>
          <Link
            href={`/admin/bookings?${new URLSearchParams({ ...Object.fromEntries(query.entries()), page: String(Math.min(totalPages, page + 1)) }).toString()}`}
            className={`rounded border px-2 py-1 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
