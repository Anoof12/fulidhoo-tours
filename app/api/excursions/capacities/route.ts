import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCapacityStatus } from "@/utils/capacity";

export async function GET(request: NextRequest) {
  const dateQuery = request.nextUrl.searchParams.get("date");
  const date = dateQuery ? new Date(dateQuery) : new Date();
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 },
    );
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const [excursions, bookingTotals] = await Promise.all([
    prisma.excursion.findMany({
      where: { isActive: true },
      select: { id: true, maxCapacity: true },
    }),
    prisma.booking.groupBy({
      by: ["excursionId"],
      where: {
        bookingDate: { gte: start, lte: end },
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      _sum: { participants: true },
    }),
  ]);

  const grouped = Object.fromEntries(
    bookingTotals.map((item) => [item.excursionId, item._sum.participants ?? 0]),
  );

  const capacities = excursions.map((excursion) => {
    const booked = grouped[excursion.id] ?? 0;
    const maxCapacity = excursion.maxCapacity;
    const available = Math.max(0, maxCapacity - booked);
    const percentage = Math.round((booked / Math.max(1, maxCapacity)) * 100);
    const status = getCapacityStatus(percentage, available);
    return {
      excursionId: excursion.id,
      maxCapacity,
      booked,
      available,
      percentage,
      status,
    };
  });

  return NextResponse.json({ date: start.toISOString(), capacities });
}
