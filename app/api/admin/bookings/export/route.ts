import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";

function csvEscape(value: string) {
  // Prefix formula-trigger characters to prevent CSV injection
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status");
  const excursionId = searchParams.get("excursionId");
  const q = searchParams.get("q");

  const bookings = await prisma.booking.findMany({
    where: {
      ...(from || to
        ? {
            bookingDate: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(status ? { status: status as BookingStatus } : {}),
      ...(excursionId ? { excursionId } : {}),
      ...(q
        ? {
            OR: [
              { bookingNumber: { contains: q, mode: "insensitive" } },
              { customerName: { contains: q, mode: "insensitive" } },
              { customerEmail: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { excursion: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Booking Number",
    "Customer Name",
    "Email",
    "Phone",
    "Excursion",
    "Date",
    "Participants",
    "Total (USD)",
    "Status",
  ].join(",");

  const rows = bookings.map((booking) =>
    [
      booking.bookingNumber,
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone,
      booking.excursion.title,
      booking.bookingDate.toISOString().slice(0, 10),
      String(booking.participants),
      booking.totalPrice.toString(),
      booking.status,
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [header, ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${Date.now()}.csv"`,
    },
  });
}
