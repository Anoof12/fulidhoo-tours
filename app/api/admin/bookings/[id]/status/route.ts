import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasAdminPanelAccess } from "@/lib/roles";

const schema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || !hasAdminPanelAccess(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ success: true, booking: updated });
}
