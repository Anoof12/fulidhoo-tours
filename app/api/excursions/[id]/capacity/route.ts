import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCapacityStatus } from "@/utils/capacity";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dateQuery = request.nextUrl.searchParams.get("date");
  const excursion = await prisma.excursion.findUnique({
    where: { id },
    select: { id: true, maxCapacity: true },
  });

  if (!excursion) {
    return NextResponse.json({ error: "Excursion not found" }, { status: 404 });
  }

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

  const agg = await prisma.booking.aggregate({
    where: {
      excursionId: id,
      bookingDate: { gte: start, lte: end },
      status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
    },
    _sum: { participants: true },
  });
  const booked = agg._sum.participants ?? 0;

  const maxCapacity = excursion.maxCapacity;
  const available = Math.max(0, maxCapacity - booked);
  const percentage = Math.round((booked / Math.max(1, maxCapacity)) * 100);
  const status = getCapacityStatus(percentage, available);

  return NextResponse.json({
    maxCapacity,
    booked,
    available,
    percentage,
    status,
  });
}
