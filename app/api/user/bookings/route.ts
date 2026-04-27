import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasCustomerPortalAccess } from "@/lib/roles";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasCustomerPortalAccess(user.role)) {
    return NextResponse.json({ error: "Only customer accounts can access this endpoint." }, { status: 403 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      excursion: {
        select: { id: true, title: true, slug: true, category: true, duration: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
