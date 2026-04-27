import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCapacityStatus } from "@/utils/capacity";

type CapacityPayload = {
  maxCapacity: number;
  booked: number;
  available: number;
  percentage: number;
  status: ReturnType<typeof getCapacityStatus>;
};

const capacityCache = new Map<string, { expiresAt: number; payload: CapacityPayload }>();
const CAPACITY_CACHE_TTL_MS = 60_000;

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
  const cacheKey = `${id}:${start.toISOString().slice(0, 10)}`;
  const now = Date.now();
  const cached = capacityCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.payload, {
      headers: { "Cache-Control": "private, max-age=30" },
    });
  }

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

  const payload: CapacityPayload = {
    maxCapacity,
    booked,
    available,
    percentage,
    status,
  };
  capacityCache.set(cacheKey, {
    expiresAt: now + CAPACITY_CACHE_TTL_MS,
    payload,
  });

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "private, max-age=30" },
  });
}
