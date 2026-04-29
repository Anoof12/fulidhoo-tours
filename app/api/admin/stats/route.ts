import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalCustomers, totalBookings, activeExcursions, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.booking.count(),
    prisma.excursion.count({ where: { isActive: true } }),
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
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
