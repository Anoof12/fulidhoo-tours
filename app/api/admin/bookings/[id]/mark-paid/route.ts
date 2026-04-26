import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  void request;
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "TOUR_OPERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.paymentStatus === "PAID") {
    return NextResponse.json({ success: true, booking });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { paymentStatus: "PAID" },
  });

  return NextResponse.json({ success: true, booking: updated });
}
