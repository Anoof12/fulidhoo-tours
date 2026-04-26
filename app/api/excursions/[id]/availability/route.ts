import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dateParam = request.nextUrl.searchParams.get("date");
  if (!dateParam) {
    return NextResponse.json({ error: "date query param is required" }, { status: 400 });
  }

  const date = new Date(dateParam);
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const excursion = await prisma.excursion.findUnique({ where: { id } });
  if (!excursion) return NextResponse.json({ error: "Excursion not found" }, { status: 404 });

  const booked = await prisma.booking.aggregate({
    where: {
      excursionId: id,
      bookingDate: { gte: start, lte: end },
      status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
    },
    _sum: { participants: true },
  });

  const bookedSeats = booked._sum.participants ?? 0;
  const spotsRemaining = Math.max(0, excursion.maxCapacity - bookedSeats);
  return NextResponse.json({ available: spotsRemaining > 0, spotsRemaining });
}
