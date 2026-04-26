import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "TOUR_OPERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalCustomers, totalBookings, activeExcursions, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.booking.count(),
    prisma.excursion.count({ where: { isActive: true } }),
    prisma.booking.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalPrice: true },
    }),
  ]);

  return NextResponse.json({
    totalCustomers,
    totalBookings,
    activeExcursions,
    totalRevenue: Number(revenue._sum.totalPrice ?? 0),
  });
}
