import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { excursion: { select: { title: true, meetingPoint: true } } },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = JSON.stringify({
    bookingNumber: booking.bookingNumber,
    excursion: booking.excursion.title,
    date: booking.bookingDate.toISOString(),
    participants: booking.participants,
    meetingPoint: booking.excursion.meetingPoint,
  });

  const svg = await QRCode.toString(payload, {
    type: "svg",
    width: 220,
    margin: 1,
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, max-age=60",
    },
  });
}
